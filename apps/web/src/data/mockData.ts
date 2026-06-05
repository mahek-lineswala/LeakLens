export const kpis = [
  { label: 'Total Spend', value: '$12,457', delta: '+8.2% from previous week' },
  { label: 'Documents Processed', value: '156', delta: '24 more than previous week' },
  { label: 'Potential Savings', value: '$1,245', delta: 'From duplicate, unused, and abnormal spend' },
  { label: 'Risk Score', value: '72 / 100', delta: 'Influenced by 4 active anomalies' },
];

export const dailySpendTrend = [
  { day: 'May 30', spend: 1140 },
  { day: 'May 31', spend: 1760 },
  { day: 'Jun 01', spend: 1490 },
  { day: 'Jun 02', spend: 2240 },
  { day: 'Jun 03', spend: 1840 },
  { day: 'Jun 04', spend: 2010 },
  { day: 'Jun 05', spend: 1977 },
];

export const expenseCategories = [
  { name: 'Software', value: 28 },
  { name: 'Cloud', value: 24 },
  { name: 'Marketing', value: 18 },
  { name: 'Travel', value: 12 },
  { name: 'Office', value: 9 },
  { name: 'Payroll', value: 9 },
];

export const vendorSpend = [
  { vendor: 'AWS', spend: 3450 },
  { vendor: 'Google', spend: 2310 },
  { vendor: 'Microsoft', spend: 1880 },
  { vendor: 'Adobe', spend: 1470 },
  { vendor: 'Ramp', spend: 1120 },
  { vendor: 'Notion', spend: 880 },
  { vendor: 'Slack', spend: 820 },
  { vendor: 'HubSpot', spend: 760 },
  { vendor: 'Figma', spend: 640 },
  { vendor: 'Zoom', spend: 430 },
];

export const spendHeatmap = [
  { bucket: 'Morning', day: 'Mon', value: 6 },
  { bucket: 'Morning', day: 'Tue', value: 4 },
  { bucket: 'Morning', day: 'Wed', value: 5 },
  { bucket: 'Morning', day: 'Thu', value: 8 },
  { bucket: 'Morning', day: 'Fri', value: 7 },
  { bucket: 'Morning', day: 'Sat', value: 2 },
  { bucket: 'Morning', day: 'Sun', value: 1 },
  { bucket: 'Midday', day: 'Mon', value: 7 },
  { bucket: 'Midday', day: 'Tue', value: 5 },
  { bucket: 'Midday', day: 'Wed', value: 8 },
  { bucket: 'Midday', day: 'Thu', value: 9 },
  { bucket: 'Midday', day: 'Fri', value: 10 },
  { bucket: 'Midday', day: 'Sat', value: 4 },
  { bucket: 'Midday', day: 'Sun', value: 2 },
  { bucket: 'Evening', day: 'Mon', value: 2 },
  { bucket: 'Evening', day: 'Tue', value: 3 },
  { bucket: 'Evening', day: 'Wed', value: 4 },
  { bucket: 'Evening', day: 'Thu', value: 5 },
  { bucket: 'Evening', day: 'Fri', value: 4 },
  { bucket: 'Evening', day: 'Sat', value: 3 },
  { bucket: 'Evening', day: 'Sun', value: 2 },
];

export const recentActivity = [
  { date: 'Jun 05', vendor: 'AWS', amount: '$325.89', category: 'Cloud', status: 'Duplicate suspected' },
  { date: 'Jun 05', vendor: 'Adobe', amount: '$89.99', category: 'Software', status: 'Subscription renewed' },
  { date: 'Jun 04', vendor: 'Delta', amount: '$642.12', category: 'Travel', status: 'Policy check required' },
  { date: 'Jun 03', vendor: 'Google Ads', amount: '$1,125.00', category: 'Marketing', status: 'Approved' },
  { date: 'Jun 02', vendor: 'Microsoft', amount: '$478.10', category: 'Software', status: 'Vendor anomaly detected' },
];

export const topRisks = [
  { title: 'Duplicate Invoice Detected', detail: 'AWS INV-2025-001 appears twice within 14 minutes.', severity: 'Critical' },
  { title: 'High AWS Spend Spike', detail: 'Cloud infrastructure is up 18% week-over-week.', severity: 'High' },
  { title: 'Recurring Subscription Increase', detail: 'Adobe seat count rose from 14 to 19.', severity: 'Medium' },
  { title: 'Vendor Billing Anomaly', detail: 'Microsoft invoice total drifted from historical average.', severity: 'Medium' },
];

