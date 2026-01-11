/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SnykApi implements ICredentialType {
	name = 'snykApi';
	displayName = 'Snyk API';
	documentationUrl = 'https://docs.snyk.io/snyk-api';
	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Snyk API token from Account Settings',
		},
		{
			displayName: 'Region',
			name: 'region',
			type: 'options',
			default: 'US',
			options: [
				{ name: 'US', value: 'US' },
				{ name: 'EU', value: 'EU' },
				{ name: 'AU', value: 'AU' },
			],
			description: 'The region your Snyk account is hosted in',
		},
		{
			displayName: 'API Version',
			name: 'version',
			type: 'string',
			default: '2024-10-15',
			description: 'The API version to use (format: YYYY-MM-DD)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=token {{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.region === "EU" ? "https://api.eu.snyk.io" : $credentials.region === "AU" ? "https://api.au.snyk.io" : "https://api.snyk.io"}}',
			url: '/rest/self?version={{$credentials.version || "2024-10-15"}}',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json',
			},
		},
	};
}
