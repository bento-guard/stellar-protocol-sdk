import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { CREDENTIALS_FILE } from '../utils';
import { BentoError } from '../utils';

export interface BentoCredentials {
  agentApiKey?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface TokenStore {
  load(): BentoCredentials;
  save(credentials: BentoCredentials): void;
  clear(): void;
}

function resolvePath(fileName = CREDENTIALS_FILE): string {
  const cwdPath = path.join(process.cwd(), fileName);
  if (fs.existsSync(cwdPath)) return cwdPath;
  return path.join(os.homedir(), fileName);
}

export class FileTokenStore implements TokenStore {
  constructor(private readonly fileName = CREDENTIALS_FILE) {}

  load(): BentoCredentials {
    const filePath = resolvePath(this.fileName);
    if (!fs.existsSync(filePath)) {
      return {};
    }

    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as BentoCredentials;
    } catch (error: any) {
      throw new BentoError(`Failed to read credentials: ${error.message}`);
    }
  }

  save(credentials: BentoCredentials): void {
    const filePath = resolvePath(this.fileName);
    try {
      fs.writeFileSync(filePath, JSON.stringify(credentials, null, 2), { encoding: 'utf-8', mode: 0o600 });
      try {
        fs.chmodSync(filePath, 0o600);
      } catch {
        // Best-effort hardening; some platforms ignore POSIX-style permissions.
      }
    } catch (error: any) {
      throw new BentoError(`Failed to write credentials: ${error.message}`);
    }
  }

  clear(): void {
    const filePath = resolvePath(this.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
