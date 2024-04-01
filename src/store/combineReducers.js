import { configureStore, combineReducers } from "@reduxjs/toolkit";
import orderReducer from "./orderReducer";
import languageReduces from "./languageReducer";
import notReduceer from "./getNotifications"
export const rootReducers = combineReducers({
    order: orderReducer,
    language:languageReduces,
    notifies: notReduceer
});
