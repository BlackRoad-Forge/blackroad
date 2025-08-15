import React from 'react';
import clsx from 'classnames';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button.  The variant controls background and
   * foreground colors derived from the design tokens.  Defaults to
   * `primary`.
   */
  variant?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'neutral'
    | 'info'
    | 'danger'
    | 'warning'
    | 'success'
    | 'outline';
  /**
   * Size of the button which controls padding and font size.  Uses
   * semantic names tied to our token definitions.
   */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * A minimal, accessible button component.  Variants map to the
 * semantic colors defined in the design tokens.  Sizes map to a
 * combination of padding and font-size.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}) => {
  const baseStyles =
    'inline-flex items-center justify-center border font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const variantStyles: Record<string, string> = {
    primary: 'bg-primary text-white border-transparent hover:bg-primary/90',
    secondary: 'bg-secondary text-white border-transparent hover:bg-secondary/90',
    accent: 'bg-accent text-white border-transparent hover:bg-accent/90',
    neutral: 'bg-neutral text-gray-900 border-transparent hover:bg-gray-200',
    info: 'bg-info text-white border-transparent hover:bg-info/90',
    danger: 'bg-danger text-white border-transparent hover:bg-danger/90',
    warning: 'bg-warning text-white border-transparent hover:bg-warning/90',
    success: 'bg-success text-white border-transparent hover:bg-success/90',
    outline:
      'bg-transparent border-current text-current hover:bg-gray-100 dark:hover:bg-gray-800',
  };

  return (
    <button
      className={clsx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
