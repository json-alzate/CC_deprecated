import { createFeatureSelector } from '@ngrx/store';


export interface UIState {
    loading: boolean;
    toast: string | null;
    typeToast: string;
    // piecesStyle: 'default' | 'fantasy';
    // boardStyle: string;
    // TODO: sonidos
}

export const getUIState = createFeatureSelector<UIState>('ui');
