import { getDb } from './CredentialsDb';


export async function getRQueue () {
    const db = await getDb();
    return await db.collection('rqueue');
};


export async function getVpRequest () {
    const db = await getDb();
    return await db.collection('vprequest');
};