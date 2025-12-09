import { WelesAIBase } from "../client";
import { HLDRequest, ReverseEngineerRequest, DocumentRetrieveRequest, DocumentStatusRequest, FileStory, ArchiveCode, DocumentsListRequest } from "./model/model";

export class Documents{
    _client: WelesAIBase;
    _logger: any

    constructor(client: WelesAIBase, logger: any) {
        this._client = client;
        this._logger = logger;
    }

    /**
     * Will generate High Level Design architecture document using provided stories as input. The document
     * will be delivered to a given destination.
     * @param stories 
     */
    async highLevelDesignArchitecture(request:HLDRequest){
        const data = {
            ...request.context,
            product: "HLD",            
            destination: request.destination,
            docs: request.stories.map(item=>{
                if((<FileStory>item).protocol == "FILE") (<FileStory>item).mediaType = "text/markdown";
                return item;
            }),
            remotes: request.remotes

        }
        const r = await this._client._fetch(`${this._client._baseURL}/plugins/weles-ai/generate`,{
            method: "POST",
            body: JSON.stringify(data)
        });
        if(!r.ok){
            const message = await r.text();            
            throw new Error(`${r.status} ${r.statusText} due to: ${message}`)
        }
        
        // new work item is in the response
        const responseData = await r.json();
        return responseData;
    }

    /**
     * Generates Reverse Engineering Report for a provided source code
     * @param request 
     * @returns 
     */
    async reverseEngineerReport(request: ReverseEngineerRequest){
        const data = {
            ...request.context,
            product: "REVERSE_ENG",            
            destination: request.destination,
            code: request.codes.map(item=>{
                if((<ArchiveCode>item).protocol == "ARCHIVE") (<ArchiveCode>item).mediaType = "application/zip"
                return item;
            }),
            remotes: request.remotes

        }
        const r = await this._client._fetch(`${this._client._baseURL}/plugins/weles-ai/generate`,{
            method: "POST",
            body: JSON.stringify(data)
        });
        if(!r.ok){
            const message = await r.text();            
            throw new Error(`${r.status} ${r.statusText} due to: ${message}`)
        }
        
        // new work item is in the response
        const responseData = await r.json();
        return responseData;
    }

    /**
     * Retrieves given document
     * @param request 
     * @returns 
     */
    async retrieve(request: DocumentRetrieveRequest){
        const data = request
        const r = await this._client._fetch(`${this._client._baseURL}/plugins/weles-ai/inference/deliverables`,{
            method: "POST",
            body: JSON.stringify(data)
        });
        if(!r.ok){
            const message = await r.text();            
            throw new Error(`${r.status} ${r.statusText} due to: ${message}`)
        }
                
        const responseData = await r.json();
        return responseData;
    }

    /**
     * Retrieves status of a provided document
     * @param request 
     * @returns 
     */
    async status(request: DocumentStatusRequest){
        const data = {
            ids: [request.id]
        }
        const r = await this._client._fetch(`${this._client._baseURL}/plugins/weles-ai/inference/list`,{
            method: "POST",
            body: JSON.stringify(data)
        });
        if(!r.ok){
            const message = await r.text();            
            throw new Error(`${r.status} ${r.statusText} due to: ${message}`)
        }
                
        const responseData = await r.json();
        const workItem = (<any>responseData)[0];
        return {
            id: workItem.id,
            status: workItem.status,
            fileName: workItem.meta?.deliverables[0]?.filename || workItem.meta?.deliverables[0]?.fileName
        }
    }

    /**
     * Lists all generated documents so far
     * @param request 
     * @returns 
     */
    async list(request: DocumentsListRequest){

        const r = await this._client._fetch(`${this._client._baseURL}/plugins/weles-ai/inference/list`,{
            method: "POST",
            body: JSON.stringify(request)
        });
        if(!r.ok){
            const message = await r.text();            
            throw new Error(`${r.status} ${r.statusText} due to: ${message}`)
        }
                
        const responseData = await r.json();
        const workItems = (<any>responseData);
        return workItems.map((item:any)=>{
            return {
                id: item.id,
                status: item.status,
                fileName: item.meta?.deliverables[0]?.filename || item.meta?.deliverables[0]?.fileName
            }
        })        
    }
}