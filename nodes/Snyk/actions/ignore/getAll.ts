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

	const response = await snykV1ApiRequest.call(
		this,
		'GET',
		`/org/${orgId}/project/${projectId}/ignores`,
	);

	// Convert object response to array
	const ignores: IDataObject[] = [];
	if (response && typeof response === 'object') {
		for (const [issueId, ignoreData] of Object.entries(response)) {
			if (Array.isArray(ignoreData)) {
				for (const ignore of ignoreData) {
					ignores.push({ issueId, ...ignore });
				}
			} else {
				ignores.push({ issueId, ...(ignoreData as IDataObject) });
			}
		}
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(ignores),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Get Many',
	name: 'getAll',
	description: 'Get all ignore rules for a project',
	action: 'Get all ignore rules',
};
