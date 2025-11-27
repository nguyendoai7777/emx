import { join } from 'node:path';
import { readdirSync, unlinkSync } from 'node:fs';

export const deleteFileStartsWith = (prefix: string, userId: string | number) => {
  const dir = join(__dirname, '../public', 'profile-img', String(userId));
  try {
    const files = readdirSync(dir);
    const targets = files.filter((f) => f.startsWith(prefix));
    for (const file of targets) {
      unlinkSync(join(dir, file));
      console.log(`Deleted: ${file}`);
    }
    return targets;
  } catch (err: any) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn(`Folder for user ${userId} not found.`);
      return [];
    }
    throw err;
  }
};
