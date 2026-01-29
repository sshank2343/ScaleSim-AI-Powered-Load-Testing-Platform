import TestRun from "../models/TestRun.js";
import { startLoadTest } from "../services/orchestrator.js";
import { monitorContainer } from "../services/dockerMonitor.js";

export const startTest = async (req, res) => {
  try {
    const { targetUrl, users, spawnRate, duration } = req.body;

    if (!targetUrl || !users || !spawnRate || !duration) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const testRun = await TestRun.create({
      targetUrl,
      users,
      spawnRate,
      duration,
      status: "CREATED",
    });

    // Actually start the load test container
    await startLoadTest(testRun._id.toString(), {
      targetUrl,
      users,
      spawnRate,
      duration,
    });

    // Monitor the container for completion
    monitorContainer(`load-engine-${testRun._id}`, testRun._id.toString());

    return res.status(201).json({
      message: "Test created and started",
      testRun,
    });
  } catch (error) {
    console.error("Start test error:", error);
    return res.status(500).json({ message: "Failed to start test" });
  }
};

export const stopTest = async (req, res) => {
  try {
    const { id } = req.params;

    const testRun = await TestRun.findById(id);

    if (!testRun) {
      return res.status(404).json({ message: "Test not found" });
    }

    testRun.status = "STOPPED";
    testRun.finishedAt = new Date();
    await testRun.save();

    return res.json({
      message: "Test stopped",
      testRun,
    });
  } catch (error) {
    console.error("Stop test error:", error);
    return res.status(500).json({ message: "Failed to stop test" });
  }
};

export const getTestStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const testRun = await TestRun.findById(id);

    if (!testRun) {
      return res.status(404).json({ message: "Test not found" });
    }

    return res.json({ testRun });
  } catch (error) {
    console.error("Get test status error:", error);
    return res.status(500).json({ message: "Failed to get test status" });
  }
};

export const getAllTests = async (req, res) => {
  try {
    const tests = await TestRun.find().sort({ createdAt: -1 }).limit(50);
    return res.json({ tests });
  } catch (error) {
    console.error("Get all tests error:", error);
    return res.status(500).json({ message: "Failed to get tests" });
  }
};
