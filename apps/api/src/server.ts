import { app } from './app';
import { env } from './config/env';

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  console.log(`[LeakLens Server] Running on port ${PORT} in ${env.NODE_ENV} mode`);
});

// Graceful shutdowns on deployment platforms (e.g. Render, AWS, Heroku)
process.on('SIGTERM', () => {
  console.log('[LeakLens Server] SIGTERM signal received. Initiating graceful shutdown...');
  server.close(() => {
    console.log('[LeakLens Server] HTTP server closed. Process exiting.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[LeakLens Server] SIGINT signal received. Initiating graceful shutdown...');
  server.close(() => {
    console.log('[LeakLens Server] HTTP server closed. Process exiting.');
    process.exit(0);
  });
});
