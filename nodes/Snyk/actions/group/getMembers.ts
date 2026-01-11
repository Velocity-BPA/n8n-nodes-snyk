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
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const qs: IDataObject = {};

	if (additionalFields.page) {
		qs.page = additionalFields.page;
	}

	if (additionalFields.perPage) {
		qs.perPage = additionalFields.perPage;
	}

	const response = await snykV1ApiRequest.call(
		this,
		'GET',
		`/group/${groupId}/members`,
		undefined,
		qs,
	);

	const members = Array.isArray(response) ? response : [response as IDataObject];

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(members),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Get Members',
	name: 'getMembers',
	description: 'Get members of a group',
	action: 'Get group members',
};
