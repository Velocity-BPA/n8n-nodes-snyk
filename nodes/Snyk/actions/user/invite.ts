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
	const email = this.getNodeParameter('email', index) as string;
	const role = this.getNodeParameter('role', index, 'ORG_COLLABORATOR') as string;

	const body = {
		email,
		role,
	};

	const response = await snykV1ApiRequest.call(
		this,
		'POST',
		`/org/${orgId}/invite`,
		body,
	);

	const responseData = (response as IDataObject) || { success: true, email };

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Invite',
	name: 'invite',
	description: 'Invite a user to an organization',
	action: 'Invite a user',
};
