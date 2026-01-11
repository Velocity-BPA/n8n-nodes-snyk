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
	const includeVulnerabilities = this.getNodeParameter('includeVulnerabilities', index, false) as boolean;

	const qs: IDataObject = {
		format: 'cyclonedx1.4+json',
	};

	if (includeVulnerabilities) {
		qs.include_vulnerabilities = true;
	}

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
	displayName: 'Export CycloneDX',
	name: 'exportCycloneDX',
	description: 'Export SBOM as CycloneDX format',
	action: 'Export SBOM as CycloneDX',
};
