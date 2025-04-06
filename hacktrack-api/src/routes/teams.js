import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();
const prisma = new PrismaClient();

// Schema for team creation validation
const createTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  hackathonId: z.number().int().positive('Hackathon ID must be a positive integer'),
});

// Create a new team for a hackathon
router.post('/create', authenticate, async (req, res) => {
  try {
    const data = createTeamSchema.parse(req.body); // Validate input data
    const team = await prisma.team.create({
      data: {
        name: data.name,
        hackathon: { connect: { id: data.hackathonId } },
        users: {
          connect: { id: req.userId },
        },
      },
    });
    res.status(201).json({ message: 'Team created successfully', team });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Join an existing team
router.post('/join/:teamId', authenticate, async (req, res) => {
  const { teamId } = req.params;

  try {
    await prisma.team.update({
      where: { id: parseInt(teamId) },
      data: {
        users: {
          connect: { id: req.userId },
        },
      },
    });
    res.status(201).json({ message: 'Joined team successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
