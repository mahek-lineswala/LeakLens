import { useEffect, useState } from 'react';
import { AlertTriangle, ChevronLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { useAuthStore } from '../store/authStore';
import { apiFetch } from '../lib/api';
import { Badge } from '../components/ui/badge';
import { Card, CardHeader } from '../components/ui/card';

type UploadDetail = {
  id: string;
  originalName: string;
  fileUrl: string;
  createdAt: string;
  ocrResult: { rawText: string } | null;
  expense: {
    vendor: string | null;
    amount: number;
    invoiceNumber: string | null;
    category: string;
    transactionDate: string | null;
    summary: string | null;
    riskScore: number | null;
    duplicateExpense: boolean;
    subscriptionDetected: boolean;
    fraudIndicators: string[];
    anomalies: string[];
    estimatedSavings: number | null;
    recommendations: string[];
  } | null;
};

export function InsightDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuthStore();
  const [detail, setDetail] = useState<UploadDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !accessToken) {
      return;
    }

    void apiFetch<UploadDetail>(`/api/upload/${id}`, accessToken)
      .then(setDetail)
      .catch((apiError: Error) => setError(apiError.message));
  }, [accessToken, id]);

  return (
    <div className="space-y-6">
      <Link to="/insights" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
        <ChevronLeft className="h-4 w-4" />
        Back to insights
      </Link>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-6">
          <CardHeader title="Insight Detail" eyebrow="Document Detail" />
          <div className="mt-6 rounded-[28px] border border-white/6 bg-[#09111c] p-5">
            <div className="flex aspect-[4/3] items-center justify-center rounded-[24px] border border-dashed border-cyan-300/20 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.08),transparent_45%)]">
              <div className="text-center">
                <Sparkles className="mx-auto h-8 w-8 text-cyan-200" />
                <p className="mt-3 text-base font-medium text-white">{detail?.originalName ?? 'Loading document detail...'}</p>
                <p className="mt-1 text-sm text-slate-500">{detail?.expense?.vendor ?? error ?? 'Waiting for document data'}</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <CardHeader title="Threat Assessment" eyebrow="AI Risk Summary" />
            <div className="mt-6 flex items-start gap-4 rounded-3xl border border-red-400/10 bg-red-400/5 p-5">
              <div className="rounded-2xl bg-red-400/10 p-3 text-red-200">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="border-red-400/20 bg-red-400/10 text-red-200">Risk {detail?.expense?.riskScore ?? 0}/100</Badge>
                  <Badge className="border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                    {detail?.expense?.duplicateExpense ? 'Duplicate suspected' : 'No duplicate flagged'}
                  </Badge>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {detail?.expense?.summary ?? 'No threat assessment available for this document.'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <CardHeader title="Extracted Fields" eyebrow="Structured Analysis" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ['vendor', detail?.expense?.vendor ?? 'Unknown'],
                ['amount', detail?.expense ? `$${detail.expense.amount.toFixed(2)}` : 'No data'],
                ['invoiceNumber', detail?.expense?.invoiceNumber ?? 'Not found'],
                ['category', detail?.expense?.category ?? 'No data'],
                ['transactionDate', detail?.expense?.transactionDate ?? 'Not found'],
                ['estimatedSavings', detail?.expense ? `$${(detail.expense.estimatedSavings ?? 0).toFixed(2)}` : 'No data'],
              ].map(([key, value]) => (
                <div key={key} className="rounded-2xl border border-white/6 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{key}</p>
                  <p className="mt-2 font-medium text-white">{value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <CardHeader title="OCR Text" eyebrow="Raw Extraction" />
          <div className="mt-6 rounded-3xl border border-white/6 bg-[#09111c] p-5">
            <p className="text-sm leading-7 text-slate-300">{detail?.ocrResult?.rawText ?? 'No OCR text available.'}</p>
          </div>
        </Card>

        <Card className="p-6">
          <CardHeader title="Recommendations" eyebrow="AI Next Actions" />
          <div className="mt-6 space-y-4">
            {detail?.expense?.recommendations?.length ? (
              detail.expense.recommendations.map((recommendation) => (
                <div key={recommendation} className="flex gap-3 rounded-2xl border border-white/6 bg-white/[0.03] p-4">
                  <div className="rounded-2xl bg-emerald-400/10 p-2 text-emerald-200">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <p className="text-sm leading-7 text-slate-300">{recommendation}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-4 text-sm text-slate-400">
                No recommendations stored for this document.
              </div>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
