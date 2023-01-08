import React, { useState } from "react";
import "./App.css";
import "antd/dist/reset.css";
import { Layout } from "antd";
import TopBar from "@/layout/TopBar";
import SideBar from "@/layout/SideBar";
import Overview from "@/views/Home";

const initBoardSize = { width: 1920, height: 1080 };

export type TState = {
  boardSize: {
    width: number;
    height: number;
  };
  setBoardSize: (t: { width: number; height: number }) => void;
  elements: any[];
  setElements: (t: any[]) => void;
  selectElementId: string;
  setSelectElementId: (t: any) => void;
};

function App() {
  const [boardSize, setBoardSize] = useState(initBoardSize);

  const [elements, setElements] = useState<any[]>([]);

  const [selectElementId, setSelectElementId] = useState("");

  const state: TState = {
    boardSize,
    setBoardSize,
    elements,
    setElements,
    selectElementId,
    setSelectElementId,
  };

  return (
    <div className="h-screen flex flex-col">
      <TopBar />
      <div className="flex-1 flex ">
        <SideBar {...state} />
        <div className="flex-1">
          <Overview {...state} />
        </div>
      </div>
    </div>
  );
}

export default App;
