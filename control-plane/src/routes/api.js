import express from "express";
import { startTest, stopTest, getTestStatus, getAllTests } from "../controllers/testController.js";

const router = express.Router();

router.post("/start-test", startTest);
router.post("/stop-test/:id", stopTest);
router.get("/test/:id", getTestStatus);
router.get("/tests", getAllTests);
router.get("/health", (req, res) => res.json({ status: "ok", service: "control-plane" }));

export default router;
