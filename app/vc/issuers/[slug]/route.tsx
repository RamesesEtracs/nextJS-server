import { NextRequest } from "next/server";
import {getIssuers } from '@/datasources/CredentialsDb.js';

const commands = {

    "registerDid": async (data:any) => {
        const coll = await getIssuers();
        coll.insertOne( data );
        return {status: "ok"}; 
    },

    "list": async ( data:any )=> {
        console.log("entering...");
        const coll = await getIssuers();
        const dat = await coll.find({}, {projection:{_id:0, id:1, name:2}}).toArray();
        return dat;
    },

    "find": async (data:any) =>  {
        let id = data.id;
        const did = "did:web:filipizen.com:issuers:" + id;
        const coll = await getIssuers();
        const dat = await coll.findOne( {id: did}, {projection: {_id: 0}} );    
        return dat;
    }
}

export const GET = async (req: NextRequest, {params}:any) => {
    let action = params.slug;
    let res = null;
    if( action.indexOf(".")>1 ) {
        const id = action.substring( 0, action.lastIndexOf(".") );
        console.log("id is ", id);
        res = await commands.find( {id: id } );
    }
    else {
        console.log("entering non find action", action );
       res = await commands[(action)]( {} );
    }
    return Response.json( res );
}

export const POST = async (req: NextRequest, {params}: any ) => {
    let action = params.slug;
    const data = (await req.json()) || {};
    const res = await commands[(action)]( data );
    return Response.json( res );
}

