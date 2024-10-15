import jsigs from 'jsonld-signatures';
import {loadDidWebDocument} from "./DidWebDocLoader.js";
import { loadDidKeyDocument  } from './DidKeyDocLoader.js';
import { loadJsonLdConstants } from './JsonLdDocLoader.js';

const {extendContextLoader} = jsigs;

const map = new Map();

export const customDocumentLoader = extendContextLoader( async (url)=>{
    if( !map.has(url) ) {
        if( url.startsWith("did:web:")) {
            //await loadDidWebDocument(url, map);
        }
        else if( url.startsWith("did:key:") ) {
            await loadDidKeyDocument(url, map);
        }
        else {
            await loadJsonLdConstants(url, map);
        }
    }

    const doc = map.get(url);
    if(!doc) throw new Error("document " + url + " not found");
    return {
        contextUrl: null,
        documentUrl: url,
        document: doc
    } 
});