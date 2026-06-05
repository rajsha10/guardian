import fs from 'fs';
import path from 'path';

// Load API key and Endpoint URL from environment or fallback to manual parsing of .env.local
let apiKey = process.env.AI_API_KEY;
let endpointUrl = process.env.AI_ENDPOINT_URL;

if (!apiKey) {
  try {
    const envPath = path.resolve('.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      
      const keyMatch = envContent.match(/^AI_API_KEY\s*=\s*(.+)$/m);
      if (keyMatch) {
        apiKey = keyMatch[1].trim().replace(/^['"]|['"]$/g, '');
      }

      const endpointMatch = envContent.match(/^AI_ENDPOINT_URL\s*=\s*(.+)$/m);
      if (endpointMatch) {
        endpointUrl = endpointMatch[1].trim().replace(/^['"]|['"]$/g, '');
      }
    }
  } catch (e) {
    console.warn('⚠️ Warning: Failed to read .env.local file directly:', e.message);
  }
}

if (!apiKey) {
  console.error('\n\x1b[31m❌ Error: AI_API_KEY not found in environment or .env.local\x1b[0m');
  console.log('Please make sure AI_API_KEY is defined in your .env.local file or set in your environment.');
  process.exit(1);
}

console.log(`\x1b[36m==================================================\x1b[0m`);
console.log(`\x1b[36m🤖 AI Model Availability Checker\x1b[0m`);
console.log(`\x1b[36m==================================================\x1b[0m`);
console.log(`🔑 Key format: \x1b[32m${apiKey.slice(0, 8)}...${apiKey.slice(-4)}\x1b[0m`);
if (endpointUrl) {
  console.log(`🔗 Endpoint URL: \x1b[35m${endpointUrl}\x1b[0m`);
}
console.log();

// 1. Fetch from Gemini Native API
async function checkNativeGeminiModels() {
  console.log('\x1b[33m🔄 Querying Native Gemini Models API...\x1b[0m');
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }
    const data = await res.json();
    if (data.models && Array.isArray(data.models)) {
      console.log(`\x1b[32m✅ Successfully retrieved ${data.models.length} native Gemini models:\x1b[0m`);
      const formattedModels = data.models.map(m => ({
        'Model Name': m.name.replace('models/', ''),
        'Display Name': m.displayName,
        'Input Token Limit': m.inputTokenLimit.toLocaleString(),
        'Output Token Limit': m.outputTokenLimit.toLocaleString(),
      }));
      console.table(formattedModels);
    } else {
      console.log('⚠️ Unexpected response format:', data);
    }
  } catch (error) {
    console.error(`\x1b[31m❌ Failed to query Native Gemini Models API:\x1b[0m`, error.message);
  }
}

// 2. Fetch from Endpoint URL (typically OpenAI-compatible)
async function checkEndpointModels() {
  if (!endpointUrl) {
    console.log('\n\x1b[33mℹ️ No AI_ENDPOINT_URL specified. Skipping OpenAI-compatible models check.\x1b[0m');
    return;
  }

  // Convert chat/completions completion URL to standard models list URL
  let modelsUrl = endpointUrl;
  if (endpointUrl.endsWith('/chat/completions')) {
    modelsUrl = endpointUrl.replace(/\/chat\/completions$/, '/models');
  } else if (endpointUrl.endsWith('/chat/completions/')) {
    modelsUrl = endpointUrl.replace(/\/chat\/completions\/$/, '/models');
  } else {
    // If not ending in /chat/completions, try standard relative paths
    try {
      const parsed = new URL(endpointUrl);
      parsed.pathname = parsed.pathname.replace(/\/chat\/completions.*$/, '/models');
      modelsUrl = parsed.toString();
    } catch (e) {
      modelsUrl = endpointUrl + '/models';
    }
  }

  console.log(`\n\x1b[33m🔄 Querying Endpoint Models API (\x1b[35m${modelsUrl}\x1b[33m)...\x1b[0m`);
  
  try {
    const res = await fetch(modelsUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }
    
    const data = await res.json();
    if (data.data && Array.isArray(data.data)) {
      console.log(`\x1b[32m✅ Successfully retrieved ${data.data.length} models from endpoint:\x1b[0m`);
      const formattedModels = data.data.map(m => ({
        'Model ID': m.id,
        'Owned By': m.owned_by || 'Unknown',
        'Created': m.created ? new Date(m.created * 1000).toLocaleDateString() : 'N/A'
      }));
      console.table(formattedModels);
    } else if (data.models && Array.isArray(data.models)) {
      // Handle alternative formats
      console.log(`\x1b[32m✅ Successfully retrieved ${data.models.length} models from endpoint:\x1b[0m`);
      const formattedModels = data.models.map(m => ({
        'Model ID': m.name || m.id,
        'Display Name': m.displayName || m.name,
      }));
      console.table(formattedModels);
    } else {
      console.log('⚠️ Unexpected response format:', data);
    }
  } catch (error) {
    console.error(`\x1b[31m❌ Failed to query Endpoint Models API:\x1b[0m`, error.message);
  }
}

async function main() {
  await checkNativeGeminiModels();
  await checkEndpointModels();
  console.log(`\n\x1b[36m==================================================\x1b[0m`);
}

main().catch(err => {
  console.error('❌ Execution failed:', err);
});
