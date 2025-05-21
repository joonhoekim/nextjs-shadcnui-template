import { NextRequest, NextResponse } from 'next/server';
import { oracleKnex } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sql } = body;

    if (!sql || typeof sql !== 'string') {
      return NextResponse.json({
        success: false,
        message: '유효한 SQL 쿼리가 필요합니다',
        error: 'SQL 쿼리가 제공되지 않았습니다'
      }, { status: 400 });
    }
    
    // 기본적인 검증 (예: 위험한 쿼리 방지)
    const forbiddenCommands = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE', 'INSERT', 'UPDATE', 'GRANT', 'REVOKE'];
    const upperSql = sql.toUpperCase();
    
    for (const command of forbiddenCommands) {
      if (upperSql.includes(command + ' ')) {
        return NextResponse.json({
          success: false,
          message: '허용되지 않은 SQL 명령',
          error: `${command} 명령은 이 인터페이스에서 허용되지 않습니다. 조회 명령만 사용해주세요.`
        }, { status: 403 });
      }
    }
    
    // Knex로 쿼리 실행
    const result = await oracleKnex.raw(sql);
    
    return NextResponse.json({
      success: true,
      message: 'SQL 쿼리 실행 성공',
      data: result
    });
  } catch (error: any) {
    console.error('SQL 쿼리 실행 오류:', error);
    return NextResponse.json({
      success: false,
      message: 'SQL 쿼리 실행 실패',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 });
  }
} 