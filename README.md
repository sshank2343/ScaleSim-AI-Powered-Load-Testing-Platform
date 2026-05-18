# ScaleSim – AI-Powered Auto-Discovery Load Testing Platform

ScaleSim is an intelligent, distributed load testing platform that automatically discovers your API's capacity limits using progressive ramping and AI-powered analysis. Built with microservices architecture, it provides real-time monitoring, breaking point detection, and automated root cause analysis.

---

## 🎯 What ScaleSim Does

- **Auto-Discovery Mode**: Automatically finds your API's breaking point by progressively ramping load
- **Real-Time Monitoring**: Live dashboard showing RPS, latency, error rates, and user load
- **Intelligent Ramping**: Custom sequence (1→2→3→4→5→10→25→50→100→200...) with configurable step duration
- **Breaking Point Detection**: Automatically stops when hitting error rate, latency thresholds, or max users
- **AI Analysis**: Uses OpenAI to analyze failures and suggest optimizations
- **Docker-Native**: Full container orchestration with dynamic load engine spawning
- **Persistent Results**: Stores all test runs in MongoDB for historical analysis

---

## 🏗️ Architecture Overview

ScaleSim uses a microservices architecture with 6 core components:

```
┌─────────────┐     WebSocket      ┌──────────────┐
│   Frontend  │◄──────────────────►│Control Plane │
│   (React)   │     Socket.io      │  (Node.js)   │
└─────────────┘                    └──────┬───────┘
                                          │
                                          │ Orchestrates
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    ▼                     ▼                     ▼
            ┌──────────────┐      ┌─────────────┐     ┌──────────────┐
            │ Load Engine  │      │   Redis     │     │   MongoDB    │
            │  (Locust)    │◄────►│  (Upstash)  │     │   (Atlas)    │
            └──────┬───────┘      └─────────────┘     └──────────────┘
                   │ Hits                   ▲
                   ▼                        │
            ┌──────────────┐                │
            │Target Server │                │ Analyzes
            │  (Node.js)   │                │
            └──────────────┘         ┌──────┴───────┐
                                     │Analyst Agent │
                                     │  (AI + LLM)  │
                                     └──────────────┘
```

### Components:

1. **Frontend** (React + Vite + TailwindCSS)
   - Real-time dashboard with Recharts visualization
   - Auto-discovery mode configuration
   - WebSocket connection for live updates

2. **Control Plane** (Node.js + Express + Socket.io)
   - REST API for test lifecycle management
   - Docker container orchestration via Dockerode
   - Real-time telemetry broadcasting
   - Test run persistence to MongoDB

3. **Load Engine** (Python + Locust)
   - Custom `AutoRampLoadShape` for progressive ramping
   - Configurable step duration (5-120s)
   - Redis pub/sub for telemetry streaming
   - Automatic breaking point detection

4. **Target Server** (Node.js)
   - Sample API endpoints for testing
   - Includes CPU-heavy, memory-leak, I/O-heavy routes

5. **Analyst Agent** (Python + LangChain + OpenAI)
   - AI-powered log analysis
   - Root cause identification
   - Performance metrics analysis
   - Automated report generation

6. **Redis** (Upstash)
   - Pub/sub messaging backbone
   - Real-time telemetry streaming

7. **MongoDB** (Atlas)
   - Test run metadata storage
   - Historical results tracking

---

## 🚀 Technologies Used

### Backend
- **Node.js v20** - Runtime
- **Express.js** - REST API framework
- **Socket.io** - WebSocket real-time communication
- **Dockerode** - Docker container management
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Redis** - Pub/sub messaging

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Recharts** - Data visualization
- **Socket.io-client** - Real-time updates

### Load Testing
- **Python 3.11** - Runtime
- **Locust** - Load testing framework
- **Custom LoadTestShape** - Auto-ramping algorithm

### AI Agents
- **LangChain 0.2.6** - Agent framework
- **OpenAI** - LLM provider
- **Pandas** - Data analysis
- **Watchdog** - File monitoring

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server

---

## ✨ Features

### Auto-Discovery Mode
- **Progressive Ramping**: Automatically increases load following sequence: 1→2→3→4→5→10→25→50→100→200→300→400→500→1000→2000...
- **Configurable Step Duration**: Set how long to test at each level (5-120s, default 15s)
- **Safety Limit**: Set maximum users to prevent runaway tests
- **Smart Detection**: Stops automatically when detecting:
  - Error rate exceeds threshold (default 10%)
  - Response latency exceeds threshold (default 5000ms)
  - Reached maximum user limit

### Real-Time Dashboard
- **Live Metrics**: RPS, latency, error rate, active users
- **Interactive Charts**: Time-series visualization with Recharts
- **System Health**: Real-time status indicators
- **Breaking Point Alert**: Visual notification when capacity discovered

