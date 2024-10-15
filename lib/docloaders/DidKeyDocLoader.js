import { Ed25519VerificationKey2020 } from "@digitalbazaar/ed25519-verification-key-2020";

export async function loadDidKeyDocument( url, map ) {
    //correct first the url
    let surl = url;
    const hashIdx = url.indexOf("#");
    if( hashIdx > 0 ) {
        surl = url.substring(0, hashIdx);    
    }
    const controller = surl;
    const fingerprint = surl.substring( 8 );
    const id = controller + "#" + fingerprint;

    const assertionController = {
        '@context': 'https://w3id.org/security/v2',
        id: controller,
        // actual keys are going to be added in the test suite before() block
        assertionMethod: [id],
        authentication: [id]
    };
    map.set(controller, assertionController);

    const ldp = await Ed25519VerificationKey2020.fromFingerprint({fingerprint});
    let keyPair = ldp.export( { publicKey: true } );
    keyPair.controller = controller;
    keyPair.id = id;
    map.set(id,  keyPair);
                
}