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
  },
];
