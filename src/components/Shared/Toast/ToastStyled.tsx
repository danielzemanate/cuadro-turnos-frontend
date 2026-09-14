import { styled, keyframes, css } from "styled-components";
import { Breakpoints } from "../../../constants/breakpoints";

const slideInFromRight = keyframes`
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const CloseContainer = styled.div`
  cursor: pointer;
  svg {
    width: 15px;
    height: 15px;
  }
`;

const getVariantStyles = (variant: "success" | "warning" | "error") => {
  switch (variant) {
    case "error":
      return css`
        background: #fee2e2;
        color: #991b1b;
      `;
    case "warning":
      return css`
        background: #ffedd5;
        color: #9a3412;
      `;
    case "success":
      return css`
        background: #dcfce7;
        color: #166534;
      `;
    default:
      return css`
        background: ${(props) => props.theme.colors.white};
        color: #111827;
      `;
  }
};

export const ToastContainer = styled.div`
  position: fixed;
  top: 70px;
  right: 30px;
  z-index: 9999;
  width: 100%;
  max-width: 1034px;
  height: 82px;
  animation: ${slideInFromRight} 0.4s ease-out;
  @media (${Breakpoints.tabletMedium} >= width) {
    width: calc(100% - 40px);
    right: 10px;
    top: 10px;
  }
`;

export const ToastWrapper = styled.div<{
  variant: "success" | "warning" | "error";
}>`
  box-sizing: border-box;
  padding: 20px;
  font-family: ${(props) => props.theme.fonts.poppinsMedium};
  font-size: 16px;
  line-height: 24px;
  width: 100%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  text-align: center;
  ${({ variant }) => getVariantStyles(variant)}
`;
