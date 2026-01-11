/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IHookFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IPollFunctions,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';

import { snykApiRequestAllItems } from './transport/GenericFunctions';

export class SnykTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Snyk Trigger',
		name: 'snykTrigger',
		icon: 'file:snyk.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["triggerMode"]}}',
		description: 'Starts the workflow when Snyk events occur',
		defaults: {
			name: 'Snyk Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'snykApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		polling: true,
		properties: [
			{
				displayName: 'Trigger Mode',
				name: 'triggerMode',
				type: 'options',
				options: [
					{
						name: 'Webhook',
						value: 'webhook',
						description: 'Receive events via webhook from Snyk',
					},
					{
						name: 'Polling',
						value: 'polling',
						description: 'Poll for new events periodically',
					},
				],
				default: 'polling',
				description: 'How to trigger the workflow',
			},
			{
				displayName: 'Organization ID',
				name: 'orgId',
				type: 'string',
				required: true,
				default: '',
				description: 'The UUID of the organization to monitor',
				displayOptions: {
					show: {
						triggerMode: ['polling'],
					},
				},
			},
			{
				displayName: 'Event Type',
				name: 'eventType',
				type: 'options',
				options: [
					{
						name: 'Critical Issue Found',
						value: 'criticalIssue',
						description: 'Trigger when a critical severity issue is found',
					},
					{
						name: 'New Issue Discovered',
						value: 'newIssue',
						description: 'Trigger when any new issue is discovered',
					},
					{
						name: 'New Vulnerability',
						value: 'newVulnerability',
						description: 'Trigger when a new vulnerability is detected',
					},
					{
						name: 'Project Imported',
						value: 'projectImported',
						description: 'Trigger when a new project is imported',
					},
				],
				default: 'newVulnerability',
				description: 'Type of event to trigger on',
				displayOptions: {
					show: {
						triggerMode: ['polling'],
					},
				},
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'Optional: Limit to a specific project',
				displayOptions: {
					show: {
						triggerMode: ['polling'],
					},
				},
			},
			{
				displayName: 'Severity Filter',
				name: 'severityFilter',
				type: 'multiOptions',
				options: [
					{
						name: 'Critical',
						value: 'critical',
					},
					{
						name: 'High',
						value: 'high',
					},
					{
						name: 'Medium',
						value: 'medium',
					},
					{
						name: 'Low',
						value: 'low',
					},
				],
				default: ['critical', 'high'],
				description: 'Filter issues by severity',
				displayOptions: {
					show: {
						triggerMode: ['polling'],
						eventType: ['newIssue', 'newVulnerability'],
					},
				},
			},
			{
				displayName: 'Webhook Events',
				name: 'webhookEvents',
				type: 'multiOptions',
				options: [
					{
						name: 'Issue Created',
						value: 'project.issue.created',
					},
					{
						name: 'Issue Ignored',
						value: 'project.issue.ignored',
					},
					{
						name: 'Issue Resolved',
						value: 'project.issue.resolved',
					},
					{
						name: 'Project Snapshot',
						value: 'project.snapshot',
					},
				],
				default: ['project.issue.created'],
				description: 'Events to listen for via webhook',
				displayOptions: {
					show: {
						triggerMode: ['webhook'],
					},
				},
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// Webhook management would typically be done through Snyk's UI
				// This is a placeholder for webhook setup verification
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				// Webhooks in Snyk are typically set up through the Snyk UI
				// This returns true to allow the workflow to proceed
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				// Clean up webhook if needed
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const body = this.getBodyData() as IDataObject;

		// Verify webhook signature if available
		const snykSignature = req.headers['x-snyk-signature'];
		if (snykSignature) {
			// In a production environment, you would verify the signature here
			// using the webhook secret configured in Snyk
		}

		// Extract event type from the webhook payload
		const eventType = body.event as string || 'unknown';
		const webhookEvents = this.getNodeParameter('webhookEvents') as string[];

		// Filter events based on configuration
		if (webhookEvents.length > 0 && !webhookEvents.includes(eventType)) {
			return {
				noWebhookResponse: true,
			};
		}

		return {
			workflowData: [
				this.helpers.returnJsonArray({
					event: eventType,
					timestamp: new Date().toISOString(),
					...body,
				}),
			],
		};
	}

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const triggerMode = this.getNodeParameter('triggerMode') as string;

		if (triggerMode !== 'polling') {
			return null;
		}

		const orgId = this.getNodeParameter('orgId') as string;
		const eventType = this.getNodeParameter('eventType') as string;
		const projectId = this.getNodeParameter('projectId', '') as string;
		const severityFilter = this.getNodeParameter('severityFilter', ['critical', 'high']) as string[];

		// Get the last poll time from workflow static data
		const webhookData = this.getWorkflowStaticData('node');
		const lastPollTime = webhookData.lastPollTime as string || new Date(Date.now() - 3600000).toISOString();
		webhookData.lastPollTime = new Date().toISOString();

		const returnData: INodeExecutionData[] = [];

		try {
			switch (eventType) {
				case 'newVulnerability':
				case 'newIssue': {
					const qs: IDataObject = {
						'created_after': lastPollTime,
					};

					if (severityFilter.length > 0) {
						qs['severity'] = severityFilter.join(',');
					}

					let endpoint = `/orgs/${orgId}/issues`;
					if (projectId) {
						endpoint = `/orgs/${orgId}/projects/${projectId}/issues`;
					}

					const issues = await snykApiRequestAllItems.call(
						this as unknown as import('n8n-workflow').IExecuteFunctions,
						'GET',
						endpoint,
						undefined,
						qs,
					);

					for (const issue of issues) {
						returnData.push({
							json: {
								event: eventType,
								timestamp: new Date().toISOString(),
								...issue,
							},
						});
					}
					break;
				}

				case 'criticalIssue': {
					const qs: IDataObject = {
						'created_after': lastPollTime,
						'severity': 'critical',
					};

					let endpoint = `/orgs/${orgId}/issues`;
					if (projectId) {
						endpoint = `/orgs/${orgId}/projects/${projectId}/issues`;
					}

					const issues = await snykApiRequestAllItems.call(
						this as unknown as import('n8n-workflow').IExecuteFunctions,
						'GET',
						endpoint,
						undefined,
						qs,
					);

					for (const issue of issues) {
						returnData.push({
							json: {
								event: 'criticalIssue',
								timestamp: new Date().toISOString(),
								...issue,
							},
						});
					}
					break;
				}

				case 'projectImported': {
					const qs: IDataObject = {
						'created_after': lastPollTime,
					};

					const projects = await snykApiRequestAllItems.call(
						this as unknown as import('n8n-workflow').IExecuteFunctions,
						'GET',
						`/orgs/${orgId}/projects`,
						undefined,
						qs,
					);

					for (const project of projects) {
						const projectData = project as IDataObject;
						const attributes = projectData.attributes as IDataObject || {};
						const createdAt = attributes.created as string;
						
						if (createdAt && new Date(createdAt) > new Date(lastPollTime)) {
							returnData.push({
								json: {
									event: 'projectImported',
									timestamp: new Date().toISOString(),
									...project,
								},
							});
						}
					}
					break;
				}
			}
		} catch (error) {
			// If there's an error, log it but don't fail the entire poll
			console.error('Snyk polling error:', error);
		}

		if (returnData.length === 0) {
			return null;
		}

		return [returnData];
	}
}
