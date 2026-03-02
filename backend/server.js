import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cron from 'node-cron'; 
import db from './config/connection.js';
import authRoutes from './routes/auth.routes.js';
import processQueue from './workers/queue.worker.js'; 
import botRoutes from './routes/bot.routes.js';
import conversationRoutes from './routes/conversation.schema.js';

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cors({
    origin: "*",
    credentials: true
}));                                

app.use('/user', authRoutes);
app.use('/bot',botRoutes);
app.use('/conversation',conversationRoutes);



cron.schedule("*/30 * * * * *", async () => {
    console.log("Queue worker running...");
    await processQueue();
});



const PORT = process.env.PORT || 3004;

app.listen(PORT, async () => {
    await db();
    console.log(`Server is running on ${PORT}`);
});
