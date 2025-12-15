#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListPromptsRequestSchema, GetPromptRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
const PROMPTS_CHAT_API = "https://prompts.chat/api/mcp";
const USER_AGENT = "prompts-chat-mcp/1.0.5";
async function callPromptsChatMcp(method, params) {
    const response = await fetch(PROMPTS_CHAT_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json, text/event-stream",
            "User-Agent": USER_AGENT,
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: Date.now(),
            method,
            params,
        }),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const contentType = response.headers.get("content-type") || "";
    // Handle SSE response format
    if (contentType.includes("text/event-stream")) {
        const text = await response.text();
        const lines = text.split("\n");
        for (const line of lines) {
            if (line.startsWith("data: ")) {
                const jsonStr = line.slice(6);
                if (jsonStr.trim()) {
                    return JSON.parse(jsonStr);
                }
            }
        }
        throw new Error("No valid JSON data found in SSE response");
    }
    return (await response.json());
}
const server = new McpServer({
    name: "prompts-chat",
    version: "1.0.1",
}, {
    capabilities: {
        prompts: { listChanged: false },
    },
});
// Forward prompts/list to upstream
server.server.setRequestHandler(ListPromptsRequestSchema, async (request) => {
    const response = await callPromptsChatMcp("prompts/list", {
        cursor: request.params?.cursor,
    });
    if (response.error) {
        throw new Error(response.error.message);
    }
    return response.result;
});
// Forward prompts/get to upstream
server.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const response = await callPromptsChatMcp("prompts/get", {
        name: request.params.name,
        arguments: request.params.arguments,
    });
    if (response.error) {
        throw new Error(response.error.message);
    }
    return response.result;
});
// Tool: search_prompts
server.registerTool("search_prompts", {
    title: "Search Prompts",
    description: "Search for AI prompts by keyword. Returns matching prompts with title, description, content, author, category, and tags.",
    inputSchema: {
        query: z.string().describe("Search query to find relevant prompts"),
        limit: z
            .number()
            .min(1)
            .max(50)
            .default(10)
            .describe("Maximum number of prompts to return (default 10, max 50)"),
        type: z
            .enum(["TEXT", "STRUCTURED", "IMAGE", "VIDEO", "AUDIO"])
            .optional()
            .describe("Filter by prompt type"),
        category: z.string().optional().describe("Filter by category slug"),
        tag: z.string().optional().describe("Filter by tag slug"),
    },
}, async ({ query, limit, type, category, tag }) => {
    try {
        const response = await callPromptsChatMcp("tools/call", {
            name: "search_prompts",
            arguments: { query, limit, type, category, tag },
        });
        if (response.error) {
            return {
                content: [{ type: "text", text: JSON.stringify({ error: response.error.message }) }],
                isError: true,
            };
        }
        const result = response.result;
        return {
            content: [{ type: "text", text: result.content[0].text }],
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
            content: [{ type: "text", text: JSON.stringify({ error: message }) }],
            isError: true,
        };
    }
});
// Tool: get_prompt
server.registerTool("get_prompt", {
    title: "Get Prompt",
    description: "Get a prompt by ID. If the prompt contains template variables (like ${variable} or ${variable:default}), you may need to provide values for them.",
    inputSchema: {
        id: z.string().describe("The ID of the prompt to retrieve"),
    },
}, async ({ id }) => {
    try {
        const response = await callPromptsChatMcp("tools/call", {
            name: "get_prompt",
            arguments: { id },
        });
        if (response.error) {
            return {
                content: [{ type: "text", text: JSON.stringify({ error: response.error.message }) }],
                isError: true,
            };
        }
        const result = response.result;
        return {
            content: [{ type: "text", text: result.content[0].text }],
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
            content: [{ type: "text", text: JSON.stringify({ error: message }) }],
            isError: true,
        };
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("prompts.chat MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
