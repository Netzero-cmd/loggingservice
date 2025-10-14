import './App.js';
import express from 'express';
import requestIp from 'request-ip';
const app = express();
import morgan from 'morgan';
import { connectDB } from './config/config.js';
import bodyParser from 'body-parser';
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(requestIp.mw());
app.use(morgan('dev'));


app.get('/', (req, res) => {
    console.log('IP Address:', req.clientIp);
    res.send('API is running....');
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    connectDB();
});