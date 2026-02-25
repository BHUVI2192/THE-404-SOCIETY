import React from 'react';

interface FormInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'number' | 'url' | 'tel';
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

interface FormTextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  rows?: number;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  error,
  disabled,
}) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full bg-white border rounded-lg px-4 py-2 text-black placeholder-gray-400 focus:outline-none transition ${
          error
            ? 'border-red-500 focus:border-red-600'
            : 'border-gray-300 focus:border-cyan-500'
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
  disabled,
}) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full bg-white border rounded-lg px-4 py-2 text-black focus:outline-none transition ${
          error
            ? 'border-red-500 focus:border-red-600'
            : 'border-gray-300 focus:border-cyan-500'
        }`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export const FormTextArea: React.FC<FormTextAreaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
  disabled,
  rows = 4,
}) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`w-full bg-white border rounded-lg px-4 py-2 text-black placeholder-gray-400 focus:outline-none transition resize-none ${
          error
            ? 'border-red-500 focus:border-red-600'
            : 'border-gray-300 focus:border-cyan-500'
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

/**
 * Admin Modal Wrapper
 */
interface AdminModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    loading?: boolean;
  }[];
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  actions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-black">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-black transition"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">{children}</div>

        {actions && (
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                disabled={action.loading}
                className={`px-4 py-2 rounded-lg transition disabled:opacity-50 text-white ${
                  action.variant === 'danger'
                    ? 'bg-red-600 hover:bg-red-700'
                    : action.variant === 'secondary'
                      ? 'bg-gray-200 hover:bg-gray-300 text-black'
                      : 'bg-cyan-600 hover:bg-cyan-700'
                }`}
              >
                {action.loading ? 'Loading...' : action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Status Badge Component
 */
interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
}) => {
  const getColor = () => {
    switch (status) {
      case 'open':
        return 'bg-green-600/20 text-green-400 border-green-600/30';
      case 'locked':
        return 'bg-red-600/20 text-red-400 border-red-600/30';
      case 'approved':
        return 'bg-green-600/20 text-green-400 border-green-600/30';
      case 'rejected':
        return 'bg-red-600/20 text-red-400 border-red-600/30';
      case 'pending':
      default:
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30';
    }
  };

  return (
    <span
      className={`border px-3 py-1 rounded-full text-xs font-medium ${getColor()} ${className}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

/**
 * Loading Spinner
 */
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'md',
}) => {
  const sizeClass = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }[size];

  return (
    <div className={`${sizeClass} border-4 border-gray-300 border-t-cyan-500 rounded-full animate-spin`} />
  );
};

/**
 * Empty State
 */
interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
}) => {
  return (
    <div className="p-8 text-center text-gray-500">
      <p className="font-medium text-base">{title}</p>
      {description && <p className="text-sm mt-1">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 text-cyan-600 hover:text-cyan-700 transition"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
