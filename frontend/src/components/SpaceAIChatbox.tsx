import { useState, useRef, useEffect } from "react";
import { spaceKnowledge } from "@/data/space-data";

interface Message {
    role: "user" | "ai";
    text: string;
}

const SUGGESTED_PROMPTS = [
    "Why is Mars red?",
    "How fast is light?",
    "Tell me about black holes",
    "How are stars born?",
    "What is dark matter?",
];

/** Offline fallback using local knowledge base */
function findOfflineAnswer(query: string): string {
    const q = query.toLowerCase().trim();
    let bestMatch: { answer: string; score: number } | null = null;

    for (const entry of spaceKnowledge) {
        let score = 0;
        for (const kw of entry.keywords) {
            if (q.includes(kw.toLowerCase())) {
                score += kw.length;
            }
        }
        if (score > 0 && (!bestMatch || score > bestMatch.score)) {
            bestMatch = { answer: entry.answer, score };
        }
    }

    if (bestMatch) return bestMatch.answer;
    return "Great question, space explorer! 🌌 I have knowledge about planets, stars, black holes, galaxies, the Big Bang, space missions, and much more. Try asking about a specific topic!";
}

/** Call Gemini AI via serverless function */
async function fetchAIResponse(message: string): Promise<string> {
    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        });

        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        if (data.success && data.answer) return data.answer;
        throw new Error("No answer");
    } catch {
        // Fallback to offline knowledge base
        return findOfflineAnswer(message);
    }
}

const SpaceAIChatbox = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "ai",
            text: "Hello, space explorer! 🚀 I'm powered by Gemini AI. Ask me anything about the cosmos — planets, stars, black holes, and more!",
        },
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, typing]);

    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open]);

    const handleSend = async (text?: string) => {
        const msg = (text || input).trim();
        if (!msg || typing) return;

        setMessages((prev) => [...prev, { role: "user", text: msg }]);
        setInput("");
        setTyping(true);

        const answer = await fetchAIResponse(msg);
        setMessages((prev) => [...prev, { role: "ai", text: answer }]);
        setTyping(false);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 group"
                style={{
                    background: "linear-gradient(135deg, hsl(195 100% 50%), hsl(220 100% 50%))",
                    boxShadow: "0 0 20px hsl(195 100% 50% / 0.5), 0 4px 15px rgba(0,0,0,0.3)",
                }}
                aria-label="Ask Space AI"
            >
                {open ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                ) : (
                    <span className="text-2xl group-hover:animate-bounce">🚀</span>
                )}
            </button>

            {/* Chat Panel */}
            <div
                className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] transition-all duration-300 origin-bottom-right ${open ? "scale-100 opacity-100 pointer-events-auto" : "scale-75 opacity-0 pointer-events-none"
                    }`}
            >
                <div
                    className="rounded-xl border border-primary/30 overflow-hidden flex flex-col"
                    style={{
                        background: "hsl(228 60% 7% / 0.95)",
                        backdropFilter: "blur(20px)",
                        boxShadow: "0 0 40px hsl(195 100% 50% / 0.15), 0 20px 60px rgba(0,0,0,0.5)",
                        height: "500px",
                    }}
                >
                    {/* Header */}
                    <div
                        className="px-4 py-3 flex items-center gap-3 border-b border-primary/20"
                        style={{
                            background: "linear-gradient(135deg, hsl(195 100% 50% / 0.15), hsl(220 100% 50% / 0.1))",
                        }}
                    >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                            style={{ background: "linear-gradient(135deg, hsl(195 100% 50%), hsl(220 100% 50%))" }}
                        >
                            🤖
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-orbitron font-bold text-primary glow-text-cyan tracking-wider">
                                SPACE AI
                            </h3>
                            <p className="text-[10px] font-mono text-muted-foreground">
                                Powered by Gemini AI • Ask anything
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                            <span className="text-[9px] font-mono text-success">ONLINE</span>
                        </div>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-lg px-3 py-2.5 text-xs font-mono leading-relaxed whitespace-pre-wrap ${msg.role === "user"
                                            ? "bg-primary/20 text-foreground border border-primary/30 rounded-br-sm"
                                            : "bg-muted/40 text-foreground/90 border border-border/50 rounded-bl-sm"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {typing && (
                            <div className="flex justify-start">
                                <div className="bg-muted/40 border border-border/50 rounded-lg rounded-bl-sm px-4 py-3">
                                    <div className="flex gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Suggested Prompts (only show when few messages) */}
                    {messages.length <= 2 && !typing && (
                        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                            {SUGGESTED_PROMPTS.map((prompt) => (
                                <button
                                    key={prompt}
                                    onClick={() => handleSend(prompt)}
                                    className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-primary/30 text-primary/80 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-3 border-t border-primary/20">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Ask about space..."
                                className="flex-1 bg-muted/30 border border-border/60 rounded-lg px-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || typing}
                                className="px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
                                style={{
                                    background: "linear-gradient(135deg, hsl(195 100% 50%), hsl(220 100% 50%))",
                                    color: "hsl(228 80% 4%)",
                                }}
                            >
                                SEND
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SpaceAIChatbox;
