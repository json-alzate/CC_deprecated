import { createSelector } from '@ngrx/store';

import { getAllUserPuzzles } from '@redux/selectors/user-puzzles.selectors';

import { getPuzzlesState, puzzlesAdapter } from '@redux/states/puzzles.state';

export const {
    selectAll: getAllPuzzles,
    selectTotal: getCountAllPuzzles,
    selectEntities: getPuzzlesEntities
} = puzzlesAdapter.getSelectors(getPuzzlesState);


/*
    Lógica del selector:
    se eligen los puzzles por resolver y los del usuario, y se elige que no este en los del usuario.
    Si el resultado es 0, se manda a llamar a mas puzzles hasta que devuelva uno, de esta manera se asegura de siempre devolver uno
*/
export const getPuzzlesToResolve = () => createSelector(
    getAllPuzzles,
    getAllUserPuzzles,
    (puzzles, userPuzzles) => puzzles.filter(el => !userPuzzles.find(obj => el.uid === obj.uidPuzzle))
);


/*
    Lógica del selector:
    recibe el elo inicial y final, y las fases, y devuelve todos los puzzles que cumplan con esos parámetros
    Se toman los puzzles según los parámetros de elo y fases.
    Si el resultado es 0, se manda a llamar a mas puzzles hasta que devuelva uno, de esta manera se asegura de siempre devolver uno
*/
export const getPuzzlesInfiniteToResolve = (eloStar: number, eloEnd: number, phases: string[]) => createSelector(
    getAllPuzzles,
    (puzzles) => {

        // se filtran los puzzles por elo y fases
        const filteredPuzzles = puzzles.filter(el => el.rating >= eloStar && el.rating <= eloEnd &&
            el.themes.some(r => phases.includes(r)));

        return filteredPuzzles;

    }
);
