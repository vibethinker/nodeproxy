import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import https from "https";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.options("*", cors());

const agent = new https.Agent({
    rejectUnauthorized: false
});

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Kerala Result Proxy Running"
    });
});

app.post("/result", async (req, res) => {

    try {

        console.log("BODY:", req.body);

        const {
            regno,
            exam_type,
            dob
        } = req.body;

        const form = new URLSearchParams();

        form.append("regno", regno);
        form.append("exam_type", exam_type);
        form.append("dob", dob);
        form.append("action", "loadLSSResult");

        const response = await fetch(
            "https://bpekerala.in/lss_uss_2026/controller/result_viewController.php",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "User-Agent": "Mozilla/5.0"
                },

                body: form.toString(),

                agent
            }
        );

        console.log("STATUS:", response.status);

        const html = await response.text();

        console.log("HTML RECEIVED");

        res.setHeader("Access-Control-Allow-Origin", "*");

        res.setHeader(
            "Content-Type",
            "text/html; charset=UTF-8"
        );

        res.send(html);

    } catch(err) {

        console.error("ERROR:", err);

        res.setHeader("Access-Control-Allow-Origin", "*");

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Running on ${PORT}`);
});
