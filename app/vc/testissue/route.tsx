import { NextRequest } from "next/server";
import { randomUUID } from "crypto";

import * as EcdsaMultikey from '@digitalbazaar/ecdsa-multikey';
import { DataIntegrityProof } from "@digitalbazaar/data-integrity";
import * as vc from "@digitalbazaar/vc";
import { customDocumentLoader } from "@/lib/docloaders/index.js";
import { createSignCryptosuite } from "@digitalbazaar/ecdsa-sd-2023-cryptosuite";
import { getMessages } from "@/datasources/CredentialsDb";

const issueCredential = async (msg: any) => {
    const credential = msg.credential;
    const issuer = msg.issuer;

    const fname = issuer.substring( issuer.lastIndexOf(":")+1 );
    const kp = await import( "@/testkeys/" + fname + "/verificationKey.js" );
    const keyPair = await EcdsaMultikey.from( kp.keyPair );
    credential.id = credential.credentialSchema.id + `#:${randomUUID()}`;    
    credential.issuer = keyPair.controller;
    credential.issuanceDate = new Date();//"2024-08-11T03:55:44Z";
    const suite = new DataIntegrityProof({
        signer: keyPair.signer(), 
        cryptosuite: createSignCryptosuite( 
            { mandatoryPointers: ['/issuer', '/issuanceDate'] } 
        )
    });   
    const proofId = `urn:uuid:${randomUUID()}`;
    suite.proof = {id: proofId};
    const documentLoader = customDocumentLoader;
    //load the test keys
    return await vc.issue( {credential, suite, documentLoader } );
}

export const POST = async (req: NextRequest, {params}: any ) => {
    const data = (await req.json()) || {};
    const res = await issueCredential( data );

    //if there is a recipient send to messages
    if( data.recipient ) {
        const msg:any = {};
        msg.recipient = data.recipient;
        msg.sender = data.issuer;
        msg.payload = res;
        msg.dtcreated = res.issuanceDate;
        const coll = await getMessages();
        coll.insertOne( msg );
    }

    return Response.json( res );
}

