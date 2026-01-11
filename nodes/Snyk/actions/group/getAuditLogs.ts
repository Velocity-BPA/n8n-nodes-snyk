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
	const groupId = this.getNodeParameter('groupId', index) as string;
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const limit = this.getNodeParameter('limit', index, 10) as number;
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

	const qs: IDataObject = {};

	if (filters.from) {
		qs.from = filters.from;
	}

	if (filters.to) {
		qs.to = filters.to;
	}

	if (filters.event) {
		qs.event = filters.event;
	}

	if (filters.userId) {
		qs.user_id = filters.userId;
	}

	if (!returnAll) {
		qs.limit = limit;
	}

	let responseData: IDataObject[];

	if (returnAll) {
		responseData = await snykApiRequestAllItems.call(
			this,
			'GET',
			`/groups/${groupId}/audit_logs/search`,
			undefined,
			qs,
		);
	} else {
		const response = await snykApiRequest.call(
			this,
			'GET',
			`/groups/${groupId}/audit_logs/search`,
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
	displayName: 'Get Audit Logs',
	name: 'getAuditLogs',
	description: 'Get audit logs for a group',
	action: 'Get group audit logs',
};