export const uploads = [
  {
    id: 'upl-aws-001',
    fileName: 'aws-invoice-may.pdf',
    type: 'PDF',
    uploadedAt: '2026-06-05T08:30:00Z',
    ocrStatus: 'Completed',
    aiStatus: 'Completed',
    confidence: 98,
    metadata: { pages: 3, size: '1.8 MB', vendor: 'Amazon Web Services', amount: '$325.89' },
    rawText:
      'Amazon Web Services Invoice INV-2025-001 Billing Period May 2026 Total Due USD 325.89 EC2 compute, S3 storage, CloudWatch monitoring.',
    fields: {
      vendor: 'Amazon Web Services',
      amount: '$325.89',
      date: '2025-08-12',
      invoiceNumber: 'INV-2025-001',
      category: 'Cloud Services',
    },
  },
  {
    id: 'upl-adb-002',
    fileName: 'adobe-renewal.png',
    type: 'PNG',
    uploadedAt: '2026-06-05T07:10:00Z',
    ocrStatus: 'Completed',
    aiStatus: 'Completed',
    confidence: 94,
    metadata: { pages: 1, size: '628 KB', vendor: 'Adobe', amount: '$89.99' },
    rawText:
      'Adobe Creative Cloud renewal invoice Monthly plan 5 seats Amount USD 89.99 Renewal Date 2026-06-04',
    fields: {
      vendor: 'Adobe',
      amount: '$89.99',
      date: '2026-06-04',
      invoiceNumber: 'ADB-55672',
      category: 'Software',
    },
  },
  {
    id: 'upl-dlt-003',
    fileName: 'travel-receipt-delta.jpg',
    type: 'JPG',
    uploadedAt: '2026-06-04T14:20:00Z',
    ocrStatus: 'Completed',
    aiStatus: 'Processing',
    confidence: 81,
    metadata: { pages: 1, size: '1.1 MB', vendor: 'Delta', amount: '$642.12' },
    rawText: 'Delta receipt flight SEA to SFO total USD 642.12 employee travel receipt issued 2026-06-03',
    fields: {
      vendor: 'Delta',
      amount: '$642.12',
      date: '2026-06-03',
      invoiceNumber: 'TRV-9921',
      category: 'Travel',
    },
  },
  {
    id: 'upl-msf-004',
    fileName: 'microsoft-billing.webp',
    type: 'WEBP',
    uploadedAt: '2026-06-03T13:05:00Z',
    ocrStatus: 'Failed',
    aiStatus: 'Failed',
    confidence: 42,
    metadata: { pages: 1, size: '540 KB', vendor: 'Microsoft', amount: '$478.10' },
    rawText: 'Partial OCR text could not fully resolve line items.',
    fields: {
      vendor: 'Microsoft',
      amount: '$478.10',
      date: '2026-06-02',
      invoiceNumber: 'MS-7744',
      category: 'Software',
    },
  },
];

export const uploadAnalytics = [
  { label: 'Documents Uploaded', value: '156', detail: '+14 this week' },
  { label: 'OCR Success Rate', value: '96.8%', detail: '4 files require review' },
  { label: 'Avg Processing Time', value: '18 sec', detail: 'AI + OCR pipeline' },
  { label: 'AI Accuracy Score', value: '93.2%', detail: 'Based on reviewed outputs' },
];

export const insightsOverview = [
  { label: 'Potential Savings', value: '$1,245', detail: 'Projected over next 30 days' },
  { label: 'Duplicate Expenses', value: '7', detail: '2 high-confidence duplicates' },
  { label: 'Subscription Leaks', value: '5', detail: '$418 monthly exposure' },
  { label: 'Risk Score', value: '72 / 100', detail: 'Cloud and vendor anomalies elevated' },
];

export const insightFeed = [
  { time: '09:14', title: 'AWS invoice duplicated', detail: 'The same amount and invoice number appeared twice across two uploaded PDFs.', severity: 'Critical' },
  { time: '10:42', title: 'Adobe subscription renewed', detail: 'Renewal increased seat count by 35% versus last month.', severity: 'Medium' },
  { time: '12:06', title: 'Travel expense unusually high', detail: 'Delta spend exceeded employee baseline by 2.7x.', severity: 'High' },
  { time: '13:35', title: 'Vendor spending increased 42%', detail: 'Google Ads invoices accelerated over the last seven-day window.', severity: 'High' },
];

