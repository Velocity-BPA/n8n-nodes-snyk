/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { snykApiRequest, snykApiRequestAllItems, validateOrgId } from '../../transport/GenericFunctions';

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const orgId = validateOrgId(this.getNodeParameter('orgId', index) as string);
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const limit = this.getNodeParameter('limit', index, 100) as number;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const qs: IDataObject = {};

	if (additionalFields.severity) {
		qs['severity'] = additionalFields.severity;
	}

	if (additionalFields.issueType) {
		qs['type'] = additionalFields.issueType;
	}

	if (additionalFields.from) {
		qs['from'] = additionalFields.from;
	}

	if (additionalFields.to) {
		qs['to'] = additionalFields.to;
	}

	if (!returnAll) {
		qs.limit = limit;
	}

	let responseData: IDataObject[];

	if (returnAll) {
		responseData = await snykApiRequestAllItems.call(
			this,
			'GET',
			`/orgs/${orgId}/issues`,
			undefined,
			qs,
		);
	} else {
		const response = await snykApiRequest.call(
			this,
			'GET',
			`/orgs/${orgId}/issues`,
			undefined,
			qs,
		);
		responseData = (response.data as IDataObject[]) || [];
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Get Latest Issues',
	name: 'getLatestIssues',
	description: 'Get the latest issues report for an organization',
	action: 'Get latest issues report',
};
