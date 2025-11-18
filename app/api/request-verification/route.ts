import { NextResponse } from 'next/server';

// This route handles /api/request-verification
// For provider-specific routes, use /api/request-verification/binance or /api/request-verification/coinbase
export async function GET(request: Request) {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Please specify a provider. Use /api/request-verification/binance or /api/request-verification/coinbase' 
    },
    { status: 400 }
  );
}