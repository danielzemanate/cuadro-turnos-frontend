import { combineReducers, Reducer } from 'redux';

export type AppState = Record<string, never>;

const rootReducer: Reducer<AppState> = combineReducers({});

export default rootReducer;
