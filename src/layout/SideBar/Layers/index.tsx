import React from "react";
import { List, arrayMove } from "react-movable";

import "./index.css";
import IconFont from "@/components/Iconfont";
import { TState } from "@/App";

const iconStyle = { color: "rgb(171, 179, 191)", fontSize: "16px" };

const Layers = (props: TState & { style: React.CSSProperties }) => {
  const { elements, setElements, selectElementId, setSelectElementId, style } =
    props;

  const setShapeProps = (index: number, props: string,value:any) => {
    const result = elements.slice();
    result[index].shapeProps[props] = value;
    setElements(result);
  };

  const deleteElement = (id: number) => {
    const result = elements.slice().filter((i) => i.shapeProps.id !== id);
    setSelectElementId(null);
    setElements(result);
  };

  return (
    <div className="" style={{ ...style }}>
      <div>
        <List
          values={elements}
          onChange={({ oldIndex, newIndex }: any) =>
            setElements(arrayMove(elements, oldIndex, newIndex))
          }
          renderList={({ children, props }: any) => (
            <ul {...props}>{children}</ul>
          )}
          renderItem={({ value, props, isDragged, isSelected, index }) => (
            <li
              onClick={() => setSelectElementId(value.shapeProps.id)}
              {...props}
              style={{
                ...props.style,
                padding: "4px",
                margin: "0.3em 0em",
                listStyleType: "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow:
                  " 0 0 0 1px rgb(17 20 24 / 40%), 0 0 0 rgb(17 20 24 / 0%), 0 0 0 rgb(17 20 24 / 0%)",
                borderRadius: "3px",
                cursor: isDragged ? "grabbing" : "inherit",
                fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                backgroundColor:
                  isDragged || isSelected
                    ? "rgba(0, 161, 255, 0.2)"
                    : "#383e47",
              }}
              className={`${
                value.shapeProps.id === selectElementId ? "layer-selected" : ""
              }`}
            >
              <div className="flex items-center	">
                <div
                  data-movable-handle
                  className="flex items-center	"
                  style={{
                    cursor: isDragged ? "grabbing" : "grab",
                    marginRight: 10,
                  }}
                  tabIndex={-1}
                >
                  <IconFont
                    type="icon-tuodong"
                    style={{
                      fontSize: 16,
                      color:'#f6f7f9'
                    }}
                  />
                </div>
                <span style={{ color: "#f6f7f9", fontSize: 12 ,opacity:.5}}>
                  {value.shapeProps.type}
                </span>
              </div>

              <div className="layer-input px-3 ">
                <input
                  className="w-36"
                  placeholder="请输入元素名称"
                  value={
                    value.shapeProps.name ?? ''
                  }

                  onChange={(e)=>{
                    setShapeProps(index as number, "name",e.target.value)
                  }}
                />
              </div>

              <div className="ml-auto	flex">
                <div
                  className="button-wrap"
                  tabIndex={-1}
                  onClick={() => setShapeProps(index as number, "visible",!value.shapeProps.visible)}
                >
                  <IconFont
                    type={
                      value.shapeProps.visible
                        ? "icon-yanjing"
                        : "icon-bukejian"
                    }
                    style={iconStyle}
                  />
                </div>
                <div
                  className="	button-wrap"
                  tabIndex={-1}
                  onClick={() => setShapeProps(index as number, "draggable",!value.shapeProps.draggable)}
                >
                  <IconFont
                    type={
                      value.shapeProps.draggable
                        ? "icon-jiesuo"
                        : "icon-suoding"
                    }
                    style={iconStyle}
                  />
                </div>
                <div
                  className=" button-wrap"
                  tabIndex={-1}
                  onClick={() => deleteElement(value.shapeProps.id)}
                >
                  <IconFont type="icon-shanchu" style={iconStyle} />
                </div>
              </div>
            </li>
          )}
        />
      </div>
    </div>
  );
};

export default Layers;
