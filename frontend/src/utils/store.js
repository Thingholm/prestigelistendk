import { create } from "zustand";

export const initialFilterState = {
    activeStatus: "all",
    nation: "none",
    bornBefore: 2002,
    bornAfter: 1852,
    yearFilterRange: "range",
};

const useStore = create((set) => ({
    rankingAlltime: [],
    rankingFilter: initialFilterState,

    addRankingAlltime: (rankings) => set((state) => ({
        rankingAlltime: rankings,
    })),

    setRankingFilter: (newFilter) => set((state) => ({
        rankingFilter: newFilter,
    })),
}))

export default useStore;