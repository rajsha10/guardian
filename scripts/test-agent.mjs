import fs from 'fs';
import path from 'path';

let apiKey = process.env.AI_API_KEY;
let endpoint = process.env.AI_ENDPOINT_URL || 'https://generativelanguage.googleapis.com/v1beta/openai/v1/chat/completions';
let model = process.env.AI_MODEL_NAME || 'gemma-4-31b-it';

if (!apiKey) {
  try {
    const envPath = path.resolve('.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const keyMatch = envContent.match(/^AI_API_KEY\s*=\s*(.+)$/m);
      if (keyMatch) apiKey = keyMatch[1].trim().replace(/^['"]|['"]$/g, '');
      const endpointMatch = envContent.match(/^AI_ENDPOINT_URL\s*=\s*(.+)$/m);
      if (endpointMatch) endpoint = endpointMatch[1].trim().replace(/^['"]|['"]$/g, '');
      const modelMatch = envContent.match(/^AI_MODEL_NAME\s*=\s*(.+)$/m);
      if (modelMatch) model = modelMatch[1].trim().replace(/^['"]|['"]$/g, '');
    }
  } catch (e) {
    // Ignore
  }
}

if (!apiKey) {
  console.error('Error: AI_API_KEY not found');
  process.exit(1);
}

const systemPrompt = `
  You are the constrained on-chain execution brain of DelegAI Guardian.
  Your job is to translate raw human personal finance intent into structured, machine-readable smart wallet actions.
  Valid "action" types are strictly limited to: "transfer", "save", "pay".
  The "target" field must be a valid Ethereum address.
  The "token" field must always be: "USDC".

  EXPECTED OUTPUT FORMAT (STRICT JSON ONLY):
  {
    "action": "transfer" | "save" | "pay",
    "amount": number,
    "token": "USDC",
    "target": "0x123...",
    "reason": "reason"
  }
`;

const prompt = 'Send 50 USDC to 0x71C7656EC7ab88b098defB751B7401B5f6d8976F for rent';

async function test() {
  console.log(`Testing model: ${model}`);
  console.log(`Endpoint: ${endpoint}`);
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`❌ HTTP Error ${response.status}:`, errText);
      return false;
    }

    const data = await response.json();
    if (data.choices && data.choices[0]) {
      const aiContent = data.choices[0].message.content.trim();
      console.log('🤖 Raw AI Output:\n', aiContent);
      
      const startIndex = aiContent.indexOf('{');
      const endIndex = aiContent.lastIndexOf('}');
      if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
        throw new Error('No valid JSON block found in the model response');
      }
      const cleanJsonString = aiContent.substring(startIndex, endIndex + 1);
      const parsedAction = JSON.parse(cleanJsonString);
      
      console.log('\n✅ Parsed Action JSON successfully:\n', JSON.stringify(parsedAction, null, 2));
      return true;
    }
  } catch (error) {
    console.error('❌ Error during request:', error);
  }
  return false;
}

test();
