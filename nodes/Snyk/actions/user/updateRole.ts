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
	const userId = this.getNodeParameter('userId', index) as string;
	const role = this.getNodeParameter('role', index) as string;

	const body = {
		role,
	};

	const response = await snykV1ApiRequest.call(
		this,
		'PUT',
		`/org/${orgId}/members/${userId}`,
		body,
	);

	const responseData = (response as IDataObject) || { success: true, userId, role };

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Update Role',
	name: 'updateRole',
	description: 'Update user role in an organization',
	action: 'Update user role',
};
