const express = require(`express`);
const router = express.Router();
const { authorize } = require(`../controllers/auth.controller`)
const { validateAdmin } = require(`../middlewares/admin.validation`)

//import model
const adminController = require(`../controllers/admin.controller`);

router.get("/", authorize, adminController.getAlladmin);
router.get("/search/:key", authorize, adminController.findAdmin);
router.post("/", validateAdmin, adminController.addAdmin);
router.put("/:id", validateAdmin, adminController.updateAdmin);
router.put("/reset/:id", adminController.resetPass);
router.delete("/:id", adminController.deleteAdmin);

module.exports = router;