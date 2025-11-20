import express from "express";
import ErrorController from "../controllers/error.controller.js";

const router = express.Router();
router.post("/", ErrorController.create);
router.get("/search", ErrorController.search);

export default router;
