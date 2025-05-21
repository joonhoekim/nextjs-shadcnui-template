'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
    error?: string;
  } | null>(null);

  const testOracleDbConnection = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/test-oracledb-oracle-connection');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: '요청 실패',
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Oracle DB 연결 테스트</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Oracle DB 연결 확인</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={testOracleDbConnection} 
            disabled={loading}
          >
            {loading ? '연결 중...' : 'DB 연결 테스트'}
          </Button>

          {result && (
            <Alert className={`mt-4 ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-start">
                {result.success ? <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> : <XCircle className="h-5 w-5 text-red-500 mr-2" />}
                <div>
                  <AlertTitle>{result.success ? '성공' : '실패'}</AlertTitle>
                  <AlertDescription>
                    {result.message}
                    {result.error && (
                      <div className="mt-2 text-red-600">{result.error}</div>
                    )}
                    {result.data && (
                      <pre className="mt-2 p-2 bg-slate-100 rounded text-sm">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    )}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
