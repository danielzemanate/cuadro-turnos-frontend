import { ReactNode } from 'react';

export interface IChildrenProps {
  children: ReactNode;
}

export interface Theme {
  colors: {
    blueDark200: string;
    blueDark100: string;
    blueDark90: string;
    blueDark80: string;
    blueDark70: string;
    blueDark60: string;
    blueDark50: string;
    blueDark40: string;
    blueDark30: string;
    blueDark20: string;
    blueDark10: string;
    blueDark05: string;
    blueDark00: string;
    blueLight100: string;
    blueLight90: string;
    blueLight80: string;
    blueLight70: string;
    blueLight60: string;
    blueLight50: string;
    blueLight40: string;
    blueLight30: string;
    blueLight20: string;
    green100: string;
    green90: string;
    green80: string;
    green70: string;
    purple100: string;
    purple90: string;
    purple80: string;
    purple70: string;
    purple60: string;
    orange100: string;
    orange90: string;
    gray100: string;
    gray90: string;
    gray80: string;
    gray70: string;
    gray60: string;
    gray50: string;
    red100: string;
    red90: string;
    white: string;
    black: string;
    error: string;
    success: string;
    warning: string;
  };
  fonts: {
    poppinsRegular: string;
    poppinsMedium: string;
    poppinsSemiBold: string;
    poppinsBold: string;
  };
  //   logo: {
  //     alternativeLogo: string;
  //     primaryLogo: string;
  //     secondaryLogo: string;
  //     mobileLogo: string;
  //   };
}

export interface IPrivateRoute extends IChildrenProps {
  isAllowed: boolean;
}
