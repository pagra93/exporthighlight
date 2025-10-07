'use client';

import { motion } from 'framer-motion';
import { ParserProgress } from '@/hooks/use-parser-with-progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, FileText, Globe, BookOpen, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ParsingProgressProps {
  progress: ParserProgress;
}

export function ParsingProgress({ progress }: ParsingProgressProps) {
  const { t } = useLanguage();
  
  const getPhaseInfo = () => {
    switch (progress.phase) {
      case 'reading':
        return {
          icon: FileText,
          label: t.process.phases.reading.label,
          description: t.process.phases.reading.description,
          color: 'text-blue-500',
        };
      case 'detecting':
        return {
          icon: Globe,
          label: t.process.phases.detecting.label,
          description: t.process.phases.detecting.description,
          color: 'text-purple-500',
        };
      case 'parsing':
        return {
          icon: BookOpen,
          label: t.process.phases.parsing.label,
          description: t.process.phases.parsing.description,
          color: 'text-green-500',
        };
      case 'organizing':
        return {
          icon: CheckCircle2,
          label: t.process.phases.organizing.label,
          description: t.process.phases.organizing.description,
          color: 'text-emerald-500',
        };
      case 'complete':
        return {
          icon: CheckCircle2,
          label: t.process.phases.complete.label,
          description: t.process.phases.complete.description,
          color: 'text-green-600',
        };
      default:
        return {
          icon: Loader2,
          label: t.common.loading,
          description: '',
          color: 'text-gray-500',
        };
    }
  };
  
  const phaseInfo = getPhaseInfo();
  const Icon = phaseInfo.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
    >
      {/* Icon */}
      <div className="flex justify-center">
        <motion.div
          animate={{ rotate: progress.phase === 'complete' ? 0 : 360 }}
          transition={{ duration: 2, repeat: progress.phase === 'complete' ? 0 : Infinity, ease: "linear" }}
          className={`w-16 h-16 rounded-full bg-gradient-to-br ${
            progress.phase === 'complete' 
              ? 'from-green-500 to-emerald-500' 
              : 'from-blue-500 to-purple-500'
          } flex items-center justify-center`}
        >
          <Icon className="h-8 w-8 text-white" />
        </motion.div>
      </div>
      
      {/* Phase label */}
      <div className="text-center space-y-2">
        <h3 className={`text-xl font-semibold ${phaseInfo.color}`}>
          {phaseInfo.label}
        </h3>
        <p className="text-sm text-muted-foreground">
          {phaseInfo.description}
        </p>
        {progress.currentEntry && progress.totalEntries && (
          <p className="text-xs text-muted-foreground mt-2 font-mono">
            {progress.currentEntry} / {progress.totalEntries} {t.process.totalHighlights}
          </p>
        )}
      </div>
      
      {/* Progress bar */}
      <div className="space-y-2">
        <Progress value={progress.progress} className="h-3" />
        <p className="text-right text-sm text-muted-foreground">
          {Math.round(progress.progress)}%
        </p>
      </div>
      
      {/* Animation hints - más detallados */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-center text-xs text-muted-foreground"
      >
        {progress.phase === 'reading' && t.process.phases.reading.hint}
        {progress.phase === 'detecting' && t.process.phases.detecting.hint}
        {progress.phase === 'parsing' && t.process.phases.parsing.hint}
        {progress.phase === 'organizing' && t.process.phases.organizing.hint}
        {progress.phase === 'complete' && t.process.phases.complete.hint}
      </motion.div>
    </motion.div>
  );
}

