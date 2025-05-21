'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Database, Code } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SqlResultTable } from "@/components/SqlResultTable";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [oracleLoading, setOracleLoading] = useState(false);
  const [oracleResult, setOracleResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
    error?: string;
  } | null>(null);
  
  const [knexLoading, setKnexLoading] = useState(false);
  const [knexResult, setKnexResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
    error?: string;
  } | null>(null);
  
  const [sqlCode, setSqlCode] = useState("SELECT 1 FROM DUAL");
  const [sqlResult, setSqlResult] = useState<any>(null);
  const [sqlError, setSqlError] = useState<string | null>(null);
  const [sqlLoading, setSqlLoading] = useState(false);

  const testOracleDbConnection = async () => {
    try {
      setOracleLoading(true);
      const response = await fetch('/api/test-oracledb-oracle-connection');
      const data = await response.json();
      setOracleResult(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      setOracleResult({
        success: false,
        message: '요청 실패',
        error: errorMessage,
      });
    } finally {
      setOracleLoading(false);
    }
  };

  const testKnexOracleConnection = async () => {
    try {
      setKnexLoading(true);
      const response = await fetch('/api/test-knex-oracle-connection');
      const data = await response.json();
      setKnexResult(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      setKnexResult({
        success: false,
        message: '요청 실패',
        error: errorMessage,
      });
    } finally {
      setKnexLoading(false);
    }
  };

  const executeSql = async () => {
    try {
      setSqlLoading(true);
      setSqlError(null);
      const response = await fetch('/api/execute-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql: sqlCode }),
      });
      const data = await response.json();
      if (data.success) {
        setSqlResult(data.data);
      } else {
        setSqlError(data.error || '알 수 없는 오류');
        setSqlResult(null);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      setSqlError(errorMessage || '요청 실패');
      setSqlResult(null);
    } finally {
      setSqlLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">ORACLE DB - Node connection test</h1>
      
      <Tabs defaultValue="oracledb" className="mb-8">
        <TabsList className="mb-4 w-full md:w-auto">
          <TabsTrigger value="oracledb" className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            <span>OracleDB</span>
          </TabsTrigger>
          <TabsTrigger value="knex" className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            <span>Knex</span>
          </TabsTrigger>
          <TabsTrigger value="sql" className="flex items-center gap-1">
            <Code className="h-4 w-4" />
            <span>SQL 실행</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="oracledb">
          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <CardTitle>OracleDB 연결 확인</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Button 
                onClick={testOracleDbConnection} 
                disabled={oracleLoading}
              >
                {oracleLoading ? '연결 중...' : 'DB 연결 테스트'}
              </Button>

              {oracleResult && (
                <Alert className={`mt-4 ${oracleResult.success ? 'border-green-600 dark:border-green-800' : 'border-destructive'}`} variant={oracleResult.success ? "default" : "destructive"}>
                  <div className="flex items-start">
                    {oracleResult.success ? 
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mr-2 flex-shrink-0" /> : 
                      <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    }
                    <div>
                      <AlertTitle>
                        {oracleResult.success ? '성공' : '실패'}
                      </AlertTitle>
                      <AlertDescription>
                        <p>{oracleResult.message}</p>
                        {oracleResult.error && (
                          <div className="mt-2 font-medium">{oracleResult.error}</div>
                        )}
                        {oracleResult.data && (
                          <pre className="mt-2 p-2 bg-muted rounded text-sm">
                            {JSON.stringify(oracleResult.data, null, 2)}
                          </pre>
                        )}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="knex">
          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <CardTitle>Knex Oracle 연결 확인</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Button 
                onClick={testKnexOracleConnection} 
                disabled={knexLoading}
              >
                {knexLoading ? '연결 중...' : 'Knex DB 연결 테스트'}
              </Button>

              {knexResult && (
                <Alert className={`mt-4 ${knexResult.success ? 'border-green-600 dark:border-green-800' : 'border-destructive'}`} variant={knexResult.success ? "default" : "destructive"}>
                  <div className="flex items-start">
                    {knexResult.success ? 
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mr-2 flex-shrink-0" /> : 
                      <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    }
                    <div>
                      <AlertTitle>
                        {knexResult.success ? '성공' : '실패'}
                      </AlertTitle>
                      <AlertDescription>
                        <p>{knexResult.message}</p>
                        {knexResult.error && (
                          <div className="mt-2 font-medium">{knexResult.error}</div>
                        )}
                        {knexResult.data && (
                          <pre className="mt-2 p-2 bg-muted rounded text-sm">
                            {JSON.stringify(knexResult.data, null, 2)}
                          </pre>
                        )}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sql">
          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <CardTitle>SQL 쿼리 실행</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sql-code">SQL 쿼리</Label>
                  <Textarea
                    id="sql-code"
                    value={sqlCode}
                    onChange={(e) => setSqlCode(e.target.value)}
                    placeholder="실행할 SQL 쿼리를 입력하세요"
                    className="font-mono"
                    rows={5}
                  />
                </div>
                
                <Button 
                  onClick={executeSql} 
                  disabled={sqlLoading || !sqlCode.trim()}
                >
                  {sqlLoading ? '실행 중...' : 'SQL 실행'}
                </Button>
                
                {sqlError && (
                  <Alert className="mt-4" variant="destructive">
                    <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <AlertTitle>실행 실패</AlertTitle>
                    <AlertDescription>
                      <div className="font-medium">{sqlError}</div>
                    </AlertDescription>
                  </Alert>
                )}
                
                {sqlResult && (
                  <div className="mt-4 space-y-4">
                    <Alert className="border-green-600 dark:border-green-800">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mr-2 flex-shrink-0" />
                      <AlertTitle>실행 성공</AlertTitle>
                    </Alert>
                    
                    <div className="mt-4">
                      <div className="flex items-center mb-3">
                        <h3 className="text-lg font-medium mr-2">결과 테이블</h3>
                        {sqlResult && sqlResult.rows && (
                          <Badge variant="outline">
                            {sqlResult.rows.length}개 행
                          </Badge>
                        )}
                      </div>
                      <div className="rounded-md border overflow-hidden">
                        <SqlResultTable data={sqlResult} />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-lg font-medium mb-2">원시 데이터</h3>
                      <div className="bg-muted rounded-md p-4 overflow-auto max-h-60">
                        <pre className="text-sm">{JSON.stringify(sqlResult, null, 2)}</pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
