import { ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'complementary' | 'dark';

export interface ButtonProps {
  text: string;
  variant?: ButtonVariant;
  icon?: ReactNode;
  hasSpecial?: boolean;
  iconPosition?: 'left' | 'right';
  onClick?: VoidFunction;
  disabled?: boolean;
  type?: 'button' | 'reset' | 'submit';
  loading?: boolean;
}
