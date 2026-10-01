"""Optional Python AI worker for VÉQALUNE CIVIC.

Run with:
    python python_service/ai_service.py

The worker uses Gemini's REST API when GEMINI_API_KEY is configured and
returns a stable analysis shape for the Node API. Without a key it returns a
small deterministic analysis so the integration can be tested locally.
"""

from __future__ import annotations

import json
import os
import re
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

HOST = os.getenv("PYTHON_AI_HOST", "127.0.0.1")
PORT = int(os.getenv("PYTHON_AI_PORT", "8001"))
MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
MAX_BODY_BYTES = 20 * 1024 * 1024
CATEGORIES = ["Waste", "Road Damage", "Water", "Drainage", "Energy", "Public Safety", "Other"]
SEVERITIES = ["LOW", "MODERATE", "HIGH", "CRITICAL"]
RISKS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]


def fallback(payload: dict[str, Any]) -> dict[str, Any]:
    description = str(payload.get("description", ""))
    category = payload.get("category") if payload.get("category") in CATEGORIES else "Other"
    text = description.lower()

    if category == "Waste" or any(word in text for word in ("dump", "trash", "garbage")):
        category, severity, environmental, public = "Waste", "HIGH", "HIGH", "MEDIUM"
        explanation = "Accumulated waste is affecting a public area and may contaminate nearby soil or stormwater. The issue should be inspected and cleared before it expands."
        action = "Dispatch a waste collection crew and inspect the surrounding area for recurring dumping."
        tags, objects, estimate = ["Sanitation", "Illegal Dumping", "Vector Risk"], ["mixed debris", "packaging", "containers"], "12-24 Hours"
    elif category == "Road Damage" or any(word in text for word in ("pothole", "crack", "asphalt")):
        category, severity, environmental, public = "Road Damage", "HIGH", "LOW", "HIGH"
        explanation = "Road surface damage creates a hazard for vehicles, cyclists, and pedestrians. Further deterioration is likely if water enters the fractured surface."
        action = "Place temporary warning markers and schedule a rapid road-surface repair inspection."
        tags, objects, estimate = ["Pavement Hazard", "Traffic Safety", "Surface Failure"], ["pothole", "fractured asphalt", "road marking"], "8-12 Hours"
    elif category == "Drainage" or any(word in text for word in ("drain", "flood", "culvert", "clog")):
        category, severity, environmental, public = "Drainage", "CRITICAL", "CRITICAL", "HIGH"
        explanation = "Blocked drainage infrastructure can restrict stormwater flow and increase localized flood risk. The obstruction should be cleared before the next heavy rainfall event."
        action = "Dispatch a drainage crew to inspect and clear the intake, culvert, and nearby screens."
        tags, objects, estimate = ["Storm Drainage", "Flood Risk", "Blockage"], ["drain grate", "sediment", "trapped debris"], "6 Hours"
    else:
        severity, environmental, public = "MODERATE", "MEDIUM", "MEDIUM"
        explanation = "The report describes a civic infrastructure issue that requires field verification. Its impact should be assessed alongside nearby reports and local conditions."
        action = "Assign a field inspector to verify the issue and recommend the appropriate municipal response."
        tags, objects, estimate = ["Field Inspection", "Community Report"], ["reported hazard", "public asset"], "24-48 Hours"

    return {
        "category": category,
        "aiConfidence": 88,
        "severity": severity,
        "environmentalRisk": environmental,
        "publicRisk": public,
        "aiExplanation": explanation,
        "recommendedAction": action,
        "hazardTags": tags,
        "detectedObjects": objects,
        "estimatedResolutionTime": estimate,
        "source": "python-deterministic-fallback",
    }


