import { useState, useEffect, useCallback, useRef } from "react";
import StarBackground from "@/components/StarBackground";
import { quizQuestions, QuizQuestion } from "@/data/quiz-data";

type Screen = "menu" | "playing" | "result";

interface LeaderEntry {
    name: string;
    score: number;
    total: number;
    date: string;
}

const QUESTIONS_PER_ROUND = 10;
const TIME_PER_QUESTION = 15;
const LS_KEY = "spacex-quiz-leaderboard";

function shuffleArray<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function getGrade(pct: number): { letter: string; color: string; label: string } {
    if (pct >= 90) return { letter: "A+", color: "hsl(152 100% 50%)", label: "Space Genius!" };
    if (pct >= 80) return { letter: "A", color: "hsl(152 100% 50%)", label: "Stellar Knowledge!" };
    if (pct >= 70) return { letter: "B", color: "hsl(195 100% 50%)", label: "Great Explorer!" };
    if (pct >= 50) return { letter: "C", color: "hsl(45 100% 50%)", label: "Keep Exploring!" };
    return { letter: "D", color: "hsl(0 100% 64%)", label: "Study More, Cadet!" };
}

const Quiz = () => {
    const [screen, setScreen] = useState<Screen>("menu");
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);
    const [playerName, setPlayerName] = useState("");
    const [nameSaved, setNameSaved] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval>>();

    // Load leaderboard
    useEffect(() => {
        try {
            const data = localStorage.getItem(LS_KEY);
            if (data) setLeaderboard(JSON.parse(data));
        } catch { }
    }, []);

    const startQuiz = useCallback(() => {
        const shuffled = shuffleArray(quizQuestions).slice(0, QUESTIONS_PER_ROUND);
        setQuestions(shuffled);
        setCurrent(0);
        setScore(0);
        setTimeLeft(TIME_PER_QUESTION);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setNameSaved(false);
        setPlayerName("");
        setScreen("playing");
    }, []);

    // Timer
    useEffect(() => {
        if (screen !== "playing" || showExplanation) return;
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setShowExplanation(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [screen, showExplanation, current]);

    const handleAnswer = (idx: number) => {
        if (selectedAnswer !== null || showExplanation) return;
        clearInterval(timerRef.current);
        setSelectedAnswer(idx);
        if (idx === questions[current].correct) {
            setScore((s) => s + 1);
        }
        setShowExplanation(true);
    };

    const nextQuestion = () => {
        if (current + 1 >= questions.length) {
            setScreen("result");
            return;
        }
        setCurrent((c) => c + 1);
        setTimeLeft(TIME_PER_QUESTION);
        setSelectedAnswer(null);
        setShowExplanation(false);
    };

    const saveScore = () => {
        const name = playerName.trim() || "Anonymous";
        const entry: LeaderEntry = {
            name,
            score,
            total: questions.length,
            date: new Date().toLocaleDateString(),
        };
        const updated = [...leaderboard, entry]
            .sort((a, b) => b.score / b.total - a.score / a.total)
            .slice(0, 10);
        setLeaderboard(updated);
        localStorage.setItem(LS_KEY, JSON.stringify(updated));
        setNameSaved(true);
    };

    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const grade = getGrade(pct);

    // Timer ring SVG
    const timerRadius = 28;
    const timerCircumference = 2 * Math.PI * timerRadius;
    const timerOffset = timerCircumference * (1 - timeLeft / TIME_PER_QUESTION);

    return (
        <div className="relative min-h-screen bg-grid scanline">
            <StarBackground />

            <div className="relative z-10 p-4 md:p-6 lg:p-8">
                {/* ── MENU SCREEN ────────────────────────────────────── */}
                {screen === "menu" && (
                    <div className="max-w-xl mx-auto mt-12 space-y-8">
                        <div className="text-center">
                            <h1 className="text-2xl font-orbitron font-bold text-primary glow-text-cyan tracking-wider">
                                🛰️ SPACE QUIZ
                            </h1>
                            <p className="text-sm font-mono text-muted-foreground mt-2">
                                Test your cosmic knowledge! {QUESTIONS_PER_ROUND} questions, {TIME_PER_QUESTION}s each.
                            </p>
                        </div>

                        <div
                            className="rounded-xl border border-primary/30 p-6 text-center"
                            style={{
                                background: "hsl(228 60% 7% / 0.8)",
                                boxShadow: "0 0 30px hsl(195 100% 50% / 0.1)",
                            }}
                        >
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div className="bg-muted/20 rounded-lg p-3">
                                        <div className="text-xl">📝</div>
                                        <div className="text-[10px] font-mono text-muted-foreground mt-1">{QUESTIONS_PER_ROUND} Qs</div>
                                    </div>
                                    <div className="bg-muted/20 rounded-lg p-3">
                                        <div className="text-xl">⏱️</div>
                                        <div className="text-[10px] font-mono text-muted-foreground mt-1">{TIME_PER_QUESTION}s Timer</div>
                                    </div>
                                    <div className="bg-muted/20 rounded-lg p-3">
                                        <div className="text-xl">🏆</div>
                                        <div className="text-[10px] font-mono text-muted-foreground mt-1">Leaderboard</div>
                                    </div>
                                </div>

                                <button
                                    onClick={startQuiz}
                                    className="w-full px-6 py-3 rounded-lg text-sm font-orbitron font-bold tracking-wider transition-all hover:scale-105 hover:shadow-lg"
                                    style={{
                                        background: "linear-gradient(135deg, hsl(195 100% 50%), hsl(220 100% 50%))",
                                        color: "hsl(228 80% 4%)",
                                        boxShadow: "0 0 20px hsl(195 100% 50% / 0.4)",
                                    }}
                                >
                                    🚀 LAUNCH QUIZ
                                </button>
                            </div>
                        </div>

                        {/* Leaderboard */}
                        {leaderboard.length > 0 && (
                            <div
                                className="rounded-xl border border-border/40 p-5"
                                style={{ background: "hsl(228 60% 7% / 0.8)" }}
                            >
                                <h3 className="text-xs font-orbitron uppercase tracking-widest text-warning mb-4 text-center">
                                    🏆 LEADERBOARD
                                </h3>
                                <div className="space-y-2">
                                    {leaderboard.map((entry, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${i === 0 ? "bg-warning/10 border border-warning/30" : "bg-muted/10"
                                                }`}
                                        >
                                            <span className="text-xs font-mono font-bold w-6 text-center" style={{ color: i < 3 ? "gold" : "inherit" }}>
                                                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                                            </span>
                                            <span className="text-xs font-mono flex-1 text-foreground/80">{entry.name}</span>
                                            <span className="text-xs font-mono text-primary font-bold">
                                                {entry.score}/{entry.total}
                                            </span>
                                            <span className="text-[10px] font-mono text-muted-foreground">{entry.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── PLAYING SCREEN ─────────────────────────────────── */}
                {screen === "playing" && questions.length > 0 && (
                    <div className="max-w-2xl mx-auto mt-6 space-y-6">
                        {/* Progress Bar */}
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                                Q{current + 1}/{questions.length}
                            </span>
                            <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-500"
                                    style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-mono text-primary font-bold shrink-0">
                                Score: {score}
                            </span>
                        </div>

                        {/* Question Card */}
                        <div
                            className="rounded-xl border border-primary/30 p-6"
                            style={{
                                background: "hsl(228 60% 7% / 0.8)",
                                boxShadow: "0 0 30px hsl(195 100% 50% / 0.1)",
                            }}
                        >
                            {/* Timer + Question */}
                            <div className="flex items-start gap-4">
                                {/* Timer Ring */}
                                <div className="shrink-0 relative w-16 h-16">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                                        <circle cx="32" cy="32" r={timerRadius} fill="none" stroke="hsl(228 40% 12%)" strokeWidth="4" />
                                        <circle
                                            cx="32"
                                            cy="32"
                                            r={timerRadius}
                                            fill="none"
                                            stroke={timeLeft <= 5 ? "hsl(0 100% 64%)" : "hsl(195 100% 50%)"}
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            strokeDasharray={timerCircumference}
                                            strokeDashoffset={timerOffset}
                                            className="transition-all duration-1000 linear"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className={`text-sm font-orbitron font-bold ${timeLeft <= 5 ? "text-destructive animate-pulse" : "text-primary"}`}>
                                            {timeLeft}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-sm font-rajdhani font-medium text-foreground leading-relaxed flex-1">
                                    {questions[current].question}
                                </p>
                            </div>

                            {/* Options */}
                            <div className="mt-6 space-y-2.5">
                                {questions[current].options.map((opt, i) => {
                                    const isCorrect = i === questions[current].correct;
                                    const isSelected = i === selectedAnswer;
                                    let borderColor = "border-border/40";
                                    let bgColor = "bg-muted/10";

                                    if (showExplanation) {
                                        if (isCorrect) {
                                            borderColor = "border-success";
                                            bgColor = "bg-success/10";
                                        } else if (isSelected && !isCorrect) {
                                            borderColor = "border-destructive";
                                            bgColor = "bg-destructive/10";
                                        }
                                    } else if (isSelected) {
                                        borderColor = "border-primary";
                                        bgColor = "bg-primary/10";
                                    }

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleAnswer(i)}
                                            disabled={showExplanation}
                                            className={`w-full text-left px-4 py-3 rounded-lg border text-xs font-mono transition-all ${borderColor} ${bgColor} ${!showExplanation ? "hover:border-primary/50 hover:bg-primary/5 cursor-pointer" : ""
                                                }`}
                                        >
                                            <span className="font-bold text-muted-foreground mr-2">
                                                {String.fromCharCode(65 + i)}.
                                            </span>
                                            <span className="text-foreground/90">{opt}</span>
                                            {showExplanation && isCorrect && (
                                                <span className="ml-2 text-success">✓</span>
                                            )}
                                            {showExplanation && isSelected && !isCorrect && (
                                                <span className="ml-2 text-destructive">✗</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Explanation */}
                            {showExplanation && (
                                <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                                    <p className="text-[11px] font-mono text-foreground/80 leading-relaxed">
                                        💡 {questions[current].explanation}
                                    </p>
                                </div>
                            )}

                            {/* Next Button */}
                            {showExplanation && (
                                <div className="mt-4 text-right">
                                    <button
                                        onClick={nextQuestion}
                                        className="px-5 py-2 rounded-lg text-xs font-mono font-bold transition-all hover:scale-105"
                                        style={{
                                            background: "linear-gradient(135deg, hsl(195 100% 50%), hsl(220 100% 50%))",
                                            color: "hsl(228 80% 4%)",
                                        }}
                                    >
                                        {current + 1 >= questions.length ? "SEE RESULTS →" : "NEXT QUESTION →"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── RESULT SCREEN ──────────────────────────────────── */}
                {screen === "result" && (
                    <div className="max-w-lg mx-auto mt-12 space-y-6">
                        <div
                            className="rounded-xl border border-primary/30 p-8 text-center"
                            style={{
                                background: "hsl(228 60% 7% / 0.8)",
                                boxShadow: "0 0 30px hsl(195 100% 50% / 0.1)",
                            }}
                        >
                            {/* Grade Circle */}
                            <div
                                className="w-28 h-28 rounded-full mx-auto flex flex-col items-center justify-center mb-4"
                                style={{
                                    background: `linear-gradient(135deg, ${grade.color}20, ${grade.color}10)`,
                                    border: `3px solid ${grade.color}`,
                                    boxShadow: `0 0 30px ${grade.color}40`,
                                }}
                            >
                                <span className="text-3xl font-orbitron font-bold" style={{ color: grade.color }}>
                                    {grade.letter}
                                </span>
                                <span className="text-[10px] font-mono text-muted-foreground">{pct}%</span>
                            </div>

                            <h2 className="text-lg font-orbitron font-bold text-primary glow-text-cyan">
                                {grade.label}
                            </h2>
                            <p className="text-sm font-mono text-muted-foreground mt-2">
                                You scored <span className="text-primary font-bold">{score}</span> out of{" "}
                                <span className="text-primary font-bold">{questions.length}</span>
                            </p>

                            {/* Save Score */}
                            {!nameSaved && (
                                <div className="mt-6 flex gap-2 max-w-xs mx-auto">
                                    <input
                                        type="text"
                                        value={playerName}
                                        onChange={(e) => setPlayerName(e.target.value)}
                                        placeholder="Enter your name..."
                                        className="flex-1 bg-muted/30 border border-border/60 rounded-lg px-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
                                        onKeyDown={(e) => e.key === "Enter" && saveScore()}
                                    />
                                    <button
                                        onClick={saveScore}
                                        className="px-4 py-2 rounded-lg text-xs font-mono font-bold"
                                        style={{
                                            background: "linear-gradient(135deg, hsl(45 100% 50%), hsl(30 100% 50%))",
                                            color: "hsl(228 80% 4%)",
                                        }}
                                    >
                                        SAVE
                                    </button>
                                </div>
                            )}
                            {nameSaved && (
                                <p className="text-xs font-mono text-success mt-4 animate-pulse">✓ Score saved to leaderboard!</p>
                            )}

                            {/* Actions */}
                            <div className="mt-6 flex gap-3 justify-center">
                                <button
                                    onClick={startQuiz}
                                    className="px-5 py-2.5 rounded-lg text-xs font-mono font-bold transition-all hover:scale-105"
                                    style={{
                                        background: "linear-gradient(135deg, hsl(195 100% 50%), hsl(220 100% 50%))",
                                        color: "hsl(228 80% 4%)",
                                    }}
                                >
                                    🔄 PLAY AGAIN
                                </button>
                                <button
                                    onClick={() => setScreen("menu")}
                                    className="px-5 py-2.5 rounded-lg text-xs font-mono font-bold border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                                >
                                    📊 LEADERBOARD
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Quiz;
