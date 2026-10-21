import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const backendDir = path.dirname(fileURLToPath(import.meta.url));

// Load this backend's .env independently of the directory used to launch Node.
dotenv.config({ path: path.join(backendDir, '.env') });

export function resolveBackendPath(value, fallback) {
  const configuredPath = value || fallback;
  return path.isAbsolute(configuredPath)
    ? configuredPath
    : path.resolve(backendDir, configuredPath);
}
