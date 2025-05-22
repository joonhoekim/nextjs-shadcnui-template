'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Code } from "lucide-react";

export default function GetDbData() {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getDbData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/getDbData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql: "SELECT * FROM test" }),
      });
      const data = await response.json();
      setResult(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">GetDbData</h1>
      
      <div className="mb-6">
        <Link href="/sql-editor">
          <Button className="flex items-center gap-1">
            <Code className="h-5 w-5" />
            SQL 쿼리 에디터 바로가기
          </Button>
        </Link>
      </div>
      
      <Button 
        onClick={getDbData} 
        disabled={isLoading}
        className="mb-4"
      >
        {isLoading ? "데이터 로딩 중..." : "데이터 가져오기"}
      </Button>

      {result && (
        <div className="mt-4 border rounded-md p-4 bg-muted">
          <h2 className="text-xl font-semibold mb-2">결과:</h2>
          <pre className="whitespace-pre-wrap break-all">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}