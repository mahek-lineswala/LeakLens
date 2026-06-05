import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, FileSearch, ShieldAlert, Sparkles } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useAuthStore } from '../store/authStore';
import { apiFetch } from '../lib/api';
import { Badge } from '../components/ui/badge';
import { Card, CardHeader } from '../components/ui/card';
import { SpendingHeatmap } from '../components/charts/SpendingHeatmap';

type DashboardResponse = {
  kpis: {
    totalSpend: number;
    documentsProcessed: number;
    potentialSavings: number;
    riskScore: number;
  };
  dailySpendTrend: Array<{ date: string; spend: number }>;
  expenseCategories: Array<{ name: string; value: number }>;
  vendorSpend: Array<{ vendor: string; spend: number }>;
  spendingHeatmap: Array<{ day: string; bucket: string; value: number }>;
  aiSummary: string;
  recentActivity: Array<{
    id: string;
    date: string;
    vendor: string;
    amount: number;
    category: string;
    aiStatus: string;
  }>;
  topRisks: Array<{
    id: string;
    title: string;
    detail: string;
    severity: 'Low' | 'Medium' | 'High';
  }>;
};

const categoryColors = ['#67e8f9', '#38bdf8', '#0ea5e9', '#0891b2', '#7dd3fc', '#c084fc'];

