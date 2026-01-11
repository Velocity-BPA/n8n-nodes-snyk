/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { snykV1ApiRequest, validateOrgId, validateProjectId } from '../../transport/GenericFunctions';

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const orgId = validateOrgId(this.getNodeParameter('orgId', index) as string);
	const projectId = validateProjectId(this.getNodeParameter('projectId', index) as string);
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

	const body: IDataObject = {
		filters: {},
	};

	if (filters.severity) {
		(body.filters as IDataObject).severity = filters.severity;
	}

	if (filters.types) {
		(body.filters as IDataObject).types = filters.types;
	}

	if (filters.ignored !== undefined) {
		(body.filters as IDataObject).ignored = filters.ignored;
	}

	if (filters.patched !== undefined) {
		(body.filters as IDataObject).patched = filters.patched;
	}

	const response = await snykV1ApiRequest.call(
		this,
		'POST',
		`/org/${orgId}/project/${projectId}/aggregated-issues`,
		body,
	);

	const responseData = Array.isArray(response.issues)
		? (response.issues as IDataObject[])
		: [response as IDataObject];

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Get by Project',
	name: 'getByProject',
	description: 'Get issues for a specific project',
	action: 'Get issues by project',
};
