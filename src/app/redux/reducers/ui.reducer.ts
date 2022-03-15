import { createReducer, on, Action } from '@ngrx/store';

import {
  activeLoading,
  stopLoading,
  addMessageToast,
  clearMessageToast
} from '@redux/actions/ui.actions';

import { UIState } from '@redux/states/ui.state';

export const initialState: UIState = {
  loading: false,
  toast: null,
  typeToast: null
};

export const iuiReducer = createReducer(
  initialState,

  on(activeLoading, (state) => {
    return {
      ...state,
      loading: true
    };
  }),

  on(stopLoading, (state) => {
    return {
      ...state,
      loading: false
    };
  }),

  on(addMessageToast, (state, { message, status }) => {
    return {
      ...state,
      toast: message,
      typeToast: status
    };
  }),

  on(clearMessageToast, (state) => {
    return {
      ...state,
      toast: null,
      typeToast: null
    };
  })
);

export function uiReducer(state: UIState | undefined, action: Action) {
  return iuiReducer(state, action);
}
