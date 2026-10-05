import { serve } from '@hono/node-server';
import { app } from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

async function bootstrap() {
  await connectDB();

  serve(
    {
      fetch: app.fetch,
      port: env.PORT,
      hostname: '0.0.0.0',
    },
    (info) => {
      console.log(`[Server] Koto Nilo API Server running on port ${info.port}`);
    }
  );
}

bootstrap();
