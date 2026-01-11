/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { snykApiRequest, validateOrgId, validateProjectId, buildJsonApiBody } from '../../transport/GenericFunctions';

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const orgId = validateOrgId(this.getNodeParameter('orgId', index) as string);
	const projectId = validateProjectId(this.getNodeParameter('projectId', index) as string);
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

	const attributes: IDataObject = {};

	if (updateFields.businessCriticality) {
		attributes.business_criticality = updateFields.businessCriticality;
	}

	if (updateFields.environment) {
		attributes.environment = updateFields.environment;
	}

	if (updateFields.lifecycle) {
		attributes.lifecycle = updateFields.lifecycle;
	}

	if (updateFields.testFrequency) {
		attributes.test_frequency = updateFields.testFrequency;
	}

	const body = buildJsonApiBody('project', attributes);

	const response = await snykApiRequest.call(
		this,
		'PATCH',
		`/orgs/${orgId}/projects/${projectId}`,
		body,
	);
	const responseData = (response.data as IDataObject) || response;

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Update',
	name: 'update',
	description: 'Update project settings',
	action: 'Update a project',
};
