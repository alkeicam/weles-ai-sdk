# Weles AI TypeScript API Library

This library provides convenient access to the Weles AI REST API from server-side TypeScript or JavaScript.

## Installation

```sh
npm install weles-ai-sdk
```

## Usage

### Generating documents

WelesAI can generate architectural documents from provided data sources:
* JIRA tickets
* `.md` files
* GIT repositories

Following architectural documents can be generated:
* High Level Desigh Architecture - it's an architectural document that provides software architecture matching provided stories/requirements. It can be used as a bootstrap document for architects and software designers to speed up the process.
* Source Code Reverse Engineering Documents - it's a document that provides architectural overview of a provided System from it's source code. It follows C4 architecture patterns and provides processing, data model and also integration information.

<!-- prettier-ignore -->
```ts
import {WelesAI} from "weles-ai-sdk"

const client = new WelesAI({
    apiKey: process.env.WELES_AI_API_KEY // This is the default and can be omitted
});

const architectureDocumentationWorkItem = await client.generate.highLevelDesignArchitecture({
    context: {
        projectId: "MY-PROJECT",
        releaseId: "v1.0.0",
        incrementNo: 1
    },
    destination: {
        name: "Architecture Document",
        protocol: "FILE"
    },
    stories: [
        {
            name: "Issue TICKET-107",
            protocol: "JIRA_TICKET",
            remoteURI: "https://<mydomain>.atlassian.net/browse/TICKET-107"                        
        } as Story
    ],
    remotes: []
});

console.log(architectureDocumentationWorkItem);



const reverseEngineeringWorkItem = await client.generate.reverseEngineerReport({
    context: {
        projectId: "MY-PROJECT",
        releaseId: "v1.0.0",
        incrementNo: 1
    },
    destination: {
        name: "MY-PROJECT Reverse Engineered Documentation",
        protocol: "FILE"
    },    
    codes: [
        {
            name: "My module",
            protocol: "GIT_CODE",
            remoteURI: "https://<my-git-repo>.git",
            branch: "main"
        }as GitCode
    ],
    remotes: []
});

console.log(reverseEngineeringWorkItem);
```

### Retrieving documents
<!-- prettier-ignore -->
```ts
import {WelesAI} from "weles-ai-sdk"

const client = new WelesAI({
    apiKey: process.env.WELES_AI_API_KEY // This is the default and can be omitted
});

// here we have a work item from generation request
const workItem = await client.generate.highLevelDesignArchitecture({
    // here goes my request
});

// check document generation status
const statusResponse = await client.generate.status({id: workItem.id});
console.log(statusResponse.status);

// when status is DONE you may download the document
const documentData = await client.generate.retrieve(statusResponse);

```

## File uploads

### Stories uploads
Stories can be uploaded by providing `.md` file that holds story contents. 

```ts
import {WelesAI} from "weles-ai-sdk"
const client = new WelesAI();

const fileDataURL = `data:text/markdown;base64,IyBIaWdoLUxldmVsIERlc2lnbiAoSEx .... here goes file data url encoded contents`;
const fileStory = {
    name: "My file",    
    protocol: "FILE",    
    dataURL: fileDataURL
}
```

### Source code uploads
Source code can be provided as zipped source code archive.
```ts
import {WelesAI} from "weles-ai-sdk"
const client = new WelesAI();

const sourceDataURL = `data:application/zip;base64,IyBIaWdoLUxldmVsIERlc2lnbiAoSEx .... here goes zip file data url encoded contents`;
const sourceCode = {
    name: "My source code archive (zip)",    
    protocol: "ARCHIVE",
    dataURL: sourceDataURL    
}
```

## Command line usage

The package ships a non-interactive CLI as `weles-ai` (available after install or via `npx weles-ai`). It reads `WELES_AI_API_KEY` (required), `WELES_AI_BASE_URL`, and `WELES_AI_SSL_MODE` from the environment; each can be overridden with `--api-key`, `--base-url`, and `--ssl-mode`.

### CLI installation

- Project-local (recommended): `npm install --save-dev weles-ai-sdk` then run with `npx weles-ai ...`
- Global: `npm install -g weles-ai-sdk` then run `weles-ai ...`

```
weles-ai <command> [--api-key <key>] [--base-url <url>] [--ssl-mode <mode>]
```

Run `weles-ai help` to see all commands. Key flows are shown below; every JSON flag accepts either inline JSON or a path to a JSON file.

### Generate High Level Design

```sh
cat > context.json <<'EOF'
{"projectId":"MY-PROJECT","releaseId":"v1.0.0","incrementNo":1}
EOF

cat > destination.json <<'EOF'
{"name":"Architecture Document","protocol":"FILE"}
EOF

cat > stories.json <<'EOF'
[{"name":"Issue TICKET-107","protocol":"JIRA_TICKET","remoteURI":"https://<domain>.atlassian.net/browse/TICKET-107"}]
EOF

weles-ai hld --context context.json --destination destination.json --stories stories.json
```

### Generate Reverse Engineering Report

```sh
cat > codes.json <<'EOF'
[{"name":"My module","protocol":"GIT_CODE","remoteURI":"https://<my-git-repo>.git","branch":"main"}]
EOF

weles-ai reverse --context context.json --destination destination.json --codes codes.json
```

### Check, retrieve, and list

```sh
weles-ai status --id <workItemId>
weles-ai retrieve --id <workItemId> --file-name "<file name from status/list>"
weles-ai list --filters filters.json   # filters is optional; omit to list all
```
