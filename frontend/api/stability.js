import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
);

function cors(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
}

export default async function handler(req, res) {
    cors(res);
    if (req.method === "OPTIONS") return res.status(200).end();

    try {
        const url = req.url;

        // GET /api/stability/latest
        if (url.includes("/latest") && req.method === "GET") {
            const types = ["weather", "solar_wind", "radiation"];
            const results = {};
            await Promise.all(
                types.map(async (type) => {
                    const { data, error } = await supabase
                        .from("stability_scores")
                        .select("*")
                        .eq("sensor_type", type)
                        .order("computed_at", { ascending: false })
                        .limit(1)
                        .maybeSingle();
                    if (!error) results[type] = data;
                })
            );
            return res.json({ success: true, data: results });
        }

        // GET /api/stability/history
        if (url.includes("/history") && req.method === "GET") {
            const { sensor_type, from, to, limit = 200 } = req.query;
            let query = supabase
                .from("stability_scores")
                .select("sensor_type, score, drift_detected, drift_magnitude, computed_at")
                .order("computed_at", { ascending: true })
                .limit(Number(limit));
            if (sensor_type) query = query.eq("sensor_type", sensor_type);
            if (from) query = query.gte("computed_at", from);
            if (to) query = query.lte("computed_at", to);

            const { data, error } = await query;
            if (error) throw error;
            return res.json({ success: true, count: data.length, data });
        }

        // GET /api/stability/drift
        if (url.includes("/drift") && req.method === "GET") {
            const { sensor_type, limit = 50 } = req.query;
            let query = supabase
                .from("stability_scores")
                .select("*")
                .eq("drift_detected", true)
                .order("computed_at", { ascending: false })
                .limit(Number(limit));
            if (sensor_type) query = query.eq("sensor_type", sensor_type);

            const { data, error } = await query;
            if (error) throw error;
            return res.json({ success: true, count: data.length, data });
        }

        // POST /api/stability
        if (req.method === "POST") {
            const { sensor_type, score, window_hours, model_version, drift_detected, drift_magnitude, metadata } = req.body;
            if (!sensor_type || score === undefined)
                return res.status(400).json({ error: "sensor_type and score are required" });
            if (score < 0 || score > 1)
                return res.status(400).json({ error: "score must be between 0.0 and 1.0" });

            const { data, error } = await supabase
                .from("stability_scores")
                .insert([{
                    sensor_type, score, window_hours: window_hours || 24,
                    model_version: model_version || "1.0.0", drift_detected: drift_detected ?? false,
                    drift_magnitude: drift_magnitude ?? null, metadata: metadata || {},
                    computed_at: new Date().toISOString(),
                }])
                .select()
                .single();
            if (error) throw error;
            return res.status(201).json({ success: true, data });
        }

        // GET /api/stability (fallback)
        if (req.method === "GET") {
            return res.json({ success: true, message: "Use /latest, /history, or /drift" });
        }

        return res.status(405).json({ error: "Method not allowed" });
    } catch (err) {
        return res.status(500).json({ error: err.message || "Internal server error" });
    }
}
