const Design = require("../models/Design/Design.model");

exports.postADesign = async (req, res) => {
  try {
    const design = new Design(req.body);
    await design.save();
    res.status(200).json("Design uploaded");
  } catch (e) {
    console.log("Error ", e);
  }
};
exports.getAllDesigns = async (req, res) => {
  try {
    const data = await Design.find();
    res.status(200).json(data);
  } catch (e) {
    console.log("Error ", e);
  }
};
exports.getSignleDesign = async (req, res) => {
  try {
    const data = await Design.findById({ _id: req.params.id });
    if (!data) return res.status(400).json({ message: "Data not found" });
    res.status(200).json(data);
  } catch (e) {
    console.log("Error ", e);
  }
};
exports.updateDesign = async (req, res) => {
  const { id } = req.params;
  const updatedDesign = req.body;

  try {
    console.log("Inside try edit");
    const data = await Design.findByIdAndUpdate(id, updatedDesign);
    console.log("Updata data ", data);
    res.status(200).send("Design updated");
  } catch (error) {
    res.status(500).send("Error updating design");
  }
};
exports.deleteDesign = async (req, res) => {
  try {
    const design = await Design.findByIdAndDelete(req.params.id);

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }
    res.status(200).json({ message: "Design deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting design", error });
  }
};
