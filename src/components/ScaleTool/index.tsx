import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import "./index.css";

function tansformToRatio(value: number) {
  return Math.round(value * 100);
}

const scaleToll = [
  { title: "10%", value: 0.1 },
  { title: "25%", value: 0.25 },
  { title: "50%", value: 0.5 },
  { title: "75%", value: 0.75 },
  { title: "100%", value: 1 },
  { title: "150%", value: 1.5 },
  { title: "200%", value: 2 },
];

export default function Index(props: any) {
  const { value, onChange ,resize} = props;

  const zoomIn = () => {
    onChange(+(Number(value) - 0.1).toFixed(2));
  };
  const zoomOut = () => {
    onChange(+(Number(value) + 0.1).toFixed(2));
  };
  return (
    <div className="scale-tool">
      <button onClick={zoomIn}>
        <ZoomOutOutlined className="zoom-icon" style={{ color: "#abb3bf" }} />
      </button>
      <Dropdown
        overlay={
          <div className="scale-dropdown">
            {scaleToll.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => onChange(item.value)}
                  className="scale-dropdown-item"
                >
                  {item.title}
                </div>
              );
            })}
            <div
              onClick={() => resize()}
              className="scale-dropdown-item"
            >
              重置
            </div>
          </div>
        }
        trigger={["click"]}
      >
        <button className="scaleMenu">{tansformToRatio(value)}%</button>
      </Dropdown>
      <button disabled={value > 2.14} onClick={zoomOut}>
        <ZoomInOutlined className="zoom-icon" style={{ color: "#abb3bf" }} />
      </button>
    </div>
  );
}
