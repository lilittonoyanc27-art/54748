import React from 'react';
import { Volume2, BookOpen, CheckCircle2, Moon, Sun, RotateCcw } from 'lucide-react';
import { PartId } from './types.ts';

interface HeaderProps {
  currentPart: PartId | 'all';
  onSelectPart: (part: PartId | 'all') => void;
  completedCount: number;
  totalCount: number;
  onOpenSolutions: () => void;
  onOpenVocabulary: () => void;
  onResetProgress: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPart,
  onSelectPart,
  completedCount,
  totalCount,
  onOpenSolutions,
  onOpenVocabulary,
  onResetProgress,
  isDark,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-orange-200/80 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-emerald-600 via-orange-500 to-yellow-400 text-white flex items-center justify-center font-extrabold text-base shadow-sm ring-1 ring-orange-300">
            ES
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight leading-tight whitespace-nowrap">
              Completa el diálogo
            </span>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold whitespace-nowrap">
              Լրացրու երկխոսությունը · A2–B1
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onSelectPart('all')}
            className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 ${
              currentPart === 'all'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400 font-bold'
                : 'border-transparent hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            Բոլորը (20)
          </button>
          <button
            onClick={() => onSelectPart(1)}
            className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 ${
              currentPart === 1
                ? 'border-orange-500 text-orange-600 dark:text-orange-400 font-bold'
                : 'border-transparent hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            Մաս 1 · Առօրյա (1–5)
          </button>
          <button
            onClick={() => onSelectPart(2)}
            className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 ${
              currentPart === 2
                ? 'border-orange-500 text-orange-600 dark:text-orange-400 font-bold'
                : 'border-transparent hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            Մաս 2 · Ընկերներ (6–10)
          </button>
          <button
            onClick={() => onSelectPart(3)}
            className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 ${
              currentPart === 3
                ? 'border-orange-500 text-orange-600 dark:text-orange-400 font-bold'
                : 'border-transparent hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            Մաս 3 · Իրավիճակներ (11–15)
          </button>
          <button
            onClick={() => onSelectPart(4)}
            className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 ${
              currentPart === 4
                ? 'border-orange-500 text-orange-600 dark:text-orange-400 font-bold'
                : 'border-transparent hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            Մաս 4 · Սպորտ (16–20)
          </button>
        </nav>

        {/* Action Zone: Solutions, Vocab, Dark Mode */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenSolutions}
            title="Պատասխաններ / Soluciones"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Պատասխաններ</span>
            <span className="sm:hidden">Լուծումներ</span>
          </button>

          <button
            onClick={onOpenVocabulary}
            title="Բառապաշար / Vocabulario"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold text-orange-800 dark:text-orange-200 bg-orange-50 dark:bg-orange-950/60 hover:bg-orange-100 dark:hover:bg-orange-900/60 border border-orange-300 dark:border-orange-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4 text-orange-500" />
            <span className="hidden sm:inline">Բառապաշար</span>
          </button>

          <button
            onClick={onToggleTheme}
            aria-label="Փոխել թեման"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-yellow-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-orange-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
