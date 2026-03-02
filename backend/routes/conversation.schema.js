import express from 'express';
import { chatHistory } from '../controllers/conversation.controller.js';


const conversationRoutes = express.Router();


conversationRoutes.get('/history', chatHistory);

export default conversationRoutes;