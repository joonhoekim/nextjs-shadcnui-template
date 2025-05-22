import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Clock, Play, Trash2, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

interface SavedQuery {
  id: string;
  name: string;
  sql: string;
  createdAt: string;
}

interface SavedQueriesListProps {
  queries: SavedQuery[];
  onSelectQuery: (query: SavedQuery) => void;
  isLoading: boolean;
  onQueriesChange?: () => void;
}

export function SavedQueriesList({ 
  queries, 
  onSelectQuery, 
  isLoading,
  onQueriesChange
}: SavedQueriesListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [queryToDelete, setQueryToDelete] = useState<SavedQuery | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 쿼리 삭제 처리
  const handleDelete = async () => {
    if (!queryToDelete) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/queries/${queryToDelete.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('쿼리가 삭제되었습니다');
        // 부모 컴포넌트에 변경 알림
        if (onQueriesChange) {
          onQueriesChange();
        }
      } else {
        toast.error(`쿼리 삭제 실패: ${data.error || '알 수 없는 오류'}`);
      }
    } catch (error: any) {
      const errorMsg = error instanceof Error ? error.message : '알 수 없는 오류';
      toast.error(`쿼리 삭제 실패: ${errorMsg}`);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setQueryToDelete(null);
    }
  };

  // 삭제 확인 대화상자 열기
  const openDeleteDialog = (e: React.MouseEvent, query: SavedQuery) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setQueryToDelete(query);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>저장된 쿼리</CardTitle>
          <CardDescription>저장한 SQL 쿼리 목록입니다</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-6 text-center text-muted-foreground">
              로딩 중...
            </div>
          ) : queries.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">
              저장된 쿼리가 없습니다
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    {/* <TableHead>생성일</TableHead> */}
                    <TableHead className="w-[100px]">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queries.map((query) => (
                    <TableRow key={query.id} onClick={() => onSelectQuery(query)}>
                      <TableCell className="font-medium">{query.name}</TableCell>
                      {/* <TableCell>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          <span>{new Date(query.createdAt).toLocaleString()}</span>
                        </div>
                      </TableCell> */}
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <Play className="h-4 w-4" />
                            <span className="sr-only">불러오기</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            onClick={(e) => openDeleteDialog(e, query)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">삭제</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 삭제 확인 대화상자 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>쿼리 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              "{queryToDelete?.name}" 쿼리를 삭제하시겠습니까?
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  삭제 중...
                </>
              ) : (
                '삭제'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 