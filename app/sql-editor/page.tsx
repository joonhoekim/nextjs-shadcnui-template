'use client';

import React, { useState, useEffect } from 'react';
import { SqlEditor } from '@/components/SqlEditor';
import { SavedQueriesList } from '@/components/SavedQueriesList';
import { SaveQueryDialog } from '@/components/SaveQueryDialog';
import { SqlResultTable } from '@/components/SqlResultTable';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SavedQuery {
  id: string;
  name: string;
  sql: string;
  createdAt: string;
}

export default function SqlEditorPage() {
  // 상태 관리
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM DUAL');
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingQueries, setIsLoadingQueries] = useState(false);
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([]);
  const [queryResult, setQueryResult] = useState<any>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [isResultPanelOpen, setIsResultPanelOpen] = useState(true);
  const [isQueriesListPanelOpen, setIsQueriesListPanelOpen] = useState(true);

  // 저장된 쿼리 로드
  const loadSavedQueries = async () => {
    try {
      setIsLoadingQueries(true);
      const response = await fetch('/api/queries');
      const data = await response.json();
      if (data.success) {
        setSavedQueries(data.queries);
      } else {
        toast.error('쿼리 목록을 불러오는데 실패했습니다');
      }
    } catch (error) {
      toast.error('쿼리 목록을 불러오는데 실패했습니다');
      console.error('쿼리 목록 로드 오류:', error);
    } finally {
      setIsLoadingQueries(false);
    }
  };

  // 페이지 로드 시 저장된 쿼리 불러오기
  useEffect(() => {
    loadSavedQueries();
  }, []);

  // 쿼리 실행
  const executeQuery = async () => {
    try {
      setIsExecuting(true);
      setQueryError(null);
      setQueryResult(null);
      setIsResultPanelOpen(true); // 쿼리 실행 시 결과 패널 자동 오픈

      const response = await fetch('/api/execute-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql: sqlQuery }),
      });

      const data = await response.json();
      
      // 응답 데이터 구조 로깅
      console.log('쿼리 응답 데이터:', data);
      console.log('쿼리 결과 데이터:', data.data);
      
      if (data.success) {
        setQueryResult(data.data);
        toast.success('쿼리가 성공적으로 실행되었습니다');
      } else {
        setQueryError(data.error || '알 수 없는 오류');
        toast.error(`쿼리 실행 실패: ${data.error || '알 수 없는 오류'}`);
      }
    } catch (error: any) {
      const errorMsg = error instanceof Error ? error.message : '알 수 없는 오류';
      setQueryError(errorMsg);
      toast.error(`쿼리 실행 실패: ${errorMsg}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // 쿼리 저장
  const saveQuery = async (name: string) => {
    try {
      setIsSaving(true);
      const response = await fetch('/api/queries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, sql: sqlQuery }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('쿼리가 저장되었습니다');
        loadSavedQueries();
        setIsSaveDialogOpen(false);
        // 쿼리 저장 성공 시 자동으로 리스트 패널 열기
        setIsQueriesListPanelOpen(true);
      } else {
        toast.error(`쿼리 저장 실패: ${data.error || '알 수 없는 오류'}`);
      }
    } catch (error: any) {
      const errorMsg = error instanceof Error ? error.message : '알 수 없는 오류';
      toast.error(`쿼리 저장 실패: ${errorMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  // 저장된 쿼리 선택
  const handleSelectQuery = (query: SavedQuery) => {
    setSqlQuery(query.sql);
    toast.info(`"${query.name}" 쿼리를 불러왔습니다`);
  };

  // 결과 패널 토글
  const toggleResultPanel = () => {
    setIsResultPanelOpen(!isResultPanelOpen);
  };

  // 쿼리 리스트 패널 토글
  const toggleQueriesListPanel = () => {
    setIsQueriesListPanelOpen(!isQueriesListPanelOpen);
  };

  return (
    <div className="mx-8 h-screen flex flex-col py-4">
      <h1 className="text-2xl font-bold mb-6">SQL 쿼리 에디터</h1>

      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 border rounded-lg overflow-hidden relative"
      >
        {/* 왼쪽 패널 - 저장된 쿼리 목록 (토글 가능) */}
        {isQueriesListPanelOpen && (
          <>
            <ResizablePanel defaultSize={20} minSize={15}>
              <div className="h-full p-4 overflow-auto relative">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-medium">저장된 쿼리</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleQueriesListPanel}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">쿼리 목록 패널 닫기</span>
                  </Button>
                </div>
                <SavedQueriesList
                  queries={savedQueries}
                  onSelectQuery={handleSelectQuery}
                  isLoading={isLoadingQueries}
                  onQueriesChange={loadSavedQueries}
                />
              </div>
            </ResizablePanel>
            <ResizableHandle />
          </>
        )}

        {/* 쿼리 리스트 패널이 닫혀 있을 때 표시되는 토글 버튼 */}
        {!isQueriesListPanelOpen && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleQueriesListPanel}
              className="h-8 w-8 p-0 rounded-full shadow-md"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">쿼리 목록 패널 열기</span>
            </Button>
          </div>
        )}

        {/* 중앙 패널 - 쿼리 에디터 */}
        <ResizablePanel 
          defaultSize={isQueriesListPanelOpen && isResultPanelOpen ? 40 : (isQueriesListPanelOpen || isResultPanelOpen) ? 60 : 100} 
          minSize={30}
        >
          <div className="p-4 h-full">
            <SqlEditor
              value={sqlQuery}
              onChange={(value) => setSqlQuery(value)}
              onExecute={executeQuery}
              onSave={() => setIsSaveDialogOpen(true)}
              isExecuting={isExecuting}
            />
          </div>
        </ResizablePanel>

        {/* 오른쪽 패널 - 쿼리 결과 (토글 가능) */}
        {isResultPanelOpen && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={40} minSize={30}>
              <div className="p-4 h-full overflow-auto relative">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-medium">쿼리 결과</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleResultPanel}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">결과 패널 닫기</span>
                  </Button>
                </div>
                
                {isExecuting && (
                  <div className="text-center py-8 text-muted-foreground">
                    쿼리 실행 중...
                  </div>
                )}

                {queryError && (
                  <Alert className="mb-4" variant="destructive">
                    <XCircle className="h-5 w-5 mr-2" />
                    <AlertTitle>실행 실패</AlertTitle>
                    <AlertDescription>{queryError}</AlertDescription>
                  </Alert>
                )}

                {queryResult && (
                  <div className="space-y-4">
                    <Alert className="border-green-600 dark:border-green-800">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mr-2" />
                      <AlertTitle>실행 성공</AlertTitle>
                    </Alert>

                    <div>
                      <div className="flex items-center mb-3">
                        <h3 className="text-base font-medium mr-2">결과 테이블</h3>
                        {queryResult && queryResult.rows && (
                          <Badge variant="outline">
                            {queryResult.rows.length}개 행
                          </Badge>
                        )}
                      </div>
                      <div className="rounded-md border overflow-hidden">
                        <SqlResultTable data={queryResult} />
                      </div>
                    </div>
                    
                    {/* 원시 데이터 표시 */}
                    {/* <div className="mt-4">
                      <h3 className="text-base font-medium mb-2">원시 데이터</h3>
                      <div className="bg-muted rounded-md p-4 overflow-auto max-h-60">
                        <pre className="text-sm">{JSON.stringify(queryResult, null, 2)}</pre>
                      </div>
                    </div> */}
                  </div>
                )}
              </div>
            </ResizablePanel>
          </>
        )}
        
        {/* 결과 패널이 닫혀 있을 때 표시되는 토글 버튼 */}
        {!isResultPanelOpen && queryResult && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleResultPanel}
              className="h-8 w-8 p-0 rounded-full shadow-md"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">결과 패널 열기</span>
            </Button>
          </div>
        )}
      </ResizablePanelGroup>

      {/* 쿼리 저장 대화상자 */}
      <SaveQueryDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        onSave={saveQuery}
        isSaving={isSaving}
      />
    </div>
  );
} 