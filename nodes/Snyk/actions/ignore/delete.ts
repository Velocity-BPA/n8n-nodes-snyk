/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { snykV1ApiRequest, validateOrgId, validateProjectId } from '../../transport/GenericFunctions';

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const orgId = validateOrgId(this.getNodeParameter('orgId', index) as string);
	const projectId = validateProjectId(this.getNodeParameter('projectId', index) as string);
	const issueId = this.getNodeParameter('issueId', index) as string;

	await snykV1ApiRequest.call(
		this,
		'DELETE',
		`/org/${orgId}/project/${projectId}/ignore/${issueId}`,
	);

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([{ success: true, issueId }]),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Delete',
	name: 'delete',
	description: 'Delete an ignore rule',
	action: 'Delete an ignore rule',
};