### Test Results
- **Peak RPS**: Maximum requests/second achieved
- **Average RPS**: Sustained throughput
- **Breaking Point Reason**: Why the test stopped
- **Duration & Total Requests**: Complete test statistics
- **Error Analysis**: Failed request count and error rate

---

## 📦 Installation & Setup

### Prerequisites
- Docker Desktop (with WSL2 on Windows)
- Docker Compose v2.x
- MongoDB Atlas account (free tier)
- Upstash Redis account (free tier)
- OpenAI API key

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/ScaleSim.git
cd ScaleSim
```

### 2. Configure Environment Variables

Create `.env` files in respective directories:

**control-plane/.env:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/scalesim
REDIS_HOST=your-upstash-host.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
PORT=5000
```

**analyst-agent/.env:**
```env
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4o-mini
REDIS_HOST=your-upstash-host.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
```

**load-engine/.env:**
```env
REDIS_HOST=your-upstash-host.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
STEP_DURATION=15
```

### 3. Start Services
```bash
docker-compose up -d
```

### 4. Verify All Services Running
```bash
docker-compose ps
```

You should see:
- `scalesim-frontend` (port 5173)
- `scalesim-control-plane` (port 5000)
- `scalesim-target-server` (port 3000)
- `scalesim-redis`
- `scalesim-analyst-agent`

### 5. Access Dashboard
Open browser to: `http://localhost:5173`

---

## 🎮 How to Use

### Quick Start - Auto-Discovery Mode

1. **Open Dashboard**: Navigate to `http://localhost:5173`

2. **Configure Test** (Auto-Discovery Mode is enabled by default):
   - **Target URL**: `http://target-server:3000/healthy` (default)
   - **Max Users**: Set safety limit (e.g., 1000, 10000)
   - **Step Duration**: How long to test each level (default 15s)
   - **Max Error Rate**: Stop if errors exceed % (default 10%)
   - **Max Latency**: Stop if response time exceeds ms (default 5000ms)

3. **Start Test**: Click "Start Load Test" button

4. **Watch Live Metrics**:
   - Current RPS (requests per second)
   - Peak RPS achieved
   - Latency graph
   - Error rate trend
   - Active user count

5. **Test Completes** when:
   - Breaking point detected (errors or latency exceeded)
   - Max users reached
   - You click "Stop Test"

6. **View Results**: Breaking point banner shows:
   - Reason for stopping
   - Peak RPS capacity
   - Max users supported
   - Error rate and total requests

### Standard Mode (Manual Configuration)

1. Disable "Auto-Discovery Mode" checkbox
2. Configure:
   - Max Users
   - Spawn Rate (users/sec)
   - Duration (seconds)
3. Start test

---

## 🧪 Sample Test Scenarios

### Scenario 1: Find API Capacity
```yaml
Target: http://target-server:3000/healthy
Max Users: 10000
Step Duration: 15s
Max Error Rate: 10%
Max Latency: 5000ms
```

**Expected**: Discovers exact breaking point with RPS capacity

### Scenario 2: CPU Stress Test
```yaml
Target: http://target-server:3000/cpu-heavy
Max Users: 1000
Step Duration: 20s
```

**Expected**: Lower breaking point, CPU latency increases

### Scenario 3: Fast Discovery
```yaml
Max Users: 5000
Step Duration: 5s
Max Error Rate: 15%
```

**Expected**: Quick test, finds approximate capacity

---

## 🛠️ Management Commands

### Stop All Services
```bash
docker-compose stop
```

### Restart All Services
```bash
docker-compose start
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f control-plane
docker-compose logs -f load-engine
```

### Rebuild After Code Changes
```bash
docker-compose build frontend
docker-compose up -d frontend
```

### Clean Everything
```bash
docker-compose down
docker-compose down -v  # Also removes volumes
```

---

## 📊 Understanding Results

### Key Metrics Explained

- **Peak RPS**: Maximum requests per second your API handled successfully - this is your API's peak throughput capacity
- **Average RPS**: Sustained throughput across the entire test duration
- **Max Users**: The breaking point in concurrent users, or safety limit reached
- **Error Rate**: Percentage of failed requests (0% = perfect reliability)
- **Latency**: Response time in milliseconds (lower = faster)
- **Duration**: Total test runtime in seconds

### Breaking Point Reasons

1. **"Max error rate exceeded"**: API started failing too many requests (>10%)
2. **"Max latency exceeded"**: API became too slow (>5000ms)
3. **"Reached end of ramping sequence"**: Completed all steps without breaking
4. **"Reached safety limit"**: Hit your configured max users without breaking

### What Good Results Look Like

✅ **Healthy API:**
- Peak RPS > 500
- Error Rate = 0%
- Latency < 500ms
- Graceful degradation

