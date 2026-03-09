import expressApp from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: path.join(__dirname, "../.env") });

const app = expressApp();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(expressApp.json());

// API Key Middleware
const apiKeyAuth = (
  req: expressApp.Request,
  res: expressApp.Response,
  next: expressApp.NextFunction,
) => {
  const apiKey = req.headers["x-api-key"];
  const lilloPass = process.env.LILLO_PASSWORD;
  const cokiPass = process.env.COKI_PASSWORD;

  if (!apiKey) {
    return res.status(401).json({ error: "No API key provided" });
  }

  if (apiKey !== lilloPass && apiKey !== cokiPass) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  next();
};

app.use("/api", apiKeyAuth);

// API Routes
app.get("/api/expenses", async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { date: "desc" },
    });
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/expenses", async (req, res) => {
  try {
    const expense = await prisma.expense.create({
      data: req.body,
    });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/expenses/:id", async (req, res) => {
  try {
    const expense = await prisma.expense.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/expenses/:id", async (req, res) => {
  try {
    await prisma.expense.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/settings", async (req, res) => {
  try {
    const settings = await prisma.appSettings.findUnique({
      where: { id: 1 },
    });
    // Return array to match previous PostgREST expectation, or adapt frontend.
    // The previous frontend expected an array due to PostgREST, let's wrap it in an array or object.
    // Our refactored `useFinance.ts` handles both!
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/settings", async (req, res) => {
  try {
    const { partnerAName, partnerBName, partner_a_name, partner_b_name } =
      req.body;
    const settings = await prisma.appSettings.upsert({
      where: { id: 1 },
      update: {
        partnerAName: partnerAName || partner_a_name,
        partnerBName: partnerBName || partner_b_name,
      },
      create: {
        id: 1,
        partnerAName: partnerAName || partner_a_name || "Lillo",
        partnerBName: partnerBName || partner_b_name || "Coki",
      },
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Serve frontend in production
const distPath = path.join(__dirname, "../dist");
app.use(expressApp.static(distPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
