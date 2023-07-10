import { create } from "zustand";

export const initialFilterState = {
    activeStatus: "all",
    nation: ["none"],
    bornBefore: 2004,
    bornAfter: 1852,
    yearFilterRange: "range",
};

const useStore = create((set) => ({
    rankingAlltime: [],
    rankingFilter: initialFilterState,
    latestResults: [],
    pointSystem: [],

    addRankingAlltime: (rankings) => set((state) => ({
        rankingAlltime: rankings,
    })),

    setRankingFilter: (newFilter) => set((state) => ({
        rankingFilter: newFilter,
    })),

    addLatestResults: (results) => set((state) => ({
        latestResults: results,
    })),

    addPointSystem: (system) => set((state) => ({
        pointSystem: system,
    })),
}))

export default useStore;