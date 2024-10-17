import { NextRequest, NextResponse } from "next/server";
import {socket} from '../socket.js'
import { getRQueue } from "@/datasources/RQueueDB.js";

export async function POST(req: NextRequest) {

    const { id } = await req.json();

    try {
        const rQueueCollection = await getRQueue();
        const result = await rQueueCollection.deleteOne({id});

        if(result.deletedCount === 1) {
            socket.emit('deleted', result);
        }   
        return NextResponse.json({ result });
        
    } catch (error) {
        console.log(error)
    };
};


export async function GET(req: NextRequest) {
    try {
        const rQueueCollection = await getRQueue();
        const changeStream = rQueueCollection.watch([], { fullDocument: 'updateLookup' });

        changeStream.on('change', (change) => {
            console.log('Document deleted:', change);
            return NextResponse.json({ change });
            
        });

    } catch (error) {
        console.log(error)
    };
};

