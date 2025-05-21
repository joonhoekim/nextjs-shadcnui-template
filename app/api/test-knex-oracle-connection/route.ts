import { NextResponse } from 'next/server';
import { testKnexOracleConnection } from '@/lib/db';

export async function GET() {
  try {
    const result = await testKnexOracleConnection();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Knex Oracle DB 연결 오류:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Knex Oracle DB 연결 실패', 
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 });
  }
} 