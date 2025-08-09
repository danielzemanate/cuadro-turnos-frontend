import { styled, keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const SpinnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const SpinnerElement = styled.div`
  width: 30px;
  height: 30px;
  border: 3px solid;
  border-color: #3b82f6 transparent #60a5fa transparent;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;
