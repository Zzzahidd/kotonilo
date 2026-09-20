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
    },
    (info) => {
      console.log(`[Server] Koto Nilo API Server running on http://localhost:${info.port}`);
    }
  );
}

bootstrap();
