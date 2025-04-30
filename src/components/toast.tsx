'use client';

import React, { type ReactNode } from 'react';
import { toast as sonnerToast } from 'sonner';
import { CircleX, CircleCheck } from 'lucide-react';

const iconsByType: Record<'success' | 'error', ReactNode> = {
  success: <CircleCheck className="w-4 h-4 text-green-300" />,
  error: <CircleX className="w-4 h-4 text-red-500" />,
};

interface ToastProps {
  id?: string | number;
  type: 'success' | 'error';
  description: string;
}

export function toast({ type, description }: ToastProps) {
  return sonnerToast.custom((id) => (
    <Toast id={id} type={type} description={description} />
  ));
}

function Toast(props: ToastProps) {
  const { type, description } = props;

  return (
    <div className="flex w-full toast-mobile:w-[356px] justify-center">
      <div
        data-testid="toast"
        className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg w-full toast-mobile:w-fit flex flex-row gap-2 items-center"
      >
        <div
          data-type={type}
          className="data-[type=error]:text-red-600 data-[type=success]:text-green-600"
        >
          {iconsByType[type]}
        </div>
        <div className="text-zinc-950 dark:text-zinc-50 text-sm">
          {description}
        </div>
      </div>
    </div>
  );
}
