import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { WelesAI } from './weles-sdk';
import {
  DocumentsListRequest,
  HLDRequest,
  ReverseEngineerRequest,
} from './api/model/model';

dotenv.config();

type ArgValue = string | boolean;
type ParsedArgs = { _: string[] } & Record<string, ArgValue | string[]>;

const parseArgs = (argv: string[]): ParsedArgs => {
  const parsed: ParsedArgs = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      parsed._.push(token);
      continue;
    }
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      parsed[key] = next;
      i += 1;
    } else {
      parsed[key] = true;
    }
  }
  return parsed;
};

const getOption = (options: ParsedArgs, ...keys: string[]): string | undefined =>
  keys
    .map((key) => options[key])
    .find((value): value is string => typeof value === 'string' && value.length > 0);

const fileExists = (filePath: string): boolean => {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
};

const loadJSON = async <T>(
  raw: string | undefined,
  label: string,
  required: boolean,
  fallback?: T
): Promise<T | undefined> => {
  if (!raw) {
    if (required && fallback === undefined) {
      throw new Error(`Missing ${label}. Provide --${label} as JSON or a path to a JSON file.`);
    }
    return fallback;
  }
  const potentialPath = path.resolve(raw);
  if (fileExists(potentialPath)) {
    const fileContent = await fs.promises.readFile(potentialPath, 'utf8');
    try {
      return JSON.parse(fileContent) as T;
    } catch (error) {
      throw new Error(`Invalid JSON in file for ${label}: ${(error as Error).message}`);
    }
  }
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    throw new Error(
      `Invalid JSON for ${label}. Provide valid JSON or a path to a JSON file. ${(error as Error).message}`
    );
  }
};

const createClient = (options: ParsedArgs): WelesAI => {
  const apiKey =
    getOption(options, 'api-key', 'apiKey') ?? process.env.WELES_AI_API_KEY ?? '';
  if (!apiKey) {
    throw new Error('API key is required. Use --api-key or set WELES_AI_API_KEY.');
  }
  const baseURL = getOption(options, 'base-url', 'baseUrl') ?? process.env.WELES_AI_BASE_URL;
  const sslMode = getOption(options, 'ssl-mode', 'sslMode') ?? process.env.WELES_AI_SSL_MODE;

  return new WelesAI({
    apiKey,
    baseURL: baseURL || undefined,
    sslMode: sslMode || undefined,
  });
};

const printJSON = (data: unknown): void => {
  console.log(JSON.stringify(data, null, 2));
};

const printHelp = (): void => {
  console.log(`Usage: weles-ai <command> [options]

Commands:
  hld, high-level-design     Generate High Level Design document
  reverse, reverse-eng       Generate Reverse Engineering report
  status                     Check status of a work item
  retrieve                   Retrieve a generated deliverable
  list                       List work items
  help                       Show this help

Global options:
  --api-key <key>            API key (or WELES_AI_API_KEY env)
  --base-url <url>           Override API base URL (or WELES_AI_BASE_URL env)
  --ssl-mode <mode>          TLS mode (strict|insecure). Defaults to env WELES_AI_SSL_MODE

Command options:
  hld:      --context <json|file> --destination <json|file> --stories <json|file> [--remotes <json|file>]
  reverse:  --context <json|file> --destination <json|file> --codes <json|file> [--remotes <json|file>]
  status:   --id <workItemId>
  retrieve: --id <workItemId> --file-name <fileNameFromStatus>
  list:     [--filters <json|file>]`);
};

const handleHLD = async (options: ParsedArgs, client: WelesAI) => {
  const context = await loadJSON<HLDRequest['context']>(getOption(options, 'context'), 'context', true);
  const destination = await loadJSON<HLDRequest['destination']>(
    getOption(options, 'destination'),
    'destination',
    true
  );
  const stories = await loadJSON<HLDRequest['stories']>(
    getOption(options, 'stories'),
    'stories',
    true
  );
  const remotes = await loadJSON<HLDRequest['remotes']>(
    getOption(options, 'remotes'),
    'remotes',
    false
  );

  const request: HLDRequest = {
    context: context as HLDRequest['context'],
    destination: destination as HLDRequest['destination'],
    stories: stories as HLDRequest['stories'],
    remotes,
  };

  const result = await client.generate.highLevelDesignArchitecture(request);
  printJSON(result);
};

const handleReverse = async (options: ParsedArgs, client: WelesAI) => {
  const context = await loadJSON<ReverseEngineerRequest['context']>(
    getOption(options, 'context'),
    'context',
    true
  );
  const destination = await loadJSON<ReverseEngineerRequest['destination']>(
    getOption(options, 'destination'),
    'destination',
    true
  );
  const codes = await loadJSON<ReverseEngineerRequest['codes']>(
    getOption(options, 'codes'),
    'codes',
    true
  );
  const remotes = await loadJSON<ReverseEngineerRequest['remotes']>(
    getOption(options, 'remotes'),
    'remotes',
    false
  );

  const request: ReverseEngineerRequest = {
    context: context as ReverseEngineerRequest['context'],
    destination: destination as ReverseEngineerRequest['destination'],
    codes: codes as ReverseEngineerRequest['codes'],
    remotes,
  };

  const result = await client.generate.reverseEngineerReport(request);
  printJSON(result);
};

const handleStatus = async (options: ParsedArgs, client: WelesAI) => {
  const id = getOption(options, 'id');
  if (!id) {
    throw new Error('Missing id. Use --id to provide a work item id.');
  }
  const result = await client.generate.status({ id });
  printJSON(result);
};

const handleRetrieve = async (options: ParsedArgs, client: WelesAI) => {
  const id = getOption(options, 'id');
  const fileName = getOption(options, 'file-name', 'fileName');
  if (!id || !fileName) {
    throw new Error('Missing arguments. Use --id and --file-name.');
  }
  const result = await client.generate.retrieve({ id, fileName });
  printJSON(result);
};

const handleList = async (options: ParsedArgs, client: WelesAI) => {
  const filters = await loadJSON<DocumentsListRequest>(
    getOption(options, 'filters'),
    'filters',
    false,
    {}
  );
  const result = await client.generate.list(filters ?? {});
  printJSON(result);
};

const main = async () => {
  const parsed = parseArgs(process.argv.slice(2));
  const [command] = parsed._;

  if (!command || command === 'help' || parsed.help || parsed['--help']) {
    printHelp();
    process.exit(command ? 0 : 1);
    return;
  }

  const client = createClient(parsed);

  switch (command) {
    case 'hld':
    case 'high-level-design':
      await handleHLD(parsed, client);
      break;
    case 'reverse':
    case 'reverse-eng':
      await handleReverse(parsed, client);
      break;
    case 'status':
      await handleStatus(parsed, client);
      break;
    case 'retrieve':
      await handleRetrieve(parsed, client);
      break;
    case 'list':
      await handleList(parsed, client);
      break;
    default:
      printHelp();
      throw new Error(`Unknown command "${command}".`);
  }
};

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error((error as Error).message ?? error);
  process.exit(1);
});
