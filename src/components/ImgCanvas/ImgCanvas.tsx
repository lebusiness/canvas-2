import { Slider } from "@mui/material";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { ResizeOptionsButton } from "./ResizeOptionsButton/ResizeOptionsButton";

const MAX_SCALE = 300;
const MIN_SCALE = 12;

const SCALE_BAR_HEIGHT = 30;

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
  // canvas
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const canvasHeight = canvas?.clientHeight;
  const canvasWidth = canvas?.clientWidth;
  //

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

        const BORDER_SIZE = 50;
        const heightK = height / (containerHeight - BORDER_SIZE * 2);
        const widthK = width / (containerWidth - BORDER_SIZE * 2);

        const maxK = Math.max(heightK, widthK);

        setScale(Math.min(MAX_SCALE, Math.ceil((1 / maxK) * 100)));
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
      <div>
        {imgParams && (
          <ResizeOptionsButton
            initialHeight={image.height}
            initialWidth={image.width}
            newHeight={imgParams?.height}
            newWidth={imgParams?.width}
            setImgParams={({ height, width }) => {
              setImgParams((prev) => {
                return { ...prev, height, width };
              });
            }}
          />
        )}
      </div>
      <div style={{ height: `${SCALE_BAR_HEIGHT}px` }}>
        {scale && (
          <Slider
            onChange={(event) => {
              const inputEvent =
                event as unknown as ChangeEvent<HTMLInputElement>;

              setScale(Number(inputEvent.target.value));
            }}
            value={scale}
            min={MIN_SCALE}
            max={MAX_SCALE}
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
          height={containerHeight - SCALE_BAR_HEIGHT}
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
