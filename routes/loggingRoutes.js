import express from 'express';
import { createLog } from '../Controllers/logscreateControllers.js';
const router = express.Router();


router.post('/logs', createLog);
// router.get('/logs')
// router.get('/logs/:id')
// router.put('/logs/:id')
// router.delete('/logs/:id')
// router.get('correlation/:correlationId')

export default router;