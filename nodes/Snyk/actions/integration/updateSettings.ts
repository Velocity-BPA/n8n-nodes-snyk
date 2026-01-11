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
	const integrationId = this.getNodeParameter('integrationId', index) as string;
	const settingsJson = this.getNodeParameter('settings', index) as string;

	let settings: IDataObject;
	try {
		settings = JSON.parse(settingsJson) as IDataObject;
	} catch {
		throw new Error('Invalid JSON in settings field');
	}

	const response = await snykV1ApiRequest.call(
		this,
		'PUT',
		`/org/${orgId}/integrations/${integrationId}/settings`,
		settings,
	);
	const responseData = response as IDataObject;

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Update Settings',
	name: 'updateSettings',
	description: 'Update integration settings',
	action: 'Update integration settings',
};
