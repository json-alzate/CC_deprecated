import { createFeatureSelector } from '@ngrx/store';


export interface UIState {
    loading: boolean;
    toast: string | null;
    typeToast: string;
}

export const getUIState = createFeatureSelector<UIState>('ui');