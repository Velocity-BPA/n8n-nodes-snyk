/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import * as actions from './actions';

export class Snyk implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Snyk',
		name: 'snyk',
		icon: 'file:snyk.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Snyk security platform API',
		defaults: {
			name: 'Snyk',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'snykApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Audit Log',
						value: 'auditLog',
					},
					{
						name: 'Dependency',
						value: 'dependency',
					},
					{
						name: 'Group',
						value: 'group',
					},
					{
						name: 'Ignore',
						value: 'ignore',
					},
					{
						name: 'Integration',
						value: 'integration',
					},
					{
						name: 'Issue',
						value: 'issue',
					},
					{
						name: 'Organization',
						value: 'organization',
					},
					{
						name: 'Project',
						value: 'project',
					},
					{
						name: 'Report',
						value: 'report',
					},
					{
						name: 'SBOM',
						value: 'sbom',
					},
					{
						name: 'Target',
						value: 'target',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'organization',
			},

			// Organization Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['organization'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get an organization by ID',
						action: 'Get an organization',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many organizations',
						action: 'Get many organizations',
					},
					{
						name: 'Get Members',
						value: 'getMembers',
						description: 'Get organization members',
						action: 'Get organization members',
					},
					{
						name: 'Get Projects',
						value: 'getProjects',
						description: 'Get all projects in organization',
						action: 'Get organization projects',
					},
					{
						name: 'Get Settings',
						value: 'getSettings',
						description: 'Get organization settings',
						action: 'Get organization settings',
					},
					{
						name: 'Update Settings',
						value: 'updateSettings',
						description: 'Update organization settings',
						action: 'Update organization settings',
					},
				],
				default: 'getAll',
			},

			// Project Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['project'],
					},
				},
				options: [
					{
						name: 'Activate',
						value: 'activate',
						description: 'Activate project monitoring',
						action: 'Activate a project',
					},
					{
						name: 'Add Tag',
						value: 'addTag',
						description: 'Add tag to project',
						action: 'Add tag to project',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new project',
						action: 'Create a project',
					},
					{
						name: 'Deactivate',
						value: 'deactivate',
						description: 'Deactivate project monitoring',
						action: 'Deactivate a project',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a project',
						action: 'Delete a project',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a project by ID',
						action: 'Get a project',
					},
					{
						name: 'Get History',
						value: 'getHistory',
						description: 'Get project snapshot history',
						action: 'Get project history',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many projects',
						action: 'Get many projects',
					},
					{
						name: 'Get Tags',
						value: 'getTags',
						description: 'Get project tags',
						action: 'Get project tags',
					},
					{
						name: 'Remove Tag',
						value: 'removeTag',
						description: 'Remove tag from project',
						action: 'Remove tag from project',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a project',
						action: 'Update a project',
					},
				],
				default: 'getAll',
			},

			// Issue Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['issue'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get an issue by ID',
						action: 'Get an issue',
					},
					{
						name: 'Get by Organization',
						value: 'getByOrg',
						description: 'Get all issues in organization',
						action: 'Get issues by organization',
					},
					{
						name: 'Get by Project',
						value: 'getByProject',
						description: 'Get issues for a project',
						action: 'Get issues by project',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many issues',
						action: 'Get many issues',
					},
					{
						name: 'Ignore',
						value: 'ignore',
						description: 'Ignore an issue',
						action: 'Ignore an issue',
					},
					{
						name: 'Unignore',
						value: 'unignore',
						description: 'Unignore an issue',
						action: 'Unignore an issue',
					},
					{
						name: 'Update Status',
						value: 'updateStatus',
						description: 'Update issue status',
						action: 'Update issue status',
					},
				],
				default: 'getAll',
			},

			// Target Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['target'],
					},
				},
				options: [
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a target',
						action: 'Delete a target',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a target by ID',
						action: 'Get a target',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many targets',
						action: 'Get many targets',
					},
					{
						name: 'Import Project',
						value: 'importProject',
						description: 'Import project from target',
						action: 'Import project from target',
					},
				],
				default: 'getAll',
			},

			// Integration Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['integration'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get an integration by ID',
						action: 'Get an integration',
					},
					{
						name: 'Get Credentials',
						value: 'getCredentials',
						description: 'Get integration credentials',
						action: 'Get integration credentials',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many integrations',
						action: 'Get many integrations',
					},
					{
						name: 'Get Settings',
						value: 'getSettings',
						description: 'Get integration settings',
						action: 'Get integration settings',
					},
					{
						name: 'Update Settings',
						value: 'updateSettings',
						description: 'Update integration settings',
						action: 'Update integration settings',
					},
				],
				default: 'getAll',
			},

			// Dependency Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['dependency'],
					},
				},
				options: [
					{
						name: 'Get by Organization',
						value: 'getByOrg',
						description: 'Get all dependencies in organization',
						action: 'Get dependencies by organization',
					},
					{
						name: 'Get by Project',
						value: 'getByProject',
						description: 'Get dependencies for a project',
						action: 'Get dependencies by project',
					},
					{
						name: 'Get Licenses',
						value: 'getLicenses',
						description: 'Get dependency licenses',
						action: 'Get dependency licenses',
					},
				],
				default: 'getByOrg',
			},

			// Group Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['group'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a group by ID',
						action: 'Get a group',
					},
					{
						name: 'Get Audit Logs',
						value: 'getAuditLogs',
						description: 'Get group audit logs',
						action: 'Get group audit logs',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many groups',
						action: 'Get many groups',
					},
					{
						name: 'Get Members',
						value: 'getMembers',
						description: 'Get group members',
						action: 'Get group members',
					},
					{
						name: 'Get Organizations',
						value: 'getOrgs',
						description: 'Get organizations in group',
						action: 'Get group organizations',
					},
					{
						name: 'Get Settings',
						value: 'getSettings',
						description: 'Get group settings',
						action: 'Get group settings',
					},
				],
				default: 'getAll',
			},

			// Audit Log Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['auditLog'],
					},
				},
				options: [
					{
						name: 'Get by Date Range',
						value: 'getByDateRange',
						description: 'Get audit logs in date range',
						action: 'Get audit logs by date range',
					},
					{
						name: 'Get by Group',
						value: 'getByGroup',
						description: 'Get audit logs for group',
						action: 'Get audit logs by group',
					},
					{
						name: 'Get by Organization',
						value: 'getByOrg',
						description: 'Get audit logs for organization',
						action: 'Get audit logs by organization',
					},
					{
						name: 'Get by User',
						value: 'getByUser',
						description: 'Get audit logs by user',
						action: 'Get audit logs by user',
					},
				],
				default: 'getByOrg',
			},

			// User Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a user by ID',
						action: 'Get a user',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many users',
						action: 'Get many users',
					},
					{
						name: 'Invite',
						value: 'invite',
						description: 'Invite a user to organization',
						action: 'Invite a user',
					},
					{
						name: 'Remove',
						value: 'remove',
						description: 'Remove a user from organization',
						action: 'Remove a user',
					},
					{
						name: 'Update Role',
						value: 'updateRole',
						description: 'Update user role',
						action: 'Update user role',
					},
				],
				default: 'getAll',
			},

			// Ignore Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['ignore'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create an ignore rule',
						action: 'Create an ignore rule',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an ignore rule',
						action: 'Delete an ignore rule',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an ignore rule by ID',
						action: 'Get an ignore rule',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many ignore rules',
						action: 'Get many ignore rules',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an ignore rule',
						action: 'Update an ignore rule',
					},
				],
				default: 'getAll',
			},

			// SBOM Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['sbom'],
					},
				},
				options: [
					{
						name: 'Export CycloneDX',
						value: 'exportCycloneDX',
						description: 'Export SBOM as CycloneDX format',
						action: 'Export SBOM as CycloneDX',
					},
					{
						name: 'Export SPDX',
						value: 'exportSPDX',
						description: 'Export SBOM as SPDX format',
						action: 'Export SBOM as SPDX',
					},
					{
						name: 'Get by Project',
						value: 'getByProject',
						description: 'Get SBOM for a project',
						action: 'Get SBOM by project',
					},
				],
				default: 'getByProject',
			},

			// Report Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['report'],
					},
				},
				options: [
					{
						name: 'Get Issues by Project',
						value: 'getIssuesByProject',
						description: 'Get issues summary by project',
						action: 'Get issues by project',
					},
					{
						name: 'Get Latest Issues',
						value: 'getLatestIssues',
						description: 'Get latest issues report',
						action: 'Get latest issues report',
					},
					{
						name: 'Get Remediation Report',
						value: 'getRemediationReport',
						description: 'Get remediation recommendations',
						action: 'Get remediation report',
					},
					{
						name: 'Get Vulnerability Count by Day',
						value: 'getVulnerabilityCountByDay',
						description: 'Get vulnerability count trends',
						action: 'Get vulnerability count by day',
					},
				],
				default: 'getLatestIssues',
			},

			// Common Fields - Organization ID
			{
				displayName: 'Organization ID',
				name: 'orgId',
				type: 'string',
				required: true,
				default: '',
				description: 'The UUID of the organization',
				displayOptions: {
					show: {
						resource: [
							'organization',
							'project',
							'issue',
							'target',
							'integration',
							'dependency',
							'auditLog',
							'user',
							'ignore',
							'sbom',
							'report',
						],
					},
					hide: {
						operation: ['getAll'],
						resource: ['organization'],
					},
				},
			},

			// Group ID field
			{
				displayName: 'Group ID',
				name: 'groupId',
				type: 'string',
				required: true,
				default: '',
				description: 'The UUID of the group',
				displayOptions: {
					show: {
						resource: ['group'],
					},
					hide: {
						operation: ['getAll'],
					},
				},
			},

			// Project ID field
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				required: true,
				default: '',
				description: 'The UUID of the project',
				displayOptions: {
					show: {
						resource: ['project', 'sbom'],
						operation: [
							'get',
							'update',
							'delete',
							'activate',
							'deactivate',
							'getHistory',
							'getTags',
							'addTag',
							'removeTag',
							'getByProject',
							'exportCycloneDX',
							'exportSPDX',
						],
					},
				},
			},

			// Project ID for dependency/issue
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				required: true,
				default: '',
				description: 'The UUID of the project',
				displayOptions: {
					show: {
						resource: ['dependency', 'issue', 'report'],
						operation: ['getByProject', 'getIssuesByProject', 'getRemediationReport'],
					},
				},
			},

			// Issue ID field
			{
				displayName: 'Issue ID',
				name: 'issueId',
				type: 'string',
				required: true,
				default: '',
				description: 'The UUID of the issue',
				displayOptions: {
					show: {
						resource: ['issue'],
						operation: ['get', 'ignore', 'unignore', 'updateStatus'],
					},
				},
			},

			// Target ID field
			{
				displayName: 'Target ID',
				name: 'targetId',
				type: 'string',
				required: true,
				default: '',
				description: 'The UUID of the target',
				displayOptions: {
					show: {
						resource: ['target'],
						operation: ['get', 'delete', 'importProject'],
					},
				},
			},

			// Integration ID field
			{
				displayName: 'Integration ID',
				name: 'integrationId',
				type: 'string',
				required: true,
				default: '',
				description: 'The UUID of the integration',
				displayOptions: {
					show: {
						resource: ['integration'],
						operation: ['get', 'getSettings', 'updateSettings', 'getCredentials'],
					},
				},
			},

			// User ID field
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				required: true,
				default: '',
				description: 'The UUID of the user',
				displayOptions: {
					show: {
						resource: ['user', 'auditLog'],
						operation: ['get', 'remove', 'updateRole', 'getByUser'],
					},
				},
			},

			// Ignore ID field
			{
				displayName: 'Ignore ID',
				name: 'ignoreId',
				type: 'string',
				required: true,
				default: '',
				description: 'The UUID of the ignore rule',
				displayOptions: {
					show: {
						resource: ['ignore'],
						operation: ['get', 'update', 'delete'],
					},
				},
			},

			// Return All field
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all results or only up to a given limit',
				displayOptions: {
					show: {
						operation: [
							'getAll',
							'getMembers',
							'getProjects',
							'getByOrg',
							'getByProject',
							'getOrgs',
							'getLatestIssues',
							'getByGroup',
							'getByDateRange',
							'getByUser',
						],
					},
				},
			},

			// Limit field
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 10,
				description: 'Max number of results to return',
				displayOptions: {
					show: {
						returnAll: [false],
						operation: [
							'getAll',
							'getMembers',
							'getProjects',
							'getByOrg',
							'getByProject',
							'getOrgs',
							'getLatestIssues',
							'getByGroup',
							'getByDateRange',
							'getByUser',
						],
					},
				},
			},

			// Email field for invite
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				required: true,
				default: '',
				description: 'Email address of the user to invite',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['invite'],
					},
				},
			},

			// Role field for invite/update
			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				options: [
					{
						name: 'Admin',
						value: 'ORG_ADMIN',
					},
					{
						name: 'Collaborator',
						value: 'ORG_COLLABORATOR',
					},
				],
				default: 'ORG_COLLABORATOR',
				description: 'Role to assign to the user',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['invite', 'updateRole'],
					},
				},
			},

			// Tag fields
			{
				displayName: 'Tag Key',
				name: 'tagKey',
				type: 'string',
				required: true,
				default: '',
				description: 'Key of the tag',
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['addTag', 'removeTag'],
					},
				},
			},
			{
				displayName: 'Tag Value',
				name: 'tagValue',
				type: 'string',
				required: true,
				default: '',
				description: 'Value of the tag',
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['addTag', 'removeTag'],
					},
				},
			},

			// SBOM Format field
			{
				displayName: 'Include Vulnerabilities',
				name: 'includeVulnerabilities',
				type: 'boolean',
				default: true,
				description: 'Whether to include vulnerability data in the SBOM',
				displayOptions: {
					show: {
						resource: ['sbom'],
						operation: ['getByProject', 'exportCycloneDX', 'exportSPDX'],
					},
				},
			},

			// Issue Status field
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Open',
						value: 'open',
					},
					{
						name: 'Resolved',
						value: 'resolved',
					},
					{
						name: 'Ignored',
						value: 'ignored',
					},
				],
				default: 'open',
				description: 'Status to set for the issue',
				displayOptions: {
					show: {
						resource: ['issue'],
						operation: ['updateStatus'],
					},
				},
			},

			// Ignore reason field
			{
				displayName: 'Reason',
				name: 'reason',
				type: 'options',
				options: [
					{
						name: 'Not Vulnerable',
						value: 'not-vulnerable',
					},
					{
						name: 'Won\'t Fix',
						value: 'wont-fix',
					},
					{
						name: 'Temporary Ignore',
						value: 'temporary-ignore',
					},
				],
				default: 'temporary-ignore',
				description: 'Reason for ignoring the issue',
				displayOptions: {
					show: {
						resource: ['issue', 'ignore'],
						operation: ['ignore', 'create'],
					},
				},
			},

			// Ignore issue ID for create
			{
				displayName: 'Issue ID',
				name: 'issueId',
				type: 'string',
				required: true,
				default: '',
				description: 'The UUID of the issue to ignore',
				displayOptions: {
					show: {
						resource: ['ignore'],
						operation: ['create'],
					},
				},
			},

			// Additional Fields for various operations
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'organization',
							'project',
							'issue',
							'target',
							'dependency',
							'auditLog',
							'ignore',
							'report',
						],
						operation: [
							'getAll',
							'getMembers',
							'getProjects',
							'getByOrg',
							'getByProject',
							'getByGroup',
							'getByDateRange',
							'getLatestIssues',
							'getIssuesByProject',
							'getVulnerabilityCountByDay',
							'update',
							'create',
						],
					},
				},
				options: [
					{
						displayName: 'Business Criticality',
						name: 'businessCriticality',
						type: 'options',
						options: [
							{ name: 'Critical', value: 'critical' },
							{ name: 'High', value: 'high' },
							{ name: 'Medium', value: 'medium' },
							{ name: 'Low', value: 'low' },
						],
						default: 'medium',
						description: 'Business criticality of the project',
					},
					{
						displayName: 'Environment',
						name: 'environment',
						type: 'options',
						options: [
							{ name: 'Frontend', value: 'frontend' },
							{ name: 'Backend', value: 'backend' },
							{ name: 'Internal', value: 'internal' },
							{ name: 'External', value: 'external' },
							{ name: 'Mobile', value: 'mobile' },
						],
						default: 'backend',
						description: 'Environment of the project',
					},
					{
						displayName: 'Expires',
						name: 'expires',
						type: 'dateTime',
						default: '',
						description: 'Expiration date for temporary ignore',
					},
					{
						displayName: 'From',
						name: 'from',
						type: 'dateTime',
						default: '',
						description: 'Start date for date range queries',
					},
					{
						displayName: 'Group By',
						name: 'groupBy',
						type: 'options',
						options: [
							{ name: 'Severity', value: 'severity' },
							{ name: 'Issue Type', value: 'issueType' },
							{ name: 'Project', value: 'project' },
						],
						default: 'severity',
						description: 'Group results by this field',
					},
					{
						displayName: 'Is Fixable',
						name: 'isFixable',
						type: 'boolean',
						default: false,
						description: 'Whether to filter by fixable issues',
					},
					{
						displayName: 'Issue Type',
						name: 'issueType',
						type: 'options',
						options: [
							{ name: 'Vulnerability', value: 'vuln' },
							{ name: 'License', value: 'license' },
							{ name: 'Configuration', value: 'configuration' },
						],
						default: 'vuln',
						description: 'Type of issue',
					},
					{
						displayName: 'Origin',
						name: 'origin',
						type: 'options',
						options: [
							{ name: 'GitHub', value: 'github' },
							{ name: 'GitLab', value: 'gitlab' },
							{ name: 'Bitbucket', value: 'bitbucket' },
							{ name: 'Azure Repos', value: 'azure-repos' },
							{ name: 'CLI', value: 'cli' },
							{ name: 'API', value: 'api' },
						],
						default: 'github',
						description: 'Origin of the project',
					},
					{
						displayName: 'Project ID',
						name: 'projectId',
						type: 'string',
						default: '',
						description: 'Filter by project ID',
					},
					{
						displayName: 'Reason Text',
						name: 'reasonText',
						type: 'string',
						default: '',
						description: 'Custom reason description',
					},
					{
						displayName: 'Severity',
						name: 'severity',
						type: 'options',
						options: [
							{ name: 'Critical', value: 'critical' },
							{ name: 'High', value: 'high' },
							{ name: 'Medium', value: 'medium' },
							{ name: 'Low', value: 'low' },
						],
						default: 'high',
						description: 'Severity level',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{ name: 'Active', value: 'active' },
							{ name: 'Inactive', value: 'inactive' },
						],
						default: 'active',
						description: 'Status of the project',
					},
					{
						displayName: 'To',
						name: 'to',
						type: 'dateTime',
						default: '',
						description: 'End date for date range queries',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'npm', value: 'npm' },
							{ name: 'Maven', value: 'maven' },
							{ name: 'pip', value: 'pip' },
							{ name: 'Gradle', value: 'gradle' },
							{ name: 'NuGet', value: 'nuget' },
							{ name: 'Docker', value: 'docker' },
							{ name: 'CocoaPods', value: 'cocoapods' },
							{ name: 'Composer', value: 'composer' },
						],
						default: 'npm',
						description: 'Type of project',
					},
				],
			},

			// Update Settings fields
			{
				displayName: 'Settings',
				name: 'settings',
				type: 'collection',
				placeholder: 'Add Setting',
				default: {},
				displayOptions: {
					show: {
						operation: ['updateSettings'],
					},
				},
				options: [
					{
						displayName: 'Auto Remediation PR Enabled',
						name: 'autoRemediationPrsEnabled',
						type: 'boolean',
						default: false,
						description: 'Whether auto remediation PRs are enabled',
					},
					{
						displayName: 'Auto Dependency Upgrade Enabled',
						name: 'autoDependencyUpgradeEnabled',
						type: 'boolean',
						default: false,
						description: 'Whether auto dependency upgrades are enabled',
					},
					{
						displayName: 'Minimum Severity for PR',
						name: 'autoRemediationMinSeverity',
						type: 'options',
						options: [
							{ name: 'Critical', value: 'critical' },
							{ name: 'High', value: 'high' },
							{ name: 'Medium', value: 'medium' },
							{ name: 'Low', value: 'low' },
						],
						default: 'high',
						description: 'Minimum severity for auto remediation PRs',
					},
				],
			},

			// Date range fields for audit logs
			{
				displayName: 'From Date',
				name: 'fromDate',
				type: 'dateTime',
				required: true,
				default: '',
				description: 'Start date for the date range',
				displayOptions: {
					show: {
						resource: ['auditLog'],
						operation: ['getByDateRange'],
					},
				},
			},
			{
				displayName: 'To Date',
				name: 'toDate',
				type: 'dateTime',
				required: true,
				default: '',
				description: 'End date for the date range',
				displayOptions: {
					show: {
						resource: ['auditLog'],
						operation: ['getByDateRange'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: INodeExecutionData[] = [];

				switch (resource) {
					case 'organization':
						responseData = await executeOrganization.call(this, operation, i);
						break;
					case 'project':
						responseData = await executeProject.call(this, operation, i);
						break;
					case 'issue':
						responseData = await executeIssue.call(this, operation, i);
						break;
					case 'target':
						responseData = await executeTarget.call(this, operation, i);
						break;
					case 'integration':
						responseData = await executeIntegration.call(this, operation, i);
						break;
					case 'dependency':
						responseData = await executeDependency.call(this, operation, i);
						break;
					case 'group':
						responseData = await executeGroup.call(this, operation, i);
						break;
					case 'auditLog':
						responseData = await executeAuditLog.call(this, operation, i);
						break;
					case 'user':
						responseData = await executeUser.call(this, operation, i);
						break;
					case 'ignore':
						responseData = await executeIgnore.call(this, operation, i);
						break;
					case 'sbom':
						responseData = await executeSbom.call(this, operation, i);
						break;
					case 'report':
						responseData = await executeReport.call(this, operation, i);
						break;
				}

				returnData.push(...responseData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

async function executeOrganization(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'getAll':
			return actions.organization.getAll.execute.call(this, index);
		case 'get':
			return actions.organization.get.execute.call(this, index);
		case 'getMembers':
			return actions.organization.getMembers.execute.call(this, index);
		case 'getProjects':
			return actions.organization.getProjects.execute.call(this, index);
		case 'getSettings':
			return actions.organization.getSettings.execute.call(this, index);
		case 'updateSettings':
			return actions.organization.updateSettings.execute.call(this, index);
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}

async function executeProject(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'getAll':
			return actions.project.getAll.execute.call(this, index);
		case 'get':
			return actions.project.get.execute.call(this, index);
		case 'create':
			return actions.project.create.execute.call(this, index);
		case 'update':
			return actions.project.update.execute.call(this, index);
		case 'delete':
			return actions.project.delete_.execute.call(this, index);
		case 'activate':
			return actions.project.activate.execute.call(this, index);
		case 'deactivate':
			return actions.project.deactivate.execute.call(this, index);
		case 'getHistory':
			return actions.project.getHistory.execute.call(this, index);
		case 'getTags':
			return actions.project.getTags.execute.call(this, index);
		case 'addTag':
			return actions.project.addTag.execute.call(this, index);
		case 'removeTag':
			return actions.project.removeTag.execute.call(this, index);
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}

async function executeIssue(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'getAll':
			return actions.issue.getAll.execute.call(this, index);
		case 'get':
			return actions.issue.get.execute.call(this, index);
		case 'getByProject':
			return actions.issue.getByProject.execute.call(this, index);
		case 'getByOrg':
			return actions.issue.getByOrg.execute.call(this, index);
		case 'ignore':
			return actions.issue.ignore.execute.call(this, index);
		case 'unignore':
			return actions.issue.unignore.execute.call(this, index);
		case 'updateStatus':
			return actions.issue.updateStatus.execute.call(this, index);
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}

async function executeTarget(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'getAll':
			return actions.target.getAll.execute.call(this, index);
		case 'get':
			return actions.target.get.execute.call(this, index);
		case 'delete':
			return actions.target.delete_.execute.call(this, index);
		case 'importProject':
			return actions.target.importProject.execute.call(this, index);
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}

async function executeIntegration(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'getAll':
			return actions.integration.getAll.execute.call(this, index);
		case 'get':
			return actions.integration.get.execute.call(this, index);
		case 'getSettings':
			return actions.integration.getSettings.execute.call(this, index);
		case 'updateSettings':
			return actions.integration.updateSettings.execute.call(this, index);
		case 'getCredentials':
			return actions.integration.getCredentials.execute.call(this, index);
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}

async function executeDependency(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'getByOrg':
			return actions.dependency.getByOrg.execute.call(this, index);
		case 'getByProject':
			return actions.dependency.getByProject.execute.call(this, index);
		case 'getLicenses':
			return actions.dependency.getLicenses.execute.call(this, index);
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}

async function executeGroup(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'getAll':
			return actions.group.getAll.execute.call(this, index);
		case 'get':
			return actions.group.get.execute.call(this, index);
		case 'getOrgs':
			return actions.group.getOrgs.execute.call(this, index);
		case 'getMembers':
			return actions.group.getMembers.execute.call(this, index);
		case 'getSettings':
			return actions.group.getSettings.execute.call(this, index);
		case 'getAuditLogs':
			return actions.group.getAuditLogs.execute.call(this, index);
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}

async function executeAuditLog(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'getByOrg':
			return actions.auditLog.getByOrg.execute.call(this, index);
		case 'getByGroup':
			return actions.auditLog.getByGroup.execute.call(this, index);
		case 'getByUser':
			return actions.auditLog.getByUser.execute.call(this, index);
		case 'getByDateRange':
			return actions.auditLog.getByDateRange.execute.call(this, index);
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}

async function executeUser(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'getAll':
			return actions.user.getAll.execute.call(this, index);
		case 'get':
			return actions.user.get.execute.call(this, index);
		case 'invite':
			return actions.user.invite.execute.call(this, index);
		case 'remove':
			return actions.user.remove.execute.call(this, index);
		case 'updateRole':
			return actions.user.updateRole.execute.call(this, index);
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}

async function executeIgnore(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'getAll':
			return actions.ignore.getAll.execute.call(this, index);
		case 'get':
			return actions.ignore.get.execute.call(this, index);
		case 'create':
			return actions.ignore.create.execute.call(this, index);
		case 'update':
			return actions.ignore.update.execute.call(this, index);
		case 'delete':
			return actions.ignore.delete_.execute.call(this, index);
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}

async function executeSbom(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'getByProject':
			return actions.sbom.getByProject.execute.call(this, index);
		case 'exportCycloneDX':
			return actions.sbom.exportCycloneDX.execute.call(this, index);
		case 'exportSPDX':
			return actions.sbom.exportSPDX.execute.call(this, index);
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}

async function executeReport(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'getLatestIssues':
			return actions.report.getLatestIssues.execute.call(this, index);
		case 'getIssuesByProject':
			return actions.report.getIssuesByProject.execute.call(this, index);
		case 'getVulnerabilityCountByDay':
			return actions.report.getVulnerabilityCountByDay.execute.call(this, index);
		case 'getRemediationReport':
			return actions.report.getRemediationReport.execute.call(this, index);
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
