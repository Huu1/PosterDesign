import Konva from "konva";
import { useState } from "react";
import Board from "./Board";
import Toolbar from "./Toolbar";

const initBoardSize = { width: 1920, height: 1080 };

const Index = () => {
  const [boardSize, setBoardSize] = useState(initBoardSize);

  const [elements,setElements]=useState<any>([])

  return (
    <div className="flex flex-col h-full">
      <Toolbar />
      <Board boardSize={boardSize} elements={elements} setElements={setElements} setBoardSize={setBoardSize} />
    </div>
  );
};

export default Index;
