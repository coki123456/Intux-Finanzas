import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// API Routes
app.get('/api/expenses', async (req, res) => {
    try {
        const expenses = await prisma.expense.findMany({
            orderBy: { date: 'desc' },
        });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching expenses' });
    }
});

app.post('/api/expenses', async (req, res) => {
    try {
        const { concept, amount, payer, date, currency } = req.body;
        const expense = await prisma.expense.create({
            data: { concept, amount, payer, date: new Date(date), currency },
        });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ error: 'Error creating expense' });
    }
});

app.put('/api/expenses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { concept, amount, payer, date, currency } = req.body;
        const expense = await prisma.expense.update({
            where: { id },
            data: { concept, amount, payer, date: new Date(date), currency },
        });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ error: 'Error updating expense' });
    }
});

app.delete('/api/expenses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.expense.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting expense' });
    }
});

app.get('/api/settings', async (req, res) => {
    try {
        let settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
        if (!settings) {
            settings = await prisma.appSettings.create({ data: { id: 1 } });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching settings' });
    }
});

app.post('/api/settings', async (req, res) => {
    try {
        const { partner_a_name, partner_b_name } = req.body;
        const settings = await prisma.appSettings.upsert({
            where: { id: 1 },
            update: { partnerAName: partner_a_name, partnerBName: partner_b_name },
            create: { id: 1, partnerAName: partner_a_name, partnerBName: partner_b_name },
        });
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Error updating settings' });
    }
});

// Fallback for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
