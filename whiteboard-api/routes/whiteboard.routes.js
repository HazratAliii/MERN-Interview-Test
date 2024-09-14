const router = require("express").Router();

const {
  postADesign,
  getAllDesigns,
  getSignleDesign,
  updateDesign,
  deleteDesign,
} = require("../controllers/whiteboard.controller");

router.post("/", postADesign);
router.get("/", getAllDesigns);
router.get("/:id", getSignleDesign);
router.put("/:id", updateDesign);
router.delete("/:id", deleteDesign);

module.exports = router;
