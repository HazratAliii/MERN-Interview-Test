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
      type: [{}],
      required: true,
    },
  },
  { timeseries: true }
);

const Design = new model("Design", designSchema);
module.exports = Design;

/*
left top fill width height angle selectable
radius stroke strokeWidth
*/
