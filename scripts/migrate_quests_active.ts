
import { prisma } from '../src/lib/db';

async function main() {
    console.log('Migrating quests statuses...');

    // Update all quests that are 'Draft' (which was the default backfill) to 'Active'
    // checking if they look like they should be active (e.g. have a title)
    // But given the context, we'll request to update ALL current Drafts.

    const result = await prisma.quest.updateMany({
        where: {
            status: 'Draft'
        },
        data: {
            status: 'Active'
        }
    });

    console.log(`Updated ${result.count} quests from Draft to Active.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
