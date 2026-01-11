/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { snykApiRequest, snykApiRequestAllItems, validateOrgId, buildFilterParams } from '../../transport/GenericFunctions';

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const orgId = validateOrgId(this.getNodeParameter('orgId', index) as string);
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const limit = this.getNodeParameter('limit', index, 10) as number;
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

	const qs = buildFilterParams(filters);

	if (!returnAll) {
		qs.limit = limit;
	}

	let responseData: IDataObject[];

	if (returnAll) {
		responseData = await snykApiRequestAllItems.call(
			this,
			'GET',
			`/orgs/${orgId}/targets`,
			undefined,
			qs,
		);
	} else {
		const response = await snykApiRequest.call(
			this,
			'GET',
			`/orgs/${orgId}/targets`,
			undefined,
			qs,
		);
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
	description: 'Get many targets',
	action: 'Get many targets',
};
