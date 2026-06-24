import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import speakerRoutes from './routes/speakerRoutes.js';
import speechRoutes from './routes/speechRoutes.js'; // 1. Import your new router file

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,               
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('TNTJ Bayan Backend Server is Running...');
});

app.use('/api/speakers', speakerRoutes);
app.use('/api/speech', speechRoutes); // 2. Mount it under the exact path your frontend fetches from!

app.listen(PORT, () => {
  console.log(`Server is operating smoothly on port ${PORT}`);
});