import React from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PolicyModalProps {
  trigger: React.ReactNode;
  title: string;
  contentComponent: React.ReactNode;
  linkHref: string;
}

export function PolicyModal({
  trigger,
  title,
  contentComponent,
}: PolicyModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Please review our {title.toLowerCase()}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm text-muted-foreground max-h-[60vh] overflow-y-auto pr-6">
          {contentComponent}
        </div>
      </DialogContent>
    </Dialog>
  );
}
