import { NextRequest } from "next/server";
import { getMessages } from '@/datasources/CredentialsDb.js';
import { randomUUID } from "crypto";

const commands = {

    "push": async (data: any) => {
        console.log("pushing data ", data );
        if( !data.id ) data.id = "MSG" + randomUUID();
        if( !data.dtcreated ) data.dtcreated = new Date();
        const coll = await getMessages();
        coll.insertOne( data );
        return {status: "ok"};
    },

    "fetch": async (data:any) => {
        const coll = await getMessages();
        const list = await coll.find( {recipient: data.recipient} ).project({_id:0}).limit(10).toArray();
        return {status: "ok", data: list};
    },

    "remove": async( data:any ) => {
        const coll = await getMessages();
        //retrieve based on query
        const list = await coll.find( data ).project({id:1}).toArray();
        list.forEach(async (c)=>{
            await coll.findOneAndDelete({id: c.id});
        });
        return {status: "ok"};
    }
}

export const POST = async (req: NextRequest, {params}: any ) => {
    let action = params.slug;
    const data = (await req.json()) || {};
    const res = await commands[(action)]( data );
    return Response.json( res );
}

