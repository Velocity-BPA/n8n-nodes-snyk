/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { snykApiRequest, validateOrgId, validateProjectId } from '../../transport/GenericFunctions';

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const orgId = validateOrgId(this.getNodeParameter('orgId', index) as string);
	const projectId = validateProjectId(this.getNodeParameter('projectId', index) as string);

	await snykApiRequest.call(this, 'DELETE', `/orgs/${orgId}/projects/${projectId}`);

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([{ success: true, projectId }]),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Delete',
	name: 'delete',
	description: 'Delete a project',
	action: 'Delete a project',
};
