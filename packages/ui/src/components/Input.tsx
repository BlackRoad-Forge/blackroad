import React from 'react';
import clsx from 'classnames';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Visual variant of the input which controls border and focus ring.
   */
  variant?: 'default' | 'danger' | 'success' | 'warning';
  /**
   * Optional label for the input.  When provided the label is bound
   * automatically to the input via the `htmlFor` attribute.
   */
  label?: string;
}

/**
 * A basic text input with semantic variants and focus styling.
 */
export const Input: React.FC<InputProps> = ({
  variant = 'default',
  label,
  id,
  className,
  ...rest
}) => {
  const baseStyles =
    'block w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  const variantStyles: Record<string, string> = {
    default:
      'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-primary',
    danger:
      'border border-danger bg-white text-gray-900 placeholder-gray-400 focus:border-danger focus:ring-danger',
    success:
      'border border-success bg-white text-gray-900 placeholder-gray-400 focus:border-success focus:ring-success',
    warning:
      'border border-warning bg-white text-gray-900 placeholder-gray-400 focus:border-warning focus:ring-warning',
  };

  const inputId = id || (label ? `input-${Math.random().toString(36).slice(2)}` : undefined);

  return (
    <div className={clsx('space-y-1', className)}>
      {label && inputId && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input id={inputId} className={clsx(baseStyles, variantStyles[variant])} {...rest} />
    </div>
  );
};

export default Input;
