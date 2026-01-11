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
	const issueId = this.getNodeParameter('issueId', index) as string;

	const response = await snykV1ApiRequest.call(
		this,
		'DELETE',
		`/org/${orgId}/project/${projectId}/ignore/${issueId}`,
	);

	const responseData = (response as IDataObject) || { success: true, issueId };

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Unignore',
	name: 'unignore',
	description: 'Unignore an issue',
	action: 'Unignore an issue',
};
