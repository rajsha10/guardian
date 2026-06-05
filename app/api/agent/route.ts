// app/api/agent/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, allowedAddress } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Missing intent prompt parameter' }, { status: 400 });
    }

    // Identical structural constraint guidelines mapped to the incoming model layer
    const systemPrompt = `
      You are the constrained on-chain execution brain of DelegAI Guardian.
      Your job is to translate raw human personal finance intent into structured, machine-readable smart wallet actions.

      CRITICAL SYSTEM RULES:
      1. You do NOT have wallet custody. You only possess delegated authority.
      2. You must ONLY output a raw, valid JSON object. No prose, no markdown code blocks, no trailing conversational text.
      3. Valid "action" types are strictly limited to: "transfer", "save", "pay".
      4. The "target" field must map intelligently:
         - If the user specifies savings, yield, or investment, target must be exactly: "${allowedAddress}"
         - If the user specifies rent or external payments, target must be exactly: "${allowedAddress}"
      5. The "token" field must always be: "USDC".

      EXPECTED OUTPUT FORMAT (STRICT JSON ONLY):
      {
        "action": "transfer" | "save" | "pay",
        "amount": number,
        "token": "USDC",
        "target": "${allowedAddress}",
        "reasoning": "A brief 1-sentence strategic justification of this action"
      }
    `;

    // Production check for fallback simulation if environment variables are not loaded
    const apiKey = process.env.AI_API_KEY;
    const endpoint = process.env.AI_ENDPOINT_URL || 'https://api.venice.ai/api/v1/chat/completions';
    const model = process.env.AI_MODEL_NAME || 'llama-3.1-70b';

    if (!apiKey) {
      console.warn('⚠️ AI_API_KEY configuration missing. Executing local fallback simulation.');
      return NextResponse.json(generateLocalFallbackResponse(prompt, allowedAddress));
    }

    // Direct interface dispatch using standard completion architectures
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
        temperature: 0.1, // Forces strict deterministic schema compliance
        response_format: { type: 'json_object' }
      }),
    });

    const data = await response.json();
    
    // Safety check for parsing errors or alternative gateway models
    if (!data.choices || data.choices.length === 0) {
      throw new Error('Invalid generation response from execution endpoint');
    }

    let aiContent = data.choices[0].message.content.trim();

    // Remove any thought blocks (e.g. <thought>...</thought> or <think>...</think>) before parsing
    aiContent = aiContent
      .replace(/<thought>[\s\S]*?<\/thought>/g, '')
      .replace(/<think>[\s\S]*?<\/think>/g, '')
      .trim();

    // Parse returned JSON block safely
    let parsedAction;
    try {
      parsedAction = JSON.parse(aiContent);
    } catch (parseError) {
      // Fallback: extract the JSON block targeting the first '{' and last '}'
      const startIndex = aiContent.indexOf('{');
      const endIndex = aiContent.lastIndexOf('}');
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        const jsonSubstring = aiContent.substring(startIndex, endIndex + 1);
        try {
          parsedAction = JSON.parse(jsonSubstring);
        } catch {
          throw new Error('Failed to parse extracted JSON block from model response');
        }
      } else {
        throw new Error(`Invalid JSON format in model response: ${(parseError as Error).message}`);
      }
    }

    // Enforce explicit schema validation constraints
    if (
      !parsedAction.action ||
      parsedAction.amount === undefined ||
      parsedAction.amount === null ||
      !parsedAction.target
    ) {
      throw new Error('Structured output schema validation failed: Missing action, amount, or target field');
    }

    // Ensure amount is parsed as number format
    parsedAction.amount = Number(parsedAction.amount);

    return NextResponse.json(parsedAction);

  } catch (error) {
    console.error('AI Processing Pipeline Error:', error);
    return NextResponse.json({ error: 'Failed to process agent reasoning context' }, { status: 500 });
  }
}

function generateLocalFallbackResponse(prompt: string, allowedAddress: string) {
  const cleanPrompt = prompt.toLowerCase();
  let amount = 50;
  
  const amountMatch = cleanPrompt.match(/\d+/);
  if (amountMatch) amount = Number(amountMatch[0]);

  if (cleanPrompt.includes('random') || cleanPrompt.includes('hacker') || cleanPrompt.includes('attacker')) {
    return {
      action: 'transfer',
      amount: amount,
      token: 'USDC',
      target: '0x666A7773C9DeAd749bB02cbB13331bc78077bcA1',
      reasoning: 'CRITICAL SECURITY BREACH: Intercepted anomalous third-party routing instruction loop.'
    };
  }

  return {
    action: cleanPrompt.includes('rent') ? 'pay' : cleanPrompt.includes('save') ? 'save' : 'transfer',
    amount: amount,
    token: 'USDC',
    target: allowedAddress,
    reasoning: `Inference Engine processing successful: Extracted ${amount} USDC allocation bound to whitelisted contract topology.`
  };
}