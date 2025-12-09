
import { Response } from "undici";
import { Code, GitCode, Story } from "../src/api/model/model";
import {WelesAI} from "../src/weles-sdk"


describe("Weles AI Typescript SDK",()=>{
    beforeEach(()=>{
        jest.resetAllMocks();
        jest.restoreAllMocks();
    })

    describe("document generation",()=>{
        it("generates High Level Design document",async ()=>{        
            const theSpy = jest.spyOn(WelesAI.prototype, "_fetch");
            theSpy.mockResolvedValue({
                ok: true,
                json: async ()=>{}
            } as Response)


            const client = new WelesAI({
                apiKey: "somekey"            
            });

            const data:any = {
                context: {
                    projectId: "PROJECT1",
                    releaseId: "v1.0.0",
                    incrementNo: 1
                },
                destination: {
                    name: "My Document",
                    protocol: "FILE"
                },
                stories: [
                    {
                        name: "Issue XXX-100",
                        protocol: "JIRA_TICKET",
                        remoteURI: "https://mydomain/browse/XXX-100"                        
                    } as Story
                ],
                remotes: []
            }
            
            await client.generate.highLevelDesignArchitecture(data);       
            
            const firstArg = theSpy.mock.calls[0];
            const parsed = JSON.parse((<any>firstArg[1]).body);

            expect(theSpy).toHaveBeenCalledWith(
                expect.stringContaining("/plugins/weles-ai/generate"),
                expect.objectContaining({
                    body: expect.stringContaining("PROJECT1")
                })
            );
            expect(theSpy).toHaveBeenCalledWith(
                expect.stringContaining("/plugins/weles-ai/generate"),
                expect.objectContaining({
                    body: expect.stringContaining("v1.0.0")                            
                })
            );

            expect(parsed).toEqual(
                expect.objectContaining({
                    docs: expect.arrayContaining([
                        expect.objectContaining({
                            name: "Issue XXX-100"
                        })
                    ]),
                    incrementNo: data.context.incrementNo,
                    product: "HLD",
                    projectId: data.context.projectId,
                    releaseId: data.context.releaseId
                })
            )


            
        })
        it("generates High Level Design document with story from file",async ()=>{        
            const theSpy = jest.spyOn(WelesAI.prototype, "_fetch");
            theSpy.mockResolvedValue({
                ok: true,
                json: async ()=>{}
            } as Response)


            const client = new WelesAI({
                apiKey: "somekey"            
            });

            const data:any = {
                context: {
                    projectId: "PROJECT1",
                    releaseId: "v1.0.0",
                    incrementNo: 1
                },
                destination: {
                    name: "My Document",
                    protocol: "FILE"
                },
                stories: [
                    {
                        name: "Issue XXX-100",
                        protocol: "FILE",
                        dataURL: "<somedataurl>",
                        fileName: "myfile.md"
                    
                    } as Story
                ],
                remotes: []
            }
            
            await client.generate.highLevelDesignArchitecture(data);       
            
            const firstArg = theSpy.mock.calls[0];
            const parsed = JSON.parse((<any>firstArg[1]).body);

            expect(theSpy).toHaveBeenCalledWith(
                expect.stringContaining("/plugins/weles-ai/generate"),
                expect.objectContaining({
                    body: expect.stringContaining("PROJECT1")
                })
            );
            expect(theSpy).toHaveBeenCalledWith(
                expect.stringContaining("/plugins/weles-ai/generate"),
                expect.objectContaining({
                    body: expect.stringContaining("v1.0.0")                            
                })
            );

            expect(parsed).toEqual(
                expect.objectContaining({
                    docs: expect.arrayContaining([
                        expect.objectContaining({
                            name: "Issue XXX-100",
                            mediaType: "text/markdown"
                        })
                    ]),
                    incrementNo: data.context.incrementNo,
                    product: "HLD",
                    projectId: data.context.projectId,
                    releaseId: data.context.releaseId
                })
            )


            
        })


        it("generates Reverse engineer report",async ()=>{        
            const theSpy = jest.spyOn(WelesAI.prototype, "_fetch");
            theSpy.mockResolvedValue({
                ok: true,
                json: async ()=>{}
            } as Response)


            const client = new WelesAI({
                apiKey: "somekey"            
            });

            const data:any = {
                context: {
                    projectId: "PROJECT1",
                    releaseId: "v1.0.0",
                    incrementNo: 1
                },
                destination: {
                    name: "My Document",
                    protocol: "FILE"
                },
                codes: [
                    {
                        name: "Commons module",
                        protocol: "GIT_CODE",
                        remoteURI: "https://gitlab.execon.pl/execon/weles-ai/welesai-commons.git",
                        branch: "main"
                    }as GitCode
                ],
                remotes: []
            }
            
            await client.generate.reverseEngineerReport(data);       
            
            const firstArg = theSpy.mock.calls[0];
            const parsed = JSON.parse((<any>firstArg[1]).body);

            expect(theSpy).toHaveBeenCalledWith(
                expect.stringContaining("/plugins/weles-ai/generate"),
                expect.objectContaining({
                    body: expect.stringContaining("PROJECT1")
                })
            );
            expect(theSpy).toHaveBeenCalledWith(
                expect.stringContaining("/plugins/weles-ai/generate"),
                expect.objectContaining({
                    body: expect.stringContaining("v1.0.0")                            
                })
            );

            expect(parsed).toEqual(
                expect.objectContaining({
                    code: expect.arrayContaining([
                        expect.objectContaining({
                            name: "Commons module"
                        })
                    ]),
                    incrementNo: data.context.incrementNo,
                    product: "REVERSE_ENG",
                    projectId: data.context.projectId,
                    releaseId: data.context.releaseId
                })
            )


            
        })
        it("generates Reverse engineer report from source code archive",async ()=>{        
            const theSpy = jest.spyOn(WelesAI.prototype, "_fetch");
            theSpy.mockResolvedValue({
                ok: true,
                json: async ()=>{}
            } as Response)


            const client = new WelesAI({
                apiKey: "somekey"            
            });

            const data:any = {
                context: {
                    projectId: "PROJECT1",
                    releaseId: "v1.0.0",
                    incrementNo: 1
                },
                destination: {
                    name: "My Document",
                    protocol: "FILE"
                },
                codes: [
                    {
                        name: "Commons module",                    
                        protocol: "ARCHIVE",
                        dataURL: "<some zip archive data url>"                    
                    }as Code
                ],
                remotes: []
            }
            
            await client.generate.reverseEngineerReport(data);       
            
            const firstArg = theSpy.mock.calls[0];
            const parsed = JSON.parse((<any>firstArg[1]).body);

            expect(theSpy).toHaveBeenCalledWith(
                expect.stringContaining("/plugins/weles-ai/generate"),
                expect.objectContaining({
                    body: expect.stringContaining("PROJECT1")
                })
            );
            expect(theSpy).toHaveBeenCalledWith(
                expect.stringContaining("/plugins/weles-ai/generate"),
                expect.objectContaining({
                    body: expect.stringContaining("v1.0.0")                            
                })
            );

            expect(parsed).toEqual(
                expect.objectContaining({
                    code: expect.arrayContaining([
                        expect.objectContaining({
                            name: "Commons module",
                            mediaType: "application/zip"
                        })
                    ]),
                    incrementNo: data.context.incrementNo,
                    product: "REVERSE_ENG",
                    projectId: data.context.projectId,
                    releaseId: data.context.releaseId
                })
            )


            
        })
    })
    describe("document status",()=>{
        it("retrieves document status",async ()=>{

            const id = "id15";

            const requestResponse:any = {
                id: id,
                status: "DONE",                
                deliverables: [{
                    filename: "MyFile-Result.md"
                }]
            }

            const data = {
                id: id
            }

            const theSpy = jest.spyOn(WelesAI.prototype, "_fetch");
            theSpy.mockResolvedValue({
                ok: true,
                json: async ()=>{
                    return [requestResponse]
                }
            } as Response)


            const client = new WelesAI({
                apiKey: "somekey"            
            });

            
            
            const workItemStatus = await client.generate.status(data);       
            
            const firstArg = theSpy.mock.calls[0];
            const parsed = JSON.parse((<any>firstArg[1]).body);

            expect(theSpy).toHaveBeenCalledWith(
                expect.stringContaining("/plugins/weles-ai/inference/list"),
                expect.anything()
            );

            expect(parsed).toEqual(
                expect.objectContaining({
                    ids: expect.arrayContaining([
                        id
                    ])
                })
            )

            expect(workItemStatus).toEqual({
                id: id,
                status: requestResponse.status,
                fileName: requestResponse.meta?.deliverables[0].filename
            })

        })
        it("retrieves document status - backward compatibility",async ()=>{

            const id = "id15";

            const requestResponse:any = {
                id: id,
                status: "DONE", 
                meta: {
                    deliverables: [{
                        fileName: "MyFile-Result.md"
                    }]
                }               
                
            }

            const data = {
                id: id
            }

            const theSpy = jest.spyOn(WelesAI.prototype, "_fetch");
            theSpy.mockResolvedValue({
                ok: true,
                json: async ()=>{
                    return [requestResponse]
                }
            } as Response)


            const client = new WelesAI({
                apiKey: "somekey"            
            });

            
            
            const workItemStatus = await client.generate.status(data);       
            
            const firstArg = theSpy.mock.calls[0];
            const parsed = JSON.parse((<any>firstArg[1]).body);

            expect(theSpy).toHaveBeenCalledWith(
                expect.stringContaining("/plugins/weles-ai/inference/list"),
                expect.anything()
            );

            expect(parsed).toEqual(
                expect.objectContaining({
                    ids: expect.arrayContaining([
                        id
                    ])
                })
            )

            expect(workItemStatus).toEqual({
                id: id,
                status: requestResponse.status,
                fileName: requestResponse.meta?.deliverables[0].fileName
            })

        })
    })
    describe("document retrieval",()=>{
        it("retrieves document by id and filename",async ()=>{

            const id = "id15";
            const filename = "myfile.md"

            const requestResponse:any = {                
            }

            const data = {
                id: id,
                fileName: filename
            }

            const theSpy = jest.spyOn(WelesAI.prototype, "_fetch");
            theSpy.mockResolvedValue({
                ok: true,
                json: async ()=>{
                    return [requestResponse]
                }
            } as Response)


            const client = new WelesAI({
                apiKey: "somekey"            
            });

            
            
            await client.generate.retrieve(data);       
            
            const firstArg = theSpy.mock.calls[0];
            const parsed = JSON.parse((<any>firstArg[1]).body);

            expect(theSpy).toHaveBeenCalledWith(
                expect.stringContaining("/plugins/weles-ai/inference/deliverables"),
                expect.anything()
            );

            expect(parsed).toEqual(
                expect.objectContaining({
                    id: id,
                    fileName: filename
                })
            )            
        })        
    })    
    describe("document listings",()=>{
        it("lists documents using provided criteria",async ()=>{

            const id = "id15";
            const id2 = "id2";

            const requestResponses:any =[
                {
                    id: id,
                    status: "DONE", 
                    meta: {
                        deliverables: [{
                            filename: "MyFile.md"
                        }]
                    }
                    
                },
                {
                    id: id2,
                    status: "PROCESSING",                
                    meta: {
                        deliverables: [{
                            fileName: "SecondFile.md"
                        }]
                    }
                    
                }
            ]

            const data = {
                ids: [id, id2]
            }

            const theSpy = jest.spyOn(WelesAI.prototype, "_fetch");
            theSpy.mockResolvedValue({
                ok: true,
                json: async ()=>{
                    return requestResponses
                }
            } as Response)


            const client = new WelesAI({
                apiKey: "somekey"            
            });

            
            
            const workItemStatus = await client.generate.list(data);       
            
            const firstArg = theSpy.mock.calls[0];
            const parsed = JSON.parse((<any>firstArg[1]).body);

            expect(theSpy).toHaveBeenCalledWith(
                expect.stringContaining("/plugins/weles-ai/inference/list"),
                expect.anything()
            );

            expect(parsed).toEqual(data)

            expect(workItemStatus).toEqual([
                {
                    id: id,
                    status: requestResponses[0].status,
                    fileName: requestResponses[0].meta.deliverables[0].filename
                },
                {
                    id: id2,
                    status: requestResponses[1].status,
                    fileName: requestResponses[1].meta.deliverables[0].fileName
                }
            ])
        })
    }) 
})



