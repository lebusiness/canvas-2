import {
  Box,
  Button,
  Checkbox,
  Input,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import { FC, useState } from "react";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  //   alignItems: "center",
};

interface Props {
  initialHeight: number;
  initialWidth: number;
  newHeight: number;
  newWidth: number;
  setImgParams: ({ height, width }: { height: number; width: number }) => void;
}

export const ResizeOptionsButton: FC<Props> = ({
  initialHeight,
  initialWidth,
  newHeight,
  newWidth,
  setImgParams,
}) => {
  // modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // resizing
  const [measuringUnits, setMeasuringUnits] = useState<"px" | "percent">("px");

  const [keepProportions, setKeepProportions] = useState(false);

  const [changedImgHeight, setChangedImgHeight] = useState(newHeight);
  const [changedImgWidth, setChangedImgWidth] = useState(newWidth);

  //

  //
  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            Initial(HxW): {initialHeight}x{initialWidth}
          </div>
          <div>
            New(HxW): {newHeight}x{newWidth}
          </div>

          <Box display={"flex"} gap={1} alignItems={"center"}>
            Units of calculation
            <Select
              value={measuringUnits}
              onChange={(event) => {
                setMeasuringUnits(event.target.value as "px" | "percent");
              }}
            >
              <MenuItem value={"px"}>px</MenuItem>
              <MenuItem value={"percent"}>percent</MenuItem>
            </Select>
          </Box>

          <Box display={"flex"} gap={1} alignItems={"center"}>
            Keep the proportions
            <Checkbox
              value={keepProportions}
              onChange={(event) => {
                setKeepProportions(event.target.checked);
              }}
            />
          </Box>

          <Box display={"flex"} gap={1} alignItems={"center"}>
            <Box display={"flex"} gap={1} alignItems={"center"}>
              height:
              <Input
                value={changedImgHeight}
                onChange={(event) => {
                  setChangedImgHeight(+event.target.value);
                }}
                style={{ width: 80 }}
                type="number"
                //  inputProps={{ max: 50, min: 0 }}
              />
            </Box>
            <Box display={"flex"} gap={1} alignItems={"center"}>
              width:
              <Input
                value={changedImgWidth}
                onChange={(event) => {
                  setChangedImgWidth(+event.target.value);
                }}
                style={{ width: 80 }}
                type="number"
                //  inputProps={{ max: 50, min: 0 }}
              />
            </Box>
          </Box>
          <Button
            style={{ width: "100%" }}
            onClick={() => {
              setImgParams({
                width: changedImgWidth,
                height: changedImgHeight,
              });
            }}
            variant={"contained"}
            type={"submit"}
          >
            Apply
          </Button>
        </Box>
      </Modal>
    </div>
  );
};
