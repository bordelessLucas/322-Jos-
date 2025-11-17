import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { FiLoader } from 'react-icons/fi';
import './Button.css';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  loadingText?: ReactNode;
  iconsOnly?: boolean;
}

const getClassNames = ({
  variant,
  size,
  fullWidth,
  isLoading,
  disabled,
  iconsOnly,
}: {
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  iconsOnly?: boolean;
}) => {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--block' : '',
    isLoading ? 'btn--loading' : '',
    disabled ? 'btn--disabled' : '',
    iconsOnly ? 'btn--icon-only' : '',
  ].filter(Boolean);

  return classes.join(' ');
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    fullWidth,
    leftIcon,
    rightIcon,
    isLoading,
    loadingText,
    disabled,
    iconsOnly,
    children,
    className,
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || isLoading;
  const composedClassName = [getClassNames({ variant, size, fullWidth, isLoading, disabled: isDisabled, iconsOnly }), className]
    .filter(Boolean)
    .join(' ');

  return (
    <button ref={ref} className={composedClassName} disabled={isDisabled} aria-busy={isLoading} {...rest}>
      {isLoading ? (
        <span className="btn__spinner" aria-hidden="true">
          <FiLoader />
        </span>
      ) : (
        leftIcon && <span className="btn__icon btn__icon--left">{leftIcon}</span>
      )}

      {isLoading ? (
        <span className="btn__content">{loadingText ?? children}</span>
      ) : (
        !iconsOnly && <span className="btn__content">{children}</span>
      )}

      {!isLoading && rightIcon && <span className="btn__icon btn__icon--right">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
