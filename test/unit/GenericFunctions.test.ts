/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	getBaseUrl,
	validateOrgId,
	validateProjectId,
	buildFilterParams,
	parseSnykError,
	formatISODate,
	extractJsonApiData,
	buildJsonApiBody,
} from '../../nodes/Snyk/transport/GenericFunctions';

describe('GenericFunctions', () => {
	describe('getBaseUrl', () => {
		it('should return US URL by default', () => {
			expect(getBaseUrl('US')).toBe('https://api.snyk.io');
		});

		it('should return EU URL for EU region', () => {
			expect(getBaseUrl('EU')).toBe('https://api.eu.snyk.io');
		});

		it('should return AU URL for AU region', () => {
			expect(getBaseUrl('AU')).toBe('https://api.au.snyk.io');
		});

		it('should return US URL for unknown region', () => {
			expect(getBaseUrl('UNKNOWN')).toBe('https://api.snyk.io');
		});
	});

	describe('validateOrgId', () => {
		it('should return trimmed org ID', () => {
			expect(validateOrgId('  org-123  ')).toBe('org-123');
		});

		it('should throw error for empty org ID', () => {
			expect(() => validateOrgId('')).toThrow('Organization ID is required');
		});

		it('should throw error for whitespace-only org ID', () => {
			expect(() => validateOrgId('   ')).toThrow('Organization ID is required');
		});
	});

	describe('validateProjectId', () => {
		it('should return trimmed project ID', () => {
			expect(validateProjectId('  proj-123  ')).toBe('proj-123');
		});

		it('should throw error for empty project ID', () => {
			expect(() => validateProjectId('')).toThrow('Project ID is required');
		});
	});

	describe('buildFilterParams', () => {
		it('should build params from object', () => {
			const filters = {
				severity: 'high',
				status: 'open',
			};
			expect(buildFilterParams(filters)).toEqual({
				severity: 'high',
				status: 'open',
			});
		});

		it('should ignore null and undefined values', () => {
			const filters = {
				severity: 'high',
				status: null,
				type: undefined,
			};
			expect(buildFilterParams(filters)).toEqual({
				severity: 'high',
			});
		});

		it('should ignore empty strings', () => {
			const filters = {
				severity: 'high',
				status: '',
			};
			expect(buildFilterParams(filters)).toEqual({
				severity: 'high',
			});
		});

		it('should join arrays with commas', () => {
			const filters = {
				severity: ['high', 'critical'],
			};
			expect(buildFilterParams(filters)).toEqual({
				severity: 'high,critical',
			});
		});

		it('should convert booleans to strings', () => {
			const filters = {
				isFixable: true,
				isUpgradable: false,
			};
			expect(buildFilterParams(filters)).toEqual({
				isFixable: 'true',
				isUpgradable: 'false',
			});
		});
	});

	describe('parseSnykError', () => {
		it('should parse JSON:API error format', () => {
			const error = {
				errors: [
					{
						title: 'Bad Request',
						detail: 'Invalid organization ID',
					},
				],
			};
			expect(parseSnykError(error)).toBe('Bad Request: Invalid organization ID');
		});

		it('should handle multiple errors', () => {
			const error = {
				errors: [
					{ title: 'Error 1', detail: 'Detail 1' },
					{ title: 'Error 2', detail: 'Detail 2' },
				],
			};
			expect(parseSnykError(error)).toBe('Error 1: Detail 1; Error 2: Detail 2');
		});

		it('should return default message for unknown format', () => {
			const error = {};
			expect(parseSnykError(error)).toBe('An unknown error occurred');
		});
	});

	describe('formatISODate', () => {
		it('should format Date object to ISO string', () => {
			const date = new Date('2024-01-15T10:30:00Z');
			expect(formatISODate(date)).toBe('2024-01-15T10:30:00.000Z');
		});

		it('should parse and format string date', () => {
			const dateStr = '2024-01-15';
			const result = formatISODate(dateStr);
			expect(result).toContain('2024-01-15');
		});
	});

	describe('extractJsonApiData', () => {
		it('should extract data from JSON:API response', () => {
			const response = {
				data: { id: '123', type: 'project' },
			};
			expect(extractJsonApiData(response)).toEqual({ id: '123', type: 'project' });
		});

		it('should return original response if no data field', () => {
			const response = { id: '123', type: 'project' };
			expect(extractJsonApiData(response)).toEqual({ id: '123', type: 'project' });
		});
	});

	describe('buildJsonApiBody', () => {
		it('should build JSON:API compliant body', () => {
			const result = buildJsonApiBody('project', { name: 'Test Project' });
			expect(result).toEqual({
				data: {
					type: 'project',
					attributes: { name: 'Test Project' },
				},
			});
		});

		it('should include relationships if provided', () => {
			const result = buildJsonApiBody(
				'project',
				{ name: 'Test Project' },
				{ organization: { data: { type: 'org', id: 'org-123' } } },
			);
			expect(result).toEqual({
				data: {
					type: 'project',
					attributes: { name: 'Test Project' },
					relationships: {
						organization: { data: { type: 'org', id: 'org-123' } },
					},
				},
			});
		});
	});
});
