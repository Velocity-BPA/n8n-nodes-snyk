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

	const response = await snykV1ApiRequest.call(this, 'GET', `/org/${orgId}/integrations`);

	// Convert object response to array
	const integrations: IDataObject[] = [];
	if (response && typeof response === 'object') {
		for (const [type, id] of Object.entries(response)) {
			integrations.push({ type, id });
		}
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(integrations),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Get Many',
	name: 'getAll',
	description: 'Get all integrations',
	action: 'Get all integrations',
};
