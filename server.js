import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
});

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: accessLogStream }));
}

app.get('/', (req, res) => res.send('<h1>Hi there!</h1>'));

app.listen(PORT, () => {
  console.log(`Started server on port ${PORT}, url: http://localhost:${PORT}`);
});
