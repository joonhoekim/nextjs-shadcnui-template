import { NextResponse } from 'next/server';

let oracledb = require('oracledb');

export async function GET() {
  try {
    // Oracle DB 연결 설정
    const connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECTION_STRING
      
    });

    // 간단한 쿼리 실행하여 연결 확인
    const result = await connection.execute('SELECT 1 FROM DUAL');
    
    // 연결 종료
    await connection.close();

    return NextResponse.json({ 
      success: true, 
      message: 'Oracle DB 연결 성공', 
      data: result.rows 
    });
  } catch (error: any) {
    console.error('Oracle DB 연결 오류:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Oracle DB 연결 실패', 
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 });
  }
}
