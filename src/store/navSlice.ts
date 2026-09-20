import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { NavState } from "@data-types/nav/index";

const initialState: NavState = {
  stack: ["home"],
};

const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    pushRoute(state, action: PayloadAction<string>) {
      const top = state.stack[state.stack.length - 1];
      if (action.payload === top) return;
      // If already in history, pop back to it — no cycles
      const existingIndex = state.stack.lastIndexOf(action.payload);
      if (existingIndex !== -1) {
        state.stack = state.stack.slice(0, existingIndex + 1);
      } else {
        state.stack.push(action.payload);
        if (state.stack.length > 50) state.stack.shift();
      }
    },
    popRoute(state) {
      if (state.stack.length > 1) state.stack.pop();
    },
  },
});

export const { pushRoute, popRoute } = navSlice.actions;
export default navSlice.reducer;
