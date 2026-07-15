import express from "express";
import cors from "cors";
import spawnPointRoutes from "./routes/spawnPoints.js";
import sideQuestRoutes from "./routes/sideQuests.js";
import conRoutes from "./routes/cons.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "404 Offline API is live 🍑" });
});

app.use("/api/spawn-points", spawnPointRoutes);
app.use("/api/side-quests", sideQuestRoutes);
app.use("/api/cons", conRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});