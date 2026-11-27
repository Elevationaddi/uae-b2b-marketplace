/** DEVELOPMENT HELPER: prints the current TOTP code for a seeded admin. Refuses production. */
import { authenticator } from 'otplib';
import { DEV_ADMIN_TOTP } from './seed-secrets';

if (process.env.NODE_ENV === 'production') {
  console.error('Refusing to run in production.');
  process.exit(1);
}
const email = process.argv[2];
const secret = email ? DEV_ADMIN_TOTP[email] : undefined;
if (!secret) {
  console.error(
    `usage: pnpm dev:totp <email>  (one of: ${Object.keys(DEV_ADMIN_TOTP).join(', ')})`,
  );
  process.exit(2);
}
console.log(authenticator.generate(secret));
