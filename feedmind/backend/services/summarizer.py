import requests
import re
import logging
from typing import Dict

logger = logging.getLogger(__name__)

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3"

PROMPT_TEMPLATE = """You are a technical article summarizer. Given the article title and snippet below, produce a structured JSON response.

Article Title: {title}
Content: {content}

Respond ONLY with valid JSON in this exact format (no extra text):
{{
  "bullets": [
    "First key insight from the article",
    "Second key insight from the article",
    "Third key insight from the article"
  ],
  "difficulty": "beginner",
  "why_it_matters": "One sentence explaining why this is important"
}}

difficulty must be exactly one of: beginner, intermediate, advanced
"""


def summarize(title: str, content: str) -> Dict:
    """Call local Ollama to summarize an article. Returns bullets, difficulty, why_it_matters."""
    prompt = PROMPT_TEMPLATE.format(title=title, content=content[:1500])

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.3, "num_predict": 400},
            },
            timeout=60,
        )
        response.raise_for_status()
        raw = response.json().get("response", "")
        return _parse_response(raw)

    except requests.exceptions.ConnectionError:
        logger.warning("Ollama not running — returning placeholder summary.")
        return _placeholder(title)
    except Exception as e:
        logger.error(f"Summarizer error: {e}")
        return _placeholder(title)


def _parse_response(raw: str) -> Dict:
    """Extract JSON block from Ollama's response."""
    # Strip markdown code fences if present
    raw = re.sub(r"```(?:json)?", "", raw).strip()
    # Find first { ... } block
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if not match:
        return _placeholder("parse error")

    import json
    try:
        data = json.loads(match.group())
        bullets = data.get("bullets", [])
        difficulty = data.get("difficulty", "intermediate").lower()
        if difficulty not in {"beginner", "intermediate", "advanced"}:
            difficulty = "intermediate"
        why = data.get("why_it_matters", "")
        return {
            "bullets": bullets[:3],
            "difficulty": difficulty,
            "why_it_matters": why,
            "summary": "\n".join(f"• {b}" for b in bullets[:3]),
        }
    except Exception:
        return _placeholder("json parse error")


def _placeholder(title: str) -> Dict:
    return {
        "bullets": [
            "Article summary unavailable (Ollama offline).",
            "Run `ollama run llama3` to enable AI summaries.",
            "Content preview will still be available via the link.",
        ],
        "difficulty": "intermediate",
        "why_it_matters": "Start Ollama to get AI-powered insights.",
        "summary": "• Ollama offline\n• Run `ollama run llama3`\n• Click link to read",
    }
