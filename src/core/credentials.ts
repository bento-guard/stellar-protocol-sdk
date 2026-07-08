import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { CREDENTIALS_FILE, BentoError } from '../utils';

export interface Credentials {
  agent_api_key: string;
  jwt_token: string;
}

function getCredentialsFilePath(): string {
  // Check in current working directory first
  const cwdPath = path.join(process.cwd(), CREDENTIALS_FILE);
  if (fs.existsSync(cwdPath)) {
    return cwdPath;
  }
  
  // Fallback to home directory
  return path.join(os.homedir(), CREDENTIALS_FILE);
}

export function loadCredentials(): Credentials {
  const filePath = getCredentialsFilePath();
  
  if (!fs.existsSync(filePath)) {
    throw new BentoError(`Credentials file not found at ${filePath}. Please ensure ${CREDENTIALS_FILE} exists.`);
  }

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    
    if (!parsed.agent_api_key || !parsed.jwt_token) {
      throw new BentoError('Invalid credentials format. Must contain agent_api_key and jwt_token.');
    }
    
    return parsed as Credentials;
  } catch (error: any) {
    if (error instanceof BentoError) throw error;
    throw new BentoError(`Failed to read credentials: ${error.message}`);
  }
}

export function saveCredentials(credentials: Credentials): void {
  const filePath = getCredentialsFilePath();
  try {
    fs.writeFileSync(filePath, JSON.stringify(credentials, null, 2), 'utf-8');
  } catch (error: any) {
    throw new BentoError(`Failed to write credentials: ${error.message}`);
  }
}

