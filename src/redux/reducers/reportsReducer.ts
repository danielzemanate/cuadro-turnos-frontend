import { constants } from "../../types/types";
import { IReportTypes, ISubReportTypes } from "../../interfaces/reports";

export interface IReportsState {
  reportTypes: IReportTypes[] | null;
  subReportTypes: ISubReportTypes[] | null;
}

const initialState: IReportsState = {
  reportTypes: null,
  subReportTypes: null,
};

export type IReportsActions =
  | {
      type: typeof constants.reportsSetTypes;
      payload: IReportTypes[];
    }
  | {
      type: typeof constants.reportsClearTypes;
    }
  | {
      type: typeof constants.reportsSetSubTypes;
      payload: ISubReportTypes[];
    }
  | {
      type: typeof constants.reportsClearSubTypes;
    };

export const reportsReducer = (
  state: IReportsState = initialState,
  action: IReportsActions,
): IReportsState => {
  switch (action.type) {
    case constants.reportsSetTypes:
      return { ...state, reportTypes: action.payload };

    case constants.reportsClearTypes:
      return { ...state, reportTypes: null };

    case constants.reportsSetSubTypes:
      return { ...state, subReportTypes: action.payload };

    case constants.reportsClearSubTypes:
      return { ...state, subReportTypes: null };

    default:
      return state;
  }
};
