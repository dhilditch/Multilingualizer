import 'dotenv/config';
import { requiredEnv } from './common.mjs';

export async function wpTool(name, args = {}) {
  requiredEnv(['WP_SITE_URL', 'WP_USERNAME', 'WP_APPLICATION_PASSWORD']);
  const response = await fetch(`${process.env.WP_SITE_URL.replace(/\/$/, '')}/wp-json/mcp/v1/http`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.WP_USERNAME}:${process.env.WP_APPLICATION_PASSWORD}`).toString('base64')}`,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream'
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
    signal: AbortSignal.timeout(30000)
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`WordPress MCP ${response.status}: ${body}`);
  const message = JSON.parse(body);
  if (message.error || message.result?.isError) throw new Error(JSON.stringify(message.error || message.result));
  return message.result;
}
