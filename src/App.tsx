import React, { useEffect, useMemo, useState } from "react";

import "./App.css";
import { UploadFileInput } from "./components/UploadFileInput/UploadFileInput";
import { ImgCanvas, Pixel } from "./components/ImgCanvas/ImgCanvas";
import { UrlFileInput } from "./components/UrlFileInput/UrlFileInput";

function isUndefined(value: any): value is undefined {
  return value === undefined;
}

function App() {
  const [imgSrc, setImg] = useState<string>();
  const [rgb, setRgb] = useState<Pixel>();

  const [, rerender] = useState<null>();

  const image = useMemo(() => {
    const img = new Image();

    img.src = imgSrc ?? "";
    img.crossOrigin = "Anonymous";

    return img;
  }, [imgSrc]);

  useEffect(() => {
    const rerenderCb = () => {
      rerender(null);
    };

    image.addEventListener("load", rerenderCb);

    return () => {
      image.removeEventListener("load", rerenderCb);
    };
  }, [image]);

  return (
    <div className="App">
      <div
        style={{
          height: "105px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <UploadFileInput setImg={setImg} />
        or
        <UrlFileInput setImg={setImg} />
      </div>
      {imgSrc && (
        <>
          <div style={{ height: "calc(100vh - 105px - 120px)" }}>
            <ImgCanvas image={image} onCanvasClick={setRgb} />
          </div>
          <div style={{ height: "120px", padding: "20px" }}>
            <div>
              natutal size(HxW): {image.height}x{image.width}
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div>
                {Object.entries(rgb ?? {})
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(", ")}
              </div>
              {!isUndefined(rgb) &&
                !isUndefined(rgb.r) &&
                !isUndefined(rgb.g) &&
                !isUndefined(rgb.b) &&
                !isUndefined(rgb.a) && (
                  <div
                    style={{
                      border: "1px solid black",
                      height: "30px",
                      width: "30px",
                      background: `rgb(${Object.values(rgb).join(",")})`,
                      margin: "0 auto",
                    }}
                  ></div>
                )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
