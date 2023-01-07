import { configureStore } from "@reduxjs/toolkit";
import boardSlice from "./feature/boardSlice";

export default configureStore({
  reducer: {
    board: boardSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
