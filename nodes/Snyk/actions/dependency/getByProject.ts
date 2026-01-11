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

	const body: IDataObject = {
		filters: {
			projects: [projectId],
		},
	};

	const response = await snykV1ApiRequest.call(
		this,
		'POST',
		`/org/${orgId}/dependencies`,
		body,
	);

	const results = (response.results as IDataObject[]) || [];

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(results),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Get by Project',
	name: 'getByProject',
	description: 'Get dependencies for a specific project',
	action: 'Get dependencies by project',
};
