/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

const REGION_URLS: Record<string, string> = {
	US: 'https://api.snyk.io',
	EU: 'https://api.eu.snyk.io',
	AU: 'https://api.au.snyk.io',
};

/**
 * Get the base URL for the Snyk API based on region
 */
export function getBaseUrl(region: string): string {
	return REGION_URLS[region] || REGION_URLS.US;
}

/**
 * Make an authenticated request to the Snyk REST API
 */
export async function snykApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('snykApi');

	const baseUrl = getBaseUrl(credentials.region as string);
	const version = (credentials.version as string) || '2024-10-15';

	const qs: IDataObject = { ...query, version };

	const options: IRequestOptions = {
		method,
		uri: `${baseUrl}/rest${endpoint}`,
		headers: {
			Authorization: `token ${credentials.apiToken}`,
			'Content-Type': 'application/vnd.api+json',
			Accept: 'application/vnd.api+json',
		},
		qs,
		json: true,
	};

	if (body && Object.keys(body).length > 0) {
		options.body = body;
	}

	try {
		const response = await this.helpers.request(options);
		return response as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make an authenticated request to the Snyk V1 API (legacy endpoints)
 */
export async function snykV1ApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('snykApi');

	const baseUrl = getBaseUrl(credentials.region as string);

	const options: IRequestOptions = {
		method,
		uri: `${baseUrl}/v1${endpoint}`,
		headers: {
			Authorization: `token ${credentials.apiToken}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		json: true,
	};

	if (body && Object.keys(body).length > 0) {
		options.body = body;
	}

	if (query && Object.keys(query).length > 0) {
		options.qs = query;
	}

	try {
		const response = await this.helpers.request(options);
		return response as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make a paginated request to the Snyk REST API and return all items
 */
export async function snykApiRequestAllItems(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let nextCursor: string | undefined;

	const qs: IDataObject = { ...query };
	qs.limit = qs.limit || 100;

	do {
		if (nextCursor) {
			qs.starting_after = nextCursor;
		}

		const response = await snykApiRequest.call(this, method, endpoint, body, qs);

		if (response.data && Array.isArray(response.data)) {
			returnData.push(...(response.data as IDataObject[]));

			// Check for next page in links
			const links = response.links as IDataObject | undefined;
			if (links?.next) {
				try {
					const nextUrl = new URL(links.next as string, 'https://api.snyk.io');
					nextCursor = nextUrl.searchParams.get('starting_after') || undefined;
				} catch {
					nextCursor = undefined;
				}
			} else {
				nextCursor = undefined;
			}
		} else {
			break;
		}
	} while (nextCursor);

	return returnData;
}

/**
 * Validate and format organization ID
 */
export function validateOrgId(orgId: string): string {
	const trimmed = orgId.trim();
	if (!trimmed) {
		throw new Error('Organization ID is required');
	}
	return trimmed;
}

/**
 * Validate and format project ID
 */
export function validateProjectId(projectId: string): string {
	const trimmed = projectId.trim();
	if (!trimmed) {
		throw new Error('Project ID is required');
	}
	return trimmed;
}

/**
 * Build query parameters for filtering
 */
export function buildFilterParams(filters: IDataObject): IDataObject {
	const params: IDataObject = {};

	for (const [key, value] of Object.entries(filters)) {
		if (value !== undefined && value !== null && value !== '') {
			if (Array.isArray(value) && value.length > 0) {
				params[key] = value.join(',');
			} else if (typeof value === 'boolean') {
				params[key] = value.toString();
			} else {
				params[key] = value;
			}
		}
	}

	return params;
}

/**
 * Parse the Snyk API error response
 */
export function parseSnykError(error: IDataObject): string {
	if (error.errors && Array.isArray(error.errors)) {
		const errors = error.errors as IDataObject[];
		return errors
			.map((e) => `${e.title || 'Error'}: ${e.detail || 'Unknown error'}`)
			.join('; ');
	}
	return 'An unknown error occurred';
}

/**
 * Handle rate limiting with exponential backoff
 */
export async function handleRateLimit(
	this: IExecuteFunctions,
	fn: () => Promise<IDataObject>,
	maxRetries = 5,
): Promise<IDataObject> {
	let retries = 0;
	let delay = 1000; // Start with 1 second

	while (retries < maxRetries) {
		try {
			return await fn();
		} catch (error) {
			const err = error as { statusCode?: number; headers?: Record<string, string> };
			if (err.statusCode === 429 && retries < maxRetries - 1) {
				const retryAfter = err.headers?.['retry-after'];
				if (retryAfter) {
					delay = parseInt(retryAfter, 10) * 1000;
				}
				await new Promise((resolve) => setTimeout(resolve, delay));
				delay *= 2; // Exponential backoff
				retries++;
			} else {
				throw error;
			}
		}
	}

	throw new Error('Max retries exceeded for rate-limited request');
}

/**
 * Format ISO date string
 */
export function formatISODate(date: string | Date): string {
	if (date instanceof Date) {
		return date.toISOString();
	}
	return new Date(date).toISOString();
}

/**
 * Extract data from JSON:API response
 */
export function extractJsonApiData(response: IDataObject): IDataObject | IDataObject[] {
	if (response.data) {
		return response.data as IDataObject | IDataObject[];
	}
	return response;
}

/**
 * Build JSON:API compliant request body
 */
export function buildJsonApiBody(
	type: string,
	attributes: IDataObject,
	relationships?: IDataObject,
): IDataObject {
	const data: IDataObject = {
		type,
		attributes,
	};

	if (relationships && Object.keys(relationships).length > 0) {
		data.relationships = relationships;
	}

	return { data };
}
