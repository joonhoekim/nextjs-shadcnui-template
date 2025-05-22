import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SaveQueryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => void;
  isSaving: boolean;
}

export function SaveQueryDialog({
  open,
  onOpenChange,
  onSave,
  isSaving,
}: SaveQueryDialogProps) {
  const [queryName, setQueryName] = useState('');

  const handleSave = () => {
    if (queryName.trim()) {
      onSave(queryName.trim());
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setQueryName('');
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>쿼리 저장</DialogTitle>
          <DialogDescription>
            나중에 쉽게 찾을 수 있도록 쿼리에 이름을 지정하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="query-name">쿼리 이름</Label>
            <Input
              id="query-name"
              placeholder="쿼리 이름을 입력하세요"
              value={queryName}
              onChange={(e) => setQueryName(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSaving}
          >
            취소
          </Button>
          <Button
            onClick={handleSave}
            disabled={!queryName.trim() || isSaving}
          >
            {isSaving ? '저장 중...' : '저장'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 