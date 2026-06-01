import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();
if (!process.env.DATABASE_URL) {
	const rootEnvPath = path.resolve(__dirname, '../../../.env');
	if (fs.existsSync(rootEnvPath)) {
		dotenv.config({ path: rootEnvPath });
	}
}

console.log('[LeakLens Worker] Background processing worker successfully initialized.');
console.log('[LeakLens Worker] Ready to handle OCR, AI analysis, and notifications.');
