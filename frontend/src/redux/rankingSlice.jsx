import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    alltimeRanking: [],
}

export const rankingSlice = createSlice({
    name: "ranking",
    initialState,
    reducers: {
        importRanking: (state, action) => {
            state.alltimeRanking = action.payload;
        },
    },
});

export const { importRanking } = rankingSlice.actions;

export default rankingSlice.reducer;