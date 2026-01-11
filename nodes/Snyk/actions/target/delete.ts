/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { snykApiRequest, validateOrgId } from '../../transport/GenericFunctions';

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const orgId = validateOrgId(this.getNodeParameter('orgId', index) as string);
	const targetId = this.getNodeParameter('targetId', index) as string;

	await snykApiRequest.call(this, 'DELETE', `/orgs/${orgId}/targets/${targetId}`);

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([{ success: true, targetId }]),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Delete',
	name: 'delete',
	description: 'Delete a target',
	action: 'Delete a target',
};
