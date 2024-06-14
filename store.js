import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./Redux/Reducers/index";
const store = configureStore({
    reducer: rootReducer
})

export default store;
