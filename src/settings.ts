import path from 'path';

export const BASE_DIR: string = path.dirname(__filename);

export const MONGODB_URI: string = String(process.env.MONGODB_URI);
