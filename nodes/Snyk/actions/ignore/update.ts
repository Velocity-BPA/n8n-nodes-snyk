/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { snykV1ApiRequest, validateOrgId, validateProjectId } from '../../transport/GenericFunctions';

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const orgId = validateOrgId(this.getNodeParameter('orgId', index) as string);
	const projectId = validateProjectId(this.getNodeParameter('projectId', index) as string);
	const issueId = this.getNodeParameter('issueId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

	const body: IDataObject = {};

	if (updateFields.reason) {
		body.reason = updateFields.reason;
	}

	if (updateFields.reasonText) {
		body.reasonText = updateFields.reasonText;
	}

	if (updateFields.disregardIfFixable !== undefined) {
		body.disregardIfFixable = updateFields.disregardIfFixable;
	}

	if (updateFields.expires) {
		body.expires = updateFields.expires;
	}

	const response = await snykV1ApiRequest.call(
		this,
		'PUT',
		`/org/${orgId}/project/${projectId}/ignore/${issueId}`,
		body,
	);

	const responseData = (response as IDataObject) || { success: true, issueId };

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Update',
	name: 'update',
	description: 'Update an ignore rule',
	action: 'Update an ignore rule',
};
