// Admin Utilities

/**
 * Format date to readable string
 */
export const formatDate = (timestamp: number | undefined): string => {
  if (!timestamp) return '-';
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date with time
 */
export const formatDateTime = (timestamp: number | undefined): string => {
  if (!timestamp) return '-';
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get status color classes
 */
export const getStatusColor = (
  status: string
): { bg: string; text: string; border: string } => {
  const colors: Record<
    string,
    { bg: string; text: string; border: string }
  > = {
    open: {
      bg: 'bg-green-600/20',
      text: 'text-green-400',
      border: 'border-green-600/30',
    },
    locked: {
      bg: 'bg-red-600/20',
      text: 'text-red-400',
      border: 'border-red-600/30',
    },
    pending: {
      bg: 'bg-yellow-600/20',
      text: 'text-yellow-400',
      border: 'border-yellow-600/30',
    },
    approved: {
      bg: 'bg-green-600/20',
      text: 'text-green-400',
      border: 'border-green-600/30',
    },
    rejected: {
      bg: 'bg-red-600/20',
      text: 'text-red-400',
      border: 'border-red-600/30',
    },
  };
  return colors[status] || colors.pending;
};

/**
 * Export data to CSV
 */
export const exportToCSV = (
  data: any[],
  columns: { key: string; header: string }[],
  filename: string
): void => {
  if (data.length === 0) return;

  const headers = columns.map((col) => col.header);
  const rows = data.map((item) =>
    columns.map((col) => {
      const value = col.key.split('.').reduce((obj, key) => obj?.[key], item);
      return `"${value || '-'}"`;
    })
  );

  const csv = [headers, ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
