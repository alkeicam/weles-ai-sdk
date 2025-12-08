export interface HLDRequest{
    destination: Destination, 
    context: ProjectContext, 
    stories: Story[], 
    remotes?: Remote[] // when not provided defaults from account will be used
}

export interface ReverseEngineerRequest{
    destination: Destination, 
    context: ProjectContext, 
    codes: Code[], 
    remotes?: Remote[]
}

export interface  DocumentRetrieveRequest{
    id: string, // generation id
    fileName: string // generated document name
}

export interface DocumentStatusRequest{
    id: string
}

export enum Status{
    NEW = "NEW",
    PROCESSING = "PROCESSING",
    DONE = "DONE",
    ERROR = "ERROR"
}

export enum Product {
    HLD = "HLD",
    LLD = "LLD",
    STORY = "STORY",
    SCENARIO = "SCENARIO",
    CODE = "CODE",
    REVERSE_ENG = "REVERSE_ENG"
}

export interface DocumentsListRequest{    
    ids?: string[], // lists by generated work items ids
    statuses?: Status[], // filters by status
    projects?: string[], // filters by project    
    products?: Product[], // filter by products
    fromTs?: number // when provided only work items created after fromTs are returned (including fromTs)
    toTs?: number // when provided only work items created before toTs are returned
}

export interface Story{
    name: string,     
}

export interface Code{    
    name: string,    
    
}

export interface GitCode extends Code{
    protocol: "GIT_CODE",
    remoteURI: string,
    branch: string    
}

export interface ArchiveCode extends Code{
    protocol: "ARCHIVE",
    dataURL: string,
    mediaType: string,
}

export interface JiraStory extends Story{
    name: string,
    remoteURI: string,
    protocol: "JIRA_TICKET"   
}

export interface FileStory extends Story{
    name: string,    
    protocol: "FILE",
    mediaType: string,
    dataURL: string // here goes data url encoded file contents    
}

export interface ProjectContext{
    projectId: string,
    releaseId: string,
    incrementNo: number
}

export interface Destination{
    name: string,
    protocol: "FILE"|"CONFLUENCE_PAGE"|"JIRA_TICKET"
}
export interface FileDestination extends Destination{
    protocol: "FILE"
}
export interface ConfluenceDestination extends Destination{
    parentId: string,
    groupId: string,
    protocol: "CONFLUENCE_PAGE"
}

export interface JiraDestination extends Destination {
    projectKey: string,
    parentKey?: string,
    protocol: "JIRA_TICKET"
}

export interface Remote{
    id: string,
    name: string,  
    // for azure workspace
    // usually file://some/base/path or https://some/remote/base/path - catalog structure will follow: {tenantId}/{projectId}/{releaseId}/{incrementId}
    // for azure blob service this includes container https://myaccount.blob.core.windows.net/mycontainer and /{tenantId}/{projectId}/{releaseId}/{incrementId} is represented as so called blob name
    baseURI: string,      
    credentials: {
        token: string, // token for bearer or password for other
        username?: string // when token is not used
    }
}