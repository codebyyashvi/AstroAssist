# 🌐 MOSDAC AI-Powered Chatbot

An intelligent AI-powered chatbot built for the [MOSDAC Portal](https://www.mosdac.gov.in/), enabling users to access satellite and meteorological data through natural language queries. The chatbot supports multi-turn conversations, hybrid retrieval, and knowledge graph reasoning, simplifying the way users interact with complex scientific data.

---

## 🚀 Features

- **Natural Language Interaction:**  
  Users can ask queries conversationally, even across multiple follow-ups.

- **Hybrid Retrieval System:**  
  Combines semantic search using Qdrant and structured querying with Neo4j.

- **Multi-source Data Ingestion:**  
  Extracts and cleans data from:
  - Website FAQs
  - PDFs
  - Government and scientific documents

- **Qdrant Vector Database:**  
  Stores embedded data for fast semantic search based on meaning, not just keywords.

- **Neo4j Knowledge Graph:**  
  Captures relationships between key entities:
  - Satellites
  - Instruments
  - Data types
  - Services

- **LLM Integration via LangChain:**  
  Uses advanced language models (e.g., Gemini) for:
  - Intelligent responses
  - Tool calling
  - Future enhancements (like geospatial search)

---

## 🛠️ Getting Started

### 🔧 Frontend

```bash
cd frontend
npm install
npm run dev (port: 5731)
```

### Backend

```bash
cd Backend
pip install -r requirements.txt
setup your .venv and activate
python src/main.py (port: 8000)
```
