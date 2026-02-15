import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
);

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") return res.status(200).end();

    const start = Date.now();
    const { error } = await supabase.from("sensor_readings").select("id").limit(1);
    const dbStatus = error ? "unreachable" : "ok";

    res.status(dbStatus === "ok" ? 200 : 503).json({
        status: dbStatus === "ok" ? "healthy" : "degraded",
        timestamp: new Date().toISOString(),
        response_ms: Date.now() - start,
        database: dbStatus,
        version: "1.0.0",
    });
}
