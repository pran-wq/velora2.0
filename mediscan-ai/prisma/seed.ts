import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SQLite database...');
  // Seed initial demo record if empty
  const count = await prisma.report.count();
  if (count === 0) {
    await prisma.report.create({
      data: {
        patientName: 'Rahul Sharma',
        age: 32,
        gender: 'Male',
        reportText: 'Hemoglobin: 9.1 g/dL, Ferritin: 10 ng/mL, Serum Iron: 32 ug/dL, TIBC: 460 ug/dL',
        diseases: 'Iron Deficiency Anemia',
        severity: 'Moderate',
        confidence: 92.0,
        summary: 'Detected multiple abnormal biomarkers suggestive of Iron Deficiency Anemia. Recommended clinical review.',
        biomarkers: {
          create: [
            { name: 'Hemoglobin', value: 9.1, unit: 'g/dL', status: 'Abnormal' },
            { name: 'Ferritin', value: 10, unit: 'ng/mL', status: 'Abnormal' },
            { name: 'Serum Iron', value: 32, unit: 'ug/dL', status: 'Abnormal' },
            { name: 'TIBC', value: 460, unit: 'ug/dL', status: 'Abnormal' }
          ]
        }
      }
    });
    console.log('Created initial demo report.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
