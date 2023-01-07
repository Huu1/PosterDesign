import { createSlice } from "@reduxjs/toolkit";

export type BoardSizeType = {
  width: number;
  height: number;
};

interface IState {
  // 画板尺寸
  boardSize: BoardSizeType;
  boardScale: number;
}

const initialState: IState = {
  boardSize: {
    width: 1920,
    height: 1080,
  },
  boardScale: 1,
};

const brushSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoardSize(state: { boardSize: any }, action: { payload: any }) {
      state.boardSize = action.payload;
    },
    setBoardScale(state: { boardSize: any }, action: { payload: any }) {
      state.boardSize = action.payload;
    },
  },
});

export const { setBoardSize } = brushSlice.actions;

export default brushSlice.reducer;

// 获取画板数据
export const getBoardSetting = (state: any): IState => state.board;
