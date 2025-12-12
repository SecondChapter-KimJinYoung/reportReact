import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { cloneElement, isValidElement } from 'react';
import { BUTTON_VARIANTS, BUTTON_SIZES, BUTTON_BASE } from './styles';
import type { ButtonVariant, ButtonSize } from './styles';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

// 아이콘 크기 매핑 (버튼 size에 따라 - Material-UI fontSize 기준)
const ICON_SIZE_MAP: Record<ButtonSize, 'small' | 'medium' | 'inherit'> = {
  xs: 'small',
  sm: 'small',
  md: 'medium',
  lg: 'medium',
};

// 아이콘을 감싸서 크기를 자동 조절하는 헬퍼
const IconWrapper = ({ icon, size, className = '' }: { icon: ReactNode; size: ButtonSize; className?: string }) => {
  const fontSize = ICON_SIZE_MAP[size];
  
  // Material-UI 아이콘인 경우 fontSize prop으로 크기 조절
  if (isValidElement(icon)) {
    const props = icon.props as { fontSize?: string };
    if (props.fontSize === undefined) {
      const iconWithSize = cloneElement(icon, { fontSize, sx: { fontSize: 'inherit' } } as any);
      return (
        <span className={`mr-2 inline-flex items-center ${className}`}>
          {iconWithSize}
        </span>
      );
    }
  }
  
  // 일반 아이콘의 경우 그대로 렌더링
  return (
    <span className={`mr-2 inline-flex items-center ${className}`}>
      {icon}
    </span>
  );
};

const Button = ({
  variant = 'black',
  size = 'md',
  children,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const variantStyles = BUTTON_VARIANTS[variant];
  const sizeStyles = BUTTON_SIZES[size];

  const buttonClasses = [
    BUTTON_BASE,
    variantStyles.base,
    variantStyles.disabled,
    sizeStyles,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const buttonStyle: CSSProperties = {
    fontFamily: 'Pretendard',
    lineHeight: '1.57143',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    margin: 0,
    ...props.style,
  };

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      style={buttonStyle}
      {...props}
    >
      {isLoading ? (
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
      ) : leftIcon ? (
        <IconWrapper icon={leftIcon} size={size} />
      ) : null}
      {children}
      {rightIcon && !isLoading && (
        <IconWrapper icon={rightIcon} size={size} className="ml-2" />
      )}
    </button>
  );
};

export default Button;
