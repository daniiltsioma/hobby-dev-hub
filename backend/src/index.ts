import express from "express";
import "dotenv/config";

const port = process.env.PORT || 8000;

const app = express();

app.get("/api/login", (req) => {
    console.log(`Github code: ${req.query.code}`);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
