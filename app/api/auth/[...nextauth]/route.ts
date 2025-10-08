// Force Node.js runtime (critical for nodemailer in EmailProvider)
// Updated: Force clean Docker rebuild
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { handlers } from "@/app/auth";

export const { GET, POST } = handlers;
