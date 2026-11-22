// YouDecide Service Category 3: Analytics & Business Intelligence
// Complete offering definitions, lead research methodology, and structured metrics

export interface AnalyticsOffering {
  id: string;
  number: string;
  title: string;
  tagline: string;
  category: string;
  image: string;
  accentColor: string;
  overview: string;
  dataToMonitor: string[];
  keyMetrics: string[];
  dashboardArchitecture: {
    type: string;
    description: string;
    components: string[];
  };
  reportingAndIntegration: {
    pipeline: string;
    connectors: string[];
    cadence: string;
  };
  decisionMakers: {
    role: string;
    focus: string;
  }[];
  businessValue: string;
  observableIndicators: string[];
  leadEvaluation: {
    confirmedObservations: string[];
    potentialOpportunities: string[];
  };
}

export const ANALYTICS_OFFERINGS: AnalyticsOffering[] = [
  {
    id: 'bi-dashboards',
    number: '01',
    title: 'Business Intelligence Dashboards',
    tagline: 'Single-pane-of-glass executive dashboards unifying multi-department telemetry.',
    category: 'EXECUTIVE TELEMETRY',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80',
    accentColor: '#3B82F6',
    overview:
      'We design and deploy unified executive dashboards that synthesize cross-departmental operations, high-velocity revenue pipelines, and financial performance into responsive, real-time command centers.',
    dataToMonitor: [
      'Cross-departmental OKR & KPI progress',
      'Net revenue run rate and cash burn',
      'Operational throughput across physical/digital units',
      'Customer acquisition vs retention velocity',
      'Executive headcount and cost-to-serve metrics',
    ],
    keyMetrics: [
      'Operating Margin (%)',
      'Revenue Velocity ($/day)',
      'Customer Lifetime Value / CAC Ratio',
      'Blended Net Promoter Score (NPS)',
      'Departmental SLA Fulfillment Rate',
    ],
    dashboardArchitecture: {
      type: 'Executive Cockpit & Interactive Drilldown',
      description:
        'A tiered executive interface providing bird-eye organization health summaries with one-click drilldowns into department-level sub-dashboards.',
      components: [
        'Real-time Topline KPI Ribbon',
        'Cross-Functional Performance Heatmap',
        'Multi-Entity P&L Variance Waterfall',
        'Geographic Branch Health Matrix',
      ],
    },
    reportingAndIntegration: {
      pipeline: 'Direct bi-directional sync through modern data stacks with sub-minute cache warming.',
      connectors: ['Snowflake', 'BigQuery', 'PostgreSQL', 'Stripe', 'HubSpot', 'Salesforce'],
      cadence: 'Streaming real-time + daily automated morning summaries',
    },
    decisionMakers: [
      { role: 'Chief Executive Officer (CEO)', focus: 'Strategic trajectory and cross-unit alignment' },
      { role: 'Chief Operating Officer (COO)', focus: 'Bottleneck elimination and operational capacity' },
      { role: 'Chief Financial Officer (CFO)', focus: 'Margin defense and capital efficiency' },
    ],
    businessValue:
      'Replaces scattered spreadsheets and conflicting departmental numbers with a singular source of executive truth, cutting executive deliberation cycles by up to 60%.',
    observableIndicators: [
      'Multi-location operations across regions or global hubs',
      'Multiple independent business units or subsidiaries',
      'Fast expansion into new geographic territories',
      'Executive leadership managing 4+ disconnected core platforms',
    ],
    leadEvaluation: {
      confirmedObservations: [
        'Entity operates across 3+ regional offices or franchise hubs',
        'Distinct commercial and technical department hierarchies published',
        'Active recruitment for multiple regional managers',
      ],
      potentialOpportunities: [
        'High likelihood of fragmented spreadsheet reporting between divisions',
        'Opportunity to establish centralized Snowflake/BigQuery data warehouse',
        'Potential for cross-unit benchmarking and automated board-deck generation',
      ],
    },
  },
  {
    id: 'website-traffic-analytics',
    number: '02',
    title: 'Website & Traffic Analytics',
    tagline: 'Behavioral intelligence that pinpoints drop-offs and amplifies digital conversion.',
    category: 'DIGITAL PERFORMANCE',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1400&q=80',
    accentColor: '#06B6D4',
    overview:
      'Granular behavioral telemetry analyzing visitor origin, on-page scroll-depth, funnel leaks, and purchase velocity across desktop and mobile devices.',
    dataToMonitor: [
      'Campaign attribution across organic, paid, social, and direct channels',
      'Session journeys, rage clicks, and interaction drop-offs',
      'Device performance, Core Web Vitals, and load latencies',
      'Checkout funnel and micro-conversion transition rates',
    ],
    keyMetrics: [
      'Funnel Conversion Rate (%)',
      'Cart/Checkout Abandonment Rate (%)',
      'Cost Per Acquisition (CPA) by Source',
      'Average Time-to-Interact & Session Depth',
      'Largest Contentful Paint (LCP) & INP',
    ],
    dashboardArchitecture: {
      type: 'Behavioral Funnel & Acquisition Engine',
      description:
        'Visual multi-step funnel visualization combined with geographic heatmaps and granular UTM campaign performance matrices.',
      components: [
        'Multi-Touch Attribution Journey Sankey',
        'Real-time Traffic Ingestion Feed',
        'Device & Browser Conversion Discrepancy Matrix',
        'Landing Page Speed vs Abandonment Scatterplot',
      ],
    },
    reportingAndIntegration: {
      pipeline: 'Server-side tracking & event streaming via privacy-preserving telemetry ingestion.',
      connectors: ['Google Analytics 4', 'Mixpanel', 'PostHog', 'Segment', 'Shopify', 'Vercel Analytics'],
      cadence: 'Live streaming telemetry + weekly channel performance digests',
    },
    decisionMakers: [
      { role: 'Head of Growth / VP Marketing', focus: 'CAC reduction and high-intent attribution' },
      { role: 'Product Lead / UX Director', focus: 'Funnel friction points and interaction dead-ends' },
      { role: 'E-Commerce Director', focus: 'Cart conversion velocity and average order value (AOV)' },
    ],
    businessValue:
      'Exposes hidden leaks in digital user journeys, driving immediate 15–35% uplifts in inbound form submission and checkout conversion.',
    observableIndicators: [
      'High-traffic digital store or consumer web application',
      'Heavy investment in multi-channel paid acquisition (Meta, Google, TikTok)',
      'Frequent landing page launches or new product line releases',
      'Observable user interface complexity with multi-step flows',
    ],
    leadEvaluation: {
      confirmedObservations: [
        'Active paid ad tracking scripts running on public source code',
        'Extensive product catalog spanning dozens of categories',
        'Multiple localized domains (.in, .com, .co.uk)',
      ],
      potentialOpportunities: [
        'Conversion loss due to unoptimized mobile checkouts',
        'Absence of unified attribution across ad networks and CRM receipts',
        'Opportunity for real-time automated traffic anomaly alerts',
      ],
    },
  },
  {
    id: 'sales-crm-analytics',
    number: '03',
    title: 'Sales & CRM Analytics',
    tagline: 'Pipeline velocity, rep capacity, and deal close forecasting at enterprise scale.',
    category: 'REVENUE VELOCITY',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1400&q=80',
    accentColor: '#8B5CF6',
    overview:
      'Complete visibility into deal progression, representative activity velocity, win/loss post-mortems, and revenue projections from first touch to contract execution.',
    dataToMonitor: [
      'Inbound enquiry volume and stage transition duration',
      'Representative outbound volume, call connect rates, and demo bookings',
      'Discount variance and contract value deviations',
      'Customer churn signals and renewal timelines',
      'Stalled pipeline deals and competitive loss reasons',
    ],
    keyMetrics: [
      'Sales Velocity ($ per rep per month)',
      'Lead-to-Opportunity & Opportunity-to-Close Rate (%)',
      'Average Sales Cycle Length (Days)',
      'Quota Attainment Distribution',
      'Pipeline Slippage Rate (%)',
    ],
    dashboardArchitecture: {
      type: 'Revenue Operations War Room',
      description:
        'Kanban-style pipeline flow analytics linked to rep-by-rep leaderboard metrics, forecasting confidence bands, and deal aging alerts.',
      components: [
        'Visual Pipeline Stage Velocity Waterfall',
        'Rep Performance & Quota Pacing Leaderboard',
        'Deal Slippage Risk Radar',
        'Weighted Forecast vs Historic Actuals Trendline',
      ],
    },
    reportingAndIntegration: {
      pipeline: 'Automated CRM webhooks feeding real-time normalization models and pipeline state archives.',
      connectors: ['Salesforce', 'HubSpot', 'Pipedrive', 'Close', 'Gong', 'Apollo.io'],
      cadence: 'Daily morning pipeline briefings + real-time deal alerts',
    },
    decisionMakers: [
      { role: 'Chief Revenue Officer (CRO)', focus: 'Quarterly predictability and forecast accuracy' },
      { role: 'VP / Director of Sales', focus: 'Individual quota pacing and rep coaching insights' },
      { role: 'Head of RevOps', focus: 'Pipeline hygiene and CRM field governance' },
    ],
    businessValue:
      'Pinpoints exact bottlenecks in enterprise deal stages, shortens typical sales cycles by 20–30%, and eliminates end-of-quarter forecast surprises.',
    observableIndicators: [
      'Dedicated inside and field sales teams on LinkedIn',
      'Complex B2B consultation or custom quoting process',
      'High-volume inbound form enquiries on marketing pages',
      'Multiple regional sales branches or territory splits',
    ],
    leadEvaluation: {
      confirmedObservations: [
        'Company lists 15+ Account Executives and SDRs on public directory',
        'Tiered pricing packages with custom "Book Demo" gates',
        'Multiple customer testimonials across divergent enterprise sectors',
      ],
      potentialOpportunities: [
        'Manual pipeline inspection causing blindspots in revenue forecasting',
        'Lack of automated SLA tracking on inbound lead follow-up times',
        'Opportunity to implement automated win-rate decay alerts for aging deals',
      ],
    },
  },
  {
    id: 'marketing-analytics',
    number: '04',
    title: 'Marketing Analytics',
    tagline: 'End-to-end multi-touch attribution and real-time ROAS intelligence across all ad channels.',
    category: 'ACQUISITION & ATTRIBUTION',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1400&q=80',
    accentColor: '#EC4899',
    overview:
      'Unify performance marketing, organic SEO, content syndication, and influencer partnerships into an automated attribution matrix that proves incremental revenue return.',
    dataToMonitor: [
      'Ad spend and real-time impression/click delivery across all ad networks',
      'Blended Cost Per Acquisition (CPA) and Customer Acquisition Cost (CAC)',
      'Organic search rank stability, impressions, and click-through rates',
      'Content asset engagement and lead generation effectiveness',
      'Cross-device attribution paths and offline conversion imports',
    ],
    keyMetrics: [
      'Return on Ad Spend (ROAS)',
      'Marketing Efficiency Ratio (MER)',
      'Cost Per Qualified Lead (CPQL)',
      'Customer Payback Period (Months)',
      'Channel Incremental Contribution (%)',
    ],
    dashboardArchitecture: {
      type: 'Multi-Channel Spend & Attribution Command Center',
      description:
        'Live campaign ROAS monitors with budget pacing gauges, channel margin heatmaps, and automated creative fatigue indicators.',
      components: [
        'Unified Cross-Channel Spend & Revenue Tracker',
        'First-Touch / Last-Touch / Algorithmic Attribution Explorer',
        'Ad Creative Performance & Fatigue Matrix',
        'Daily Budget Pacing & Auto-Throttle Alerts',
      ],
    },
    reportingAndIntegration: {
      pipeline: 'Automated API connectors pulling ad costs hourly, matched against CRM closed-won revenue.',
      connectors: ['Meta Ads', 'Google Ads', 'LinkedIn Ads', 'TikTok Ads', 'Search Console', 'Semrush'],
      cadence: 'Hourly spend ingestion + weekly CMO performance scorecard',
    },
    decisionMakers: [
      { role: 'Chief Marketing Officer (CMO)', focus: 'Holistic budget allocation and channel profitability' },
      { role: 'VP of Performance Marketing', focus: 'Real-time ROAS optimization and creative scaling' },
      { role: 'Growth Marketing Manager', focus: 'Campaign-level bidding efficiency and CPA targets' },
    ],
    businessValue:
      'Eliminates wasted ad spend on saturated audiences and underperforming channels, typically improving overall portfolio ROAS by 25–40%.',
    observableIndicators: [
      'Concurrent ad campaigns running across Google, Meta, and LinkedIn',
      'Regular blog publishing, webinar hosting, or gated whitepaper assets',
      'Rapid seasonal inventory turnover requiring synchronized promotions',
      'Presence of multi-brand or multi-product digital marketing funnels',
    ],
    leadEvaluation: {
      confirmedObservations: [
        'Active Meta Ad Library campaigns running in multiple countries',
        'Extensive corporate blog and resource library with download forms',
        'Co-marketing and partnership co-branding initiatives',
      ],
      potentialOpportunities: [
        'Over-reliance on native platform attribution leading to double-counted conversions',
        'Lack of real-time spend alerts during budget pacing anomalies',
        'Opportunity to establish blended MER dashboards for executive leadership',
      ],
    },
  },
  {
    id: 'customer-analytics',
    number: '05',
    title: 'Customer Analytics',
    tagline: 'Cohort retention, churn prediction, and behavioral lifetime value modeling.',
    category: 'RETENTION & LIFETIME VALUE',
    image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1400&q=80',
    accentColor: '#10B981',
    overview:
      'Transform raw customer event data into predictive behavioral cohorts, identifying accounts at risk of churn before they cancel and unlocking expansion opportunities.',
    dataToMonitor: [
      'Account active usage frequency, feature adoption, and session recency',
      'Net Promoter Score (NPS), CSAT ratings, and support ticket sentiment',
      'Expansion, upgrade, and downgrade activity across subscription tiers',
      'Product telemetry markers signaling power users vs dormant profiles',
    ],
    keyMetrics: [
      'Net Revenue Retention (NRR %)',
      'Customer Churn & Gross Churn Rate (%)',
      'Customer Lifetime Value (LTV)',
      'Feature Adoption Velocity',
      'Expansion MRR Contribution (%)',
    ],
    dashboardArchitecture: {
      type: 'Customer Health & Cohort Retention Grid',
      description:
        'A comprehensive customer 360 interface displaying dynamic health scores, retention cohort heatmaps, and churn risk alarms.',
      components: [
        'Dynamic Account Health Score Matrix',
        'Monthly & Annual Retention Cohort Heatmap',
        'Expansion Opportunity Pipeline',
        'Support Ticket Sentiment & Escalation Tracker',
      ],
    },
    reportingAndIntegration: {
      pipeline: 'Customer event streaming aggregated into real-time health scoring models and CRM triggers.',
      connectors: ['Zendesk', 'Intercom', 'ChurnZero', 'Stripe Billing', 'Mixpanel', 'HubSpot'],
      cadence: 'Continuous health scoring + automated CSM churn warnings',
    },
    decisionMakers: [
      { role: 'Chief Customer Officer (CCO)', focus: 'Account retention and cross-sell expansion' },
      { role: 'Head of Customer Success', focus: 'Proactive intervention on at-risk accounts' },
      { role: 'Product Analytics Lead', focus: 'Feature usage correlations with long-term retention' },
    ],
    businessValue:
      'Lowers annual customer churn by 18–30% through early health score alerts, while systematically identifying high-propensity expansion accounts.',
    observableIndicators: [
      'Subscription, SaaS, or recurring retainer revenue model',
      'Large installed client base with diverse plan tiers',
      'Active customer success or support department recruitment',
      'Frequent product release cadence with user adoption challenges',
    ],
    leadEvaluation: {
      confirmedObservations: [
        'Self-serve customer portal with recurring billing options',
        'Public help center with extensive documentation and ticket submission',
        'Tiered enterprise pricing plans featuring dedicated account management',
      ],
      potentialOpportunities: [
        'Absence of unified customer health scoring across product usage and support tickets',
        'Reactive churn management instead of automated behavioral prediction',
        'Opportunity to automate renewal notices based on feature usage thresholds',
      ],
    },
  },
  {
    id: 'financial-analytics',
    number: '06',
    title: 'Financial Analytics',
    tagline: 'Real-time cash flow monitoring, variance analysis, and unit economics transparency.',
    category: 'CAPITAL EFFICIENCY',
    image: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=1400&q=80',
    accentColor: '#F59E0B',
    overview:
      'Institutional financial modeling connecting banking feeds, accounting general ledgers, and operational cost centers into real-time margin and liquidity dashboards.',
    dataToMonitor: [
      'Daily bank account balances, cash runway, and net burn rate',
      'Accounts receivable aging, DSO, and unpaid invoice balances',
      'Departmental budget vs actual expense variances',
      'Product/service line gross profit margins and COGS breakdown',
      'Tax liabilities and regional payroll obligations',
    ],
    keyMetrics: [
      'Gross Profit & EBITDA Margin (%)',
      'Days Sales Outstanding (DSO)',
      'Cash Runway (Months)',
      'Rule of 40 Index',
      'Customer Unit Economic Margin',
    ],
    dashboardArchitecture: {
      type: 'CFO Treasury & Unit Economics Suite',
      description:
        'Audited financial visualizations displaying cash runway runways, scenario modeling toggles, and real-time budget burn heatmaps.',
      components: [
        'Treasury Liquidity & 12-Month Runway Forecaster',
        'Budget vs Actual Variance Waterfall',
        'Accounts Receivable Aging Matrix',
        'Product Margin & Contribution Hierarchy',
      ],
    },
    reportingAndIntegration: {
      pipeline: 'Automated bank feed synchronization and general ledger reconciliation models.',
      connectors: ['QuickBooks', 'Xero', 'NetSuite', 'Stripe', 'Plaid', 'Brex', 'Ramp'],
      cadence: 'Daily cash reconciliation + monthly board reporting packs',
    },
    decisionMakers: [
      { role: 'Chief Financial Officer (CFO)', focus: 'Treasury management and margin preservation' },
      { role: 'VP of Finance / Controller', focus: 'Budget adherence and fast period-end closing' },
      { role: 'Managing Partner / Board of Directors', focus: 'Capital allocation and runway stability' },
    ],
    businessValue:
      'Gives executive leadership live financial clarity without waiting 3 weeks for month-end close, protecting working capital and maximizing cash runway.',
    observableIndicators: [
      'Multi-currency or international payment acceptance',
      'Substantial inventory, manufacturing, or payroll capital outlays',
      'High invoice volume with manual accounts receivable workflows',
      'Recent equity/debt financing round requiring formal board reporting',
    ],
    leadEvaluation: {
      confirmedObservations: [
        'Operations spanning multiple legal entities or currency corridors',
        'Public mentions of recent venture funding or rapid expansion targets',
        'Significant operational team scale across diverse job functions',
      ],
      potentialOpportunities: [
        'Lagging monthly close process creating delayed financial visibility',
        'Manual consolidation across banking portals and ERP ledgers',
        'Opportunity to automate real-time gross margin tracking by product line',
      ],
    },
  },
  {
    id: 'operational-analytics',
    number: '07',
    title: 'Operational Analytics',
    tagline: 'Supply chain transparency, workflow throughput, and capacity utilization telemetry.',
    category: 'PROCESS EXCELLENCE',
    image: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?auto=format&fit=crop&w=1400&q=80',
    accentColor: '#14B8A6',
    overview:
      'Deep operational process telemetry tracking fulfillment bottlenecks, physical or digital SLA performance, resource allocation, and vendor compliance.',
    dataToMonitor: [
      'Job ticket or order processing lead times across stages',
      'Facility or team capacity utilization and downtime logs',
      'Vendor delivery compliance, defect rates, and supply delays',
      'Inventory stockout risks and turnover rates across distribution hubs',
    ],
    keyMetrics: [
      'Order Fulfillment Cycle Time (Hours/Days)',
      'Overall Equipment Effectiveness (OEE %)',
      'On-Time In-Full (OTIF) Delivery Rate (%)',
      'Cost Per Unit Delivered ($)',
      'Employee Capacity Utilization (%)',
    ],
    dashboardArchitecture: {
      type: 'Operational Control Room & Process Heatmap',
      description:
        'Live throughput monitor with automated bottleneck detection alerts, geographic shipment trackers, and capacity threshold indicators.',
      components: [
        'Process Bottleneck Stage Sankey Diagram',
        'Hub Capacity Utilization & Load Balance Gauges',
        'Vendor SLA Compliance Scorecard',
        'Incident Resolution Duration Timeline',
      ],
    },
    reportingAndIntegration: {
      pipeline: 'IoT, warehouse management, and project management event ingestion streams.',
      connectors: ['Jira', 'Asana', 'Monday.com', 'SAP', 'Shopify Fulfillment', 'Custom APIs'],
      cadence: 'Near real-time process monitoring + shift performance reports',
    },
    decisionMakers: [
      { role: 'Chief Operating Officer (COO)', focus: 'Bottleneck elimination and operational efficiency' },
      { role: 'VP of Supply Chain / Logistics', focus: 'Inventory turnover and fulfillment SLA execution' },
      { role: 'Operations Director', focus: 'Staff utilization and error rate mitigation' },
    ],
    businessValue:
      'Uncovers hidden process logjams, reduces fulfillment delays by 35%, and optimizes team capacity to scale output without linearly increasing overhead.',
    observableIndicators: [
      'Physical logistics, distribution hubs, or multi-location facilities',
      'High-volume daily order processing or project fulfillment tasks',
      'Complex cross-functional handoffs between technical and operations teams',
      'Public customer reviews mentioning delivery or support response times',
    ],
    leadEvaluation: {
      confirmedObservations: [
        'Extensive distribution network with localized fulfillment promises',
        'Job listings for warehouse managers and logistics coordinators',
        'Multi-stage service workflow described on public corporate website',
      ],
      potentialOpportunities: [
        'Manual dispatch and tracking between dispatchers and drivers',
        'Absence of unified visibility into end-to-end order processing delays',
        'Opportunity for automated inventory re-order alerts based on run-rates',
      ],
    },
  },
  {
    id: 'automated-reporting',
    number: '08',
    title: 'Automated Reporting',
    tagline: 'Zero-touch daily, weekly, and monthly intelligence delivered to Slack, Email, and Notion.',
    category: 'REPORTING AUTOMATION',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1400&q=80',
    accentColor: '#6366F1',
    overview:
      'Eliminate manual data pulling and deck preparation. We construct automated intelligence pipelines that compile, validate, and broadcast beautiful executive briefings on exact schedules.',
    dataToMonitor: [
      'Daily revenue, cash collections, and lead generation totals',
      'Weekly marketing efficiency, ad spend pacing, and ROAS reports',
      'Monthly departmental budget utilization and headcounts',
      'Executive board decks with automated chart and variance generation',
    ],
    keyMetrics: [
      'Hours Saved on Manual Reporting (Monthly)',
      'Report Generation Latency (Minutes vs Days)',
      'Data Discrepancy & Error Rate (%)',
      'Stakeholder Delivery Rate & Readership',
      'Decision Time-to-Action (Hours)',
    ],
    dashboardArchitecture: {
      type: 'Automated Briefing & PDF/Slide Compiler Engine',
      description:
        'A dynamic template engine that pulls fresh database queries, generates interactive charts, and formats responsive PDFs and Slack digests.',
      components: [
        'Slack / Teams Automated Morning Intelligence Cards',
        'Executive PDF Board Deck Auto-Generator',
        'Automated Client Performance Portals',
        'Audit Log & Data Quality Verification Seal',
      ],
    },
    reportingAndIntegration: {
      pipeline: 'Scheduled serverless execution pipelines generating formatted output across channels.',
      connectors: ['Slack', 'Microsoft Teams', 'SendGrid', 'Notion', 'Google Slides', 'PostgreSQL'],
      cadence: 'Daily at 08:00 AM, weekly on Mondays, and monthly closing digests',
    },
    decisionMakers: [
      { role: 'Chief of Staff / VP Strategy', focus: 'Executive alignment without manual deck creation' },
      { role: 'Agency / Operations Director', focus: 'Automated client deliverables and SLA reports' },
      { role: 'BI / Data Team Lead', focus: 'Eliminating repetitive ad-hoc pull requests from leadership' },
    ],
    businessValue:
      'Saves 40+ hours of senior leadership and analyst time per month, while ensuring every decision-maker starts the day with identical, audited metrics.',
    observableIndicators: [
      'Teams visibly producing regular client reporting deliverables',
      'Heavy manual spreadsheet distribution internally',
      'Growing client roster creating reporting backlogs',
      'Executive meetings requiring hours of manual slide assembly',
    ],
    leadEvaluation: {
      confirmedObservations: [
        'Company serves 20+ B2B clients requiring performance accounts',
        'Public job posts for "Reporting Analyst" or "Operations Assistant"',
        'Complex multi-product reporting requirements across business lines',
      ],
      potentialOpportunities: [
        'High hours spent manually creating monthly client PDF reports',
        'Opportunity to deploy branded client intelligence dashboards',
        'Automated Slack alerts for critical business metrics reaching thresholds',
      ],
    },
  },
  {
    id: 'data-integration-analytics',
    number: '09',
    title: 'Data Integration & Analytics',
    tagline: 'Modern data stack pipelines connecting fragmented silos into a single source of truth.',
    category: 'DATA INFRASTRUCTURE',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80',
    accentColor: '#38BDF8',
    overview:
      'We bridge disconnected databases, third-party SaaS tools, payment gateways, and custom applications into robust data warehouses with clean schema definitions and dbt modeling.',
    dataToMonitor: [
      'Pipeline sync latency, connector health, and failure logs',
      'Schema changes, duplicate records, and data drift',
      'Query execution speeds, warehouse computing costs, and caching efficiency',
      'Historical record snapshots and audit compliance logs',
    ],
    keyMetrics: [
      'Pipeline Ingestion Latency (Minutes)',
      'Data Warehouse Query Execution Speed (Seconds)',
      'Sync Success & Data Freshness Rate (%)',
      'Warehouse Compute Efficiency ($/query)',
      'Data Test Coverage & Quality Passing Rate (%)',
    ],
    dashboardArchitecture: {
      type: 'Data Pipeline Lineage & Governance Control Deck',
      description:
        'A comprehensive data architecture visualizer tracking ingestion stages, transformation DAGs, and warehouse health telemetry.',
      components: [
        'End-to-End Pipeline Data Lineage Graph',
        'Connector Sync Status & Failure Alerts',
        'Warehouse Query Cost & Performance Monitor',
        'Data Freshness & SLA Telemetry Bar',
      ],
    },
    reportingAndIntegration: {
      pipeline: 'ELT architecture utilizing modern extractors, cloud warehouses, and dbt transformation layers.',
      connectors: ['Fivetran', 'Airbyte', 'dbt Core', 'Snowflake', 'BigQuery', 'PostgreSQL'],
      cadence: 'Sub-hourly incremental ingestion + full daily reconciliations',
    },
    decisionMakers: [
      { role: 'Chief Technology Officer (CTO)', focus: 'Data architectural resilience and security' },
      { role: 'Head of Data Engineering', focus: 'Pipeline reliability and automated schema migrations' },
      { role: 'VP of Analytics', focus: 'Data freshness and self-serve semantic layer readiness' },
    ],
    businessValue:
      'Demolishes departmental data silos, guarantees 99.9% data freshness, and provides an authoritative foundation for company-wide analytics and AI integrations.',
    observableIndicators: [
      'Usage of 6+ disconnected SaaS platforms across departments',
      'Data trapped in siloed legacy ERPs or custom operational databases',
      'Conflicting metric definitions between sales, marketing, and finance',
      'High growth companies hiring data engineers to solve reporting chaos',
    ],
    leadEvaluation: {
      confirmedObservations: [
        'Company uses modern SaaS stack (Salesforce + Stripe + Shopify + Zendesk)',
        'Public tech stack badges mentioning cloud architecture',
        'Job listings seeking data pipeline engineers',
      ],
      potentialOpportunities: [
        'Disconnect between sales CRM bookings and finance ledger collections',
        'Opportunity to establish centralized BigQuery or Snowflake warehouse',
        'Elimination of manual CSV exports and spreadsheet Frankenstein models',
      ],
    },
  },
  {
    id: 'advanced-analytics-forecasting',
    number: '10',
    title: 'Advanced Analytics & Forecasting',
    tagline: 'Predictive statistical models and machine learning for demand and revenue projection.',
    category: 'PREDICTIVE INTELLIGENCE',
    image: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=1400&q=80',
    accentColor: '#A855F7',
    overview:
      'Deploy advanced econometric and machine learning algorithms on historical company data to forecast future demand, optimize pricing elasticity, and proactively navigate market shifts.',
    dataToMonitor: [
      'Historical seasonal sales curves and cyclical trends',
      'Inventory depletion velocity and lead-time constraints',
      'Customer churn probability scores across active user base',
      'Pricing sensitivity and demand elasticity under various price tiers',
      'Macroeconomic leading indicators impacting target sector',
    ],
    keyMetrics: [
      'Forecast Accuracy (Mean Absolute Percentage Error - MAPE %)',
      'Demand Prediction Lead Time (Weeks Ahead)',
      'Model Confidence Interval (%)',
      'Revenue Lift from Dynamic Pricing (%)',
      'Stockout Reduction Rate (%)',
    ],
    dashboardArchitecture: {
      type: 'Predictive Scenario Modeling & Simulation Studio',
      description:
        'An interactive simulation cockpit allowing executives to slide key macroeconomic and operational variables to visualize future revenue projections.',
      components: [
        'Monte Carlo Scenario Simulation Range',
        'Demand & Inventory Depletion Forecasting Curve',
        'Predictive Churn Risk Quadrant',
        'Dynamic Pricing Elasticity Optimizer',
      ],
    },
    reportingAndIntegration: {
      pipeline: 'Automated Python/R ML model retraining pipelines executing against warehouse feature stores.',
      connectors: ['Python Scikit-Learn', 'Prophet', 'Snowflake ML', 'BigQuery ML', 'Tableau', 'Looker'],
      cadence: 'Weekly model re-calibration + on-demand executive scenario simulations',
    },
    decisionMakers: [
      { role: 'Chief Strategy Officer / CEO', focus: 'Long-term capital planning and strategic moats' },
      { role: 'VP of Demand Planning / Inventory', focus: 'Stockout elimination and working capital allocation' },
      { role: 'Head of Pricing & Monetization', focus: 'Elasticity testing and revenue optimization' },
    ],
    businessValue:
      'Transitions executive leadership from reactive rearview-mirror reporting to proactive future planning, improving inventory efficiency and forecast reliability by up to 45%.',
    observableIndicators: [
      'Strong seasonal demand spikes (holidays, academic cycles, fiscal quarters)',
      'Perishable or high-carrying-cost physical inventory lines',
      'Complex enterprise contract sizes with long decision gestation',
      'Market expansion initiatives requiring capital deployment projections',
    ],
    leadEvaluation: {
      confirmedObservations: [
        'Public marketing indicates strong holiday and seasonal promotional surges',
        'Extensive SKU catalog with diverse supplier lead times',
        'Rapid scaling across new regional demographics',
      ],
      potentialOpportunities: [
        'High vulnerability to stockouts or overstock during unexpected demand surges',
        'Opportunity to implement automated dynamic forecasting models',
        'Executive scenario modeling for upcoming financial rounds and expansions',
      ],
    },
  },
];
