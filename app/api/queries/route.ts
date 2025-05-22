import { NextRequest, NextResponse } from 'next/server';
import { oracleKnex } from '@/lib/db';
import fs from 'fs';
import path from 'path';

// JSON 파일 경로 설정
const DATA_DIR = path.join(process.cwd(), 'data');
const QUERIES_FILE = path.join(DATA_DIR, 'saved-queries.json');

// 디렉토리 및 파일 존재 확인 및 생성
const ensureDataFileExists = () => {
  // 디렉토리가 없으면 생성
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  // 파일이 없으면 빈 배열로 초기화된 파일 생성
  if (!fs.existsSync(QUERIES_FILE)) {
    fs.writeFileSync(QUERIES_FILE, JSON.stringify([], null, 2), 'utf8');
  }
};

// 저장된 쿼리 읽기
const readSavedQueries = () => {
  ensureDataFileExists();
  try {
    const data = fs.readFileSync(QUERIES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('쿼리 파일 읽기 오류:', error);
    return [];
  }
};

// 쿼리 저장하기
const saveQueriesToFile = (queries: any[]) => {
  ensureDataFileExists();
  try {
    fs.writeFileSync(QUERIES_FILE, JSON.stringify(queries, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('쿼리 파일 저장 오류:', error);
    return false;
  }
};

// 모든 저장된 쿼리 가져오기
export async function GET() {
  try {
    const savedQueries = readSavedQueries();
    return NextResponse.json({
      success: true,
      queries: savedQueries
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: '쿼리 목록을 가져오는데 실패했습니다',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 });
  }
}

// 새 쿼리 저장하기
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, sql } = body;

    if (!name || !sql) {
      return NextResponse.json({
        success: false,
        message: '쿼리 이름과 SQL이 필요합니다',
      }, { status: 400 });
    }

    const savedQueries = readSavedQueries();
    const id = Date.now().toString();
    const newQuery = {
      id,
      name,
      sql,
      createdAt: new Date().toISOString()
    };

    savedQueries.push(newQuery);
    const saveSuccess = saveQueriesToFile(savedQueries);

    if (!saveSuccess) {
      return NextResponse.json({
        success: false,
        message: '쿼리 저장에 실패했습니다',
        error: '파일 시스템 오류'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '쿼리가 저장되었습니다',
      query: newQuery
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: '쿼리 저장에 실패했습니다',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 });
  }
} 