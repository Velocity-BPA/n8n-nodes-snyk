/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { snykV1ApiRequest } from '../../transport/GenericFunctions';

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const groupId = this.getNodeParameter('groupId', index) as string;

	const response = await snykV1ApiRequest.call(this, 'GET', `/group/${groupId}/settings`);
	const responseData = response as IDataObject;

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Get Settings',
	name: 'getSettings',
	description: 'Get group settings',
	action: 'Get group settings',
};
