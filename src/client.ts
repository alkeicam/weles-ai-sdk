import * as API from './api/index';
import * as Model from './api/model/model'
import  { Agent, setGlobalDispatcher, fetch }  from 'undici';

_CACHED_CA: new Map();

const _bootstrapTLSSettingForFetch = (sslMode:string = "strict")=>{
    let useBaseAgent = true;
    
    // when caFilePath is provided - create custom agent
    // when no caFilePath is provided and sslMode is strict - do nothing as this is the default axios agent
    // when no caFilePath is provided and sslMode is other then strict - make a custom agent
    const agentOptions = {}
    // if(caFilePath){
    //     try{
    //         let caData;
    //         if(!SECURITY._CACHED_CA.has(caFilePath)){
    //             caData = fs.readFileSync(caFilePath);
    //             SECURITY._CACHED_CA.set(caFilePath, caData);
    //         }else{
    //             caData = SECURITY._CACHED_CA.get(caFilePath)
    //         }
    //         agentOptions.ca = [...tls.rootCertificates, caData];
    //         agentOptions.minVersion = 'TLSv1.2';
    //         useBaseAgent = false;        
    //     }catch(error){
    //         logger?.error(`Custom CA was requested but couldn't load from "${caFilePath}". Defaulting to base https agent.`, error);
    //     }                
    // }
    if(sslMode!="strict"){
        (<any>agentOptions).rejectUnauthorized = false;
        (<any>agentOptions).checkServerIdentity = () => undefined;
        useBaseAgent = false;
    }

    let options = {
        connect: {
            ...agentOptions
        }
    };

    if(!useBaseAgent){
        // set global fetch tls configuration
        const dispatcher = new Agent(options);
        setGlobalDispatcher(dispatcher)        
        return;
    }        
}

export class WelesAIBase {
    _apiKey: string;
    _baseURL: string;
    _options: any;
    _logger: any;

    constructor({    
        baseURL = process.env.WELES_AI_BASE_URL,
        apiKey = process.env.WELES_AI_API_KEY ?? null,        
        logger = console ?? null,
        ...opts        
    }: any = {}) {
        const options: any = {
            apiKey,                        
            baseURL: baseURL || `https://veles-cloud.execon.pl:7990`,
            ...opts,
        };

        this._apiKey = options.apiKey
        this._baseURL = options.baseURL
        this._options = options
        this._logger = logger
        if(this._options.sslMode) _bootstrapTLSSettingForFetch(this._options.sslMode)
    }   

    async _fetch(url: string, options: any){

        const requestOptions = options;

        const headers = requestOptions.headers || {}   
        if(!this._apiKey) throw new Error(`Api Key is required.`);     
        headers["X-API-Key"] = this._apiKey;
        headers["Content-Type"] = "application/json";        
        requestOptions.headers = headers;

        return await fetch(url, { 
                ...requestOptions
        });
    }

    
    
}

export class WelesAI extends WelesAIBase{
    generate = new API.Documents(this, this._logger)   
}

export declare namespace WelesAI {
    export import JiraStory = Model.JiraStory;    
    export import FileStory = Model.FileStory;    
    export import Story = Model.Story;
    export import Code = Model.Code;
    export import GitCode = Model.GitCode;
    export import ArchiveCode = Model.ArchiveCode;
    export import ProjectContext = Model.ProjectContext
    export import Destination = Model.Destination
    export import JiraDestination = Model.JiraDestination
    export import ConfluenceDestination = Model.ConfluenceDestination
    export import Remote = Model.Remote
    export import HLDRequest = Model.HLDRequest
    export import ReverseEngineerRequest = Model.ReverseEngineerRequest
    export import DocumentRetrieveRequest = Model.DocumentRetrieveRequest
    export import DocumentStatusRequest = Model.DocumentStatusRequest
    export import DocumentsListRequest = Model.DocumentsListRequest
    export import Status = Model.Status
    export import Product = Model.Product
}