export const leakDetections = [
  { id: 'duplicate-invoice', type: 'Duplicate Invoice', severity: 'High', savings: '$325', description: 'Matched invoice number, amount, and billing window across duplicated AWS entries.' },
  { id: 'unused-subscription', type: 'Unused Subscription', severity: 'Medium', savings: '$59/mo', description: 'Two inactive Adobe seats were billed without recent user activity.' },
  { id: 'billing-anomaly', type: 'Vendor Billing Anomaly', severity: 'High', savings: '$412', description: 'Microsoft invoice total is materially above trailing six-invoice average.' },
];

export const vendorAnalysis = [
  { vendor: 'AWS', monthlyTrend: '+18%', avgInvoice: '$542', risk: 84 },
  { vendor: 'Adobe', monthlyTrend: '+12%', avgInvoice: '$91', risk: 61 },
  { vendor: 'Google', monthlyTrend: '+42%', avgInvoice: '$763', risk: 78 },
  { vendor: 'Microsoft', monthlyTrend: '+9%', avgInvoice: '$481', risk: 69 },
];

export const recurringPayments = [
  { vendor: 'Adobe Creative Cloud', monthlyCost: '$89.99', annualProjection: '$1,079.88', renewalDate: '2026-07-04' },
  { vendor: 'Slack Enterprise Grid', monthlyCost: '$320.00', annualProjection: '$3,840.00', renewalDate: '2026-06-28' },
  { vendor: 'Notion AI', monthlyCost: '$210.00', annualProjection: '$2,520.00', renewalDate: '2026-06-20' },
];

export const recommendations = [
  'Consider downgrading the Adobe plan and removing two inactive seats.',
  'Review the AWS spending spike and compare EC2 concurrency against workload demand.',
  'Merge duplicate SaaS subscriptions across shared team budgets.',
  'Investigate the unusual Microsoft vendor charge before next payment run.',
];

export const insightDetails = [
  {
    id: 'duplicate-invoice',
    title: 'Duplicate AWS invoice detected',
    riskScore: 89,
    confidence: 97,
    threatAssessment: 'High confidence duplicate detected across two invoices with identical vendor, amount, and invoice number.',
    recommendations: [
      'Void the second payment request before approval.',
      'Compare the AWS invoice source system to confirm duplicate ingestion.',
      'Add vendor-level dedupe rule for invoice number + total amount.',
    ],
    analysis: {
      vendor: 'Amazon Web Services',
      amount: '$325.89',
      invoiceNumber: 'INV-2025-001',
      category: 'Cloud Services',
      transactionDate: '2025-08-12',
      summary: 'Monthly AWS infrastructure charges appear duplicated within the same billing window.',
    },
    ocrText:
      'Amazon Web Services Invoice INV-2025-001 Total Due 325.89 Billing Period 2025-08-01 to 2025-08-31. Duplicate copy located in upload archive.',
  },
  {
    id: 'unused-subscription',
    title: 'Unused Adobe subscription leak',
    riskScore: 63,
    confidence: 91,
    threatAssessment: 'Medium severity subscription leak driven by inactive licenses that continue renewing monthly.',
    recommendations: [
      'Downgrade plan before next renewal.',
      'Remove inactive licenses or reassign them to active users.',
      'Audit seat-utilization monthly.',
    ],
    analysis: {
      vendor: 'Adobe',
      amount: '$89.99',
      invoiceNumber: 'ADB-55672',
      category: 'Software',
      transactionDate: '2026-06-04',
      summary: 'Monthly Adobe renewal includes seats with no recent activity, creating avoidable recurring spend.',
    },
    ocrText:
      'Adobe Creative Cloud renewal 5 seats amount 89.99 invoice ADB-55672 renewal date 2026-06-04 active seats 3 of 5',
  },
  {
    id: 'billing-anomaly',
    title: 'Microsoft billing anomaly',
    riskScore: 76,
    confidence: 88,
    threatAssessment: 'High variance detected relative to historical Microsoft invoices with missing supporting detail.',
    recommendations: [
      'Request detailed line items from the vendor.',
      'Compare contract pricing with current invoice.',
      'Hold approval pending finance review.',
    ],
    analysis: {
      vendor: 'Microsoft',
      amount: '$478.10',
      invoiceNumber: 'MS-7744',
      category: 'Software',
      transactionDate: '2026-06-02',
      summary: 'Invoice total exceeded expected spend band by 23% without a matching change order.',
    },
    ocrText:
      'Microsoft invoice MS-7744 total 478.10 billed 2026-06-02 services bundle office collaboration security addon partial line items missing',
  },
];
