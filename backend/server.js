import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import speakerRoutes from './routes/speakerRoutes.js';
import speechRoutes from './routes/speechRoutes.js'; // 1. Import your new router file

dotenv.config();

const app = express();

// 🚀 Allow both local development and your live production Vercel frontend URL
const allowedOrigins = [
  'http://localhost:5173',
  'https://tntjslmbayan.vercel.app'
];

// 🎯 FIXED: Removed duplicate 'require' line and unified your configuration properties safely
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
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

// 🎯 FIXED FOR VERCEL DEPLOYMENT: Only run the listener locally, let Vercel handle production execution environments
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is operating smoothly on port ${PORT}`);
  });
}

export default app; // 🚀 CRUCIAL FOR VERCEL SERVERLESS RUNTIME LOGIC