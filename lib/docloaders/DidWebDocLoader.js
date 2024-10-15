import {getIssuers} from '../../datasources/CredentialsDb'

export async function loadDidWebDocument( url, map ) {

    //correct first the url
    let surl = url;
    const hashIdx = url.indexOf("#");
    if( hashIdx > 0 ) {
        surl = url.substring(0, hashIdx);    
    }

    const coll = await getIssuers();
    const data = await coll.find( {id: surl} );

    //we must extract the key and keypair 
    //we should find the specific verification Method based on the id.
    // actual keys are going to be added in the test suite before() block
    const assertionController = {
        '@context': 'https://w3id.org/security/v2',
        id: data.id,
        assertionMethod: data.assertionMethod,
        authentication: data.authentication
    };

    map.set( data.id, assertionController );
    data.verificationMethod.forEach( vm=>{
        map.set( vm.id, vm );
    });

}