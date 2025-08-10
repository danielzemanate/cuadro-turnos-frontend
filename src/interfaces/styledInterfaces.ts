import { ReactNode } from 'react';
import { IChildrenProps } from './shared';

export interface IGridItemProps {
  column: number;
}

export interface IToggleContainer extends IChildrenProps {
  icon?: ReactNode;
  text: string;
}
export interface ICardProps {
  image: string;
  title: string;
  text?: string;
  onSeeMoreClick: () => void;
}
