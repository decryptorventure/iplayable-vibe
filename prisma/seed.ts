import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.variant.deleteMany();
  await prisma.project.deleteMany();

  const projects = await prisma.project.createMany({
    data: [
      {
        name: "iG Water Factory",
        slug: "ig-water-factory",
        status: "Active",
        totalVariants: 148,
        avgCTR: 4.2,
        avgCVR: 1.73,
        totalSpend: 62340
      },
      {
        name: "iG Sticker Out",
        slug: "ig-sticker-out",
        status: "AI Syncing",
        totalVariants: 96,
        avgCTR: 3.6,
        avgCVR: 1.33,
        totalSpend: 50120
      },
      {
        name: "iG Monster Merge",
        slug: "ig-monster-merge",
        status: "Active",
        totalVariants: 82,
        avgCTR: 5.1,
        avgCVR: 1.91,
        totalSpend: 41200
      },
      {
        name: "iG Bubble Quest",
        slug: "ig-bubble-quest",
        status: "Paused",
        totalVariants: 44,
        avgCTR: 2.7,
        avgCVR: 1.1,
        totalSpend: 28450
      }
    ]
  });

  console.log(`Seeded ${projects.count} projects`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
