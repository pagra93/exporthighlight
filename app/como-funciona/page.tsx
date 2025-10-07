"use client";

import { motion } from 'framer-motion';
import { BookOpen, Upload, FileText, Download, Tag, Search, Users } from 'lucide-react';
import { HowToSchema } from '@/components/seo/SchemaMarkup';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HowItWorksPage() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Upload,
      title: t.howItWorks.steps.step1.title,
      description: t.howItWorks.steps.step1.description,
    },
    {
      icon: FileText,
      title: t.howItWorks.steps.step2.title,
      description: t.howItWorks.steps.step2.description,
    },
    {
      icon: Tag,
      title: t.howItWorks.steps.step3.title,
      description: t.howItWorks.steps.step3.description,
    },
    {
      icon: Search,
      title: t.howItWorks.steps.step4.title,
      description: t.howItWorks.steps.step4.description,
    },
    {
      icon: Download,
      title: t.howItWorks.steps.step5.title,
      description: t.howItWorks.steps.step5.description,
    },
  ];

  const features = [
    {
      icon: BookOpen,
      title: t.howItWorks.features.organize.title,
      description: t.howItWorks.features.organize.description,
    },
    {
      icon: Tag,
      title: t.howItWorks.features.tags.title,
      description: t.howItWorks.features.tags.description,
    },
    {
      icon: Search,
      title: t.howItWorks.features.search.title,
      description: t.howItWorks.features.search.description,
    },
    {
      icon: Download,
      title: t.howItWorks.features.export.title,
      description: t.howItWorks.features.export.description,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Schema Markup para SEO */}
      <HowToSchema
        name="Cómo Exportar Highlights de Kindle"
        description="Guía paso a paso para extraer y organizar tus highlights de Kindle usando Kindle Notes Organizer"
        steps={[
          {
            name: "Sube tu archivo",
            text: "Arrastra tu archivo My Clippings.txt desde tu Kindle. El sistema lo procesará automáticamente."
          },
          {
            name: "Procesamiento inteligente",
            text: "Nuestro algoritmo separa tus highlights por libro, detecta autores y organiza todo por fecha."
          },
          {
            name: "Organiza con etiquetas",
            text: "Crea etiquetas personalizadas para categorizar tus highlights por tema, importancia o cualquier criterio."
          },
          {
            name: "Busca y filtra",
            text: "Encuentra cualquier highlight usando nuestro buscador avanzado o filtra por etiquetas y colecciones."
          },
          {
            name: "Exporta y comparte",
            text: "Descarga tus highlights en Markdown para usar en Notion, Obsidian o cualquier otra aplicación."
          }
        ]}
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
            {t.howItWorks.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t.howItWorks.subtitle}
          </p>
        </motion.div>

        {/* Steps */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            {t.howItWorks.stepsTitle}
          </motion.h2>

          <div className="space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-6 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                        {t.howItWorks.step} {index + 1}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Features */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            {t.howItWorks.featuresTitle}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
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
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            {t.howItWorks.faqTitle}
          </motion.h2>

          <div className="max-w-4xl mx-auto space-y-6">
            {Object.entries(t.howItWorks.faq).map(([key, item], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-semibold mb-3">{item.question}</h3>
                <p className="text-muted-foreground">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">{t.howItWorks.cta.title}</h2>
            <p className="text-blue-100 mb-6">{t.howItWorks.cta.description}</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <Upload className="h-5 w-5" />
              {t.howItWorks.cta.button}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
