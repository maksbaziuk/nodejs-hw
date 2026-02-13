import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat:
          '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

app.get('/notes/:noteId', (req, res) => {
  const id = Number.parseInt(req.params.noteId, 10);

  if (Number.isNaN(id)) {
    res.status(400).json({ message: 'Please provide a valid id' });
    return;
  }

  res.json({
    message: `Retrieved note with ID: ${id}`,
  });
});

app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    message: 'Internal Server Error',
  });
});

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Server is running on port ${PORT}`);
});
