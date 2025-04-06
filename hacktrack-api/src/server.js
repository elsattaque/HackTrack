import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import hackathonRoutes from './routes/hackathons.js';
import teamRoutes from './routes/teams.js';
import redoc from 'redoc-express';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/hackathons', hackathonRoutes);
app.use('/teams', teamRoutes);

// Redoc API documentation
app.get('/docs', redoc({
  title: 'HackTrack API Documentation',
  specUrl: '/docs/openapi.json',
}));

// Serve OpenAPI spec
app.get('/docs/openapi.json', (req, res) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'HackTrack API',
      version: '1.0.0',
      description: 'API documentation for HackTrack',
    },
    paths: {
      '/auth/register': {
        post: {
          summary: 'Register a new user',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    name: { type: 'string' },
                  },
                  required: ['email', 'password', 'name'],
                },
              },
            },
          },
          responses: {
            201: { description: 'User registered successfully' },
            400: { description: 'Validation error' },
          },
        },
      },
      '/auth/login': {
        post: {
          summary: 'Login and receive JWT',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                  },
                  required: ['email', 'password'],
                },
              },
            },
          },
          responses: {
            200: { description: 'Login successful, returns JWT' },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/auth/me': {
        get: {
          summary: 'Get current user profile',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Returns user profile' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/hackathons': {
        get: {
          summary: 'List hackathons with pagination',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer' }, required: false },
            { name: 'limit', in: 'query', schema: { type: 'integer' }, required: false },
          ],
          responses: {
            200: { description: 'Returns a list of hackathons' },
          },
        },
      },
      '/hackathons/{id}': {
        get: {
          summary: 'Get details of a specific hackathon',
          parameters: [
            { name: 'id', in: 'path', schema: { type: 'integer' }, required: true },
          ],
          responses: {
            200: { description: 'Returns hackathon details' },
            404: { description: 'Hackathon not found' },
          },
        },
      },
      '/teams/create': {
        post: {
          summary: 'Create a new team for a hackathon',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    hackathonId: { type: 'integer' },
                  },
                  required: ['name', 'hackathonId'],
                },
              },
            },
          },
          responses: {
            201: { description: 'Team created successfully' },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/teams/join/{teamId}': {
        post: {
          summary: 'Join an existing team',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'teamId', in: 'path', schema: { type: 'integer' }, required: true },
          ],
          responses: {
            201: { description: 'Joined team successfully' },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  });
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
