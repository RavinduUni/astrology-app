import express from 'express';
import cors from 'cors';
import mainRouter from './routes/mainRouter.js';
import dotenv from 'dotenv';
import { connectDB } from './configs/db.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB once at startup
await connectDB();

app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Register all API routes
app.use("/api", mainRouter);

// Only bind a port when running locally — Vercel manages the HTTP server itself
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
