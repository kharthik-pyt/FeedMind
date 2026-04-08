import requests
import re
import json
import logging
import os

logger = logging.getLogger(__name__)

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
MODEL = os.getenv("OLLAMA_MODEL", "llama3")

TEACHER_PROMPT = """You are an expert teacher and technical writer. A student asked about: "{topic}"

Write a thorough, engaging explanation like ChatGPT would — covering what it is, how it works, and why it matters. Adapt depth to "{difficulty}" level.

Respond ONLY with this exact JSON (no markdown fences, no extra text):
{{
  "explanation": "Write 4-6 detailed sentences. Start with a clear definition. Then explain HOW it works with a real analogy or concrete example. Cover the main use cases. Make it feel like a knowledgeable friend explaining, not a dictionary entry.",
  "sections": [
    {{
      "heading": "What is it?",
      "content": "2-3 sentences of deep-dive on the core concept, including what problem it solves"
    }},
    {{
      "heading": "How does it work?",
      "content": "Explain internal mechanics or process step-by-step. Use a concrete example."
    }},
    {{
      "heading": "Key features & real-world use cases",
      "content": "Most important practical applications. Mention specific tools, frameworks, or companies that use it."
    }},
    {{
      "heading": "Common mistakes & things to watch out for",
      "content": "1-2 important gotchas, misconceptions, or pitfalls that beginners often face."
    }}
  ],
  "key_points": [
    "First essential concept — explained as a full, useful sentence",
    "Second essential concept — include a concrete detail or number",
    "Third essential concept — explain why this matters in practice",
    "Fourth concept — a practical tip, insight, or best practice",
    "Fifth concept — something surprising, advanced, or often misunderstood"
  ],
  "difficulty": "{difficulty}",
  "why_it_matters": "One punchy sentence about real-world impact — be specific, cite an industry or use case"
}}

Difficulty guide:
- beginner: use everyday analogies, avoid jargon, explain from scratch as if talking to a curious 15-year-old
- intermediate: assume basic programming knowledge, use technical terms with brief explanations
- advanced: go deep — internals, trade-offs, edge cases, performance implications
"""


def get_explanation(topic: str, difficulty_mode: str = "auto") -> dict:
    difficulty = "intermediate" if difficulty_mode == "auto" else difficulty_mode

    prompt = TEACHER_PROMPT.format(topic=topic, difficulty=difficulty)

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.4,
                    "num_predict": 1400,
                    "top_p": 0.9,
                },
            },
            timeout=120,
        )
        response.raise_for_status()
        raw = response.json().get("response", "")
        return _parse(raw, topic, difficulty)

    except requests.exceptions.ConnectionError:
        logger.warning("Ollama not running — returning placeholder explanation.")
        return _placeholder(topic, difficulty)
    except Exception as e:
        logger.error(f"AI service error: {e}")
        return _placeholder(topic, difficulty)


def _parse(raw: str, topic: str, difficulty: str) -> dict:
    # Strip markdown code fences if model wraps in them
    raw = re.sub(r"```(?:json)?", "", raw).strip()
    # Find outermost JSON object
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if not match:
        return _placeholder(topic, difficulty)
    try:
        data = json.loads(match.group())

        diff = data.get("difficulty", difficulty).lower()
        if diff not in {"beginner", "intermediate", "advanced"}:
            diff = difficulty

        sections = data.get("sections", [])
        key_points = [str(p) for p in data.get("key_points", [])[:6]]
        explanation = data.get("explanation", "").strip()

        return {
            "explanation": explanation,
            "sections": sections,
            "key_points": key_points,
            "difficulty": diff,
            "why_it_matters": data.get("why_it_matters", "").strip(),
        }
    except Exception as e:
        logger.error(f"AI parse error: {e}")
        return _placeholder(topic, difficulty)


def _placeholder(topic: str, difficulty: str) -> dict:
    return {
        "explanation": (
            f"AI explanation for '{topic}' is unavailable because Ollama is not running. "
            "Run `ollama serve` then `ollama pull llama3` to enable AI-powered explanations."
        ),
        "sections": [],
        "key_points": [
            "Install Ollama: brew install ollama",
            "Pull a model: ollama pull llama3",
            "Start the server: ollama serve",
            "Then ask your question again for a real AI explanation!",
        ],
        "difficulty": difficulty,
        "why_it_matters": "Local AI gives you unlimited, private, free explanations of any topic.",
    }
