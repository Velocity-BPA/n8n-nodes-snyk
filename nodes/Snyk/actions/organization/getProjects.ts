/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { snykApiRequest, snykApiRequestAllItems, validateOrgId } from '../../transport/GenericFunctions';

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const orgId = validateOrgId(this.getNodeParameter('orgId', index) as string);
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const limit = this.getNodeParameter('limit', index, 10) as number;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const qs: IDataObject = {};

	if (additionalFields.status) {
		qs.status = additionalFields.status;
	}

	if (additionalFields.origin) {
		qs.origin = additionalFields.origin;
	}

	if (additionalFields.type) {
		qs.type = additionalFields.type;
	}

	if (!returnAll) {
		qs.limit = limit;
	}

	let responseData: IDataObject[];

	if (returnAll) {
		responseData = await snykApiRequestAllItems.call(
			this,
			'GET',
			`/orgs/${orgId}/projects`,
			undefined,
			qs,
		);
	} else {
		const response = await snykApiRequest.call(
			this,
			'GET',
			`/orgs/${orgId}/projects`,
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
	displayName: 'Get Projects',
	name: 'getProjects',
	description: 'Get all projects in an organization',
	action: 'Get organization projects',
};
