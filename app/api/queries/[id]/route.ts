import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// JSON 파일 경로 설정
const DATA_DIR = path.join(process.cwd(), 'data');
const QUERIES_FILE = path.join(DATA_DIR, 'saved-queries.json');

// 저장된 쿼리 읽기
const readSavedQueries = () => {
  try {
    if (!fs.existsSync(QUERIES_FILE)) {
      return [];
    }
    const data = fs.readFileSync(QUERIES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('쿼리 파일 읽기 오류:', error);
    return [];
  }
};

// 쿼리 저장하기
const saveQueriesToFile = (queries: any[]) => {
  try {
    // 디렉토리가 없으면 생성
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    fs.writeFileSync(QUERIES_FILE, JSON.stringify(queries, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('쿼리 파일 저장 오류:', error);
    return false;
  }
};

// 쿼리 삭제하기
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: '쿼리 ID가 필요합니다',
      }, { status: 400 });
    }
    
    const savedQueries = readSavedQueries();
    const filteredQueries = savedQueries.filter((query: any) => query.id !== id);
    
    // 삭제할 쿼리가 없는 경우
    if (savedQueries.length === filteredQueries.length) {
      return NextResponse.json({
        success: false,
        message: '해당 ID의 쿼리를 찾을 수 없습니다',
      }, { status: 404 });
    }
    
    const saveSuccess = saveQueriesToFile(filteredQueries);
    
    if (!saveSuccess) {
      return NextResponse.json({
        success: false,
        message: '쿼리 삭제에 실패했습니다',
        error: '파일 시스템 오류'
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: '쿼리가 성공적으로 삭제되었습니다'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: '쿼리 삭제에 실패했습니다',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 });
  }
} 