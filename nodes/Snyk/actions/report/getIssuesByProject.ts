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
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const qs: IDataObject = {};

	if (additionalFields.severity) {
		qs['severity'] = additionalFields.severity;
	}

	if (additionalFields.issueType) {
		qs['type'] = additionalFields.issueType;
	}

	if (additionalFields.groupBy) {
		qs['groupBy'] = additionalFields.groupBy;
	}

	const response = await snykApiRequest.call(
		this,
		'GET',
		`/orgs/${orgId}/projects/${projectId}/issues/summary`,
		undefined,
		qs,
	);

	const responseData = response.data ? [response.data as IDataObject] : [response];

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Get Issues by Project',
	name: 'getIssuesByProject',
	description: 'Get issues summary by project',
	action: 'Get issues by project',
};
