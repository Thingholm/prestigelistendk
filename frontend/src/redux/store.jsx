import { configureStore } from "@reduxjs/toolkit";
import rankingReducer from "./rankingSlice";

export const store = configureStore({
    reducer: {
        alltimeRanking: rankingReducer,
    },
});