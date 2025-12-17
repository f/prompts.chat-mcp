<p align="center">
  <img src="https://prompts.chat/logo.svg" alt="prompts.chat" width="200" />
</p>

<h1 align="center">prompts.chat MCP Server</h1>

<p align="center">
  Access thousands of AI prompts directly in your AI coding assistant
</p>

<p align="center">
  <a href="https://prompts.chat"><img src="https://img.shields.io/badge/Website-prompts.chat-blue" alt="Website"></a>
  <a href="https://www.npmjs.com/package/@fkadev/prompts.chat-mcp"><img src="https://img.shields.io/npm/v/@fkadev/prompts.chat-mcp?color=red" alt="NPM Version"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/@fkadev/prompts.chat-mcp" alt="License"></a>
</p>

---

## Features

- **MCP Prompts** - Browse and use prompts directly via MCP prompts capability
- **Search Prompts** - Search for AI prompts by keyword, category, or tag
- **Get Prompt** - Retrieve prompt details by ID with variable substitution
- **Variable Support** - Prompts with `${variable}` syntax are automatically handled

## 🛠️ Installation

### Requirements

- Node.js >= v18.0.0
- An MCP-compatible client (Cursor, Windsurf, VS Code, Claude Code, etc.)

<details>
<summary><b>Install in Cursor</b></summary>

Add this to your Cursor MCP config file (`~/.cursor/mcp.json`):

#### Remote Server (Recommended)

```json
{
  "mcpServers": {
    "prompts-chat": {
      "url": "https://prompts.chat/api/mcp"
    }
  }
}
```

#### Local Server

```json
{
  "mcpServers": {
    "prompts-chat": {
      "command": "npx",
      "args": ["-y", "@fkadev/prompts.chat-mcp"]
    }
  }
}
```

</details>

<details>
<summary><b>Install in Windsurf</b></summary>

Add this to your Windsurf MCP config file:

#### Remote Server (Recommended)

```json
{
  "mcpServers": {
    "prompts-chat": {
      "serverUrl": "https://prompts.chat/api/mcp"
    }
  }
}
```

#### Local Server

```json
{
  "mcpServers": {
    "prompts-chat": {
      "command": "npx",
      "args": ["-y", "@fkadev/prompts.chat-mcp"]
    }
  }
}
```

</details>

<details>
<summary><b>Install in VS Code</b></summary>

Add this to your VS Code MCP settings:

#### Remote Server (Recommended)

```json
"mcp": {
  "servers": {
    "prompts-chat": {
      "type": "http",
      "url": "https://prompts.chat/api/mcp"
    }
  }
}
```

#### Local Server

```json
"mcp": {
  "servers": {
    "prompts-chat": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@fkadev/prompts.chat-mcp"]
    }
  }
}
```

</details>

<details>
<summary><b>Install in Claude Code</b></summary>

#### Remote Server (Recommended)

```sh
claude mcp add --transport http prompts-chat https://prompts.chat/api/mcp
```

#### Local Server

```sh
claude mcp add prompts-chat -- npx -y @fkadev/prompts.chat-mcp
```

</details>

<details>
<summary><b>Install in Zed</b></summary>

Add this to your Zed `settings.json`:

```json
{
  "context_servers": {
    "prompts-chat": {
      "command": {
        "path": "npx",
        "args": ["-y", "@fkadev/prompts.chat-mcp"]
      }
    }
  }
}
```

</details>

## ⚙️ Configuration

The local server supports the following environment variables:

| Variable | Description |
|----------|-------------|
| `PROMPTS_API_KEY` | Optional API key for authenticated requests |
| `PROMPTS_QUERY` | Optional query string to filter prompts (e.g., `users=a,b&categories=c,d&tags=e,f`) |

### Example with Environment Variables

```json
{
  "mcpServers": {
    "prompts-chat": {
      "command": "npx",
      "args": ["-y", "@fkadev/prompts.chat-mcp"],
      "env": {
        "PROMPTS_API_KEY": "your-api-key",
        "PROMPTS_QUERY": "users=username&categories=coding&tags=productivity"
      }
    }
  }
}
```

## 🔨 Available Tools

| Tool | Description |
|------|-------------|
| `search_prompts` | Search for AI prompts by keyword. Supports filtering by type, category, and tag. |
| `get_prompt` | Get a prompt by ID. Supports variable elicitation for prompts with template variables. |
| `save_prompt` | Save a new prompt to your account. **Requires `PROMPTS_API_KEY`.** |

## 📚 MCP Prompts

This server exposes all public prompts from prompts.chat as MCP prompts. Use `prompts/list` to browse available prompts and `prompts/get` to retrieve them with variable substitution.

## 📖 Example Usage

Ask your AI assistant:

```
Search for prompts about code review
```

```
Get the prompt for "act as a linux terminal"
```

## 🔗 Links

- [prompts.chat](https://prompts.chat) - Browse all prompts
- [API Documentation](https://prompts.chat/docs/api) - API reference
- [GitHub](https://github.com/f/awesome-chatgpt-prompts) - Source repository

## 📄 License

ISC
