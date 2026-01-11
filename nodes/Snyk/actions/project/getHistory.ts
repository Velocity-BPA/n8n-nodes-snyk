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
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const qs: IDataObject = {};

	if (additionalFields.from) {
		qs.from = additionalFields.from;
	}

	if (additionalFields.to) {
		qs.to = additionalFields.to;
	}

	const response = await snykV1ApiRequest.call(
		this,
		'GET',
		`/org/${orgId}/project/${projectId}/history`,
		undefined,
		qs,
	);

	const responseData = Array.isArray(response.snapshots)
		? (response.snapshots as IDataObject[])
		: [response as IDataObject];

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Get History',
	name: 'getHistory',
	description: 'Get project snapshot history',
	action: 'Get project history',
};
