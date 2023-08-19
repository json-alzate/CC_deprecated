import { createReducer, on, Action } from '@ngrx/store';

import {
  activeLoading,
  stopLoading,
  addMessageToast,
  clearMessageToast,
  setPiecesStyle
} from '@redux/actions/ui.actions';

import { UIState } from '@redux/states/ui.state';

export const initialState: UIState = {
  loading: false,
  toast: null,
  typeToast: null,
  piecesStyle: 'fantasy'
};

export const iuiReducer = createReducer(
  initialState,

  on(activeLoading, (state) => ({
    ...state,
    loading: true
  })),

  on(stopLoading, (state) => ({
    ...state,
    loading: false
  })),

  on(addMessageToast, (state, { message, status }) => ({
    ...state,
    toast: message,
    typeToast: status
  })),

  on(clearMessageToast, (state) => ({
    ...state,
    toast: null,
    typeToast: null
  })),

  on(setPiecesStyle, (state, { piecesStyle }) => ({
    ...state,
    piecesStyle
  }))
);

export function uiReducer(state: UIState | undefined, action: Action) {
  return iuiReducer(state, action);
}
