import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 5000;

app.use(cors());

app.get("/api/repos", async (req, res) => {
  const { q, page = 1 } = req.query;
  if (!q || q.length < 1) {
    return res.status(422).json({ error: "Consulta inválida." });
  }

  try {
    const response = await axios.get("https://api.github.com/search/repositories", {
      params: {
        q,
        sort: "stars",
        order: "desc",
        page,
        per_page: 6,
      },
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    });

    return res.json(response.data);
  } catch (error) {
    if (error.response?.status === 403) {
      return res.status(403).json({ error: "Limite de requisições da API do GitHub atingido." });
    }
    return res.status(500).json({ error: "Erro ao buscar dados do GitHub." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

