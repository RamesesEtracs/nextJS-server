import getRQueue from '../datasources/RQueueDB';

import { io } from '@/server';

export async function dbListener () {

    try {
        const rQueueCollection = await getRQueue();
        const changeStream = rQueueCollection.deleteMany();

        changeStream.on('change', (change) => {
            console.log('Document deleted:', change.documentKey);
            io.emit('documentDeleted', { message: 'A document was deleted from rqueue' });
        });

    } catch (error) {
        console.log(error);
    }
};