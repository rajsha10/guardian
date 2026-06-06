import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, allowedAddress } = await request.json();

    // STRESS TEST: Empty String Guard
    if (!prompt || prompt.trim() === "") {
      return NextResponse.json({
        action: 'transfer',
        amount: 0,
        token: 'USDC',
        target: allowedAddress,
        reason: 'MALFORMED INPUT: Prompt was completely empty. Defaulted execution parameters to zero.'
      });
    }

    const cleanPrompt = prompt.toLowerCase().trim();

    // STRESS TEST: Non-Financial / Conversational Chat ("hello")
    const financialKeywords = ['move', 'transfer', 'pay', 'save', 'send', 'usdc', 'funds', 'money', 'rent'];
    const hasFinancialIntent = financialKeywords.some(keyword => cleanPrompt.includes(keyword));
    
    if (!hasFinancialIntent) {
      return NextResponse.json({
        action: 'transfer',
        amount: 0,
        token: 'USDC',
        target: allowedAddress,
        reason: 'NON-FINANCIAL INTENT DETECTED: Conversational input ignored. Zero assets exposed.'
      });
    }

    // Dynamic Parameter Extractor
    let amount = 50; // Default fallback fallback
    const amountMatch = cleanPrompt.match(/\d+/);
    if (amountMatch) amount = Number(amountMatch[0]);

    // STRESS TEST: Ambiguous Maximum Drain Prompts ("send all funds")
    if (cleanPrompt.includes('all') || cleanPrompt.includes('every')) {
      amount = 999999; // Set a massive flag amount that will guarantee a Validator rejection
    }

    // STRESS TEST: Adversarial / Malicious Redirects ("random wallet")
    if (cleanPrompt.includes('random') || cleanPrompt.includes('hacker') || cleanPrompt.includes('attacker')) {
      return NextResponse.json({
        action: 'transfer',
        amount: amount,
        token: 'USDC',
        target: '0x666A7773C9DeAd749bB02cbB13331bc78077bcA1', // Attacker target
        reason: 'ADVERSARIAL REDIRECT ROUTE: Inferred malicious third-party contract diversion.'
      });
    }

    // Map regular financial activities smoothly
    let action = 'transfer';
    if (cleanPrompt.includes('rent') || cleanPrompt.includes('pay')) action = 'pay';
    if (cleanPrompt.includes('save') || cleanPrompt.includes('money')) action = 'save';

    return NextResponse.json({
      action: action,
      amount: amount,
      token: 'USDC',
      target: allowedAddress,
      reason: `Successfully formulated structural payload for intent: "${action}" action for ${amount} USDC.`
    });

  } catch (error) {
    console.error('AI Route Stress Failure:', error);
    return NextResponse.json({
      action: 'transfer',
      amount: 0,
      token: 'USDC',
      target: '0x0000000000000000000000000000000000000000',
      reason: 'SYSTEM CRITICAL FALLBACK: Pipeline encountered an unexpected routing exception.'
    });
  }
}