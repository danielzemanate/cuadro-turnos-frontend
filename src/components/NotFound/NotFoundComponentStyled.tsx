import { styled } from 'styled-components';
import { Title, Text } from '../GlobalStyled';
import { StyledButton } from '../Shared/Button/NormalButton/NormalButtonStyled';

export const NotFoundContainer = styled.div`
  padding: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${Title} {
    color: ${(props) => props.theme.colors.white};
    font-family: ${(props) => props.theme.fonts.poppinsRegular};
    font-size: 40px;
    font-weight: 700;
    line-height: 35px;
    margin: 0px;
  }
  ${Text} {
    color: ${(props) => props.theme.colors.white};
    font-family: ${(props) => props.theme.fonts.poppinsRegular};
    font-size: 25px;
    font-weight: 400;
    line-height: 30px;
    text-align: center;
    padding: 15px;
  }
  ${StyledButton} {
    width: auto;
  }
`;
