import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, BrainCircuit, Radar, Repeat, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuthStore } from '../store/authStore';
import { apiFetch } from '../lib/api';
import { Badge } from '../components/ui/badge';
import { Card, CardHeader } from '../components/ui/card';

type InsightsResponse = {
  overview: {
    potentialSavings: number;
    duplicateExpenses: number;
    subscriptionLeaks: number;
    riskScore: number;
  };
  insightFeed: Array<{
    id: string;
    time: string;
    title: string;
    detail: string;
    severity: string;
    uploadId: string | null;
  }>;
  leakDetections: Array<{
    id: string;
    type: string;
    severity: string;
    estimatedSavings: number;
    description: string;
  }>;
  vendorAnalysis: Array<{
    vendor: string;
    totalSpend: number;
    averageInvoiceValue: number;
    riskScore: number;
    invoiceCount: number;
  }>;
  recurringPayments: Array<{
    id: string;
    vendor: string;
    monthlyCost: number;
    annualProjection: number;
    renewalDate: string;
  }>;
  recommendations: string[];
  documents: Array<{
    id: string;
    title: string;
    vendor: string;
    riskScore: number;
    summary: string;
  }>;
};

export function InsightsPage() {
  const { accessToken } = useAuthStore();
  const [data, setData] = useState<InsightsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    void apiFetch<InsightsResponse>('/api/upload/insights', accessToken)
      .then(setData)
      .catch((apiError: Error) => setError(apiError.message));
  }, [accessToken]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Potential Savings', value: `$${(data?.overview.potentialSavings ?? 0).toFixed(2)}` },
          { label: 'Duplicate Expenses', value: String(data?.overview.duplicateExpenses ?? 0) },
          { label: 'Subscription Leaks', value: String(data?.overview.subscriptionLeaks ?? 0) },
          { label: 'Risk Score', value: `${data?.overview.riskScore ?? 0}/100` },
        ].map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-5">
              <p className="text-sm text-slate-400">{card.label}</p>
              <p className="mt-4 text-lg font-semibold text-white">{card.value}</p>
              <p className="mt-3 text-sm text-slate-500">Live from stored AI analysis</p>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-6">
          <CardHeader title="Insight Feed" eyebrow="Timeline Intelligence" />
          {data && data.insightFeed.length > 0 ? (
            <div className="mt-6 space-y-5">
              {data.insightFeed.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-cyan-300" />
                    <div className="mt-2 h-full w-px bg-white/8" />
                  </div>
                  <div className="flex-1 rounded-3xl border border-white/6 bg-white/[0.03] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          {new Date(item.time).toLocaleString()}
                        </p>
                        <h3 className="mt-2 text-base font-semibold text-white">{item.title}</h3>
                      </div>
                      <Badge className="border-red-400/20 bg-red-400/10 text-red-200">{item.severity}</Badge>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-400">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyInsightPanel
              icon={BrainCircuit}
              title="No insights generated"
              description={error ?? 'Upload documents to populate the insight feed.'}
            />
          )}
        </Card>

        <Card className="p-6">
          <CardHeader title="Anomaly Detection" eyebrow="Historical Pattern Drift" />
          {data && data.leakDetections.length > 0 ? (
            <div className="mt-6 space-y-4">
              {data.leakDetections.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/6 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-base font-medium text-white">{item.type}</p>
                    <Badge className="border-amber-400/20 bg-amber-400/10 text-amber-200">{item.severity}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{item.description}</p>
                  <p className="mt-3 text-sm text-cyan-200">
                    Estimated savings: ${item.estimatedSavings.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyInsightPanel
              icon={AlertTriangle}
              title="No anomaly baseline"
              description="Anomalies appear after the first real AI detections are stored."
            />
          )}
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="p-6">
          <CardHeader title="Vendor Analysis" eyebrow="Top Vendors" />
          {data && data.vendorAnalysis.length > 0 ? (
            <div className="mt-6 space-y-4">
              {data.vendorAnalysis.map((vendor) => (
                <div key={vendor.vendor} className="rounded-2xl border border-white/6 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-base font-medium text-white">{vendor.vendor}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {vendor.invoiceCount} invoices · avg ${vendor.averageInvoiceValue.toFixed(2)}
                      </p>
                    </div>
                    <Badge className="border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                      {vendor.riskScore}/100
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">Total spend ${vendor.totalSpend.toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyInsightPanel
              icon={Radar}
              title="No vendor analysis"
              description="Vendor insights appear after enough stored documents share vendor history."
            />
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <CardHeader title="Recurring Payments" eyebrow="Detected Subscriptions" />
            {data && data.recurringPayments.length > 0 ? (
              <div className="mt-6 space-y-4">
                {data.recurringPayments.map((payment) => (
                  <div key={payment.id} className="rounded-2xl border border-white/6 bg-white/[0.03] p-4">
                    <p className="text-base font-medium text-white">{payment.vendor}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Monthly ${payment.monthlyCost.toFixed(2)} · Annual $
                      {payment.annualProjection.toFixed(2)}
                    </p>
                    <p className="mt-2 text-sm text-slate-300">
                      Renewal {new Date(payment.renewalDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyInsightPanel
                icon={Wallet}
                title="No recurring payments detected"
                description="Subscription insight appears after recurring vendor charges are detected."
              />
            )}
          </Card>

          <Card className="p-6">
            <CardHeader title="AI Recommendations" eyebrow="Action Queue" />
            {data && data.recommendations.length > 0 ? (
              <div className="mt-6 space-y-4">
                {data.recommendations.map((recommendation) => (
                  <div
                    key={recommendation}
                    className="rounded-2xl border border-white/6 bg-white/[0.03] p-4 text-sm text-slate-300"
                  >
                    {recommendation}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyInsightPanel
                icon={BrainCircuit}
                title="No recommendations yet"
                description="Recommendations appear after AI analysis stores them in the database."
              />
            )}
          </Card>
        </div>
      </section>

      <Card className="p-6">
        <CardHeader title="All Uploads" eyebrow="Stored Upload Insights" />
        {data && data.documents.length > 0 ? (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-white/6 text-xs uppercase tracking-[0.18em] text-slate-500">
                  <th className="pb-4 pr-4 font-medium">File</th>
                  <th className="pb-4 pr-4 font-medium">Vendor</th>
                  <th className="pb-4 pr-4 font-medium">Risk</th>
                  <th className="pb-4 pr-4 font-medium">Summary</th>
                  <th className="pb-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.documents.map((document) => (
                  <tr key={document.id} className="border-b border-white/6 text-sm text-slate-300 last:border-b-0">
                    <td className="py-4 pr-4 font-medium text-white">{document.title}</td>
                    <td className="py-4 pr-4">{document.vendor}</td>
                    <td className="py-4 pr-4">{document.riskScore}/100</td>
                    <td className="py-4 pr-4 text-slate-400">{document.summary}</td>
                    <td className="py-4">
                      <Link
                        to={`/insights/${document.id}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-cyan-200 hover:text-white"
                      >
                        Open detail
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyInsightPanel
            icon={Repeat}
            title="No uploads available"
            description="Each analyzed upload will appear here and open its own insight detail route."
          />
        )}
      </Card>
    </div>
  );
}

function EmptyInsightPanel({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof AlertTriangle;
  title: string;
  description: string;
}) {
  return (
    <div className="mt-6 flex min-h-[220px] items-center justify-center rounded-3xl border border-white/6 bg-white/[0.03] p-6 text-center">
      <div className="max-w-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200">
          <Icon className="h-5 w-5" />
        </div>
        <p className="mt-4 text-base font-medium text-white">{title}</p>
        <p className="mt-2 text-sm leading-7 text-slate-400">{description}</p>
      </div>
    </div>
  );
}
