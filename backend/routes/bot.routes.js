import express from 'express';
import { checkToken } from '../middleware/auth.middleware.js';
import upload from '../utils/upload.js';
import { docUpload } from '../controllers/docupload.controller.js';
import { checkBot } from '../controllers/checkBot.controller.js';
import { getscript } from '../controllers/getscript.controller.js';
import { botQuestion } from "../controllers/bot.response.controller.js"
import {addDoc, deleteBot} from "../controllers/bot.delete.controller.js"

const botRoutes = express.Router();


botRoutes.post('/upload', checkToken, upload.single('document'), docUpload);
botRoutes.post('/test', checkToken, checkBot);
botRoutes.get('/script', checkToken, getscript);
botRoutes.post('/ask', botQuestion);
botRoutes.post('/add',checkToken,upload.single('document'),addDoc);
botRoutes.delete('/delete',checkToken,deleteBot);



export default botRoutes;