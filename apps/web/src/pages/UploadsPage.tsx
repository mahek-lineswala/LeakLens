import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FileSearch, FileUp, ScanText, ShieldCheck, WandSparkles } from 'lucide-react';

import { useAuthStore } from '../store/authStore';
import { apiFetch } from '../lib/api';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardHeader } from '../components/ui/card';

type UploadRecord = {
  id: string;
  originalName: string;
  fileType: string;
  fileUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
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

export function UploadsPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { accessToken } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [uploads, setUploads] = useState<UploadRecord[]>([]);
  const [selectedUploadId, setSelectedUploadId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('No uploads yet');

  const selectedUpload = useMemo(
    () => uploads.find((upload) => upload.id === selectedUploadId) ?? uploads[0] ?? null,
    [selectedUploadId, uploads]
  );

  const loadUploads = async () => {
    if (!accessToken) {
      return;
    }

    const data = await apiFetch<UploadRecord[]>('/api/upload/history', accessToken);
    setUploads(data);
    setSelectedUploadId((current) => current ?? data[0]?.id ?? null);
  };

  useEffect(() => {
    void loadUploads().catch((error: Error) => setUploadError(error.message));
  }, [accessToken]);

  const handleOpenPicker = () => {
    setUploadError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file || !accessToken) {
      return;
    }

    setIsUploading(true);
    setStatusText(`Processing ${file.name}`);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      await apiFetch<UploadRecord>('/api/upload', accessToken, {
        method: 'POST',
        body: formData,
      });

      await loadUploads();
      setStatusText(`Completed ${file.name}`);
    } catch (error: any) {
      setUploadError(error.message || 'Upload failed.');
      setStatusText('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const uploadedCount = uploads.length;
  const ocrSuccessCount = uploads.filter((upload) => upload.ocrResult?.rawText?.trim()).length;
  const ocrRate = `${uploadedCount === 0 ? 0 : Math.round((ocrSuccessCount / uploadedCount) * 100)}%`;
  const completedUploads = uploads.filter((upload) => upload.status === 'COMPLETED');
  const averageProcessingMinutes = completedUploads.length
    ? completedUploads.reduce((sum, upload) => {
        const startedAt = new Date(upload.createdAt).getTime();
        const completedAt = new Date(upload.updatedAt).getTime();
        return sum + Math.max(completedAt - startedAt, 0);
      }, 0) /
      completedUploads.length /
      1000 /
      60
    : 0;
  const aiConfidenceScore = uploads.length
    ? Math.round(
        uploads.reduce((sum, upload) => {
          if (!upload.expense) {
            return sum;
          }

          const populatedFieldCount = [
            upload.expense.vendor,
            upload.expense.invoiceNumber,
            upload.expense.category,
            upload.expense.transactionDate,
            upload.expense.summary,
          ].filter(Boolean).length;

          return sum + Math.round((populatedFieldCount / 5) * 100);
        }, 0) / uploads.length
      )
    : 0;

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Documents Uploaded', value: uploadedCount, detail: 'Loaded from your database' },
          { label: 'OCR Success Rate', value: ocrRate, detail: 'Calculated from stored OCR results' },
          {
            label: 'Avg Processing Time',
            value: `${averageProcessingMinutes.toFixed(1)} min`,
            detail: 'Derived from stored upload timestamps',
          },
          {
            label: 'AI Accuracy Score',
            value: `${aiConfidenceScore}/100`,
            detail: 'Based on extracted field completeness across uploads',
          },
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
              <p className="mt-3 text-sm text-slate-500">{card.detail}</p>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="relative overflow-hidden p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.12),transparent_38%)]" />
          <CardHeader title="Upload Documents" eyebrow="Ingestion Pipeline" />
          <div className="relative mt-6 rounded-[28px] border border-dashed border-cyan-300/25 bg-cyan-300/5 p-10">
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-300 text-slate-950">
                <FileUp className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-white">Upload financial documents</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Upload invoices, receipts, screenshots, and scanned PDFs. LeakLens will run OCR and persist AI insights to PostgreSQL.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {['PDF', 'PNG', 'JPG', 'JPEG', 'WEBP'].map((format) => (
                  <Badge key={format} className="border-white/10 bg-white/5 text-slate-200">
                    {format}
                  </Badge>
                ))}
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.22em] text-slate-500">Maximum file size: 20MB</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button onClick={handleOpenPicker} disabled={isUploading}>
                  {isUploading ? 'Processing...' : 'Select Document'}
                </Button>
              </div>
              <p className="mt-4 text-sm text-slate-300">{statusText}</p>
              {uploadError ? <p className="mt-3 text-sm text-red-300">{uploadError}</p> : null}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <CardHeader title="Current Pipeline Health" eyebrow="Live Processing" />
          <div className="mt-6 space-y-4">
            <StatusPanel
              icon={ScanText}
              title="OCR status"
              description={selectedUpload?.ocrResult ? 'OCR completed for the selected upload.' : 'No OCR result for the selected upload.'}
            />
            <StatusPanel
              icon={WandSparkles}
              title="AI analysis status"
              description={selectedUpload?.expense ? 'AI insights stored for the selected upload.' : 'No AI analysis for the selected upload.'}
            />
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-6">
          <CardHeader title="Upload Status" eyebrow="Document Operations" />
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-white/6 text-xs uppercase tracking-[0.18em] text-slate-500">
                  <th className="pb-4 pr-4 font-medium">File Name</th>
                  <th className="pb-4 pr-4 font-medium">Type</th>
                  <th className="pb-4 pr-4 font-medium">Uploaded At</th>
                  <th className="pb-4 pr-4 font-medium">OCR</th>
                  <th className="pb-4 pr-4 font-medium">AI</th>
                  <th className="pb-4 pr-4 font-medium">Confidence</th>
                  <th className="pb-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploads.length > 0 ? (
                  uploads.map((upload) => (
                    <tr
                      key={upload.id}
                      className={`border-b border-white/6 text-sm text-slate-300 cursor-pointer hover:bg-white/[0.03] ${
                        selectedUpload?.id === upload.id ? 'bg-white/[0.04]' : ''
                      }`}
                      onClick={() => setSelectedUploadId(upload.id)}
                    >
                      <td className="py-4 pr-4 font-medium text-white">{upload.originalName}</td>
                      <td className="py-4 pr-4">{upload.fileType}</td>
                      <td className="py-4 pr-4">{new Date(upload.createdAt).toLocaleString()}</td>
                      <td className="py-4 pr-4">{upload.ocrResult ? 'Completed' : upload.status === 'FAILED' ? 'Failed' : 'Pending'}</td>
                      <td className="py-4 pr-4">{upload.expense ? 'Completed' : upload.status}</td>
                      <td className="py-4 pr-4">{upload.expense?.riskScore != null ? `${upload.expense.riskScore}/100` : 'No data'}</td>
                      <td className="py-4">
                        <a className="text-cyan-200 hover:text-white" href={upload.fileUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
                          Open file
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12">
                      <div className="text-center">
                        <p className="text-base font-medium text-white">No uploads yet</p>
                        <p className="mt-2 text-sm text-slate-400">Upload a document to populate OCR status, AI analysis, confidence, and actions.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <CardHeader title="Document Preview" eyebrow="Selected Upload" />
          {selectedUpload ? (
            <div className="mt-6 space-y-4">
              <StatusPanel icon={FileSearch} title="File" description={selectedUpload.originalName} />
              <StatusPanel icon={ShieldCheck} title="Vendor" description={selectedUpload.expense?.vendor || 'Unknown'} />
            </div>
          ) : (
            <EmptyNotice icon={FileSearch} title="No document selected" description="Click an uploaded document to preview its insights." />
          )}
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <CardHeader title="OCR Result" eyebrow="Raw Extracted Text" />
          {selectedUpload?.ocrResult ? (
            <div className="mt-6 rounded-3xl border border-white/6 bg-white/[0.03] p-5">
              <p className="text-sm leading-7 text-slate-300">{selectedUpload.ocrResult.rawText}</p>
            </div>
          ) : (
            <EmptyNotice icon={ScanText} title="No OCR text available" description="Select a processed upload to inspect the stored OCR text." />
          )}
        </Card>

        <Card className="p-6">
          <CardHeader title="AI Insight Result" eyebrow="LeakLens Analysis" />
          {selectedUpload?.expense ? (
            <div className="mt-6 space-y-4">
              <InsightField label="Vendor" value={selectedUpload.expense.vendor || 'Unknown'} />
              <InsightField label="Amount" value={`$${selectedUpload.expense.amount.toFixed(2)}`} />
              <InsightField label="Invoice Number" value={selectedUpload.expense.invoiceNumber || 'Not found'} />
              <InsightField label="Category" value={selectedUpload.expense.category} />
              <InsightField label="Transaction Date" value={selectedUpload.expense.transactionDate || 'Not found'} />
              <InsightField label="Summary" value={selectedUpload.expense.summary || 'No summary'} multiline />
              <InsightField label="Risk Score" value={`${selectedUpload.expense.riskScore ?? 0}/100`} />
              <InsightField label="Duplicate Expense" value={selectedUpload.expense.duplicateExpense ? 'Yes' : 'No'} />
              <InsightField label="Recurring Subscription" value={selectedUpload.expense.subscriptionDetected ? 'Yes' : 'No'} />
              <InsightField label="Estimated Savings" value={`$${(selectedUpload.expense.estimatedSavings ?? 0).toFixed(2)}`} />
              <ListField label="Fraud Indicators" items={selectedUpload.expense.fraudIndicators} />
              <ListField label="Anomalies" items={selectedUpload.expense.anomalies} />
              <ListField label="Recommendations" items={selectedUpload.expense.recommendations} />
            </div>
          ) : (
            <EmptyNotice icon={WandSparkles} title="No AI result yet" description="Select an analyzed upload to inspect the stored financial intelligence output." />
          )}
        </Card>
      </section>
    </div>
  );
}

function EmptyNotice({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof FileSearch;
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

function StatusPanel({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof ScanText;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-cyan-300/10 p-2 text-cyan-200">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-base font-medium text-white">{title}</p>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
      </div>
    </div>
  );
}

function InsightField({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className={`mt-2 text-sm text-white ${multiline ? 'leading-7' : 'font-medium'}`}>{value}</p>
    </div>
  );
}

function ListField({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <div className="mt-2 space-y-2">
        {items.length > 0 ? items.map((item) => <p key={item} className="text-sm leading-7 text-white">{item}</p>) : <p className="text-sm text-slate-400">None</p>}
      </div>
    </div>
  );
}
