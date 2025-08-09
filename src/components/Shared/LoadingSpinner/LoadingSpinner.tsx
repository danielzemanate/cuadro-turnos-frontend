import { FC } from 'react';
import { SpinnerElement, SpinnerWrapper } from './LoadingSpinnerStyled';

const LoadingSpinner: FC = () => (
  <SpinnerWrapper>
    <SpinnerElement />
  </SpinnerWrapper>
);

export default LoadingSpinner;
