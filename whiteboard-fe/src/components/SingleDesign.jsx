import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

const SingleDesign = ({ designData }) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    // Initialize the canvas
    const initCanvas = new fabric.Canvas(canvasRef.current, {
      width: designData.canvasWidth || 800,
      height: designData.canvasHeight || 600,
    });
    setCanvas(initCanvas);

    // Clean up on unmount
    return () => {
      if (initCanvas) {
        initCanvas.dispose();
      }
    };
  }, [designData.canvasWidth, designData.canvasHeight]);

  useEffect(() => {
    if (canvas) {
      // Clear existing objects before rendering new ones
      canvas.clear();

      // Add background rectangle
      const backgroundRect = new fabric.Rect({
        left: 0,
        top: 0,
        width: canvas.getWidth(),
        height: canvas.getHeight(),
        fill: designData.background || "#3C3C3C",
        selectable: false,
        evented: false,
      });
      canvas.add(backgroundRect);

      // Render other objects
      const parsedObjects = designData.objects.map((obj) => {
        const commonProps = {
          left: obj.left || 0,
          top: obj.top || 0,
          originX: obj.originX || "left",
          originY: obj.originY || "top",
        };

        if (obj.type === "Circle") {
          return new fabric.Circle({
            radius: obj.radius || 50,
            fill: obj.fill || "#000000",
            ...commonProps,
          });
        } else if (obj.type === "IText") {
          return new fabric.IText(obj.text || "Text", {
            fontSize: obj.fontSize || 24,
            fontWeight: obj.fontWeight || "normal",
            fontFamily: obj.fontFamily || "Arial",
            fill: obj.fill || "#000000",
            ...commonProps,
          });
        } else if (obj.type === "Rect") {
          return new fabric.Rect({
            width: obj.width || 100,
            height: obj.height || 100,
            fill: obj.fill || "#000000",
            ...commonProps,
          });
        } else if (obj.type === "Line") {
          return new fabric.Line([obj.x1, obj.y1, obj.x2, obj.y2], {
            stroke: obj.stroke || "#000000",
            strokeWidth: obj.strokeWidth || 1,
            ...commonProps,
          });
        }
        return null;
      });

      parsedObjects.forEach((obj) => {
        if (obj) {
          canvas.add(obj);
        }
      });

      canvas.renderAll();
    }
  }, [canvas, designData.objects, designData.background]);

  return (
    <div className="flex gap-6 mt-3 justify-between ml-3 mr-3">
      <div className="flex-8">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default SingleDesign;
