const express = require("express");
const app = express();

app.use(express.json());

// prevent crash on bad JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        return res.status(400).json({ success: false });
    }
    next();
});

// ---------------- DATA ----------------
let keys = {
    "SAINT-123": { used: false },
    "VIP-999": { used: false }
};

let users = {};

// ---------------- REGISTER ----------------
app.post("/register", (req, res) => {
    const { username, key } = req.body;

    if (!username || !key)
        return res.json({ success: false });

    if (users[username])
        return res.json({ success: false });

    if (!keys[key] || keys[key].used)
        return res.json({ success: false });

    keys[key].used = true;
    users[username] = { key };

    console.log("REGISTER:", username);

    res.json({ success: true });
});

// ---------------- LOGIN ----------------
app.post("/login", (req, res) => {
    const { username, key } = req.body;

    if (!users[username])
        return res.json({ success: false });

    if (users[username].key !== key)
        return res.json({ success: false });

    console.log("LOGIN:", username);

    res.json({ success: true });
});

// ---------------- TEST ----------------
app.get("/", (req, res) => {
    res.send("Server running");
});

// ---------------- PORT FIX ----------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});