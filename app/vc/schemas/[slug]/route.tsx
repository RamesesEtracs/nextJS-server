import { NextRequest } from "next/server";
import { getSchemas } from '@/datasources/CredentialsDb.js';

const commands = { 
    "list": async (data: any) => {
        const coll  = await getSchemas();
        const list = await coll.find(data).project({_id: 0,id:1,name:1,description:1}).toArray(); //to add title, insert sa "project"
        return {status: "ok", data: list};
    },

    "find": async (data: any) => {
        const coll  = await getSchemas();
        const id = "https://filipizen.com/credentials/schemas/" + data.id;
        const res =  await coll.findOne({ "id": id });
        delete res._id;
        return res;
    }
}    

export const GET = async (req: NextRequest, {params}:any) => {
    let action = params.slug;
    let res = null;
    if( action.indexOf(".")>1 ) {
        const id = action;
        console.log("id", id);
        res = await commands.find( {id: id } );
    }
    else {
        res = await commands[(action)]( {} );
    } 
    return Response.json( res );
}
