import { execSync } from 'node:child_process';

/**
 * Given. The tests run on their own database, `test.db`, so that they never
 * touch `dev.db`. Before the suite, the migrations are applied to it.
 */
export default function setup(): void {
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: 'file:./test.db' },
  });
}
