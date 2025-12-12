/**
 * Button 컴포넌트 스타일 상수
 */

export const BUTTON_VARIANTS = {
  // 기본 스타일
  black: {
    base: 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700',
    disabled: 'disabled:bg-gray-400 disabled:cursor-not-allowed',
  },
  white: {
    base: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100',
    disabled: 'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
  },
  // 시멘틱 스타일
  danger: {
    base: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    disabled: 'disabled:bg-red-300 disabled:cursor-not-allowed',
  },
  success: {
    base: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800',
    disabled: 'disabled:bg-green-300 disabled:cursor-not-allowed',
  },
  warning: {
    base: 'bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700',
    disabled: 'disabled:bg-yellow-300 disabled:cursor-not-allowed',
  },
  // 유틸리티
  ghost: {
    base: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200',
    disabled: 'disabled:text-gray-300 disabled:cursor-not-allowed',
  },
  link: {
    base: 'hover:underline active:text-gray-700',
    disabled: 'disabled:text-gray-300 disabled:cursor-not-allowed disabled:no-underline',
  },
} as const;

export const BUTTON_SIZES = {
  xs: 'px-3 py-1.5 text-xs',
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-3 text-sm',
  lg: 'px-6 py-4 text-base',
} as const;

export const ICON_BUTTON_SIZES = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
} as const;

export const BUTTON_BASE =
  'inline-flex items-center justify-center font-semibold text-[0.875rem] capitalize overflow-hidden text-ellipsis whitespace-nowrap rounded-[5px] transition-all focus:outline-none focus-visible:outline-none active:outline-none cursor-pointer [-webkit-tap-highlight-color:transparent] antialiased';

export const ICON_BUTTON_BASE =
  'inline-flex items-center justify-center rounded-[5px] transition-colors focus:outline-none focus-visible:outline-none active:outline-none cursor-pointer [-webkit-tap-highlight-color:transparent]';

export const LINK_BUTTON_BASE =
  'inline-flex items-center font-medium transition-colors focus:outline-none focus-visible:outline-none active:outline-none focus:ring-0 focus:ring-offset-0 active:ring-0 active:ring-offset-0 cursor-pointer text-sm text-gray-500 select-none [-webkit-tap-highlight-color:transparent] [outline:none] [box-shadow:none]';

export const LOADING_SPINNER = `
  <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
`;

export type ButtonVariant = keyof typeof BUTTON_VARIANTS;
export type ButtonSize = keyof typeof BUTTON_SIZES;
export type IconButtonSize = keyof typeof ICON_BUTTON_SIZES;
