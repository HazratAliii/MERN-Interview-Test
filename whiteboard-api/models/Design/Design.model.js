const { Schema, model } = require("mongoose");

const designSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    background: {
      type: String,
      required: true,
    },
    objects: {
      type: [
        {
          angle: Number,
          backgroundColor: String,
          fill: "String",
          fillRule: String,
          flipX: Boolean,
          flipY: Boolean,
          globalCompositeOperation: String,
          height: Number,
          left: Number,
          opacity: Number,
          originX: String,
          originY: String,
          paintFirst: String,
          scaleX: Number,
          scaleY: Number,
          shadow: null,
          skewX: Number,
          skewY: Number,
          stroke: String,
          strokeDashArray: null,
          strokeDashOffset: Number,
          strokeLineCap: String,
          strokeLineJoin: String,
          strokeMiterLimit: Number,
          strokeUniform: Boolean,
          strokeWidth: Number,
          top: Number,
          type: String,
          version: String,
          visible: Boolean,
          width: Number,
          x1: Number,
          x2: Number,
          y1: Number,
          y2: Number,
        },
      ],
      required: true,
    },
  },
  { timeseries: true }
);

const Design = new model("Design", designSchema);
module.exports = Design;
