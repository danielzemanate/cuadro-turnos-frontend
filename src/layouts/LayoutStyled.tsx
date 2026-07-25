import { css, styled } from "styled-components";
import { BreakpointsUx } from "../constants/breakpoints";

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: ${(props) => props.theme.colors.white};
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
`;

export const Content = styled.main<{ header?: boolean }>`
  flex: 1;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  background: ${(props) => props.theme.colors.white};
  ${(props) =>
    props.header &&
    css`
      margin-top: 110px;
      @media screen and (width < ${BreakpointsUx.tabletSmall}) {
        margin-top: 113px;
      }
    `}
`;
