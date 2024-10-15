import { NextRequest } from "next/server";
import { randomUUID } from "crypto";

import * as EcdsaMultikey from '@digitalbazaar/ecdsa-multikey';
import { DataIntegrityProof } from "@digitalbazaar/data-integrity";
import * as vc from "@digitalbazaar/vc";
import { customDocumentLoader } from "@/lib/docloaders/index.js";
import { createSignCryptosuite } from "@digitalbazaar/ecdsa-sd-2023-cryptosuite";


const issueCredential = async (msg: any) => {
    //load the test keys
    const fname = msg.recipient.substring( msg.recipient.lastIndexOf(":")+1 );
    const kp = await import( "@/testkeys/" + fname + "/verificationKey.js" );
    const keyPair = await EcdsaMultikey.from( kp.keyPair );
    const credential = msg.payload;

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
    return await vc.issue( {credential, suite, documentLoader } );
}


const push = async (data:CredentialMessage) => {
    if( !data.id ) data.id = "MSG" + randomUUID();
    if( !data.dtcreated ) data.dtcreated = new Date();
    const coll = await getCollection("messages");
    coll.insertOne( data );
    return {status: "ok"};
}