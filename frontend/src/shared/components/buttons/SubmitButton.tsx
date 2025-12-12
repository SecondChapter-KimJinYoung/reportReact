import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { BUTTON_VARIANTS, BUTTON_SIZES, BUTTON_BASE } from './styles';
import type { ButtonVariant, ButtonSize } from './styles';

export interface SubmitButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  error?: string;
}

const SubmitButton = ({
  variant = 'black',
  size = 'md',
  children,
  isLoading = false,
  loadingText,
  error,
  className = '',
  disabled,
  ...props
}: SubmitButtonProps) => {
  const variantStyles = BUTTON_VARIANTS[variant];
  const sizeStyles = BUTTON_SIZES[size];

  const buttonClasses = [
    BUTTON_BASE,
    variantStyles.base,
    variantStyles.disabled,
    sizeStyles,
    'w-full',
    error ? 'ring-2 ring-red-500' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="space-y-1">
      <button
        type="submit"
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {loadingText || children}
          </>
        ) : (
          children
        )}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default SubmitButton;
