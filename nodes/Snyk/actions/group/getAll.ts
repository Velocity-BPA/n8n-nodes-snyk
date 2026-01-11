/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { snykApiRequest, snykApiRequestAllItems } from '../../transport/GenericFunctions';

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const limit = this.getNodeParameter('limit', index, 10) as number;

	const qs: IDataObject = {};

	if (!returnAll) {
		qs.limit = limit;
	}

	let responseData: IDataObject[];

	if (returnAll) {
		responseData = await snykApiRequestAllItems.call(this, 'GET', '/groups', undefined, qs);
	} else {
		const response = await snykApiRequest.call(this, 'GET', '/groups', undefined, qs);
		responseData = (response.data as IDataObject[]) || [];
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Get Many',
	name: 'getAll',
	description: 'Get many groups',
	action: 'Get many groups',
};
