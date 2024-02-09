import crypto from 'crypto';

/**
 * Generate Key
 * @return {String}
 */
// eslint-disable-next-line import/prefer-default-export
export function generateKey(): string {
  return crypto.randomBytes(20).toString('hex');
}
