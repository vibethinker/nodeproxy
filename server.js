import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import https from "https";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const app = express();

app.use(cors());

app.use(express.json());

const agent = new https.Agent({
    rejectUnauthorized: false
});

app.get("/", (req, res) => {

    res.send("Kerala Result Proxy Running");
});

app.post("/result", async (req, res) => {

    try {

        const {
            regno,
            exam_type,
            dob
        } = req.body;

        if (!regno || !exam_type || !dob) {

            return res.status(400).json({
                success: false,
                error: "Missing required fields"
            });
        }

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

                body: form,

                agent
            }
        );

        const html = await response.text();

        res.setHeader("Content-Type", "text/html");

        res.send(html);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);
});
