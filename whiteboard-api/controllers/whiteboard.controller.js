const Design = require("../models/Design/Design.model");

// Create design
exports.postADesign = async (req, res) => {
  try {
    const design = new Design(req.body);
    await design.save();
    res.status(200).json("Design uploaded");
  } catch (e) {
    return res.status(500).json({ message: "Failed to post design" });
  }
};
exports.getAllDesigns = async (req, res) => {
  try {
    const data = await Design.find();
    console.log(data);
    res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ message: "Error fetching data" });
  }
};

// Get all designs
exports.getSignleDesign = async (req, res) => {
  try {
    const data = await Design.findById({ _id: req.params.id });
    if (!data) return res.status(404).json({ message: "Data not found" });
    res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Update a design
exports.updateDesign = async (req, res) => {
  const { id } = req.params;
  const updatedDesign = req.body;

  try {
    console.log("Inside try edit");
    const data = await Design.findByIdAndUpdate(id, updatedDesign);
    res.status(200).send("Design updated");
  } catch (error) {
    return res.status(500).send("Error updating design");
  }
};

// Delete a design
exports.deleteDesign = async (req, res) => {
  try {
    const design = await Design.findByIdAndDelete(req.params.id);

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }
    res.status(200).json({ message: "Design deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting design", error });
  }
};
