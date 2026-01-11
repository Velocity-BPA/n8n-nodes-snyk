/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { snykApiRequest, validateOrgId } from '../../transport/GenericFunctions';

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const orgId = validateOrgId(this.getNodeParameter('orgId', index) as string);
	const issueId = this.getNodeParameter('issueId', index) as string;

	const response = await snykApiRequest.call(this, 'GET', `/orgs/${orgId}/issues/${issueId}`);
	const responseData = (response.data as IDataObject) || response;

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Get',
	name: 'get',
	description: 'Get an issue by ID',
	action: 'Get an issue',
};
