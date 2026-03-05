# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| latest  | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability in any BlackRoad OS software,
please report it responsibly.

**DO NOT** open a public GitHub issue for security vulnerabilities.

Instead, email: **security@blackroad.io**

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Any suggested fixes (optional)

We will acknowledge receipt within 48 hours and provide a detailed
response within 5 business days.

## Security Practices

- All GitHub Actions are pinned to specific commit SHAs
- Dependabot is enabled for automated dependency updates
- CI/CD pipelines enforce security checks on every PR
- Secrets are managed via GitHub Actions encrypted secrets
- HTTPS is enforced across all services
- CORS and security headers are applied at the edge (Cloudflare Worker)
