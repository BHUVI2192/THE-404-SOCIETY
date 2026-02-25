
export interface NavLink {
  label: string;
  path: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content?: string;
  image?: string;
  colSpan?: number;
  rowSpan?: number;
}

export interface EmailTemplate {
  id: string;
  trigger: 'applicationReceived' | 'applicationApproved' | 'applicationRejected' | 'applicationWaitlisted';
  subject: string;
  body: string;
  enabled: boolean;
  variables: string[];
  createdAt: number;
  updatedAt: number;
}

export interface EmailLog {
  id: string;
  recipientEmail: string;
  recipientName: string;
  trigger: string;
  subject: string;
  status: 'sent' | 'failed';
  timestamp: number;
  error?: string;
}


