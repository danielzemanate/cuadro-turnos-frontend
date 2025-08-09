import { createGlobalStyle, styled } from 'styled-components';
import { Form } from 'formik';
import PoppinsRegular from '../assets/fonts/Poppins-Regular.ttf';
import PoppinsMedium from '../assets/fonts/Poppins-Medium.ttf';
import PoppinsSemiBold from '../assets/fonts/Poppins-SemiBold.ttf';
import PoppinsBold from '../assets/fonts/Poppins-Bold.ttf';
import { IGridItemProps } from '../interfaces/styledInterfaces';
import { BreakpointsUx } from '../constants/breakpoints';

interface ITextButtonProps {
  column?: number;
}

export const GlobalContainerStyled = createGlobalStyle`
  @font-face {
    font-family: Poppins-Regular;
    src: url(${PoppinsRegular}) format('truetype');
    font-display: swap;
  }
  @font-face {
    font-family: Poppins-Medium;
    src: url(${PoppinsMedium}) format('truetype');
    font-display: swap;
  }
  @font-face {
    font-family: Poppins-SemiBold;
    src: url(${PoppinsSemiBold}) format('truetype');
    font-display: swap;
  }
  @font-face {
    font-family: Poppins-Bold;
    src: url(${PoppinsBold}) format('truetype');
    font-display: swap;
  }
  html, body {
    font-family: 'Poppins-Medium', Arial, sans-serif;
    margin: 0;
    padding: 0;
    visibility: visible;
  }
`;

export const GridItem = styled.div<IGridItemProps>`
  grid-column: span ${(props: IGridItemProps) => props.column};
`;

export const GridParent = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

export const FlexBox = styled.div`
  display: flex;
`;

export const CircleButton = styled.div`
  background: ${(props) => props.theme.colors.blueLight80};
  width: 40px;
  height: 40px;
  line-height: 40px;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  cursor: pointer;
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const Title = styled.h1``;

export const SubTitle = styled.h3``;

export const TextBox = styled.div``;

export const Text = styled.p`
  text-align: center;
  font-weight: bold;
  color: ${(props) => props.theme.colors.white};
`;

export const StyledForm = styled(Form)`
  padding: 0 30px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 10px;
`;

export const Container = styled.div`
  background: ${(props) => props.theme.colors.blueDark100};
  padding: 20px;
`;

export const IFrame = styled.iframe`
  width: 100%;
  height: 100%;
`;

export const List = styled.ul``;

export const ListItem = styled.li``;

export const Box = styled.div`
  padding: 20px;
`;

export const FlexBoxImgContainer = styled(FlexBox)``;

export const TabWithIcon = styled(GridParent)`
  width: 100%;
  height: 100%;
  align-items: center;
  svg {
    width: 30px;
    height: 30px;
    path {
      fill: ${(props) => props.theme.colors.white};
    }
  }
`;

export const MobileContainer = styled.div`
  background: ${(props) => props.theme.colors.blueDark100};
`;

export const Disclaimer = styled.div`
  border-left: 10px solid ${(props) => props.theme.colors.blueLight20};
  border-radius: 10px;
  background: ${(props) => props.theme.colors.blueDark40};
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.poppinsMedium};
  font-size: 14px;
  padding: 15px;
  display: flex;
  align-items: center;
  ${Text} {
    margin: 0px;
    color: ${(props) => props.theme.colors.white} !important;
  }
`;

export const LinkRef = styled.a``;

export const PointSaleIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0px;
  cursor: pointer;
  font-weight: bold;
  white-space: break-spaces;
  font-size: 14px;
  color: ${(props) => props.theme.colors.blueDark40};
  font-family: ${(props) => props.theme.fonts.poppinsBold};
  svg {
    path {
      fill: ${(props) => props.theme.colors.blueDark40};
    }
  }
  &:hover {
    text-decoration: underline;
  }
`;

export const Highlight = styled.span`
  color: ${(props) => props.theme.colors.white};
`;

export const FloatMenuContainer = styled.div`
  position: absolute;
  top: 65px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  width: auto;
  right: auto;
  padding: 10px 0px;
  border-radius: 10px;
  background: ${(props) => props.theme.colors.blueDark05};
  @media screen and (width <= ${BreakpointsUx.tabletLarge}) {
    margin: 0px;
    border-radius: 10px;
  }
`;

export const FloatMenuWrapper = styled.div`
  width: 100%;
  background: ${(props) => props.theme.colors.blueDark05};
  text-align: left;
  &:after {
    position: absolute;
    content: '';
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 20px solid ${(props) => props.theme.colors.blueDark05};
    z-index: 1;
    right: 10px;
    top: -15px;
  }
`;

export const VerticalDivider = styled.div`
  width: 1px;
  height: 50px;
  background: ${(props) => props.theme.colors.blueDark10};
`;

export const TextButton = styled.button<ITextButtonProps>`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.white};
  font-family: ${(props) => props.theme.fonts.poppinsRegular};
  cursor: pointer;
  padding: 0;
  font-size: 1.2em;
  font-weight: bold;
  text-decoration: none;
  grid-column: span ${(props) => props.column || 1};

  &:hover {
    text-decoration: none;
  }

  &:focus {
    outline: none;
  }
`;

export const StyledParagraph = styled.p`
  color: ${(props) => props.theme.colors.gray100};
  font-size: 1.2em;
  font-weight: bold;
  margin: 0;
  font-size: 12px;
`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  font-weight: bold;
  margin: 0;
`;

export const ImgContainer = styled.div``;

export const Divider = styled.div`
  width: 100%;
  height: 2px;
  background-color: ${(props) => props.theme.colors.gray100};
  opacity: 0.2;
`;

export const FlexForm = styled(Form)`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

export const HalfWidthInput = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  box-sizing: border-box;
  gap: 5px;
  & > * {
    flex: 1;
  }
`;
