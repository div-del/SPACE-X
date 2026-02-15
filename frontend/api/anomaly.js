import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
);

function cors(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
}

export default async function handler(req, res) {
    cors(res);
    if (req.method === "OPTIONS") return res.status(200).end();

    try {
        const url = req.url;

        // GET /api/anomaly/summary
        if (url.includes("/summary") && req.method === "GET") {
            const { data, error } = await supabase.from("anomalies").select("severity");
            if (error) throw error;
            const summary = data.reduce(
                (acc, row) => { acc[row.severity] = (acc[row.severity] || 0) + 1; return acc; },
                { low: 0, medium: 0, high: 0, critical: 0 }
            );
            return res.json({ success: true, data: summary });
        }

        // PATCH /api/anomaly/:id/acknowledge
        if (url.includes("/acknowledge") && req.method === "PATCH") {
            const parts = url.split("/");
            const idIndex = parts.findIndex((p) => p === "anomaly") + 1;
            const id = parts[idIndex];
            if (!id) return res.status(400).json({ error: "Missing anomaly id" });

            const { data, error } = await supabase
                .from("anomalies")
                .update({ acknowledged: true, acknowledged_at: new Date().toISOString() })
                .eq("id", id)
                .select()
                .single();
            if (error) throw error;
            if (!data) return res.status(404).json({ error: "Anomaly not found" });
            return res.json({ success: true, data });
        }

        // POST /api/anomaly
        if (req.method === "POST") {
            const { sensor_type, reading_id, value, threshold, severity, model_version, description, metadata } = req.body;
            if (!sensor_type || value === undefined || !severity)
                return res.status(400).json({ error: "sensor_type, value, and severity are required" });

            const validSeverities = ["low", "medium", "high", "critical"];
            if (!validSeverities.includes(severity))
                return res.status(400).json({ error: `severity must be one of: ${validSeverities.join(", ")}` });

            const { data, error } = await supabase
                .from("anomalies")
                .insert([{
                    sensor_type, reading_id: reading_id || null, value, threshold: threshold ?? null,
                    severity, model_version: model_version || "1.0.0", description: description || null,
                    metadata: metadata || {}, detected_at: new Date().toISOString(), acknowledged: false,
                }])
                .select()
                .single();
            if (error) throw error;
            return res.status(201).json({ success: true, data });
        }

        // GET /api/anomaly
        if (req.method === "GET") {
            const { sensor_type, severity, acknowledged, from, to, limit = 50, offset = 0 } = req.query;
            let query = supabase
                .from("anomalies")
                .select("*")
                .order("detected_at", { ascending: false })
                .range(Number(offset), Number(offset) + Number(limit) - 1);
            if (sensor_type) query = query.eq("sensor_type", sensor_type);
            if (severity) query = query.eq("severity", severity);
            if (acknowledged !== undefined) query = query.eq("acknowledged", acknowledged === "true");
            if (from) query = query.gte("detected_at", from);
            if (to) query = query.lte("detected_at", to);

            const { data, error } = await query;
            if (error) throw error;
            return res.json({ success: true, count: data.length, data });
        }

        return res.status(405).json({ error: "Method not allowed" });
    } catch (err) {
        return res.status(500).json({ error: err.message || "Internal server error" });
    }
}
