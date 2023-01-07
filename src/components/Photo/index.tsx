import { Spin } from "antd";
import request from "@/utils/http";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import "./index.css";
import Masonry from "react-masonry-css";
import { useRequest } from "ahooks";
import PubSub from "pubsub-js";

// const fetchImage = () => {
//   return request({
//     url: "https://api.unsplash.com/photos/random?count=40",
//     method: "get",
//     headers: {
//       Authorization: "Client-ID g0hjw__H3OZAnfkzXMs4GpZZ9MvTmLsRzRufJMQnljI",
//     },
//   }).then((res) => {
//     return res;
//   });
// };
const fetchImage = () => {
  return request({
    url: "https://api.polotno.dev/api/get-unsplash?query=&per_page=20&page=1&KEY=nFA5H9elEytDyPyvKL7T",
    method: "get",
    // headers: {
    //   Authorization: "Client-ID g0hjw__H3OZAnfkzXMs4GpZZ9MvTmLsRzRufJMQnljI",
    // },
  }).then((res: any) => {
    return res.results;
  });
};

const Photo = ({ style }: { style?: React.CSSProperties }) => {
  const [data, setData] = useState<any[]>([]);

  const { loading, refresh } = useRequest(fetchImage, {
    onSuccess: (res: any) => {
      setData((data) => {
        return [...data, ...res];
      });
    },
  });

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    refresh();
  };

  const onDragStart = (e: React.DragEvent<HTMLImageElement>, item: any) => {
    const url = item.urls.regular;
    const { height, width } = item;
    const data = JSON.stringify({
      type: "image",
      data: {
        width: 400,
        height: (400 * height) / width,
        url
      },
    });
    e.dataTransfer.setData("text/plain", data);
  };

  return (
    <div className="h-full" style={{ ...style }}>
      <div style={{ height: "40px" }}>Photos by Unsplash</div>
      <div
        id="scrollableDiv"
        className="flex-1"
        style={{
          ...style,
          height: "calc(100% - 40px)",
          overflow: "hidden auto",
        }}
      >
        <InfiniteScroll
          loader={<Spin />}
          dataLength={data.length}
          next={loadMoreData}
          hasMore={data.length < 300}
          scrollableTarget="scrollableDiv"
        >
          <Masonry
            breakpointCols={2}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {/* array of JSX items */}
            {data.map((item, index) => {
              return (
                <div key={index} className="item">
                  <img
                    src={item.urls.small}
                    alt=""
                    draggable
                    onDragStart={(e) => onDragStart(e, item)}
                  />
                  <div className="info text-center">
                    Photo by <span>{item.user.name}</span> on
                    <span>Unsplash</span>
                  </div>
                </div>
              );
            })}
          </Masonry>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Photo;
