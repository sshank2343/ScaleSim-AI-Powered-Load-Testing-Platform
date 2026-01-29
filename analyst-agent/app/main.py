from fastapi import FastAPI
import threading
from app.collectors.log_watcher import start_log_watcher

app = FastAPI(title="ScaleSim Analyst Agent")

@app.on_event("startup")
async def startup_event():
    # Run log watcher in background thread to avoid blocking FastAPI
    watcher_thread = threading.Thread(target=start_log_watcher, daemon=True)
    watcher_thread.start()
    print("Analyst agent started, log watcher running in background")

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "analyst-agent"}
