import express from "express";
import InfoController from "../controllers/info.controller.js";

const router = express.Router();
router.post("/", InfoController.create);
router.get("/search", InfoController.search);

export default router;
