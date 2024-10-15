import { NextRequest } from "next/server";
import { getRQueue, getVpRequest } from "../../../datasources/RQueueDB";



export const POST = async (req: NextRequest, { params }: any) => {
  const action = params.slug[0];

  const reqBody = await req.json();
  const { challenge } = reqBody;

  const rQueueCollection = await getRQueue();

  if (action === "addQueue") {
    rQueueCollection.insertOne({ id: challenge, dtfiled: new Date() });
    return Response.json({ status: "Success", challenge });
  } else if (action === "addPayload") {
    // TODO:
    // const payload = { payload: req.json() };
    // rQueueCollection.updateOne({id: challenge }, { $set: { payload: payload } }, { upsert: false });
    return null;
  }
};



export const GET = async (req: NextRequest, { params }: any) => {

  const action = params.slug[0];
  const challenge= params.slug[1];


    if(action === 'checkStatus') {
        const rQueueCollection = await getRQueue();
        const data = await rQueueCollection.findOne({id: challenge});
        if(data) {
          return Response.json({data, isExist: true})
        } else {
          return Response.json({isExist: false})
        }
    }

    if(action === 'getVpRequest') {
        const vpRequestCollection = await getVpRequest();
        const requestData = await vpRequestCollection.find().toArray();
        return Response.json(requestData);
    }

};
