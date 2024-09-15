import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as fabric from "fabric";
import Navbar from "./components/Navbar";
import axios from "axios";

const App = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [color, setColor] = useState("#ff0000");
  const [name, setName] = useState("");
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(600);
  const [canvasColor, setCanvasColor] = useState("#3C3C3C");
  const isEditMode = !!id;

  useEffect(() => {
    const initCanvas = new fabric.Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: canvasColor,
    });
    setCanvas(initCanvas);

    // Handle object scaling, rotation, and modification
    initCanvas.on("object:scaling", (e) => {
      const obj = e.target;
      if (obj) {
        obj.set({
          width: obj.width * obj.scaleX,
          height: obj.height * obj.scaleY,
          scaleX: 1,
          scaleY: 1,
        });
        initCanvas.renderAll();
      }
    });

    initCanvas.on("object:rotating", (e) => {
      const obj = e.target;
      if (obj) {
        const angle = fabric.util.degreesToRadians(obj.angle % 360);
        const center = obj.getCenterPoint();

        if (obj.type === "line") {
          const x1 = obj.x1 - center.x;
          const y1 = obj.y1 - center.y;
          const x2 = obj.x2 - center.x;
          const y2 = obj.y2 - center.y;

          const rotatedX1 =
            x1 * Math.cos(angle) - y1 * Math.sin(angle) + center.x;
          const rotatedY1 =
            x1 * Math.sin(angle) + y1 * Math.cos(angle) + center.y;
          const rotatedX2 =
            x2 * Math.cos(angle) - y2 * Math.sin(angle) + center.x;
          const rotatedY2 =
            x2 * Math.sin(angle) + y2 * Math.cos(angle) + center.y;

          obj.set({
            x1: rotatedX1,
            y1: rotatedY1,
            x2: rotatedX2,
            y2: rotatedY2,
          });
        } else {
          obj.set({
            angle: obj.angle % 360,
          });
        }
        initCanvas.renderAll();
      }
    });

    initCanvas.on("object:modified", (e) => {
      const obj = e.target;
      if (obj) {
        obj.set({
          left: obj.left,
          top: obj.top,
          width: obj.width,
          height: obj.height,
          angle: obj.angle,
        });
        initCanvas.renderAll();
      }
    });

    return () => {
      initCanvas.dispose();
    };
  }, [canvasWidth, canvasHeight, canvasColor]);

  // Fetch the design data when in edit mode and load it into the canvas
  useEffect(() => {
    const fetchDesignData = async () => {
      if (isEditMode && canvas) {
        try {
          const response = await axios.get(
            `https://whiteboard-api-self.vercel.app/api/${id}`
          );
          const design = response.data;

          // console.log("Fetched design data: ", design);
          setName(design.name);
          canvas.clear();

          // console.log("Canvas before loading JSON: ", canvas);

          canvas.loadFromJSON(design, () => {
            canvas.renderAll();
            // console.log("Canvas after loading JSON: ", canvas.toJSON());
          });
        } catch (error) {
          console.error("Error fetching design:", error);
        }
      }
    };

    fetchDesignData();
  }, [id, canvas, isEditMode]);

  const addDeleteControl = (object) => {
    object.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetX: 16,
      offsetY: -16,
      cursorStyle: "pointer",
      mouseUpHandler: () => {
        canvas.remove(object);
      },
      render: (ctx, left, top) => {
        const img = new Image();
        img.src = "https://img.icons8.com/ios-glyphs/30/ff0000/multiply.png";
        img.onload = function () {
          ctx.drawImage(img, left - 8, top - 8, 16, 16);
        };
      },
    });
  };

  const addRectangle = () => {
    if (canvas) {
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: color,
        width: 100,
        height: 100,
        angle: 0,
        selectable: true,
      });
      addDeleteControl(rect);
      canvas.add(rect);
      canvas.setActiveObject(rect);
    }
  };

  const addCircle = () => {
    if (canvas) {
      const circle = new fabric.Circle({
        left: 200,
        top: 200,
        radius: 50,
        fill: color,
        selectable: true,
      });
      addDeleteControl(circle);
      canvas.add(circle);
      canvas.setActiveObject(circle);
    }
  };

  const addLine = () => {
    if (canvas) {
      const line = new fabric.Line([50, 50, 200, 200], {
        stroke: color,
        strokeWidth: 3,
        selectable: true,
        originX: "center",
        originY: "center",
      });
      addDeleteControl(line);
      canvas.add(line);
      canvas.setActiveObject(line);
    }
  };

  const addText = () => {
    if (canvas) {
      const text = new fabric.IText("Edit me", {
        left: 150,
        top: 150,
        fontFamily: "Arial",
        fill: color,
        fontSize: 24,
        selectable: true,
      });
      addDeleteControl(text);
      canvas.add(text);
      canvas.setActiveObject(text);
    }
  };

  const updateColor = (newColor) => {
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        if (
          activeObject.type === "circle" ||
          activeObject.type === "rect" ||
          activeObject.type === "i-text"
        ) {
          activeObject.set({ fill: newColor });
        } else if (activeObject.type === "line") {
          activeObject.set({ stroke: newColor });
        }
        canvas.renderAll();
      }
    }
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    updateColor(newColor);
  };

  const saveToBackend = async () => {
    if (canvas && name.trim() !== "") {
      const canvasData = canvas.toObject();
      const obj = {
        name,
        background: "#3C3C3C",
        objects: canvasData.objects,
      };
      try {
        if (isEditMode) {
          await axios.put(
            `https://whiteboard-api-self.vercel.app/api/${id}`,
            obj
          );
        } else {
          await axios.post("https://whiteboard-api-self.vercel.app/api", obj);
        }
        alert("Design saved successfully!");
        navigate("/designs");
      } catch (error) {
        console.error("Error saving design:", error);
      }
    } else {
      alert("Please enter a name for the design.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex gap-6 mt-3 justify-between ml-3 mr-3">
        <div className="bg-[#3C3C3C] flex flex-col items-center flex-2 gap-5">
          <div className="w-full mt-6">
            <button onClick={addRectangle}>Add Rectangle</button>
          </div>
          <div className="w-full text-center">
            <button onClick={addCircle}>Add Circle</button>
          </div>
          <div className="w-full text-center">
            <button onClick={addLine}>Add Line</button>
          </div>
          <div className="w-full text-center">
            <button onClick={addText}>Add Text</button>
          </div>
          <div className="w-full text-center">
            <input type="color" value={color} onChange={handleColorChange} />
          </div>
        </div>
        <div className="flex-8">
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            style={{ border: "1px solid #000" }}
          />
        </div>
        <div className="flex flex-col gap-5 flex-2">
          <label>
            Design Name:
            <input
              className="w-32 ml-3"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <button onClick={saveToBackend}>
            {isEditMode ? "Save Changes" : "Save Design"}
          </button>
        </div>
      </div>
    </>
  );
};

export default App;
