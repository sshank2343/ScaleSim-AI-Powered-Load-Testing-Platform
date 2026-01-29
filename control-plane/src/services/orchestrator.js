import docker from "../config/docker.js";
import TestRun from "../models/TestRun.js";

const LOAD_ENGINE_IMAGE = "scalesim-load-engine";

export const startLoadTest = async (testRunId, params) => {
  try {
    const envVars = [
      `TARGET_URL=${params.targetUrl}`,
      `USERS=${params.users}`,
      `SPAWN_RATE=${params.spawnRate}`,
      `DURATION=${params.duration}`,
      `REDIS_URL=${process.env.REDIS_URL}`,
    ];
    
    // Add optional authentication
    if (params.apiKey) {
      envVars.push(`API_KEY=${params.apiKey}`);
    }
    if (params.bearerToken) {
      envVars.push(`BEARER_TOKEN=${params.bearerToken}`);
    }
    
    const container = await docker.createContainer({
      Image: LOAD_ENGINE_IMAGE,
      name: `load-engine-${testRunId}`,
      Env: envVars,
      HostConfig: {
        AutoRemove: true,
        NetworkMode: "scalesim_default", // 🔥 THIS IS THE FIX
      },
    });

    await container.start();

    await TestRun.findByIdAndUpdate(testRunId, {
      status: "RUNNING",
      startedAt: new Date(),
    });

    console.log(`Load test started for ${testRunId}`);
  } catch (error) {
    console.error("Failed to start load test:", error);

    await TestRun.findByIdAndUpdate(testRunId, {
      status: "FAILED",
      error: error.message,
    });
  }
};
