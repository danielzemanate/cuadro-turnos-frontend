import 'styled-components';
import { Theme } from './interfaces/shared';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {
    _temp?: never;
  }
}
