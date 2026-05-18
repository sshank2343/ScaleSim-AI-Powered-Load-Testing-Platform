import os

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

LOG_FILE_PATH = "/shared/logs/victim.json"
RESULTS_DIR = "/shared/results"

if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY is not set in environment variables")
