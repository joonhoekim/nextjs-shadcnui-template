import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { format } from 'sql-formatter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onExecute: () => void;
  onSave: () => void;
  isExecuting: boolean;
}

export function SqlEditor({ 
  value, 
  onChange, 
  onExecute, 
  onSave, 
  isExecuting 
}: SqlEditorProps) {
  
  // SQL 포맷팅 함수
  const formatSql = () => {
    try {
      const formatted = format(value, {
        language: 'sql',
        tabWidth: 2,
        keywordCase: 'upper',
        linesBetweenQueries: 2,
      });
      onChange(formatted);
      toast.success('SQL이 포맷팅되었습니다');
    } catch (error) {
      toast.error('SQL 포맷팅 중 오류가 발생했습니다');
      console.error('SQL 포맷팅 오류:', error);
    }
  };

  return (
    <Card className="flex flex-col border rounded-md overflow-hidden">
      <div className="bg-muted p-2 border-b flex items-center justify-between">
        <div className="text-sm font-medium">SQL 쿼리 에디터</div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={formatSql}
          >
            포맷팅
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onSave}
          >
            저장
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={onExecute}
            disabled={isExecuting}
          >
            {isExecuting ? '실행 중...' : '실행'}
          </Button>
        </div>
      </div>
      
      <div className="min-h-[300px] max-h-[500px] overflow-auto">
        <CodeMirror
          value={value}
          height="100%"
          extensions={[sql()]}
          onChange={onChange}
          theme="dark"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            autocompletion: true,
            foldGutter: true,
          }}
          className="h-full"
        />
      </div>
    </Card>
  );
} 