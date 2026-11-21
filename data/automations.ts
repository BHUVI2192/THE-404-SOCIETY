export interface AutomationItem {
  id: string;
  number: string;
  name: string;
  cardTitle: string;
  category: string;
  aspectRatio: number;
  introduction: string;
  whatItSolves: string;
  capabilities: string[];
  workflow: string[];
  technologies: string[];
  background: string;
  textColor?: string;
  image: {
    src: string;
    alt: string;
  };
  imagePosition?: string;
  cta?: string;
}

export const AUTOMATIONS: AutomationItem[] = [
  {
    id: 'sales-crm',
    number: '01',
    name: 'SALES & CRM AUTOMATION',
    cardTitle: 'Sales & CRM Automation',
    category: 'REVENUE & PIPELINE',
    aspectRatio: 0.95,
    introduction: 'Turn incoming enquiries into organised sales opportunities.',
    whatItSolves:
      'Eliminates lost leads, slow response times, and manual copy-pasting across fragmented contact channels by orchestrating every inbound prospect into an immediate revenue pipeline.',
    capabilities: [
      'Automatic lead capture from websites and forms.',
      'Lead qualification and categorisation.',
      'Automatic lead assignment.',
      'CRM record creation and updating.',
      'Follow-up task and reminder generation.',
      'Proposal and quotation generation.',
    ],
    workflow: [
      'Website enquiry',
      'Lead qualification',
      'CRM entry',
      'Sales assignment',
      'Follow-up task',
    ],
    technologies: ['HubSpot', 'Salesforce', 'Pipedrive', 'Zapier', 'Webhooks', 'Google Sheets'],
    background: '#087FB0', // Electric Cobalt Blue
    textColor: '#FFFFFF',
    image: {
      src: 'https://framerusercontent.com/images/mapImtPjs21j2ZgFqaMyMxEZ82o.jpg',
      alt: 'Abstract sculptural liquid chrome in electric blue and violet',
    },
    imagePosition: '52% 50%',
    cta: 'Explore System',
  },
  {
    id: 'finance-accounting',
    number: '02',
    name: 'FINANCE & ACCOUNTING AUTOMATION',
    cardTitle: 'Finance & Accounting Automation',
    category: 'FINANCIAL SYSTEMS',
    aspectRatio: 0.82,
    introduction: 'Reduce manual financial operations and simplify financial workflows.',
    whatItSolves:
      'Removes human calculation errors in billing, eliminates chasing overdue invoices, and reconciles transactions across banking and accounting ledgers in real time.',
    capabilities: [
      'Automated invoice generation.',
      'Invoice data extraction using OCR.',
      'Expense approval workflows.',
      'Purchase order and invoice matching.',
      'Payment reconciliation.',
      'Overdue invoice tracking.',
      'Scheduled financial reports.',
    ],
    workflow: [
      'Invoice received',
      'Data extraction',
      'Validation',
      'Approval',
      'Accounting record',
    ],
    technologies: ['Stripe', 'QuickBooks', 'Xero', 'Tesseract OCR', 'Bill.com', 'Plaid'],
    background: '#0E7490', // Deep Marine Teal
    textColor: '#FFFFFF',
    image: {
      src: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1000&q=80',
      alt: 'Sculptural geometric glass with refractive prisms',
    },
    imagePosition: '45% 50%',
    cta: 'Explore System',
  },
  {
    id: 'document-data-processing',
    number: '03',
    name: 'DOCUMENT & DATA PROCESSING',
    cardTitle: 'Document & Data Processing',
    category: 'INTELLIGENT PROCESSING',
    aspectRatio: 1.25,
    introduction: 'Transform unstructured documents into organised, usable business data.',
    whatItSolves:
      'Eliminates hours of manual typing and PDF parsing by converting scanned papers, contracts, and receipts into verified, structured records inside your database.',
    capabilities: [
      'PDF and scanned document extraction.',
      'OCR-based information processing.',
      'Document classification.',
      'Data validation.',
      'Spreadsheet and database synchronisation.',
      'Duplicate record detection.',
      'Automated document generation.',
    ],
    workflow: [
      'Document received',
      'Information extracted',
      'Data validated',
      'Database updated',
    ],
    technologies: ['Google Document AI', 'AWS Textract', 'Python', 'PostgreSQL', 'Airtable'],
    background: '#6D28D9', // Deep Violet / Royal Purple
    textColor: '#FFFFFF',
    image: {
      src: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=1000&q=80',
      alt: 'Iridescent violet fluid sculpture and layered geometry',
    },
    imagePosition: '50% 50%',
    cta: 'Explore System',
  },
  {
    id: 'ecommerce-order-management',
    number: '04',
    name: 'E-COMMERCE & ORDER MANAGEMENT',
    cardTitle: 'E-Commerce & Order Management',
    category: 'COMMERCE & LOGISTICS',
    aspectRatio: 0.85,
    introduction: 'Connect your store, inventory, fulfilment and order operations.',
    whatItSolves:
      'Prevents overselling and stockouts, coordinates multi-warehouse inventory updates, and automates customer shipping tracking across every sales channel.',
    capabilities: [
      'Automated order processing.',
      'Inventory synchronisation.',
      'Low-stock alerts.',
      'Invoice generation.',
      'Shipping status synchronisation.',
      'Returns and refund workflows.',
      'Automated sales reports.',
    ],
    workflow: [
      'New order',
      'Inventory updated',
      'Invoice generated',
      'Fulfilment request',
      'Order status updated',
    ],
    technologies: ['Shopify', 'WooCommerce', 'Stripe', 'ShipStation', 'Klaviyo', 'Inventory APIs'],
    background: '#E96517', // Vivid Tangerine Architecture
    textColor: '#FFFFFF',
    image: {
      src: 'https://framerusercontent.com/images/nlNC9q61Uf1YSE3ZUTPDY0FaZA.jpg',
      alt: 'Sculptural curved staircase in vivid orange architecture',
    },
    imagePosition: '30% 53%',
    cta: 'Explore System',
  },
  {
    id: 'operations-approval-workflows',
    number: '05',
    name: 'OPERATIONS & APPROVAL WORKFLOWS',
    cardTitle: 'Operations & Approval Workflows',
    category: 'OPERATIONAL GOVERNANCE',
    aspectRatio: 0.88,
    introduction: 'Make internal business processes faster, more organised and accountable.',
    whatItSolves:
      'Removes email approval stagnation, enforces strict audit trails for multi-tier decisions, and automatically escalates delayed tasks before deadlines slip.',
    capabilities: [
      'Multi-level approval workflows.',
      'Internal request management.',
      'Automated task assignment.',
      'Delayed-task escalation.',
      'Vendor onboarding.',
      'Project status synchronisation.',
      'Operational reporting.',
    ],
    workflow: [
      'Employee request',
      'Manager approval',
      'Finance approval',
      'Final record',
    ],
    technologies: ['Slack', 'Microsoft Teams', 'Asana', 'Linear', 'Jira', 'Custom Webhooks'],
    background: '#BA124E', // Hot Crimson Ruby
    textColor: '#FFFFFF',
    image: {
      src: 'https://framerusercontent.com/images/widm8qIrPvvCicZ8PAQJJSjrk.jpg',
      alt: 'Reflective liquid metal sculpture in hot pink and ruby red',
    },
    imagePosition: '55% 50%',
    cta: 'Explore System',
  },
  {
    id: 'hr-employee-lifecycle',
    number: '06',
    name: 'HR & EMPLOYEE LIFECYCLE',
    cardTitle: 'HR & Employee Lifecycle',
    category: 'PEOPLE & CULTURE',
    aspectRatio: 1.22,
    introduction: 'Simplify employee onboarding, administration and internal HR processes.',
    whatItSolves:
      'Transforms fragmented employee onboarding into a frictionless, automated journey that gathers credentials, provisions accounts, and tracks compliance without manual follow-up.',
    capabilities: [
      'Employee onboarding workflows.',
      'Document collection and verification.',
      'Leave request management.',
      'Interview scheduling.',
      'Candidate tracking.',
      'Employee task assignment.',
      'Offboarding checklists.',
    ],
    workflow: [
      'Candidate hired',
      'Documents collected',
      'Onboarding tasks created',
      'Department notifications',
    ],
    technologies: ['BambooHR', 'Deel', 'Google Workspace', 'DocuSign', 'Slack', 'Notion'],
    background: '#0F766E', // Emerald Forest Teal
    textColor: '#FFFFFF',
    image: {
      src: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=1000&q=80',
      alt: 'Fluid vibrant green and emerald wave sculpture',
    },
    imagePosition: '50% 50%',
    cta: 'Explore System',
  },
  {
    id: 'data-integration-sync',
    number: '07',
    name: 'DATA INTEGRATION & SYNCHRONISATION',
    cardTitle: 'Data Integration & Synchronisation',
    category: 'SYSTEM ARCHITECTURE',
    aspectRatio: 0.82,
    introduction: 'Connect disconnected applications and keep business data consistent.',
    whatItSolves:
      'Breaks down isolated application silos by maintaining continuous, bidirectionally synchronized datasets with built-in schema validation and error-resilient retries.',
    capabilities: [
      'CRM and ERP integrations.',
      'Application-to-application synchronisation.',
      'API and webhook integrations.',
      'Automated data pipelines.',
      'Spreadsheet imports and exports.',
      'Data cleaning and validation.',
      'Scheduled backups and data exports.',
    ],
    workflow: [
      'CRM update',
      'API integration',
      'Database synchronisation',
      'Connected application updated',
    ],
    technologies: ['REST APIs', 'GraphQL', 'Webhooks', 'PostgreSQL', 'Supabase', 'n8n', 'Segment'],
    background: '#4338CA', // Electric Indigo
    textColor: '#FFFFFF',
    image: {
      src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
      alt: 'Abstract deep indigo fluid chrome sculpture',
    },
    imagePosition: '50% 50%',
    cta: 'Explore System',
  },
  {
    id: 'bi-reporting',
    number: '08',
    name: 'BUSINESS INTELLIGENCE & REPORTING',
    cardTitle: 'Business Intelligence & Reporting',
    category: 'ANALYTICS & INSIGHT',
    aspectRatio: 0.84,
    introduction: 'Turn business data into useful reports, insights and timely decisions.',
    whatItSolves:
      'Replaces tedious manual spreadsheet assembly with automated scheduled syntheses, delivering real-time executive KPIs and anomaly alerts directly to team channels.',
    capabilities: [
      'Automated daily and weekly reports.',
      'Sales and revenue reporting.',
      'Marketing performance reporting.',
      'KPI tracking.',
      'Multi-source data consolidation.',
      'Scheduled dashboard updates.',
      'Threshold-based business alerts.',
    ],
    workflow: [
      'Business data collected',
      'Data processed',
      'Dashboard updated',
      'Report generated',
      'Management notified',
    ],
    technologies: ['Metabase', 'Looker', 'BigQuery', 'PostgreSQL', 'Automated Email/Slack Digests'],
    background: '#1D4ED8', // Hyper Ultramarine Blue
    textColor: '#FFFFFF',
    image: {
      src: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1000&q=80',
      alt: 'Luminous 3D geometric waves and futuristic blue chrome',
    },
    imagePosition: '50% 50%',
    cta: 'Explore System',
  },
];
