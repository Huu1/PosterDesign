import { useState } from "react";
import { TState } from "@/App";
import Board from "./Board";
import Toolbar from "./Toolbar";

const Index = (
  props: JSX.IntrinsicAttributes & TState
) => {
  return (
    <div className="flex flex-col h-full">
      <Toolbar />
      <Board {...props} />
    </div>
  );
};

export default Index;
