import { Slider } from "@mui/material";
import { ChangeEvent, FC, useEffect, useState } from "react";

export interface Pixel {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface Img {
  height: number;
  width: number;
}

interface Props {
  image: HTMLImageElement;
  onCanvasClick: (pixel: Pixel) => void;
}

export const ImgCanvas: FC<Props> = ({ image, onCanvasClick }) => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const canvasHeight = canvas?.clientHeight;
  const canvasWidth = canvas?.clientWidth;

  // container
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const containerHeight = container?.clientHeight;
  const containerWidth = container?.clientWidth;
  //

  const [imgParams, setImgParams] = useState<Img>();

  const [scale, setScale] = useState<number>();

  // on img load + set initial scale
  useEffect(() => {
    if (containerHeight && containerWidth) {
      image.onload = () => {
        const { height, width } = image;

        setImgParams({ height, width });

        const heightK = height / containerHeight;
        const widthK = width / containerWidth;

        const maxK = Math.max(heightK, widthK);

        setScale(Math.min(300, Math.ceil((1 / maxK) * 100)));
      };
    }
  }, [containerHeight, containerWidth, image]);

  // draw img. Initial + when scale changed
  useEffect(() => {
    const allAsyncDataLoaded =
      canvas !== null &&
      canvasHeight !== undefined &&
      canvasWidth !== undefined &&
      imgParams !== undefined &&
      scale !== undefined;

    if (allAsyncDataLoaded) {
      const context = canvas.getContext("2d");

      if (context !== null) {
        const { height: imageHeight, width: imageWidth } = imgParams;

        context.clearRect(0, 0, canvas.width, canvas.height);

        const scaledImgWidth = imageWidth * (scale / 100);
        const scaledImgHeight = imageHeight * (scale / 100);

        context.drawImage(
          image,
          (canvasWidth - scaledImgWidth) / 2,
          (canvasHeight - scaledImgHeight) / 2,
          scaledImgWidth,
          scaledImgHeight
        );
      }
    }
  }, [canvas, canvasHeight, canvasWidth, image, imgParams, scale]);

  return (
    <div style={{ height: "100%", width: "100%" }} ref={setContainer}>
      <div style={{ height: "30px" }}>
        {scale && (
          <Slider
            onChange={(event) => {
              const inputEvent =
                event as unknown as ChangeEvent<HTMLInputElement>;

              setScale(Number(inputEvent.target.value));
            }}
            value={scale}
            min={12}
            max={300}
            valueLabelDisplay="on"
            style={{ width: "300px" }}
          />
        )}
      </div>
      {containerHeight && containerWidth && (
        <canvas
          style={{
            border: "2px solid rgb(25, 118, 210)",
            borderRadius: "10px",
          }}
          height={containerHeight - 30}
          width={containerWidth}
          onClick={(event) => {
            const eventCanvas = event.target as HTMLCanvasElement;

            const rect = eventCanvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const ctx = eventCanvas.getContext("2d");

            if (ctx === null) return;

            const pixelData = ctx.getImageData(x, y, 1, 1).data;

            const [r, g, b, a] = pixelData;

            onCanvasClick({ r, g, b, a });
          }}
          ref={setCanvas}
        ></canvas>
      )}
    </div>
  );
};
