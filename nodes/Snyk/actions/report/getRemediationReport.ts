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
		`/org/${orgId}/project/${projectId}/aggregated-issues`,
	);

	// Transform the response to include remediation recommendations
	const issues = response.issues as IDataObject[] || [];
	const remediationData = issues.map((issue: IDataObject) => {
		const fixInfo = issue.fixInfo as IDataObject || {};
		return {
			id: issue.id,
			issueType: issue.issueType,
			pkgName: issue.pkgName,
			pkgVersions: issue.pkgVersions,
			severity: (issue.issueData as IDataObject)?.severity,
			title: (issue.issueData as IDataObject)?.title,
			isUpgradable: fixInfo.isUpgradable,
			isPatchable: fixInfo.isPatchable,
			isPinnable: fixInfo.isPinnable,
			isFixable: fixInfo.isFixable,
			upgradePaths: fixInfo.upgradePaths,
			nearestFixedInVersion: fixInfo.nearestFixedInVersion,
		};
	});

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(remediationData),
		{ itemData: { item: index } },
	);

	return executionData;
}

export const description = {
	displayName: 'Get Remediation Report',
	name: 'getRemediationReport',
	description: 'Get remediation recommendations for a project',
	action: 'Get remediation report',
};
