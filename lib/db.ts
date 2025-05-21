import knex from 'knex';
// import oracledb from 'oracledb';
const oracledb = require('oracledb');

// Knex Oracle 연결 생성
export const oracleKnex = knex({
  client: 'oracledb',
  connection: {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECTION_STRING,
  },
  pool: { min: 0, max: 5 }
});

// OracleDB 직접 연결 생성 함수
export async function getOracleConnection() {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECTION_STRING
    });
    
    return connection;
  } catch (error) {
    console.error('Oracle DB 연결 오류:', error);
    throw error;
  }
}

// 연결을 테스트하는 함수
export async function testOracleConnection() {
  try {
    const connection = await getOracleConnection();
    const result = await connection.execute('SELECT 1 FROM DUAL');
    await connection.close();
    return { 
      success: true, 
      message: 'Oracle DB 연결 성공', 
      data: result.rows 
    };
  } catch (error: any) {
    return { 
      success: false, 
      message: 'Oracle DB 연결 실패', 
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
}

// Knex를 사용하여 Oracle 연결 테스트
export async function testKnexOracleConnection() {
  try {
    const result = await oracleKnex.raw('SELECT 1 FROM DUAL');
    return { 
      success: true, 
      message: 'Knex Oracle DB 연결 성공', 
      data: result 
    };
  } catch (error: any) {
    return { 
      success: false, 
      message: 'Knex Oracle DB 연결 실패', 
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
} 