import express from "express";
import ActivityController from "../controllers/ActivityController.js";

const router = express.Router();

router.get("/trace/:userId", ActivityController.getTraceByUserId);
router.get("/search/all", ActivityController.searchAllLogs);


export default router;