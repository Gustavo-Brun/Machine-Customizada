import fastify from 'fastify';
import cors from '@fastify/cors';

const app = fastify();

const corsOptions = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
};

app.register(cors, corsOptions);

app.listen({ host: '0.0.0.0', port: 4433 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