describe("Weles AI Typescript SDK Integration Tests",()=>{

    xit("generate High Level Design document",async ()=>{
        const client = new WelesAI({
            apiKey: process.env.TEST_API_KEY,
            sslMode: "relaxed",
            baseURL: process.env.TEST_ENDPOINT
        });
        try{
            const createdWorkItem = await client.generate.highLevelDesignArchitecture({
                context: {
                    projectId: "EXEFPF1KIK",
                    releaseId: "v1.0.10",
                    incrementNo: 1
                },
                destination: {
                    name: "SDK File Test #1 - EXEFPF2KIK-107",
                    protocol: "FILE"
                },
                stories: [
                    {
                        name: "Issue EXEFPF2KIK-107",
                        protocol: "JIRA_TICKET",
                        remoteURI: "https://execon.atlassian.net/browse/EXEFPF2KIK-107"                        
                    } as Story
                ],
                remotes: []
            });
            
            console.log(createdWorkItem);
            
        }catch(error){
            console.log("error", error);
        }
        
    })

    xit("generate reverse engineer report",async ()=>{
        const client = new WelesAI({
            apiKey: "67EhDOk5k5ihVnpi",
            sslMode: "relaxed",
            baseURL: "https://localhost:7990"
        });
        try{
            const createdWorkItem = await client.generate.reverseEngineerReport({
                destination: {
                    name: "SDK File Test #1 - EXEFPF2KIK-107",
                    protocol: "FILE"
                },
                context: {
                    projectId: "EXEFPF1KIK",
                    releaseId: "v1.0.10",
                    incrementNo: 1
                },
                codes: [
                    {
                        name: "Commons module",
                        protocol: "GIT_CODE",
                        remoteURI: "https://gitlab.execon.pl/execon/weles-ai/welesai-commons.git",
                        branch: "main"
                    }as GitCode
                ],
                remotes: []
            });            
            console.log(createdWorkItem);            
        }catch(error){
            console.log("error", error);
        }
        
    })
    
})