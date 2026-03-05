# BlackRoad OS

> Proprietary software of **BlackRoad OS, Inc.** — Not open source.

Monorepo for the BlackRoad platform: API services, web applications, UI components, Cloudflare Workers, and infrastructure.

## Architecture

```
blackroad/
  apps/
    api/           Express API server (homework, health, WebSocket)
    roadbook/      Next.js documentation site with MDX
    homework/      Next.js homework portal
  packages/
    ui/            Shared React component library (Tailwind CSS)
  workers/
    api-gateway.js Cloudflare Worker — edge routing, CORS, security headers
  prism/           Static Prism Console (HTML/CSS/JS)
  server_full.js   Main API entrypoint (Express + Lucidia LLM bridge)
  nginx/           Nginx reverse-proxy config for blackroad.io
  systemd/         Systemd service units for API, LLM, auto-update
  scripts/         Deployment and automation scripts
  blackroad/       Design tokens
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Start the API server
pnpm start
# or
node server_full.js

# Health check
curl http://localhost:4000/api/health
```

## API Endpoints

| Method | Path             | Description                    |
|--------|------------------|--------------------------------|
| GET    | `/api/health`    | Health check                   |
| GET    | `/api/hello`     | Hello world                    |
| GET    | `/api/homework`  | List homework items            |
| POST   | `/api/homework`  | Create homework item           |
| POST   | `/api/llm/chat`  | Chat with Lucidia LLM bridge   |

## Deployments

| Platform          | Purpose                          |
|-------------------|----------------------------------|
| Cloudflare Workers| API Gateway (edge routing)       |
| Cloudflare Pages  | Prism Console (static site)      |
| Railway / Vercel  | Next.js apps (roadbook, homework)|
| VPS (systemd)     | API server + Lucidia LLM         |

## CI/CD Workflows

All GitHub Actions are pinned to specific commit SHAs for supply-chain security.

| Workflow          | Trigger                | Purpose                        |
|-------------------|------------------------|--------------------------------|
| CORE CI           | push/PR to main        | Lint, build, test, health check|
| Agent CI          | push/PR to main        | Build and test with pnpm       |
| Deploy            | push to main           | Cloudflare Worker + Pages      |
| Auto Label        | PR opened              | Auto-label PRs                 |
| Automerge         | Dependabot/labeled PRs | Auto-squash-merge safe PRs     |
| CI Failure Tracker| CI failure             | Create issue on failure        |
| Project Sync      | PR opened              | Add PR to project board        |

## Security

- All Actions pinned to commit SHAs
- Dependabot enabled for npm and pip
- CODEOWNERS enforced
- Security headers at edge (Cloudflare Worker) and origin (Express)
- HTTPS enforced with HSTS
- Report vulnerabilities to security@blackroad.io

## License

Copyright (c) 2024-2026 BlackRoad OS, Inc. All rights reserved.
Proprietary and confidential. See [LICENSE](LICENSE) for full terms.
Stripe products and related assets are included under separate agreement.
