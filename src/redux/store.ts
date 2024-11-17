import { configureStore } from "@reduxjs/toolkit";
import gameSlice from "./gamePlaySlice";


const store = configureStore({
    reducer: {
        game: gameSlice,
    },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;