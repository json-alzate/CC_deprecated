import { createSelector } from '@ngrx/store';

import { getUIState } from '@redux/states/ui.state';
import { UIState } from '@redux/states/ui.state';


export const getLoading = createSelector(
  getUIState,
  uiState => uiState.loading
);


export const getToast = createSelector(
  getUIState,
  (state: UIState) => {
    return {
      message: state.toast,
      status: state.typeToast
    };
  }
);
