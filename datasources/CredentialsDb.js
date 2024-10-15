import { MongoClient } from "mongodb";

//connect here
const uri = "mongodb://localhost:27017/filipizen-vc?retryWrites=true";
const client = new MongoClient(uri) ; //, { useNewUrlParser: true, useUnifiedTopology: true });

export async function getDb() {
    return await client.db("filipizen-vc");
}

export async function getCollection( name ) {
    const db = await getDb();
    return await db.collection(name);
}

export async function getIssuers() {
    const db = await getDb();
    return await db.collection("issuers");
}

export async function getSchemas() {
    const db = await getDb();
    return await db.collection("schemas");
}

export async function getMessages() {
    const db = await getDb();
    return await db.collection("messages");
}