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
        // GET /api/sensor/latest
        if (req.url.includes("/latest") && req.method === "GET") {
            const types = ["weather", "solar_wind", "radiation"];
            const results = {};
            await Promise.all(
                types.map(async (type) => {
                    const { data, error } = await supabase
                        .from("sensor_readings")
                        .select("*")
                        .eq("sensor_type", type)
                        .order("recorded_at", { ascending: false })
                        .limit(1)
                        .maybeSingle();
                    if (!error) results[type] = data;
                })
            );
            return res.json({ success: true, data: results });
        }

        // POST /api/sensor/batch
        if (req.url.includes("/batch") && req.method === "POST") {
            const { readings } = req.body;
            if (!Array.isArray(readings) || readings.length === 0)
                return res.status(400).json({ error: "readings must be a non-empty array" });
            if (readings.length > 500)
                return res.status(400).json({ error: "Batch limit is 500 readings" });

            const rows = readings.map((r) => ({
                sensor_type: r.sensor_type,
                value: r.value,
                unit: r.unit,
                source: r.source || "batch",
                metadata: r.metadata || {},
                recorded_at: r.recorded_at || new Date().toISOString(),
            }));
            const { data, error } = await supabase.from("sensor_readings").insert(rows).select();
            if (error) throw error;
            return res.status(201).json({ success: true, inserted: data.length });
        }

        // POST /api/sensor
        if (req.method === "POST") {
            const { sensor_type, value, unit, source, metadata } = req.body;
            if (!sensor_type || value === undefined || !unit)
                return res.status(400).json({ error: "sensor_type, value, and unit are required" });

            const { data, error } = await supabase
                .from("sensor_readings")
                .insert([{ sensor_type, value, unit, source: source || "esp32", metadata: metadata || {}, recorded_at: new Date().toISOString() }])
                .select()
                .single();
            if (error) throw error;
            return res.status(201).json({ success: true, data });
        }

        // GET /api/sensor
        if (req.method === "GET") {
            const { sensor_type, source, from, to, limit = 100, offset = 0 } = req.query;
            let query = supabase
                .from("sensor_readings")
                .select("*")
                .order("recorded_at", { ascending: false })
                .range(Number(offset), Number(offset) + Number(limit) - 1);
            if (sensor_type) query = query.eq("sensor_type", sensor_type);
            if (source) query = query.eq("source", source);
            if (from) query = query.gte("recorded_at", from);
            if (to) query = query.lte("recorded_at", to);

            const { data, error } = await query;
            if (error) throw error;
            return res.json({ success: true, count: data.length, data });
        }

        return res.status(405).json({ error: "Method not allowed" });
    } catch (err) {
        return res.status(500).json({ error: err.message || "Internal server error" });
    }
}
