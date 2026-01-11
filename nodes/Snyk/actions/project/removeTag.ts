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
	const tagKey = this.getNodeParameter('tagKey', index) as string;
	const tagValue = this.getNodeParameter('tagValue', index) as string;

	const body = {
		key: tagKey,
		value: tagValue,
	};

	const response = await snykV1ApiRequest.call(
		this,
		'POST',
		`/org/${orgId}/project/${projectId}/tags/remove`,
		body,
	);

	const responseData = (response as IDataObject) || { success: true, key: tagKey, value: tagValue };

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Remove Tag',
	name: 'removeTag',
	description: 'Remove a tag from a project',
	action: 'Remove tag from project',
};
