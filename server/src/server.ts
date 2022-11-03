import Fastify from "fastify";

import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { pollRoutes } from "./routes/poll";
import { authRoutes } from "./routes/auth";
import { gameRoutes } from "./routes/game";
import { guessRoutes } from "./routes/guess";
import { userRoutes } from "./routes/user";

bootstrap();
async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(jwt, {
    secret: "a59ce5803b705c2a763fc2202b2a8e88fd75d7bc9c2fd5cf86f9ea1e30c91ac6",
  });

  await fastify.register(pollRoutes);
  await fastify.register(authRoutes);
  await fastify.register(gameRoutes);
  await fastify.register(guessRoutes);
  await fastify.register(userRoutes);

  await fastify.listen({ port: 3333, host: "0.0.0.0" });
}
