import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();
const prisma = new PrismaClient();

// Schema for hackathon creation validation
const createHackathonSchema = z.object({
  name: z.string().min(1, 'Hackathon name is required'),
  description: z.string().min(1, 'Description is required'),
  theme: z.string().min(1, 'Theme is required'),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Start date must be a valid date string',
  }),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'End date must be a valid date string',
  }),
});

// Create a new hackathon
router.post('/', async (req, res) => {
  try {
    const data = createHackathonSchema.parse(req.body);
    
    const hackathon = await prisma.hackathon.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    });
    
    res.status(201).json({ message: 'Hackathon created successfully', hackathon });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// List hackathons with pagination
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const hackathons = await prisma.hackathon.findMany({
    skip: parseInt(skip),
    take: parseInt(limit),
    orderBy: { startDate: 'asc' },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      theme: true,
      _count: { select: { teams: true } },
    },
  });

  // Remove _count from response and put the value in registeredTeamsCount
  const formattedHackathons = hackathons.map(({ _count, ...hackathon }) => ({
    ...hackathon,
    registeredTeams: _count.teams,
  }));

  res.json(formattedHackathons);
});

// Get hackathon details
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const hackathon = await prisma.hackathon.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      theme: true,
      teams: {
        select: {
          id: true,
          name: true,
          users: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    }
  });

  if (!hackathon) {
    return res.status(404).json({ error: 'Hackathon not found' });
  }

  res.json(hackathon);
});

export default router;
