import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';

const app = fastify();

const corsOptions = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
};

app.register(cors, corsOptions);

interface ConvertBody {
  from: 2 | 8 | 10 | 16;
  to: 2 | 8 | 10 | 16;
  value: string | number;
}

app.post(
  '/convert',
  {
    schema: {
      body: {
        type: 'object',
        properties: {
          from: {
            type: 'number',
            enum: [2, 8, 10, 16]
          },
          to: {
            type: 'number',
            enum: [2, 8, 10, 16]
          },
          value: {
            anyOf: [{ type: 'string' }, { type: 'number' }]
          }
        },
        required: ['from', 'to', 'value']
      }
    }
  },
  (req: FastifyRequest, reply: FastifyReply) => {
    const { from, to, value } = req.body as ConvertBody;

    try {
      const decimalValue = parseInt(value.toString(), from);

      if (isNaN(decimalValue)) {
        return reply.code(400).send({
          status: 400,
          errorCode: 'CON-02',
          errorMessage: 'Invalid value for the source base.'
        });
      }

      const result = decimalValue.toString(to);

      return reply.code(200).send({
        data: result
      });
    } catch (error) {
      console.log(error);

      return reply.code(500).send({
        status: 500,
        errorCode: 'CON-01',
        errorMessage: 'Unexpected error to convert.'
      });
    }
  }
);

app.get('/', async () => {
  return { status: 'ok' };
});

app.listen({ host: '0.0.0.0', port: 4433 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
