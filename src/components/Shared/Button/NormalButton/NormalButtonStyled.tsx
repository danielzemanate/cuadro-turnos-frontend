import { styled, css } from 'styled-components';
import { ButtonVariant } from '../../../../interfaces/buttons';
import { BreakpointsUx } from '../../../../constants/breakpoints';

const buttonStyles = {
  primary: css`
    background: ${(props) => props.theme.colors.green90};
    color: ${(props) => props.theme.colors.white};
    transition: background 0.3s ease;
    &:hover {
      background: ${(props) => props.theme.colors.green100};
    }
  `,
  secondary: css`
    background: #d6e5ff40;
    color: ${(props) => props.theme.colors.white};
    transition:
      background 0.3s ease,
      border 0.3s ease;
    &:hover {
      background: ${(props) => props.theme.colors.blueLight100};
    }
  `,
  tertiary: css`
    background: ${(props) => props.theme.colors.blueDark00};
    color: ${(props) => props.theme.colors.white};
    border: 1px solid ${(props) => props.theme.colors.white};
    transition: background 0.3s ease;
    &:hover {
      background: ${(props) => props.theme.colors.blueDark40};
    }
  `,
  complementary: css`
    background: ${(props) => props.theme.colors.blueLight80};
    color: ${(props) => props.theme.colors.white};
    transition: background 0.3s ease;
    &:hover {
      background: ${(props) => props.theme.colors.blueLight50};
    }
  `,
  dark: css`
    background: ${(props) => props.theme.colors.gray100};
    color: ${(props) => props.theme.colors.white};
    transition: background 0.3s ease;
    &:hover {
      background: ${(props) => props.theme.colors.gray90};
    }
  `,
};

export const StyledButton = styled.button<{ variant: ButtonVariant; hasSpecial?: boolean; disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  font-size: 13px;
  border: none;
  border-radius: 10px;
  font-family: ${(props) => props.theme.fonts.poppinsMedium};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? '0.6' : '1')};
  ${({ variant }) => buttonStyles[variant]}
  @media screen and (width < ${BreakpointsUx.desktopSmall}) {
    padding: 8px;
    border-radius: 6px;
    font-size: 12px;
  }
`;

export const IconWrapper = styled.span<{ iconPosition: 'left' | 'right' }>`
  display: flex;
  align-items: center;
  margin-left: ${({ iconPosition }) => (iconPosition === 'right' ? '8px' : '0')};
  margin-right: ${({ iconPosition }) => (iconPosition === 'left' ? '8px' : '0')};
`;
