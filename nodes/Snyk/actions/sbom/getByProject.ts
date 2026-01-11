/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { snykApiRequest, validateOrgId, validateProjectId } from '../../transport/GenericFunctions';

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const orgId = validateOrgId(this.getNodeParameter('orgId', index) as string);
	const projectId = validateProjectId(this.getNodeParameter('projectId', index) as string);
	const format = this.getNodeParameter('format', index, 'cyclonedx1.4+json') as string;

	const qs: IDataObject = {
		format,
	};

	const response = await snykApiRequest.call(
		this,
		'GET',
		`/orgs/${orgId}/projects/${projectId}/sbom`,
		undefined,
		qs,
	);

	const responseData = response as IDataObject;

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Get by Project',
	name: 'getByProject',
	description: 'Get SBOM for a project',
	action: 'Get SBOM by project',
};
