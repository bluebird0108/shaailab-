import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";

app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));

// Keep public AI usage bounded even if a client retries aggressively.
const chatRequests = new Map<string, { count: number; resetAt: number }>();
app.use("/api/assistant/chat", (req, res, next) => {
  const now = Date.now();
  const key = req.ip || "unknown";
  const current = chatRequests.get(key);
  const bucket = !current || current.resetAt <= now
    ? { count: 0, resetAt: now + 60_000 }
    : current;
  bucket.count += 1;
  chatRequests.set(key, bucket);
  res.setHeader("RateLimit-Limit", "10");
  res.setHeader("RateLimit-Remaining", String(Math.max(0, 10 - bucket.count)));
  if (bucket.count > 10) return res.status(429).json({ error: "Too many messages. Please wait a minute and try again." });
  next();
});

// Lazy-initialized Gemini client helper
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in the workspace secrets or environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. API Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    vpsLocation: "UAE",
    services: {
      assistant: process.env.GEMINI_API_KEY ? "active" : "fallback",
      website: "online",
    },
  });
});

// 2. Chat endpoint supporting multiple common payload formats
app.post("/api/assistant/chat", async (req, res) => {
  try {
    const { message, prompt, messages } = req.body;
    
    // Extract the latest query
    let userMessageText = "";
    if (message) {
      userMessageText = message;
    } else if (prompt) {
      userMessageText = prompt;
    } else if (Array.isArray(messages) && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      userMessageText = lastMsg.content || lastMsg.text || "";
    }

    if (!userMessageText) {
      return res.status(400).json({ error: "No message or prompt provided." });
    }

    // Try to call the Gemini API
    try {
      const ai = getGeminiClient();
      
      const systemInstruction = `You are ShahAI, the private AI system and personal assistant of Faraz (also known as Shah). You run on a secure, private VPS infrastructure in the UAE.
You are extremely smart, helpful, professional, yet friendly and conversational (saying Salaam occasionally, as fits a UAE-based assistant).
You assist with:
1. UAE Real Estate and property queries (such as calculating yields, service charges, agency/transfer fees, explaining Dubai/Abu Dhabi rules).
2. Full-stack App Development (Express, React, TypeScript, Node.js, Python, Docker, API design).
3. Custom automation workflows on VPS (scraping listing data, email follow-ups, DB backups, cron schedules).
4. General tech experiments and workspace automation.

Always stay in character as a highly capable personal AI Lab Assistant. Keep responses concise, structured, and beautifully styled with Markdown.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userMessageText,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || "I processed your request, but could not formulate a text response.";
      
      return res.json({
        reply,
        vpsLogged: true,
        timestamp: new Date().toISOString()
      });

    } catch (apiError: any) {
      console.error("Gemini API error:", apiError);
      
      // Fallback response with a custom message if Gemini is not set up or fails
      const apiKeyMissing = !process.env.GEMINI_API_KEY;
      const fallbackPrompt = userMessageText.toLowerCase();
      
      let fallbackReply = "Salaam! I received your message. I am currently running in offline fallback mode because the Gemini API key is not configured in the Secrets tab. However, I can still tell you that ShahAI Lab is fully set up to handle app backends, real estate yield calculators, and UAE automation pipelines!";
      
      if (fallbackPrompt.includes("can you do") || fallbackPrompt.includes("what can you do") || fallbackPrompt.includes("features")) {
        fallbackReply = `Salaam! As your personal assistant, I can:
- **Analyze UAE Real Estate**: Calculate gross/net yields, ROI, cash flows, and fees for properties in Dubai and Abu Dhabi.
- **Automate Workflows**: Run scheduled cron jobs like property listing syncs, database backups, and lead alerts.
- **Explain Technical Architecture**: Help build Express APIs, React interfaces, and configure Docker on your UAE VPS.
- **Provide AI Guidance**: Generate scripts, extract data structures, and draft technical content.

*(Note: Provide a Gemini API Key in the Secrets tab to activate my dynamic AI intelligence!)*`;
      } else if (fallbackPrompt.includes("vps") || fallbackPrompt.includes("server") || fallbackPrompt.includes("infra")) {
        fallbackReply = `ShahAI Lab runs on high-performance private VPS infrastructure optimized for the UAE region. It features:
- **Express Backend**: Low latency API handling and request routing.
- **Vite/React Frontend**: Fast, responsive, and visually modern portal.
- **Cron Engine**: Automatic triggering of background data collectors and backups.
- **Direct Web Access**: Safe proxy endpoints that secure secret keys from the client browser.`;
      } else if (fallbackPrompt.includes("calc") || fallbackPrompt.includes("real estate") || fallbackPrompt.includes("property")) {
        fallbackReply = `To calculate real estate metrics, use the interactive **UAE Property Yield Calculator** built right into the dashboard! 
It helps you calculate:
- **Total Initial Investment**: Including Dubai Land Department (DLD) fees (4%), agency commission (2%), and registration costs.
- **Gross Rental Yield**: Annual Rent divided by Purchase Price.
- **Net Rental Yield**: Rent minus annual service charges and maintenance, divided by total investment cost.
- **Monthly Net Cash Flow** to keep your UAE property portfolio highly transparent.`;
      }

      return res.json({
        reply: fallbackReply,
        isFallback: true,
        apiKeyMissing,
        timestamp: new Date().toISOString()
      });
    }
  } catch (err: any) {
    console.error("Endpoint error:", err);
    res.status(500).json({ error: "Internal server error: " + err.message });
  }
});

// Serve frontend assets and handle SPA routing
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`[ShahAI Backend] server running on http://${HOST}:${PORT}`);
  });
}

initServer();
