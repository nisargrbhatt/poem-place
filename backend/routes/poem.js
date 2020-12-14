const express = require("express");

const poemControllers = require("../controllers/poem");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("/createpoem", checkAuth, poemControllers.createPoem);
router.put("/updatepoem/:id", checkAuth, poemControllers.updatePoem);
router.delete("/deletepoem/:id", checkAuth, poemControllers.deletePoem);
router.get("/getpoem/:id", poemControllers.getPoem);
router.get("/getpoems", poemControllers.getPoems);
router.get("/getpoemspp", poemControllers.getPoemPP);
router.get("/getpoemsou", checkAuth, poemControllers.getPoemOU);

module.exports = router;
