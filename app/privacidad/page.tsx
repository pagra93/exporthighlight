"use client";

import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, Mail, Calendar } from 'lucide-react';
import { OrganizationSchema } from '@/components/seo/SchemaMarkup';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PrivacyPage() {
  const { t } = useLanguage();

  const privacyPoints = [
    {
      icon: Database,
      title: t.privacy?.dataCollection?.title || 'Data Collection',
      description: t.privacy?.dataCollection?.description || 'We collect only the data necessary to provide our service.',
    },
    {
      icon: Lock,
      title: t.privacy?.dataSecurity?.title || 'Data Security',
      description: t.privacy?.dataSecurity?.description || 'Your data is protected with industry-standard security measures.',
    },
    {
      icon: Eye,
      title: t.privacy?.dataUsage?.title || 'Data Usage',
      description: t.privacy?.dataUsage?.description || 'We use your data only to provide and improve our service.',
    },
    {
      icon: Shield,
      title: t.privacy?.userRights?.title || 'User Rights',
      description: t.privacy?.userRights?.description || 'You have full control over your data and can delete it at any time.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Schema Markup para SEO */}
      <OrganizationSchema
        name="Export Highlight"
        description="Herramienta gratuita para organizar y exportar highlights de Kindle con total privacidad y seguridad"
        url="https://exporthighlight.com"
        logo="https://exporthighlight.com/logo.png"
        contactPoint={{
          email: "privacy@kindlenotes.com",
          contactType: "customer service"
        }}
      />

      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t.privacy.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t.privacy.subtitle}
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{t.privacy.lastUpdated}</span>
          </div>
        </motion.div>

        {/* Privacy Points */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {privacyPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{point.title}</h3>
                      <p className="text-muted-foreground">{point.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Detailed Sections */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto space-y-8">
            {Object.entries(t.privacy?.sections || {}).map(([key, section], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-2xl font-bold mb-4">{section.title || 'Section Title'}</h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  {Array.isArray(section.content) 
                    ? section.content.map((paragraph, pIndex) => (
                        <p key={pIndex} className="mb-4 text-muted-foreground">
                          {paragraph}
                        </p>
                      ))
                    : <p className="mb-4 text-muted-foreground">{section.content || 'No content available'}</p>
                  }
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">{t.privacy?.contact?.title || 'Contact'}</h2>
            <p className="text-blue-100 mb-6">{t.privacy?.contact?.description || 'If you have any questions about this privacy policy, please contact us.'}</p>
            <a
              href="mailto:privacy@kindlenotes.com"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <Mail className="h-5 w-5" />
              {t.privacy.contact.button}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
