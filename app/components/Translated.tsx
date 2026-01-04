"use client";

import { useI18n } from '@/lib/i18n';

export default function Translated({ k, children }: { k: string; children?: React.ReactNode }) {
  const { t } = useI18n();
  const txt = t(k);
  return <>{txt ?? children}</>;
}
