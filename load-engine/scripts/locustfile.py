from locust import HttpUser, task, between
import os
import time
import json
from lib.redis_client import publish_metric

class ScaleSimUser(HttpUser):
    wait_time = between(1, 3)
    
    # Default target if not provided
    host = os.getenv("TARGET_URL", "http://target-server:3000")

    def on_start(self):
        self.start_time = time.time()

    @task
    def hit_target(self):
        start = time.time()
        
        # Optional authentication headers
        headers = {}
        api_key = os.getenv("API_KEY")
        bearer_token = os.getenv("BEARER_TOKEN")
        
        if api_key:
            headers["X-API-Key"] = api_key
        if bearer_token:
            headers["Authorization"] = f"Bearer {bearer_token}"

        with self.client.get("/", headers=headers, catch_response=True) as response:
            latency = int((time.time() - start) * 1000)

            metric = {
                "latency_ms": latency,
                "status_code": response.status_code,
                "timestamp": time.time()
            }

            try:
                publish_metric(metric)
            except Exception as e:
                print(f"Failed to publish metric to Redis: {e}")

            if response.status_code != 200:
                response.failure("Non-200 response")
            else:
                response.success()
