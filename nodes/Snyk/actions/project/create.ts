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
	const target = this.getNodeParameter('target', index) as IDataObject;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		target: {
			...target,
		},
	};

	if (additionalFields.files) {
		body.files = additionalFields.files;
	}

	if (additionalFields.exclusionGlobs) {
		body.exclusionGlobs = additionalFields.exclusionGlobs;
	}

	const response = await snykV1ApiRequest.call(
		this,
		'POST',
		`/org/${orgId}/integrations/${integrationId}/import`,
		body,
	);
	const responseData = response as IDataObject;

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Create',
	name: 'create',
	description: 'Import/create a new project',
	action: 'Create a project',
};
