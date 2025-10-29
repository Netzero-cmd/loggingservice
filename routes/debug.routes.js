import express from "express";
import DebugController from "../controllers/debug.controller.js";

const router = express.Router();
router.post("/", DebugController.create);
router.get("/search", DebugController.search);

export default router;
