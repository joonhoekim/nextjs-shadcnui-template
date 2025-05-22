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
    
    // 실행 전 기본적인 검증 (위험한 쿼리 방지)
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
    
    // 결과 로깅
    console.log('쿼리 실행 결과:', JSON.stringify(result, null, 2));
    console.log('결과 타입:', typeof result);
    console.log('결과 구조:', Object.keys(result));
    
    // 응답 형식이 SqlResultTable 컴포넌트와 맞지 않을 경우 변환
    // rows와 metaData 속성이 있는지 확인하고 없으면 변환
    let formattedResult = result;
    
    if (!result.rows && Array.isArray(result)) {
      // 배열인 경우 rows로 변환
      formattedResult = {
        rows: result,
        metaData: result.length > 0 ? 
          Object.keys(result[0]).map(key => ({ name: key })) : []
      };
    } else if (result.rows && !Array.isArray(result.rows)) {
      // rows가 있지만 배열이 아닌 경우
      formattedResult = {
        ...result,
        rows: [result.rows]
      };
    }
    
    return NextResponse.json({
      success: true,
      message: 'SQL 쿼리 실행 성공',
      data: formattedResult
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