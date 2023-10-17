import express  from 'express';
import connectMongo from './database/connectMongo';
import bodyParser  from 'body-parser';
import cors from 'cors';
import apiRouter from './routers/apiRouters'

require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

connectMongo()

const port = process.env.SERVER_PORT || 8080;

app.use('/api', apiRouter);

app.listen(port, () => console.log(`Running on port ${port}`));