const express = require("express");

const userControllers = require("../controllers/user");
const checkAuth = require("../middleware/check-auth");
const file = require("../middleware/file");

const router = express.Router();

router.post("/signup", file, userControllers.createUser);
router.put("/addpoem/:id", checkAuth, userControllers.addPoem);
router.put("/clearpoem/:id", checkAuth, userControllers.clearPoem);
router.post("/login", userControllers.userLogin);
router.get("/getuser", checkAuth, userControllers.getUser);
router.get("/checkemail/:email", userControllers.userEmails);

module.exports = router;
