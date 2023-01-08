import React, { useRef, useState } from "react";
import IconFont from "@/components/Iconfont";
import PubSub from "pubsub-js";

import "./index.css";
import BoardSize from "@/layout/SideBar/BoardSize";
import { TState } from "@/App";
import Layers from "./Layers";
import Photo from "./Photo";

enum enumMenu {
  background,
  size,
  photo,
  text,
  layer,
}

const sideMemu = [
  { title: "文字", icon: "icon-wenzi", value: enumMenu.text },
  { title: "照片", icon: "icon-tupian", value: enumMenu.photo },
  { title: "背景", icon: "icon-caidan", value: enumMenu.background },
  { title: "图层", icon: "icon-layers", value: enumMenu.layer },
  { title: "尺寸", icon: "icon-resize_", value: enumMenu.size },
];

const Index = (props: JSX.IntrinsicAttributes & TState) => {
  const [checked, setChecked] = useState<any>(enumMenu.photo);
  const ref = useRef<any>();

  const sideToggle = (val?: any) => {
    if (val) {
      ref.current.style.width = "432px";
    } else {
      ref.current.style.width = "82px";
    }
    if (val && !checked) {
      PubSub.publish("sideToggle");
    }
    setChecked(val);
  };

  return (
    <div className="flex h-full bg-primary" id="side" ref={ref}>
      <div className="bg-primary flex flex-col side-left-menu">
        {sideMemu.map((item) => {
          return (
            <div
              key={item.value}
              className={`flex flex-col justify-center 	items-center cursor-pointer	side-menu ${
                checked === item.value ? "side-menu-checked" : ""
              }`}
              onClick={() => sideToggle(item.value)}
            >
              <IconFont style={{ fontSize: "22px" }} type={item.icon} />
              <div className="mt-1.5 text-xs">{item.title}</div>
            </div>
          );
        })}
      </div>

      <div
        className="relative flex-1 cursor-pointer text-white	"
        id="side-nav"
        style={{
          display: checked ? "" : "none",
          width: "350px",
          padding: "10px",
          height: " calc(100vh - 48px)",
        }}
      >
        {
          <Photo
            style={{ display: checked === enumMenu.photo ? "" : "none" }}
          />
        }
        {
          <BoardSize
            {...props}
            style={{ display: checked === enumMenu.size ? "" : "none" }}
          />
        }
        {
          <Layers
            {...props}
            style={{ display: checked === enumMenu.layer ? "" : "none" }}
          />
        }

        <div
          onClick={() => {
            ref.current.style.width = "82px";
            setChecked(null);
            PubSub.publish("sideToggle");
          }}
          className="absolute top-1/2"
          style={{ right: "-12px", zIndex: 1, transform: "translateY(-50%)" }}
        >
          <svg
            width="15"
            height="96"
            fill="#404854"
            viewBox="0 0 15 96"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 0 C3.0011 4.42584 3.9102 9.9 7.2 13.28C7.45 13.4625 7.6 13.6 7.7 13.8048L7.8 13.8C9.8 15.8 11.6 17.6 12.9 19.7C14.0 21.6 14.7 23.9 14.9 27H15V68C15 71.7 14.3 74.3 13.0 76.6C11.7 78.8 9.9 80.5 7.8 82.6344L7.79 82.6C7.6 82.8 7.4507 83 7.27295 83.2127C3.9102 86.5228 3.0011 92.0739 3 95.4938"></path>
          </svg>
          <div className="close">{">"}</div>
        </div>
      </div>
    </div>
  );
};

export default Index;
