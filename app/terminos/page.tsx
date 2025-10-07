"use client";

import { motion } from 'framer-motion';
import { FileText, Scale, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { OrganizationSchema } from '@/components/seo/SchemaMarkup';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TermsPage() {
  const { t } = useLanguage();

  const termsPoints = [
    {
      icon: CheckCircle,
      title: t.terms?.acceptance?.title || 'Acceptance of Terms',
      description: t.terms?.acceptance?.description || 'By using our service, you agree to these terms and conditions.',
      type: 'positive',
    },
    {
      icon: AlertTriangle,
      title: t.terms?.restrictions?.title || 'Usage Restrictions',
      description: t.terms?.restrictions?.description || 'You may not use our service for illegal or harmful purposes.',
      type: 'warning',
    },
    {
      icon: Scale,
      title: t.terms?.liability?.title || 'Liability',
      description: t.terms?.liability?.description || 'We are not liable for any damages resulting from the use of our service.',
      type: 'neutral',
    },
    {
      icon: FileText,
      title: t.terms?.changes?.title || 'Modifications',
      description: t.terms?.changes?.description || 'We may modify these terms at any time with notice.',
      type: 'neutral',
    },
  ];

  const getIconColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Schema Markup para SEO */}
      <OrganizationSchema
        name="Export Highlight"
        description="Herramienta gratuita para organizar y exportar highlights de Kindle con términos de servicio transparentes"
        url="https://exporthighlight.com"
        logo="https://exporthighlight.com/logo.png"
        contactPoint={{
          email: "legal@kindlenotes.com",
          contactType: "legal"
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
            {t.terms.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t.terms.subtitle}
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{t.terms.lastUpdated}</span>
          </div>
        </motion.div>

        {/* Terms Points */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {termsPoints.map((point, index) => {
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
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getIconColor(point.type)}`}>
                      <Icon className="h-5 w-5" />
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
            {Object.entries(t.terms?.sections || {}).map(([key, section], index) => (
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

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">{t.terms.important.title}</h2>
            <p className="text-orange-100 mb-6">{t.terms.important.description}</p>
            <div className="flex items-center justify-center gap-2 text-orange-200">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">{t.terms.important.note}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
