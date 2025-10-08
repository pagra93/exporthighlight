// Force Node.js runtime (critical for nodemailer in EmailProvider)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { handlers } from "@/app/auth";

export const { GET, POST } = handlers;
