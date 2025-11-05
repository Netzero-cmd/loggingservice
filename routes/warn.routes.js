import express from "express";
import WarnController from "../controllers/warn.controller.js";

const router = express.Router();
router.post("/", WarnController.create);
router.get("/search", WarnController.search);

export default router;
