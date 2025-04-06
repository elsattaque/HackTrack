import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const hackathons = [
    {
      name: 'Innovateurs en IA',
      description: 'Explorez les dernières avancées en IA et apprentissage automatique.',
      theme: 'IA',
      startDate: new Date('2025-03-20T10:00:00Z'),
      endDate: new Date('2025-03-20T17:00:00Z'),
    },
    {
      name: 'Hack GreenTech',
      description: 'Innovez pour un avenir durable.',
      theme: 'Durabilité',
      startDate: new Date('2025-04-15T08:00:00Z'),
      endDate: new Date('2025-04-16T16:00:00Z'),
    },
    {
      name: 'Défi HealthTech',
      description: 'Créez des solutions pour améliorer les soins de santé.',
      theme: 'Santé',
      startDate: new Date('2025-04-20T09:00:00Z'),
      endDate: new Date('2025-04-22T18:00:00Z'),
    },
    {
      name: 'Hackathon FinTech',
      description: 'Révolutionnez l’industrie financière avec des solutions innovantes.',
      theme: 'Finance',
      startDate: new Date('2025-05-10T09:00:00Z'),
      endDate: new Date('2025-05-10T18:00:00Z'),
    },
    {
      name: 'Smart Cities',
      description: 'Concevez la ville intelligente de demain.',
      theme: 'Urbanisme',
      startDate: new Date('2025-06-05T10:00:00Z'),
      endDate: new Date('2025-06-06T16:00:00Z'),
    },
    {
      name: 'Tomorrow School',
      description: 'Hackathon pour l’éducation du futur.',
      theme: 'Éducation',
      startDate: new Date('2025-06-20T08:00:00Z'),
      endDate: new Date('2025-06-21T16:00:00Z'),
    },
    {
      name: 'French Open Data',
      description: 'Exploitez le potentiel des données ouvertes.',
      theme: 'Data',
      startDate: new Date('2025-07-10T09:00:00Z'),
      endDate: new Date('2025-07-11T18:00:00Z'),
    }
  ];

  for (const hackathon of hackathons) {
    await prisma.hackathon.create({ data: hackathon });
  }

  console.log('Les données des hackathons ont été ajoutées à la base de données.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
