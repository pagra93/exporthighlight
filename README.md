# export.highlight

Extract and organize your Kindle highlights from My Clippings.txt files into exportable Markdown notes.

## 🚀 Features

- **Extract ALL books**: Works with Amazon books, PDFs, EPUBs, MOBIs and any file you've read on your Kindle
- **Smart organization**: Automatically groups highlights by book and author
- **Custom tags**: Create tags to categorize your highlights
- **Advanced search**: Find any highlight with powerful search capabilities
- **Multiple export formats**: Download in Markdown, compatible with Notion, Obsidian, and more
- **Cloud sync**: Access your highlights from any device
- **Privacy first**: Optional local processing and end-to-end encryption

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Row Level Security)
- **Authentication**: NextAuth.js with Email Provider
- **Animations**: Framer Motion
- **Testing**: Vitest, Testing Library

> **Note:** Currently migrating from Supabase Auth to NextAuth. See [`supabase/migrations/`](supabase/migrations/) for details.

## 📋 Prerequisites

- Node.js 20+ (recommended)
- npm or yarn
- Supabase account

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/export-highlight.git
   cd export-highlight
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project (or use self-hosted with Coolify)
   - Run the SQL scripts in `supabase-schema.sql` and `supabase-tags-schema.sql`
   - Enable Row Level Security (RLS)
   - **For authentication migration**: See [`supabase/migrations/INDEX.md`](supabase/migrations/INDEX.md)

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
export-highlight/
├── app/                    # Next.js App Router pages
│   ├── account/           # User account pages
│   ├── auth/              # Authentication
│   └── ...
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   └── ...
├── contexts/              # React contexts
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
│   ├── i18n/             # Internationalization
│   └── ...
├── supabase/             # Supabase files
│   └── migrations/       # Auth migration scripts (Supabase Auth → NextAuth)
└── styles/               # Global styles
```

## 🌍 Internationalization

The app supports multiple languages:
- English (default)
- Spanish

To add a new language:
1. Create a new translation file in `lib/i18n/translations/`
2. Update `lib/i18n/types.ts` with the new language
3. Add the language to `lib/i18n/translations/index.ts`

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (server-only) | Yes |
| `SUPABASE_JWT_SECRET` | JWT secret for NextAuth (same as GOTRUE_JWT_SECRET) | Yes |
| `NEXTAUTH_URL` | Your app URL (e.g., https://yourdomain.com) | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth (generate with openssl) | Yes |
| `SMTP_HOST` | SMTP server host | Yes |
| `SMTP_PORT` | SMTP server port | Yes |
| `SMTP_USER` | SMTP username | Yes |
| `SMTP_PASS` | SMTP password | Yes |
| `SMTP_FROM` | Email "from" address | Yes |

> **For self-hosted Supabase**: See [`supabase/migrations/SELF_HOSTED_GUIDE.md`](supabase/migrations/SELF_HOSTED_GUIDE.md) for detailed configuration.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Next.js](https://nextjs.org/) for the amazing React framework
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact us at [your-email@example.com]

---

Made with ❤️ for readers