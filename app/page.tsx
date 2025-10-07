"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SimpleDropzone } from '@/components/SimpleDropzone';
import { ParsingProgress } from '@/components/ParsingProgress';
import { Button } from '@/components/ui/button';
import { Upload, BookOpen, Download, Shield, Zap, Cloud, ArrowRight, CheckCircle, Star, Users, FileText, Smartphone, Laptop, AlertCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { validateFile } from '@/lib/parseClippings';
import { useParserWithProgress } from '@/hooks/use-parser-with-progress';
import { WebApplicationSchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import { useAnalytics } from '@/components/analytics/GoogleAnalytics';
import { set as idbSet } from 'idb-keyval';

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { parseFile, progress, cancel } = useParserWithProgress();
  const { trackEvent } = useAnalytics();

  const handleFileAccepted = async (acceptedFile: File) => {
    const validation = validateFile(acceptedFile);
    if (!validation.valid) {
      trackEvent('file_upload_error', {
        error_type: validation.error,
        file_name: acceptedFile.name,
        file_size: acceptedFile.size,
      });
      toast({
        title: t.common.error,
        description: validation.error,
        variant: "destructive",
      });
      return;
    }
    
    setFile(acceptedFile);
    trackEvent('file_uploaded', {
      file_name: acceptedFile.name,
      file_size: acceptedFile.size,
      file_type: acceptedFile.type,
    });
    toast({
      title: t.common.success,
      description: `${acceptedFile.name} (${(acceptedFile.size / 1024).toFixed(0)} KB)`,
    });
  };

  const handleProcess = async () => {
    if (!file) return;
    
    try {
      trackEvent('file_processing_started', {
        file_name: file.name,
        file_size: file.size,
      });
      
      // Use the new robust parser with progress
      const result = await parseFile(file);
      
      if (!result || !result.books || result.books.length === 0) {
        throw new Error(t.upload.error);
      }
      
      // Show errors if any (but don't fail completely)
      if (result.errors && result.errors.length > 0) {
        console.warn(`⚠️ Parse completed with ${result.errors.length} warnings:`, result.errors);
      }
      
      // Save to IndexedDB
      await idbSet('parseResult', result);
      
      trackEvent('file_processing_success', {
        books_count: result.stats.books,
        highlights_count: result.stats.highlights,
        language: result.language,
        processing_time: Date.now(),
      });
      
      toast({
        title: t.upload.success,
        description: `${result.stats.books} ${t.process.foundBooks}, ${result.stats.highlights} ${t.process.totalHighlights} (${result.language.toUpperCase()})`,
      });
      
      // Navigate to results
      router.push('/process');
      
    } catch (error) {
      console.error('❌ Parse error:', error);
      trackEvent('file_processing_error', {
        error_message: error instanceof Error ? error.message : t.upload.error,
        file_name: file.name,
      });
      toast({
        title: t.common.error,
        description: error instanceof Error ? error.message : t.upload.error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Schema Markup para SEO */}
      <WebApplicationSchema
        name="Export Highlight"
        description="Extrae y organiza todos tus highlights de Kindle, incluyendo libros de fuentes externas. Convierte My Clippings.txt en notas organizadas y exportables a Markdown."
        url="https://exporthighlight.com"
        applicationCategory="ProductivityApplication"
        operatingSystem="Web Browser"
        offers={{
          price: "0",
          priceCurrency: "EUR"
        }}
        aggregateRating={{
          ratingValue: 4.8,
          ratingCount: 250
        }}
      />
      
      <FAQSchema
        faqs={[
          {
            question: "¿Funciona con libros que NO compré en Amazon?",
            answer: "¡Sí! Esta es nuestra ventaja principal. Funciona con PDFs, EPUBs, MOBIs y cualquier archivo que hayas leído en tu Kindle, sin importar de dónde lo conseguiste."
          },
          {
            question: "¿Dónde encuentro mi archivo My Clippings.txt?",
            answer: "Conecta tu Kindle a tu computadora. El archivo está en la carpeta raíz: Kindle/documents/My Clippings.txt"
          },
          {
            question: "¿Es gratis?",
            answer: "Totalmente gratis. Sin límites, sin anuncios, sin tarjeta de crédito requerida."
          },
          {
            question: "¿Qué formatos de export soportan?",
            answer: "Actualmente exportamos a Markdown (.md), compatible con Notion, Obsidian, Roam Research y otras apps."
          },
          {
            question: "¿Soporta múltiples idiomas?",
            answer: "Sí. Detectamos automáticamente el idioma de tus highlights y los procesamos correctamente."
          }
        ]}
      />

      {/* Hero Section - Optimizado para SEO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            {/* H1 Optimizado para SEO - Palabras clave principales */}
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t.landing.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t.landing.hero.subtitle}
            </p>
            
            {/* Upload Area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <AnimatePresence mode="wait">
                {progress.isProcessing ? (
                  <motion.div
                    key="progress"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ParsingProgress progress={progress} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
                  >
                    <SimpleDropzone
                      onFileAccepted={handleFileAccepted}
                      disabled={progress.isProcessing}
                      selectedFileName={file?.name}
                    />
                    
                    {file && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6"
                      >
                        <Button
                          onClick={handleProcess}
                          disabled={progress.isProcessing}
                          size="lg"
                          className="w-full text-lg h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <Zap className="h-5 w-5 mr-2" />
                          {t.landing.hero.cta}
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Valor único destacado - Diseño creativo */}
            <div className="relative max-w-4xl mx-auto mt-12">
              <div className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 dark:from-orange-900/20 dark:via-red-900/20 dark:to-pink-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-2xl p-8 shadow-lg">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    {t.landing.hero.uniqueValue.badge}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">NO</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">{t.landing.hero.uniqueValue.comparison.onlyAmazon}</span>
                  </div>
                  <ArrowRight className="h-6 w-6 text-orange-500" />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-green-700 dark:text-green-300">{t.landing.hero.uniqueValue.comparison.allBooks}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-3 text-orange-800 dark:text-orange-200">
                  {t.landing.hero.uniqueValue.title}
                </h2>
                <p className="text-lg text-center text-orange-700 dark:text-orange-300 mb-4">
                  <strong>{t.landing.hero.uniqueValue.description}</strong>
                </p>
                <p className="text-base text-center text-orange-600 dark:text-orange-400">
                  {t.landing.hero.uniqueValue.subtitle}
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Tutorial: Cómo encontrar el archivo Kindle */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t.landing.tutorial.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t.landing.tutorial.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: Smartphone,
                title: t.landing.tutorial.steps.step1.title,
                description: t.landing.tutorial.steps.step1.description,
                color: "from-blue-500 to-cyan-500",
              },
              {
                step: "2", 
                icon: Laptop,
                title: t.landing.tutorial.steps.step2.title,
                description: t.landing.tutorial.steps.step2.description,
                color: "from-purple-500 to-pink-500",
              },
              {
                step: "3",
                icon: FileText,
                title: t.landing.tutorial.steps.step3.title,
                description: t.landing.tutorial.steps.step3.description,
                color: "from-green-500 to-emerald-500",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="h-full p-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-lg`}>
                      {step.step}
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                      <step.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Características principales */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            {t.landing.features.title}
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: t.landing.features.items.organize.title,
                description: t.landing.features.items.organize.description,
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Download,
                title: t.landing.features.items.export.title,
                description: t.landing.features.items.export.description,
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Cloud,
                title: t.landing.features.items.cloud.title,
                description: t.landing.features.items.cloud.description,
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Shield,
                title: t.landing.features.items.privacy.title,
                description: t.landing.features.items.privacy.description,
                color: "from-orange-500 to-red-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="h-full p-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 hover:shadow-xl transition-all duration-300">
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What our users say
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Thousands of users have already extracted their Kindle highlights with our tool
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Literature Student',
                content: 'Amazing tool. I was able to extract all my highlights from books I downloaded from the internet. Before it was impossible to organize them.',
                rating: 5,
              },
              {
                name: 'Michael Chen',
                role: 'Researcher',
                content: 'Finally I can export my notes from technical books that I didn\'t buy on Amazon. The tool works perfectly.',
                rating: 5,
              },
              {
                name: 'Emily Davis',
                role: 'Writer',
                content: 'I\'ve tried many tools but this is the only one that works with ALL my Kindle books, no matter where I got them from.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { value: "10K+", label: t.landing.stats.books },
              { value: "250K+", label: t.landing.stats.highlights },
              { value: "2K+", label: t.landing.stats.users },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-5xl md:text-6xl font-extrabold mb-2">{stat.value}</div>
                <div className="text-xl text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            {t.landing.faq.title}
          </motion.h2>
          
          <div className="space-y-6">
            {Object.entries(t.landing.faq.items).map(([key, item], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl font-semibold mb-3">{item.question}</h3>
                <p className="text-muted-foreground">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t.landing.cta.title}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t.landing.cta.subtitle}
            </p>
            <Button
              size="lg"
              className="text-lg h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Upload className="h-5 w-5 mr-2" />
              {t.landing.hero.cta}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
