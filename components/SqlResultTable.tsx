import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface SqlResultTableProps {
  data: any;
}

export function SqlResultTable({ data }: SqlResultTableProps) {
  // 결과가 없거나 형식이 맞지 않은 경우
  if (!data || !data.rows || !Array.isArray(data.rows) || data.rows.length === 0) {
    return <div className="text-center p-4 text-gray-500">결과가 없습니다.</div>;
  }

  const rows = data.rows;
  const metaData = data.metaData || [];
  
  // 컬럼 헤더를 가져옵니다
  const columns = metaData.length > 0 
    ? metaData.map((col: any) => col.name)
    : Object.keys(rows[0]); // metaData가 없는 경우, 첫 번째 행의 키를 사용
  
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column: string, index: number) => (
              <TableHead key={index} className="bg-gray-100 font-medium">
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row: any, rowIndex: number) => (
            <TableRow key={rowIndex}>
              {Array.isArray(row) 
                ? row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>
                      {formatCellValue(cell)}
                    </TableCell>
                  ))
                : columns.map((column, cellIndex) => (
                    <TableCell key={cellIndex}>
                      {formatCellValue(row[column])}
                    </TableCell>
                  ))
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
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