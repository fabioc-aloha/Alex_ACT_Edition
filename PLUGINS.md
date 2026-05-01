# Available Plugins

Optional plugins that extend the Edition baseline with multi-agent orchestration. These are registered locally via `.vscode/settings.json` and require local clones of the plugin stores.

Skills from these plugins are also available individually in the [Alex_Skill_Mall](https://github.com/fabioc-aloha/Alex_Skill_Mall). Use `/install-from-mall` for individual skills; use plugin registration for the full agent experience.

## How to Register Plugins

Add to your project's `.vscode/settings.json`:

```json
{
    "chat.pluginLocations": {
        "<path-to-plugin>": true
    }
}
```

Plugins are discovered by VS Code on restart. Agents, skills, hooks, and MCP servers from registered plugins appear alongside your local customizations.

## General-Purpose Plugins (all heirs)

Register these on any project that benefits from advanced code review or documentation:

```json
"chat.pluginLocations": {
    "C:\\Development\\MALL\\.github-private\\plugins\\deep-review": true,
    "C:\\Development\\MALL\\.github-private\\plugins\\bug-hunter": true,
    "C:\\Development\\MALL\\.github-private\\plugins\\deployment-safety": true
}
```

| Plugin | Agents | What it adds |
| --- | --- | --- |
| `deep-review` | 3 (advocate, skeptic, architect) | Adversarial code review — three agents with opposing mindsets review in parallel |
| `bug-hunter` | 1 + hooks | Autonomous bug detection across 19 categories including IaC scanning (Bicep/ARM) |
| `deployment-safety` | 6 | Deployment safety checks: SDL, privacy, responsible AI, accessibility |

## Azure / SFI Compliance Plugins (infrastructure heirs)

Register these on projects that manage Azure subscriptions or require SFI compliance:

```json
"chat.pluginLocations": {
    "C:\\Development\\MALL\\microsoft-skills\\.github\\plugins\\azure-skills": true,
    "C:\\Development\\MALL\\.github-private\\plugins\\sfi-ns251-overexposed-endpoints": true,
    "C:\\Development\\MALL\\.github-private\\plugins\\sfi-ti322-entra-app-tenant-isolation": true,
    "C:\\Development\\MALL\\.github-private\\plugins\\sfi-es331-exposed-secrets": true,
    "C:\\Development\\MALL\\.github-private\\plugins\\nnf-cve-cleanup": true,
    "C:\\Development\\MALL\\.github-private\\plugins\\threat-modeling": true
}
```

| Plugin | SFI KPI | Agents | What it adds |
| --- | --- | --- | --- |
| `azure-skills` | — | 1 (infrastructure) | Microsoft's official Azure IaC plugin: 26 skills covering deploy, prepare, validate, K8s, enterprise infra planning, diagnostics, cost, storage, compute, migration, compliance + 500 reference docs |
| `sfi-ns251-overexposed-endpoints` | NS2.5.1 | 1 | NSG audit, public IP discovery, endpoint closure on your Azure subscriptions |
| `sfi-ti322-entra-app-tenant-isolation` | TI3.2.2 | 0 | Entra app registration audit, cross-tenant auth isolation |
| `sfi-es331-exposed-secrets` | ES3.3.1 | 1 | Detect and remediate exposed secrets, Key Vault adoption |
| `nnf-cve-cleanup` | CVE | 1 | AKS vulnerable container image remediation |
| `threat-modeling` | — | 13 | STRIDE threat model generation from repo analysis |

## Fabric / Power BI Plugins (data heirs)

Register these on projects that work with Microsoft Fabric, Power BI, or Azure data services:

```json
"chat.pluginLocations": {
    "C:\\Development\\MALL\\microsoft-skills\\.github\\plugins\\azure-sdk-python": true,
    "C:\\Development\\MALL\\microsoft-skills\\.github\\plugins\\azure-sdk-dotnet": true
}
```

| Plugin | Skills | What it adds |
| --- | --- | --- |
| `azure-sdk-python` | 20+ (incl. `azure-mgmt-fabric-py`) | Azure SDK skills for Python — Fabric capacity management, AI services, Cosmos DB, Event Hubs, Storage, Search |
| `azure-sdk-dotnet` | 10+ (incl. `azure-mgmt-fabric-dotnet`) | Azure SDK skills for .NET — Fabric capacity management, Event Grid, Event Hubs, Document Intelligence, Cosmos DB |

**Note**: `sfi-ns251`, `sfi-ti322`, and `threat-modeling` ship `.mcp.json` files that reference Microsoft-internal endpoints. If MCP servers fail to connect, delete the `.mcp.json` from the plugin directory — the skills and agents still work without MCP.

## All Plugins Combined

For projects that need everything (e.g., `lab-subscription`):

```json
"chat.pluginLocations": {
    "C:\\Development\\MALL\\.github-private\\plugins\\deep-review": true,
    "C:\\Development\\MALL\\.github-private\\plugins\\bug-hunter": true,
    "C:\\Development\\MALL\\.github-private\\plugins\\deployment-safety": true,
    "C:\\Development\\MALL\\.github-private\\plugins\\sfi-ns251-overexposed-endpoints": true,
    "C:\\Development\\MALL\\.github-private\\plugins\\sfi-ti322-entra-app-tenant-isolation": true,
    "C:\\Development\\MALL\\.github-private\\plugins\\sfi-es331-exposed-secrets": true,
    "C:\\Development\\MALL\\.github-private\\plugins\\nnf-cve-cleanup": true,
    "C:\\Development\\MALL\\.github-private\\plugins\\threat-modeling": true,
    "C:\\Development\\MALL\\microsoft-skills\\.github\\plugins\\azure-skills": true,
    "C:\\Development\\MALL\\microsoft-skills\\.github\\plugins\\azure-sdk-python": true,
    "C:\\Development\\MALL\\microsoft-skills\\.github\\plugins\\azure-sdk-dotnet": true
}
```

## Prerequisites

- Plugin store clones at `C:\Development\MALL\` (maintained by the Supervisor via `node scripts/store-sync.cjs`)
- On macOS/Linux, adjust paths to `~/Development/MALL/`
- VS Code with agent plugins enabled (`chat.plugins.enabled: true`)

## Skills Without Plugins

Individual skills from these plugins are available in the Mall without needing plugin registration:

| Mall skill | From plugin | Category |
| --- | --- | --- |
| `create-associate-nsg`, `lookup-nsg`, `remediate-nsg`, `lookup-nsg-for-vnet` | sfi-ns251 | security |
| `fetch-violations`, `violation-triager`, `guide-cert-rehoming`, `guide-advanced-remediation`, `generate-report`, `assist-sg-update` | sfi-ti322 | security |
| `remediate-pfx-certificates`, `revoke-and-rotate-certificate` | sfi-es331 | security |
| `nnf-cve-cleanup` | nnf-cve-cleanup | security |
| `codeql-build-fix`, `codeql-input`, `codeql-output`, `codeql-symfix` | codeql-fix | security |
| `mermaid-diagram`, `sequence-diagram` | diagrams | documentation |
| `prompt-2-data` | prompt-2-data | data |
| `autocoverage` | autocoverage | quality |
| 10 skills | ai-starter-pack | quality, process, critical-thinking, documentation, operations |

Install via `/install-from-mall` or `/find-skill`.
