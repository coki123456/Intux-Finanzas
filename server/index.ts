import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

// Carga robusta de variables de entorno
const cargarConfiguracion = () => {
  const rutasPosibles = [
    join(__dirname, "../.env"),
    join(process.cwd(), ".env"),
    join(process.cwd(), "server/.env"),
  ];

  for (const ruta of rutasPosibles) {
    const resultado = dotenv.config({ path: ruta });
    if (!resultado.error) {
      console.log(`Configuración cargada desde: ${ruta}`);
      return;
    }
  }
  console.warn(
    "Advertencia: No se encontró archivo .env en las rutas habituales. Se usarán variables de entorno del sistema.",
  );
};

cargarConfiguracion();

const app = express();
const prisma = new PrismaClient();
const PUERTO = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Middleware de Autenticación por API Key
const autenticacionApiKey = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const claveApi = req.headers["x-api-key"];
  const passLillo = process.env.LILLO_PASSWORD;
  const passCoki = process.env.COKI_PASSWORD;

  if (!claveApi) {
    return res.status(401).json({ error: "No se proporcionó API Key" });
  }

  if (claveApi !== passLillo && claveApi !== passCoki) {
    return res.status(403).json({ error: "API Key inválida" });
  }

  next();
};

app.use("/api", autenticacionApiKey);

// Rutas de la API
app.get("/api/expenses", async (req, res) => {
  try {
    const gastos = await prisma.expense.findMany({
      orderBy: { date: "desc" },
    });
    res.json(gastos);
  } catch (error) {
    console.error("Error al obtener gastos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.post("/api/expenses", async (req, res) => {
  try {
    const datos = { ...req.body };
    if (datos.date) {
      datos.date = new Date(datos.date);
    }
    const gasto = await prisma.expense.create({
      data: datos,
    });
    res.json(gasto);
  } catch (error) {
    console.error("Error al crear gasto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.put("/api/expenses/:id", async (req, res) => {
  try {
    const datos = { ...req.body };
    if (datos.date) {
      datos.date = new Date(datos.date);
    }
    const gasto = await prisma.expense.update({
      where: { id: req.params.id },
      data: datos,
    });
    res.json(gasto);
  } catch (error) {
    console.error("Error al actualizar gasto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.delete("/api/expenses/:id", async (req, res) => {
  try {
    await prisma.expense.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar gasto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/api/settings", async (req, res) => {
  try {
    const configuracion = await prisma.appSettings.findUnique({
      where: { id: 1 },
    });
    res.json(configuracion ?? { partnerAName: "Lillo", partnerBName: "Coki" });
  } catch (error) {
    console.error("Error al obtener configuración:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.post("/api/settings", async (req, res) => {
  try {
    const { partnerAName, partnerBName } = req.body;
    const configuracion = await prisma.appSettings.upsert({
      where: { id: 1 },
      update: {
        partnerAName,
        partnerBName,
      },
      create: {
        id: 1,
        partnerAName: partnerAName || "Lillo",
        partnerBName: partnerBName || "Coki",
      },
    });
    res.json(configuracion);
  } catch (error) {
    console.error("Error al guardar configuración:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Servir frontend en producción
const rutaDist = join(__dirname, "../dist");
app.use(express.static(rutaDist));

// Fallback para SPA (Single Page Application)
app.use((req, res) => {
  res.sendFile(join(rutaDist, "index.html"));
});

app.listen(PUERTO, () => {
  console.log(`Servidor ejecutándose en el puerto ${PUERTO}`);
});