def gemini_analysis(payload: dict[str, Any]) -> dict[str, Any] | None:
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key or api_key == "MY_GEMINI_API_KEY":
        return None

    prompt = f"""You are VÉQALUNE CIVIC, a civic infrastructure analysis assistant.
Analyze this report and return JSON only.
Description: {payload.get('description', '')}
Category hint: {payload.get('category', 'Other')}
Location: {payload.get('locationLabel', '')}
Return keys: category, aiConfidence, severity, environmentalRisk, publicRisk,
aiExplanation, recommendedAction, hazardTags, detectedObjects, estimatedResolutionTime.
Category must be one of {CATEGORIES}. Severity must be one of {SEVERITIES}.
Risk values must be one of {RISKS}. Confidence must be an integer from 80 to 99."""

    parts: list[dict[str, Any]] = [{"text": prompt}]
    image = payload.get("imageBase64")
    mime_type = payload.get("mimeType", "image/jpeg")
    if image:
        encoded = re.sub(r"^data:image/[^;]+;base64,", "", str(image))
        parts.insert(0, {"inline_data": {"mime_type": mime_type, "data": encoded}})

    body = json.dumps({"contents": [{"parts": parts}], "generationConfig": {"responseMimeType": "application/json"}}).encode()
    endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={api_key}"
    request = Request(endpoint, data=body, headers={"Content-Type": "application/json"}, method="POST")

    try:
        with urlopen(request, timeout=45) as response:
            result = json.loads(response.read().decode())
        text = result["candidates"][0]["content"]["parts"][0]["text"]
        parsed = json.loads(text)
        return normalize(parsed, "python-gemini")
    except (HTTPError, URLError, KeyError, IndexError, json.JSONDecodeError, TimeoutError, OSError):
        return None


def normalize(result: dict[str, Any], source: str) -> dict[str, Any]:
    category = result.get("category") if result.get("category") in CATEGORIES else "Other"
    severity = result.get("severity") if result.get("severity") in SEVERITIES else "MODERATE"
    environmental = result.get("environmentalRisk") if result.get("environmentalRisk") in RISKS else "MEDIUM"
    public = result.get("publicRisk") if result.get("publicRisk") in RISKS else "MEDIUM"
    confidence = result.get("aiConfidence", 88)
    try:
        confidence = max(80, min(99, int(confidence)))
    except (TypeError, ValueError):
        confidence = 88
    return {
        "category": category,
        "aiConfidence": confidence,
        "severity": severity,
        "environmentalRisk": environmental,
        "publicRisk": public,
        "aiExplanation": str(result.get("aiExplanation", "Field verification is recommended for this civic report.")),
        "recommendedAction": str(result.get("recommendedAction", "Assign a field inspection.")),
        "hazardTags": result.get("hazardTags") if isinstance(result.get("hazardTags"), list) else ["Community Report"],
        "detectedObjects": result.get("detectedObjects") if isinstance(result.get("detectedObjects"), list) else ["reported hazard"],
        "estimatedResolutionTime": str(result.get("estimatedResolutionTime", "24 Hours")),
        "source": source,
    }


class Handler(BaseHTTPRequestHandler):
    def _send(self, status: int, payload: dict[str, Any]) -> None:
        encoded = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def do_GET(self) -> None:  # noqa: N802
        if self.path == "/health":
            api_key = os.getenv("GEMINI_API_KEY", "").strip()
            self._send(200, {"status": "ok", "service": "python-ai-worker", "aiConfigured": bool(api_key and api_key != "MY_GEMINI_API_KEY")})
            return
        self._send(404, {"error": "Not found"})

    def do_POST(self) -> None:  # noqa: N802
        if self.path != "/analyze":
            self._send(404, {"error": "Not found"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length < 0 or length > MAX_BODY_BYTES:
                self._send(413, {"error": "Payload exceeds the 20MB limit"})
                return
            payload = json.loads(self.rfile.read(length).decode() or "{}")
            if not isinstance(payload, dict):
                self._send(400, {"error": "JSON payload must be an object"})
                return
            result = gemini_analysis(payload) or fallback(payload)
            self._send(200, result)
        except (json.JSONDecodeError, UnicodeDecodeError, ValueError):
            self._send(400, {"error": "Invalid JSON payload"})

    def log_message(self, format: str, *args: Any) -> None:
        print(f"[python-ai] {format % args}")


if __name__ == "__main__":
    print(f"Python AI worker listening on http://{HOST}:{PORT}")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
