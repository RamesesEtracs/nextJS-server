import { getRQueue } from '../../datasources/RQueueDB';
import { socket } from '../socket';



export async function watchRqueueCollection() {
    try {
        const rqueueCollection = await getRQueue();

        console.log("Listening to the rqueue collection...");
       
        const changeStream = rqueueCollection.watch([{ $match: { 'operationType': 'delete' } }]);

        changeStream.on('change', (change) => {
            console.log('Document deleted:', change.documentKey);
            socket.emit('documentDeleted', { message: 'A document was deleted from rqueue' });
        });
    } catch (err) {
        console.error('Error watching collection:', err);
    }
};