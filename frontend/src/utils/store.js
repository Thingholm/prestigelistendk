import { create } from "zustand";

const useStore = create((set) => ({
    rankingAlltime: [],

    addRankingAlltime: (rankings) => set((state) => ({
        rankingAlltime: rankings,
    })),
}))

export default useStore;