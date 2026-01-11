/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

export interface ISnykCredentials {
	apiToken: string;
	region: 'US' | 'EU' | 'AU';
	version: string;
}

export interface ISnykApiResponse {
	jsonapi?: {
		version: string;
	};
	data?: IDataObject | IDataObject[];
	links?: {
		self?: string;
		first?: string;
		prev?: string;
		next?: string;
		last?: string;
	};
	errors?: ISnykApiError[];
}

export interface ISnykApiError {
	id?: string;
	status: string;
	code?: string;
	title: string;
	detail?: string;
	meta?: {
		created?: string;
		[key: string]: unknown;
	};
}

export interface ISnykOrganization {
	id: string;
	type: string;
	attributes: {
		name: string;
		slug: string;
		created_at?: string;
		is_personal?: boolean;
		group_id?: string;
	};
	relationships?: IDataObject;
}

export interface ISnykProject {
	id: string;
	type: string;
	attributes: {
		name: string;
		type: string;
		origin: string;
		status: string;
		created?: string;
		business_criticality?: string[];
		environment?: string[];
		lifecycle?: string[];
		tags?: Array<{ key: string; value: string }>;
	};
	relationships?: IDataObject;
}

export interface ISnykIssue {
	id: string;
	type: string;
	attributes: {
		key: string;
		title: string;
		type: string;
		severity: string;
		status: string;
		created_at?: string;
		updated_at?: string;
		effective_severity_level?: string;
		ignored?: boolean;
		problems?: IDataObject[];
		coordinates?: IDataObject[];
	};
	relationships?: IDataObject;
}

export interface ISnykTarget {
	id: string;
	type: string;
	attributes: {
		display_name: string;
		url?: string;
		origin: string;
		is_private?: boolean;
		created_at?: string;
	};
	relationships?: IDataObject;
}

export interface ISnykIntegration {
	id: string;
	type: string;
	attributes: {
		name: string;
		type: string;
		status?: string;
	};
}

export interface ISnykDependency {
	id: string;
	type: string;
	attributes: {
		name: string;
		version: string;
		package_manager?: string;
		licenses?: string[];
	};
}

export interface ISnykGroup {
	id: string;
	type: string;
	attributes: {
		name: string;
		slug?: string;
		created_at?: string;
	};
	relationships?: IDataObject;
}

export interface ISnykAuditLog {
	id: string;
	type: string;
	attributes: {
		event: string;
		created?: string;
		user_id?: string;
		org_id?: string;
		group_id?: string;
		content?: IDataObject;
	};
}

export interface ISnykUser {
	id: string;
	type: string;
	attributes: {
		name?: string;
		email: string;
		username?: string;
		role?: string;
	};
}

export interface ISnykIgnore {
	id: string;
	type: string;
	attributes: {
		reason?: string;
		reason_type?: string;
		created?: string;
		expires?: string;
		disregard_if_fixable?: boolean;
	};
}

export interface ISnykSbom {
	bomFormat: string;
	specVersion: string;
	serialNumber?: string;
	version?: number;
	metadata?: IDataObject;
	components?: IDataObject[];
	dependencies?: IDataObject[];
	vulnerabilities?: IDataObject[];
}

export type SnykResource =
	| 'organization'
	| 'project'
	| 'issue'
	| 'target'
	| 'integration'
	| 'dependency'
	| 'group'
	| 'auditLog'
	| 'user'
	| 'ignore'
	| 'sbom'
	| 'report';

export type OrganizationOperation =
	| 'getAll'
	| 'get'
	| 'getMembers'
	| 'getProjects'
	| 'getSettings'
	| 'updateSettings';

export type ProjectOperation =
	| 'getAll'
	| 'get'
	| 'create'
	| 'update'
	| 'delete'
	| 'activate'
	| 'deactivate'
	| 'getHistory'
	| 'getTags'
	| 'addTag'
	| 'removeTag';

export type IssueOperation =
	| 'getAll'
	| 'get'
	| 'getByProject'
	| 'getByOrg'
	| 'ignore'
	| 'unignore'
	| 'updateStatus';

export type TargetOperation = 'getAll' | 'get' | 'delete' | 'importProject';

export type IntegrationOperation =
	| 'getAll'
	| 'get'
	| 'getSettings'
	| 'updateSettings'
	| 'getCredentials';

export type DependencyOperation = 'getByOrg' | 'getByProject' | 'getLicenses';

export type GroupOperation =
	| 'getAll'
	| 'get'
	| 'getOrgs'
	| 'getMembers'
	| 'getSettings'
	| 'getAuditLogs';

export type AuditLogOperation = 'getByOrg' | 'getByGroup' | 'getByUser' | 'getByDateRange';

export type UserOperation = 'getAll' | 'get' | 'invite' | 'remove' | 'updateRole';

export type IgnoreOperation = 'getAll' | 'get' | 'create' | 'update' | 'delete';

export type SbomOperation = 'getByProject' | 'exportCycloneDX' | 'exportSPDX';

export type ReportOperation =
	| 'getLatestIssues'
	| 'getIssuesByProject'
	| 'getVulnerabilityCountByDay'
	| 'getRemediationReport';

export interface IPaginationParams {
	limit?: number;
	starting_after?: string;
	ending_before?: string;
}
