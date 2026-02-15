export default async function handler(req, res) {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.status(200).end();

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { message } = req.body;
    if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: `You are Space AI, a friendly and knowledgeable space science expert embedded in a space weather monitoring dashboard called SPACE-X. 

Your personality:
- Enthusiastic about space and astronomy
- Use emojis naturally (🚀 🌌 ⭐ 🪐 etc.)
- Give concise but fascinating answers (2-4 paragraphs max)
- Include fun facts when relevant
- If someone asks a non-space question, gently redirect to space topics

User question: ${message}`,
                                },
                            ],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.8,
                        topP: 0.95,
                        maxOutputTokens: 500,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            console.error("Gemini API error:", response.status, errData);
            return res.status(502).json({ error: "AI service error", details: errData });
        }

        const data = await response.json();
        const aiText =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Hmm, my space sensors are glitching! 🛸 Try asking again.";

        return res.json({ success: true, answer: aiText });
    } catch (err) {
        console.error("Chat API error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
