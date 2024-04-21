import { FC, useRef } from "react";

interface Pixel {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface Props {
  image: HTMLImageElement;
  onCanvasClick: (pixel: Pixel) => void;
}

const CANVAS_SIDE_SIZE = 400;

export const ImgCanvas: FC<Props> = ({ image, onCanvasClick }) => {
  const canvas = useRef<HTMLCanvasElement>();

  return (
    <canvas
      style={{ border: "2px solid rgb(25, 118, 210)", borderRadius: "10px" }}
      height={`${CANVAS_SIDE_SIZE}px`}
      width={`${CANVAS_SIDE_SIZE}px`}
      onClick={(e) => {
        const eventCanvas = e.target as HTMLCanvasElement;

        const rect = eventCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ctx = eventCanvas.getContext("2d");

        if (ctx === null) return;

        const pixelData = ctx.getImageData(x, y, 1, 1).data;

        const [r, g, b, a] = pixelData;

        onCanvasClick({ r, g, b, a });
      }}
      ref={(canvasRef) => {
        if (canvasRef !== null) {
          const context = canvasRef.getContext("2d");

          image.onload = () => {
            if (context !== null) {
              const { height, width } = image;

              if (height < CANVAS_SIDE_SIZE && width < CANVAS_SIDE_SIZE) {
                context.drawImage(image, 0, 0);
              }

              const decreaseK =
                height > width
                  ? CANVAS_SIDE_SIZE / height
                  : CANVAS_SIDE_SIZE / width;

              context.drawImage(
                image,
                0,
                0,
                width * decreaseK,
                height * decreaseK
              );
            }
          };

          canvas.current = canvasRef;
        }
      }}
    ></canvas>
  );
};
