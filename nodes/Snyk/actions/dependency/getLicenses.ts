/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { snykV1ApiRequest, validateOrgId } from '../../transport/GenericFunctions';

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const orgId = validateOrgId(this.getNodeParameter('orgId', index) as string);
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		filters: {},
	};

	if (additionalFields.sortBy) {
		body.sortBy = additionalFields.sortBy;
	}

	if (additionalFields.order) {
		body.order = additionalFields.order;
	}

	const response = await snykV1ApiRequest.call(
		this,
		'POST',
		`/org/${orgId}/licenses`,
		body,
	);

	const results = (response.results as IDataObject[]) || [];

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(results),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Get Licenses',
	name: 'getLicenses',
	description: 'Get dependency licenses',
	action: 'Get dependency licenses',
};
