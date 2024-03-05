import { getPlansHistoryState, plansHistoryStateAdapter } from '@redux/states/plans-history.state';


export const {
    selectAll: getAllPlansHistory,
    selectTotal: getCountAllPlansHistory,
    selectEntities: getPlansHistoryEntities
} = plansHistoryStateAdapter.getSelectors(getPlansHistoryState);