⚠️ **Needs Optimization:**
- Peak RPS < 100
- Error Rate > 5%
- Latency > 2000ms
- Sudden failures

---

## 🤖 AI Agent Capabilities

The Analyst Agent uses **OpenAI** with **LangChain** to provide:

### 1. Root Cause Analysis
- Analyzes log entries automatically
- Identifies issue type (CPU, Memory, I/O, Network)
- Provides one-line explanation

### 2. Performance Metrics Analysis
- Processes performance metrics summary
- Identifies primary bottleneck
- Provides supporting evidence
- Suggests concise recommendations

### 3. Report Generation
- Automated test reports
- Summarizes findings
- Generates actionable insights

**Technologies:**
- LangChain 0.2.6 for agent orchestration
- Custom `OpenAILLM` wrapper
- OpenAI API integration
- Pandas for data analysis

---

## 🏛️ System Design Patterns

### Microservices Architecture
- Independent services with single responsibility
- Container-based deployment
- Service discovery via Docker networking

### Event-Driven Architecture
- Redis pub/sub for real-time telemetry
- WebSocket for frontend updates
- Asynchronous event processing

### Dynamic Scaling
- On-demand load engine container spawning
- Parallel test execution capability
- Resource isolation per test

### Observability
- Real-time metrics streaming
- Centralized logging
- Historical data persistence

---

## 🔧 Customization

### Modify Ramping Sequence
Edit `load-engine/scripts/locustfile.py`:
```python
RAMPING_SEQUENCE = [1, 2, 3, 4, 5, 10, 25, 50, 100, 200, ...]
```

### Change Default Step Duration
Update `STEP_DURATION` environment variable in `.env`:
```env
STEP_DURATION=30  # seconds
```

### Add Custom Target Endpoints
Edit `target-server/routes/` and add your test endpoints

### Customize AI Prompts
Modify prompts in `analyst-agent/app/agents/root_cause.py`

---

## 📁 Project Structure

```
ScaleSim/
├── docker-compose.yml           # Multi-container orchestration
├── README.md                    # This file
│
├── frontend/                    # React Dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── ControlPanel.jsx      # Test configuration UI
│   │   │   ├── MetricsChart.jsx      # Real-time charts
│   │   │   ├── SystemHealth.jsx      # Status indicators
│   │   │   ├── LogTerminal.jsx       # Log viewer
│   │   │   └── ErrorBoundary.jsx     # Error handling
│   │   ├── hooks/useSocket.js        # WebSocket hook
│   │   └── services/api.js           # API client
│   ├── Dockerfile
│   └── package.json
│
├── control-plane/               # Node.js Orchestrator
│   ├── src/
│   │   ├── controllers/
│   │   │   └── testController.js     # Test lifecycle API
│   │   ├── services/
│   │   │   ├── orchestrator.js       # Container management
│   │   │   ├── dockerMonitor.js      # Container monitoring
│   │   │   └── telemetryService.js   # WebSocket broadcast
│   │   ├── models/TestRun.js         # MongoDB schema
│   │   ├── routes/api.js             # REST routes
│   │   └── server.js                 # Express server
│   ├── Dockerfile
│   └── package.json
│
├── load-engine/                 # Python Load Tester
│   ├── scripts/
│   │   ├── locustfile.py            # Main test file
│   │   └── lib/redis_client.py      # Redis integration
│   ├── Dockerfile
│   └── requirements.txt
│
├── analyst-agent/               # AI Analysis Service
│   ├── app/
│   │   ├── agents/
│   │   │   ├── root_cause.py        # Root cause analyzer
│   │   │   └── report_generator.py  # Report generator
│   │   ├── collectors/
│   │   │   ├── log_watcher.py       # Log monitoring
│   │   │   └── metrics_ingest.py    # Metrics collection
│   │   ├── core/
│   │   │   ├── llm.py               # OpenAI LLM wrapper
│   │   │   └── config.py            # Configuration
│   │   └── main.py                  # FastAPI server
│   ├── Dockerfile
│   └── requirements.txt
│
└── target-server/               # Test Target API
    ├── routes/
    │   ├── healthy.js               # Normal endpoint
    │   ├── cpu-heavy.js             # CPU stress
    │   ├── memory-leak.js           # Memory test
    │   └── io-heavy.js              # I/O stress
    ├── server.js
    └── package.json
```

---

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Additional load testing patterns
- More AI analysis features
- Enhanced visualization
- Additional target scenarios
- Performance optimizations

---

## 📝 License

MIT License - Feel free to use for learning and projects

---

## 🙏 Acknowledgments

Built with:
- Locust - Load testing framework
- Socket.io - Real-time communication
- Recharts - Data visualization
- OpenAI - AI analysis
- LangChain - Agent framework

---

## 📧 Contact

For questions or suggestions, open an issue on GitHub.

---

**Happy Load Testing! 🚀**