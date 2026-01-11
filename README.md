# n8n-nodes-snyk

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for [Snyk](https://snyk.io), the leading developer security platform for finding and fixing vulnerabilities in code, dependencies, containers, and infrastructure as code. This node enables workflow automation for vulnerability management, project monitoring, issue tracking, and security reporting through Snyk's REST API.

![n8n](https://img.shields.io/badge/n8n-community--node-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)

## Features

- **12 Resources** with 60+ operations for comprehensive Snyk API coverage
- **Multi-Region Support**: US, EU, and AU API regions
- **Token Authentication**: Secure API token-based authentication
- **JSON:API Compliance**: Full support for Snyk's JSON:API standard
- **Cursor-Based Pagination**: Automatic pagination for large result sets
- **SBOM Export**: CycloneDX and SPDX format support
- **Trigger Node**: Webhook and polling-based triggers for event automation
- **Rate Limit Handling**: Automatic backoff and retry for rate-limited requests

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-snyk` and click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-snyk
```

### Development Installation

```bash
# 1. Extract the zip file
unzip n8n-nodes-snyk.zip
cd n8n-nodes-snyk

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Create symlink to n8n custom nodes directory
# For Linux/macOS:
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-snyk

# For Windows (run as Administrator):
# mklink /D %USERPROFILE%\.n8n\custom\n8n-nodes-snyk %CD%

# 5. Restart n8n
n8n start
```

## Credentials Setup

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| API Token | String | Yes | - | Your Snyk API token from Account Settings |
| Region | Options | No | US | API region (US, EU, AU) |
| API Version | String | No | 2024-10-15 | API version to use |

### Getting Your API Token

1. Log into [Snyk](https://app.snyk.io)
2. Navigate to **Account Settings**
3. Under **API Token**, click **Click to show** or generate a new token
4. Copy the token and use it in your n8n credentials

## Resources & Operations

### Organization

| Operation | Description |
|-----------|-------------|
| Get | Get an organization by ID |
| Get Many | List all organizations |
| Get Members | Get organization members |
| Get Projects | Get all projects in organization |
| Get Settings | Get organization settings |
| Update Settings | Update organization settings |

### Project

| Operation | Description |
|-----------|-------------|
| Get | Get a project by ID |
| Get Many | List all projects |
| Create | Import/create a new project |
| Update | Update project settings |
| Delete | Delete a project |
| Activate | Activate project monitoring |
| Deactivate | Deactivate project monitoring |
| Get History | Get project snapshot history |
| Get Tags | Get project tags |
| Add Tag | Add tag to project |
| Remove Tag | Remove tag from project |

### Issue

| Operation | Description |
|-----------|-------------|
| Get | Get an issue by ID |
| Get Many | List all issues |
| Get by Project | Get issues for a project |
| Get by Organization | Get all issues in organization |
| Ignore | Ignore an issue |
| Unignore | Unignore an issue |
| Update Status | Update issue status |

### Target

| Operation | Description |
|-----------|-------------|
| Get | Get a target by ID |
| Get Many | List all targets |
| Delete | Delete a target |
| Import Project | Import project from target |

### Integration

| Operation | Description |
|-----------|-------------|
| Get | Get an integration by ID |
| Get Many | List all integrations |
| Get Settings | Get integration settings |
| Update Settings | Update integration settings |
| Get Credentials | Get integration credentials |

### Dependency

| Operation | Description |
|-----------|-------------|
| Get by Organization | Get all dependencies in organization |
| Get by Project | Get dependencies for a project |
| Get Licenses | Get dependency licenses |

### Group

| Operation | Description |
|-----------|-------------|
| Get | Get a group by ID |
| Get Many | List all groups |
| Get Organizations | Get organizations in group |
| Get Members | Get group members |
| Get Settings | Get group settings |
| Get Audit Logs | Get group audit logs |

### Audit Log

| Operation | Description |
|-----------|-------------|
| Get by Organization | Get audit logs for organization |
| Get by Group | Get audit logs for group |
| Get by User | Get audit logs by user |
| Get by Date Range | Get audit logs in date range |

### User

| Operation | Description |
|-----------|-------------|
| Get | Get a user by ID |
| Get Many | List users in organization |
| Invite | Invite user to organization |
| Remove | Remove user from organization |
| Update Role | Update user role |

### Ignore

| Operation | Description |
|-----------|-------------|
| Get | Get an ignore rule by ID |
| Get Many | List all ignore rules |
| Create | Create ignore rule |
| Update | Update ignore rule |
| Delete | Delete ignore rule |

### SBOM (Software Bill of Materials)

| Operation | Description |
|-----------|-------------|
| Get by Project | Get SBOM for a project |
| Export CycloneDX | Export as CycloneDX format |
| Export SPDX | Export as SPDX format |

### Report

| Operation | Description |
|-----------|-------------|
| Get Latest Issues | Get latest issues report |
| Get Issues by Project | Get issues summary by project |
| Get Vulnerability Count by Day | Get vulnerability trends |
| Get Remediation Report | Get remediation recommendations |

## Trigger Node

The Snyk Trigger node supports both webhook and polling-based triggers.

### Webhook Events

- `project.snapshot`: New project snapshot
- `project.issue.created`: New issue discovered
- `project.issue.resolved`: Issue resolved
- `project.issue.ignored`: Issue ignored

### Polling Events

| Event | Description |
|-------|-------------|
| New Vulnerability | Trigger when a new vulnerability is detected |
| Critical Issue | Trigger when a critical severity issue is found |
| New Issue | Trigger when any new issue is discovered |
| Project Imported | Trigger when a new project is imported |

## Usage Examples

### Get All Critical Issues in Organization

```
1. Add Snyk node
2. Select Resource: Issue
3. Select Operation: Get by Organization
4. Enter Organization ID
5. Set Severity Filter: Critical
```

### Export SBOM for Compliance

```
1. Add Snyk node
2. Select Resource: SBOM
3. Select Operation: Export CycloneDX
4. Enter Organization ID and Project ID
5. Enable "Include Vulnerabilities" for full report
```

### Automate Vulnerability Notifications

```
1. Add Snyk Trigger node
2. Set Trigger Mode: Polling
3. Set Event Type: Critical Issue Found
4. Connect to Slack/Email node
5. Configure notification message
```

## API Regions

| Region | Base URL |
|--------|----------|
| US | https://api.snyk.io |
| EU | https://api.eu.snyk.io |
| AU | https://api.au.snyk.io |

## Rate Limits

| Endpoint Type | Limit |
|--------------|-------|
| REST API | 2000 requests/minute |
| V1 API | 70 requests/minute |
| Reporting | Lower limits apply |

The node automatically handles rate limiting with exponential backoff.

## Error Handling

The node properly handles Snyk API errors in JSON:API format:

- **400**: Bad Request - Invalid parameters
- **401**: Unauthorized - Invalid API token
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource doesn't exist
- **429**: Rate Limited - Automatic retry with backoff
- **500**: Server Error - Retry recommended

## Security Best Practices

1. **Store API tokens securely**: Use n8n's credential storage
2. **Use least-privilege tokens**: Create tokens with minimum required permissions
3. **Monitor audit logs**: Track API usage through Snyk audit logs
4. **Regular token rotation**: Rotate API tokens periodically
5. **Use region-specific endpoints**: Keep data in appropriate geographic region

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-snyk/issues)
- **Documentation**: [Snyk API Docs](https://docs.snyk.io/snyk-api)
- **Licensing**: licensing@velobpa.com

## Acknowledgments

- [Snyk](https://snyk.io) for their comprehensive security platform and API
- [n8n](https://n8n.io) for the workflow automation platform
- The n8n community for their support and contributions
