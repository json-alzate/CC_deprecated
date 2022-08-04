import { createAction, props } from '@ngrx/store';

export const activeLoading = createAction(
    '[UI] activeLoading'
);

export const stopLoading = createAction(
    '[UI] stopLoading'
);

export const addMessageToast = createAction(
    '[UI] addMessageToast',
    props<{ message: string; status: string }>()
);

export const clearMessageToast = createAction(
    '[UI] clearMessageToast'
);

