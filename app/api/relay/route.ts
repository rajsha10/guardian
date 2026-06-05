// app/api/relay/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (!payload || !payload.to || !payload.data) {
      return NextResponse.json(
        { error: 'Invalid relay request. Missing destination address (to) or transaction data.' },
        { status: 400 }
      );
    }

    // Simulate 1Shot relayer network latency & block processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate a random transaction hash on Mantle Sepolia
    const randomBytes = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const txHash = `0x9c48ea92c68efb3b276701db54${randomBytes}7e90c5d57b40974adbc3d893e3e7f`;
    const randomBlock = Math.floor(8200000 + Math.random() * 50000);

    return NextResponse.json({
      success: true,
      txHash,
      status: 'CONFIRMED',
      blockNumber: randomBlock,
      gasSponsored: '0.0035 MNT',
      paymasterId: '1Shot_Paymaster_Sepolia_v2',
      timestamp: Math.floor(Date.now() / 1000)
    });
  } catch (error) {
    console.error('Relayer Dispatch Failure:', error);
    return NextResponse.json(
      { error: 'Internal server error in relayer network gateway.' },
      { status: 500 }
    );
  }
}
