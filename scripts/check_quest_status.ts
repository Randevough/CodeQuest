
import { prisma } from '../src/lib/db';

async function main() {
    console.log('Checking quest statuses...');

    const activeCount = await prisma.quest.count({ where: { status: 'Active' } });
    const draftCount = await prisma.quest.count({ where: { status: 'Draft' } });
    const closedCount = await prisma.quest.count({ where: { status: 'Closed' } });
    const totalCount = await prisma.quest.count();
    const nullStatusCount = await prisma.quest.count({ where: { status: { equals: undefined } } }); // Check if any weirdness, though TS types might block this if strict

    console.log(`Total Quests: ${totalCount}`);
    console.log(`Active: ${activeCount}`);
    console.log(`Draft: ${draftCount}`);
    console.log(`Closed: ${closedCount}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
