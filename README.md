# CallX — AI Sales Coach Platform

> **An intelligent AI system that analyzes sales calls and delivers actionable feedback to improve team performance.**

## Overview

**CallX** is a data-driven platform that leverages **speech recognition** and **natural language processing (NLP)** to analyze real sales calls automatically and generate structured, personalized feedback for each sales representative.

The goal is to **automate post-call analysis**, reduce managerial workload, and provide **continuous performance insights** for the entire sales organization.

## Solution

CallX automates the entire process of sales-call analysis through a modular AI pipeline:

1. **Automatic call capture** via Aircall API  
2. **Speech-to-text transcription** using **OpenAI Whisper**  
3. **Contextual and behavioral analysis**
4. **Real-time dashboard** with aggregated KPIs and insights  
5. **Automated daily feedback reports** for each salesperson  


## Example Output

```json
{
  "call_id": "AICALL_0342",
  "agent": "John Doe",
  "sentiment": "Positive",
  "key_objections": ["pricing", "timeline"],
  "recommendations": [
    "Reframe pricing as ROI-driven",
    "Ask open-ended qualification questions earlier"
  ]
}
