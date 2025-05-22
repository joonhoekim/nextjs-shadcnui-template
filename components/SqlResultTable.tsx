import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

interface SqlResultTableProps {
  data: any;
}

export function SqlResultTable({ data }: SqlResultTableProps) {
  // 콘솔에 데이터 구조 로깅
  console.log('SqlResultTable 데이터:', data);
  
  // 데이터 구조 확인 및 처리
  if (!data) {
    return <div className="text-center p-4 text-muted-foreground">결과가 없습니다.</div>;
  }
  
  // 다양한 데이터 구조 처리
  let rows: any[] = [];
  let columns: string[] = [];
  
  // Case 1: data.rows가 배열인 경우
  if (data.rows && Array.isArray(data.rows) && data.rows.length > 0) {
    rows = data.rows;
    
    // metaData가 있으면 metaData에서 컬럼명 추출
    if (data.metaData && Array.isArray(data.metaData) && data.metaData.length > 0) {
      columns = data.metaData.map((col: any) => col.name || '');
    } 
    // metaData가 없으면 첫 번째 행에서 키 추출
    else if (typeof rows[0] === 'object' && rows[0] !== null) {
      columns = Object.keys(rows[0]);
    }
  } 
  // Case 2: data 자체가 배열인 경우
  else if (Array.isArray(data) && data.length > 0) {
    rows = data;
    if (typeof rows[0] === 'object' && rows[0] !== null) {
      columns = Object.keys(rows[0]);
    }
  }
  // Case 3: data에 rows가 없지만 객체인 경우
  else if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    // data 자체를 단일 row로 취급
    if (!data.rows) {
      rows = [data];
      columns = Object.keys(data).filter(key => key !== 'metaData');
    }
  }
  
  // 결과가 없는 경우
  if (rows.length === 0) {
    return <div className="text-center p-4 text-muted-foreground">결과가 없습니다.</div>;
  }
  
  // CSV로 변환하는 함수
  const exportToCsv = () => {
    try {
      // CSV 헤더
      let csvContent = columns.map(escapeCSVValue).join(',') + '\n';
      
      // CSV 내용 추가
      rows.forEach(row => {
        if (Array.isArray(row)) {
          // 배열 형태 데이터
          csvContent += row.map(cell => escapeCSVValue(formatCellValue(cell))).join(',') + '\n';
        } else {
          // 객체 형태 데이터
          csvContent += columns.map(col => escapeCSVValue(formatCellValue(row[col]))).join(',') + '\n';
        }
      });
      
      // 파일 다운로드
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `sql-result-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('CSV 내보내기 중 오류 발생:', error);
      alert('CSV 내보내기 중 오류가 발생했습니다.');
    }
  };
  
  // CSV 값 이스케이프 처리
  const escapeCSVValue = (value: any): string => {
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  return (
    <div className="h-[70vh] border rounded-md">
      <div className="p-2 flex justify-end bg-muted/50 border-b">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={exportToCsv}
          className="flex items-center gap-1"
        >
          <Download size={16} />
          <span>CSV 내보내기</span>
        </Button>
      </div>
      <ScrollArea className="h-[calc(70vh-44px)]">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, idx) => (
                <TableHead 
                  key={idx}
                  className="py-3 px-4 min-w-[300px]"
                >
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIdx) => (
              <TableRow key={rowIdx}>
                {Array.isArray(row)
                  ? row.map((cell, cellIdx) => (
                      <TableCell
                        key={cellIdx}
                        className="py-2 px-4 whitespace-nowrap min-w-[300px]"
                      >
                        {formatCellValue(cell)}
                      </TableCell>
                    ))
                  : columns.map((column, cellIdx) => (
                      <TableCell
                        key={cellIdx}
                        className="py-2 px-4 whitespace-nowrap min-w-[300px]"
                      >
                        {formatCellValue(row[column])}
                      </TableCell>
                    ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

// 셀 값을 포맷팅하는 함수
function formatCellValue(value: any): string {
  if (value === null || value === undefined) return 'NULL';
  if (value instanceof Date) return value.toLocaleString();
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
} 