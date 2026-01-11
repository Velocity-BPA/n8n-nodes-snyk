/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { snykV1ApiRequest, validateOrgId } from '../../transport/GenericFunctions';

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const orgId = validateOrgId(this.getNodeParameter('orgId', index) as string);
	const userId = this.getNodeParameter('userId', index) as string;

	await snykV1ApiRequest.call(this, 'DELETE', `/org/${orgId}/members/${userId}`);

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([{ success: true, userId }]),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Remove',
	name: 'remove',
	description: 'Remove a user from an organization',
	action: 'Remove a user',
};