export function DashboardPage() {
  const { accessToken } = useAuthStore();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    void apiFetch<DashboardResponse>('/api/upload/dashboard', accessToken)
      .then(setData)
      .catch((apiError: Error) => setError(apiError.message));
  }, [accessToken]);

  const hasChartData = useMemo(
    () =>
      Boolean(
        data &&
          (data.dailySpendTrend.length ||
            data.expenseCategories.length ||
            data.vendorSpend.length ||
            data.spendingHeatmap.length ||
            data.recentActivity.length)
      ),
    [data]
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Spend', value: `$${(data?.kpis.totalSpend ?? 0).toFixed(2)}` },
          { label: 'Documents Processed', value: String(data?.kpis.documentsProcessed ?? 0) },
          { label: 'Potential Savings', value: `$${(data?.kpis.potentialSavings ?? 0).toFixed(2)}` },
          { label: 'Risk Score', value: `${data?.kpis.riskScore ?? 0}/100` },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <Card className="p-5">
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-4 text-lg font-semibold tracking-tight text-white">{item.value}</p>
              <p className="mt-4 text-sm text-slate-500">
                {data ? 'Live from processed documents' : 'Waiting for uploaded documents'}
              </p>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card className="p-6">
          <CardHeader title="Daily Spend Trend" eyebrow="Last 7 Days" />
          {data && data.dailySpendTrend.length > 0 ? (
            <div className="mt-6 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.dailySpendTrend}>
                  <CartesianGrid stroke="rgba(148,163,184,0.1)" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    contentStyle={{ background: '#08111d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Spend']}
                  />
                  <Line type="monotone" dataKey="spend" stroke="#67e8f9" strokeWidth={3} dot={{ fill: '#67e8f9', strokeWidth: 0, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyPanel icon={BarChart3} title="No spend trend available" description="Process expense documents to generate daily spend history." />
          )}
        </Card>

        <Card className="p-6">
          <CardHeader title="AI Weekly Financial Summary" eyebrow="Co-pilot Narrative" />
          <div className="mt-6 rounded-3xl border border-cyan-300/10 bg-cyan-300/5 p-5">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base leading-7 text-slate-100">{data?.aiSummary ?? 'No summary generated yet.'}</p>
                {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="p-6">
          <CardHeader title="Expense Categories" eyebrow="Spend Mix" />
          {data && data.expenseCategories.length > 0 ? (
            <>
              <div className="mt-6 h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.expenseCategories} dataKey="value" innerRadius={70} outerRadius={100} paddingAngle={2}>
                      {data.expenseCategories.map((entry, index) => (
                        <Cell key={entry.name} fill={categoryColors[index % categoryColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#08111d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Spend']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {data.expenseCategories.map((category, index) => (
                  <div key={category.name} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: categoryColors[index % categoryColors.length] }} />
                    {category.name}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyPanel icon={FileSearch} title="No category distribution" description="Categories will populate after AI analysis extracts vendor spend." />
          )}
        </Card>

        <Card className="p-6 xl:col-span-2">
          <CardHeader title="Vendor Spend" eyebrow="Top Vendors" />
          {data && data.vendorSpend.length > 0 ? (
            <div className="mt-6 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.vendorSpend}>
                  <CartesianGrid stroke="rgba(148,163,184,0.08)" vertical={false} />
                  <XAxis dataKey="vendor" stroke="#64748b" tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    contentStyle={{ background: '#08111d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Spend']}
                  />
                  <Bar dataKey="spend" radius={[10, 10, 0, 0]} fill="#38bdf8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyPanel icon={BarChart3} title="No vendor ranking yet" description="Top vendors appear once enough uploaded documents have been processed." />
          )}
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <CardHeader title="Spending Heatmap" eyebrow="Day vs Expense Frequency" />
          {data && data.spendingHeatmap.length > 0 ? (
            <div className="mt-6">
              <SpendingHeatmap data={data.spendingHeatmap} />
            </div>
          ) : (
            <EmptyPanel icon={BarChart3} title="No activity heatmap available" description="The heatmap appears after multiple uploads establish activity patterns." />
          )}
        </Card>

        <Card className="p-6">
          <CardHeader title="Top Risks" eyebrow="Active Alerts" />
          {data && data.topRisks.length > 0 ? (
            <div className="mt-6 space-y-4">
              {data.topRisks.map((risk) => (
                <div key={risk.id} className="rounded-2xl border border-white/6 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 rounded-2xl bg-red-400/10 p-2 text-red-300">
                        <ShieldAlert className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{risk.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-400">{risk.detail}</p>
                      </div>
                    </div>
                    <Badge className="border-red-400/20 bg-red-400/10 text-red-200">{risk.severity}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyPanel icon={ShieldAlert} title="No risks detected" description="Risks appear when LeakLens detects duplicates, anomalies, or fraud indicators." />
          )}
        </Card>
      </section>

      <Card className="p-6">
        <CardHeader title="Recent Activity" eyebrow="Uploaded Documents + AI Analysis" />
        {data && data.recentActivity.length > 0 ? (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-white/6 text-xs uppercase tracking-[0.18em] text-slate-500">
                  <th className="pb-4 pr-4 font-medium">Date</th>
                  <th className="pb-4 pr-4 font-medium">Vendor</th>
                  <th className="pb-4 pr-4 font-medium">Amount</th>
                  <th className="pb-4 pr-4 font-medium">Category</th>
                  <th className="pb-4 font-medium">AI Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentActivity.map((row) => (
                  <tr key={row.id} className="border-b border-white/6 text-sm text-slate-300 last:border-b-0">
                    <td className="py-4 pr-4">{new Date(row.date).toLocaleDateString()}</td>
                    <td className="py-4 pr-4 font-medium text-white">{row.vendor}</td>
                    <td className="py-4 pr-4">${row.amount.toFixed(2)}</td>
                    <td className="py-4 pr-4">{row.category}</td>
                    <td className="py-4">
                      <Badge className="border-cyan-300/20 bg-cyan-300/10 text-cyan-200">{row.aiStatus}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyPanel icon={FileSearch} title="No activity recorded" description="Activity appears as soon as uploaded documents complete analysis." />
        )}
      </Card>
    </div>
  );
}

function EmptyPanel({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Sparkles;
  title: string;
  description: string;
}) {
  return (
    <div className="mt-6 flex min-h-[240px] items-center justify-center rounded-3xl border border-white/6 bg-white/[0.03] p-6 text-center">
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
