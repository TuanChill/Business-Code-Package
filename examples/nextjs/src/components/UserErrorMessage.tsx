"use client";

import { useBusinessMessage } from '@tuanchill/business-codes/i18n/react';

interface UserErrorMessageProps {
  response: {
    success: boolean;
    message?: string;
    error?: { code?: number };
  };
}

export function UserErrorMessage({ response }: UserErrorMessageProps) {
  const { getResponseMessage } = useBusinessMessage();
  return <p>{getResponseMessage(response)}</p>;
}
