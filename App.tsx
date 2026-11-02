import React, { useState, useEffect, useMemo } from 'react';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Search,
  Sparkles,
  BookOpen,
  Filter,
  Eye,
  EyeOff,
  RotateCcw,
  Trophy,
  MessageSquare,
  GraduationCap
} from 'lucide-react';
import { Header } from './Header.tsx';
import { DialogueCard } from './DialogueCard.tsx';
import { SolutionsModal } from './SolutionsModal.tsx';
import { VocabularyModal } from './VocabularyModal.tsx';
import { DIALOGUES } from './dialogues.ts';
import { PartId } from './types.ts';

const LOCAL_STORAGE_KEY = 'es_hy_dialogues_answers_v1';
const THEME_STORAGE_KEY = 'es_hy_theme_v1';

export default function App() {
  const [selectedPart, setSelectedPart] = useState<PartId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllTranslations, setShowAllTranslations] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [isVocabOpen, setIsVocabOpen] = useState(false);

  // Stored answers: { [dialogueId]: 'A' | 'B' | 'C' | 'D' }
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Dark mode
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved) return saved === 'dark';
      return (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    }
  }, [isDark]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(answers));
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  }, [answers]);

  const handleAnswer = (dialogueId: number, letter: 'A' | 'B' | 'C' | 'D') => {
    setAnswers((prev) => ({
      ...prev,
      [dialogueId]: letter,
    }));
  };

  const handleResetSingle = (dialogueId: number) => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[dialogueId];
      return copy;
    });
  };

  const handleResetAll = () => {
    if (window.confirm('Իսկապե՞ս ցանկանում եք զրոյացնել բոլոր պատասխանները և սկսել նորից:')) {
      setAnswers({});
    }
  };

  // Jump to dialogue
  const handleJumpToDialogue = (id: number) => {
    setSelectedPart('all');
    setSearchQuery('');
    setTimeout(() => {
      const targetCard = document.getElementById(`dialogue-${id}`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Filtering
  const filteredDialogues = useMemo(() => {
    return DIALOGUES.filter((item) => {
      if (selectedPart !== 'all' && item.partId !== selectedPart) {
        return false;
      }
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        item.titleEs.toLowerCase().includes(q) ||
        item.titleHy.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.targetWord.toLowerCase().includes(q) ||
        item.id.toString() === q ||
        item.lines.some(
          (l) =>
            l.textEs.toLowerCase().includes(q) ||
            l.textHy.toLowerCase().includes(q)
        )
      );
    });
  }, [selectedPart, searchQuery]);

  // Stats calculation
  const totalQuestions = DIALOGUES.length;
  const answeredCount = Object.keys(answers).length;
  const correctCount = DIALOGUES.filter(
    (d) => answers[d.id] === d.correctOption
  ).length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-yellow-200 selection:text-orange-950">
      {/* Top Bar */}
      <Header
        currentPart={selectedPart}
        onSelectPart={setSelectedPart}
        completedCount={correctCount}
        totalCount={totalQuestions}
        onOpenSolutions={() => setIsSolutionsOpen(true)}
        onOpenVocabulary={() => setIsVocabOpen(true)}
        onResetProgress={handleResetAll}
        isDark={isDark}
        onToggleTheme={() => setIsDark((d) => !d)}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Section in Green, Orange, Yellow */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-500/15 via-orange-500/15 to-yellow-400/20 border-2 border-orange-300 dark:border-orange-900/60 p-6 sm:p-8 shadow-sm">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider bg-white/70 dark:bg-slate-900/70 px-3 py-1 rounded-full border border-orange-200 dark:border-slate-800">
              <span className="text-orange-600 font-extrabold">Մակարդակ A2–B1</span>
              <span aria-hidden="true">·</span>
              <span>20 առօրյա իրավիճակ</span>
              <span aria-hidden="true">·</span>
              <span className="text-yellow-600 dark:text-yellow-400 font-bold">Español y armenio</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              🎭 Completa el diálogo — Լրացրու երկխոսությունը
            </h1>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              Կարդա երկխոսությունը և ընտրիր բաց թողնված բառը կամ արտահայտությունը։
              Յուրաքանչյուր հարց ունի 4 տարբերակ և միայն մեկ ճիշտ պատասխան։{' '}
              <strong className="text-orange-700 dark:text-orange-300 underline font-bold">
                Սեղմիր իսպաներեն նախադասության վրա
              </strong>
              , որպեսզի տեսնես դրա հայերեն թարգմանությունը։
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-300"></span>
                Սեղմում = Հայերեն թարգմանություն
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 ring-2 ring-orange-300"></span>
                <Volume2 className="w-3.5 h-3.5 text-orange-500" />
                Բնական իսպաներեն արտասանություն
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 ring-2 ring-yellow-200"></span>
                <MessageSquare className="w-3.5 h-3.5 text-yellow-600" />
                Բանավոր խոսքի շարունակություն
              </span>
            </div>
          </div>
        </div>

        {/* Progress & Controls Strip in Green, Orange, Yellow */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-orange-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Քո առաջընթացը
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-linear-to-r from-emerald-100 to-yellow-100 text-emerald-900 dark:from-emerald-950 dark:to-yellow-950 dark:text-emerald-200 border border-emerald-300 tabular-nums">
                  {correctCount} / {totalQuestions} ճիշտ ({percentage}%)
                </span>
              </div>
              <div className="w-full sm:w-64 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                <div
                  className="h-full rounded-full bg-linear-to-r from-emerald-500 via-orange-500 to-yellow-400 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => setShowAllTranslations((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg border transition-colors cursor-pointer ${
                  showAllTranslations
                    ? 'bg-yellow-100 dark:bg-yellow-950/60 border-yellow-400 text-yellow-950 dark:text-yellow-200'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-yellow-50'
                }`}
              >
                {showAllTranslations ? (
                  <>
                    <EyeOff className="w-4 h-4 text-orange-600" />
                    <span>Թաքցնել թարգմանությունները</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 text-emerald-600" />
                    <span>Բացել բոլոր թարգմանությունները</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsSolutionsOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-400 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ցույց տալ պատասխանները</span>
              </button>

              {answeredCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetAll}
                  title="Զրոյացնել"
                  className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filter tabs & Search */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
              <button
                onClick={() => setSelectedPart('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedPart === 'all'
                    ? 'bg-linear-to-r from-emerald-600 to-orange-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Բոլորը (20)
              </button>
              <button
                onClick={() => setSelectedPart(1)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedPart === 1
                    ? 'bg-linear-to-r from-emerald-600 to-orange-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                1. Առօրյա (1–5)
              </button>
              <button
                onClick={() => setSelectedPart(2)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedPart === 2
                    ? 'bg-linear-to-r from-emerald-600 to-orange-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                2. Ընկերներ (6–10)
              </button>
              <button
                onClick={() => setSelectedPart(3)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedPart === 3
                    ? 'bg-linear-to-r from-emerald-600 to-orange-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                3. Իրավիճակներ (11–15)
              </button>
              <button
                onClick={() => setSelectedPart(4)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedPart === 4
                    ? 'bg-linear-to-r from-emerald-600 to-orange-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                4. Սպորտ (16–20)
              </button>
            </div>

            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-orange-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Որոնել երկխոսություն..."
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl border border-orange-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Guideline in Green, Orange, Yellow */}
        <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-emerald-50 via-yellow-50 to-orange-50 dark:from-emerald-950/20 dark:via-yellow-950/20 dark:to-orange-950/20 border-2 border-yellow-300 dark:border-yellow-900/40 flex items-start gap-3.5">
          <GraduationCap className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
            <h3 className="font-extrabold text-emerald-900 dark:text-emerald-200 text-sm sm:text-base">
              Práctica oral — Բանավոր պրակտիկա
            </h3>
            <p className="leading-relaxed">
              Երբ լրացնես բաց թողնված բառը, շարունակիր երկխոսությունը ևս 1–2
              նախադասությամբ՝ պատկերացնելով, որ ինքդ ես զրուցակիցներից մեկը։
              Այսպես կվարժվես ոչ միայն բառերն ընտրելուն, այլև իրական
              խոսակցություն վարելուն։ Յուրաքանչյուր քարտի ներքևում կգտնես «🎭
              Բանավոր պրակտիկա» բաժինը։
            </p>
          </div>
        </div>

        {/* Dialogues List */}
        <div className="space-y-6">
          {filteredDialogues.map((item) => (
            <div key={item.id} id={`dialogue-${item.id}`}>
              <DialogueCard
                dialogue={item}
                userAnswer={answers[item.id]}
                onAnswer={handleAnswer}
                onReset={handleResetSingle}
                showAllTranslationsGlobal={showAllTranslations}
              />
            </div>
          ))}

          {filteredDialogues.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Search className="w-8 h-8 text-orange-400 mx-auto" />
              <div className="font-bold text-slate-800 dark:text-slate-200">
                Երկխոսություն չի գտնվել
              </div>
              <p className="text-xs text-slate-500">
                Փորձիր փոխել որոնման բառը կամ ընտրել «Բոլորը (20)» բաժինը:
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer in Green, Orange, Yellow */}
      <footer className="mt-16 py-8 border-t border-orange-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <span className="text-emerald-600">Completa el diálogo</span>
            <span aria-hidden="true">·</span>
            <span className="text-orange-600">20 առօրյա իրավիճակ (A2–B1)</span>
          </div>
          <div>
            <span className="font-semibold text-yellow-600 dark:text-yellow-400">Իսպաներենի և հայերենի ինտերակտիվ ուսուցում</span>
          </div>
        </div>
      </footer>

      {/* Solutions Modal */}
      <SolutionsModal
        isOpen={isSolutionsOpen}
        onClose={() => setIsSolutionsOpen(false)}
        onJumpToDialogue={handleJumpToDialogue}
      />

      {/* Vocabulary Modal */}
      <VocabularyModal
        isOpen={isVocabOpen}
        onClose={() => setIsVocabOpen(false)}
        onSelectDialogue={handleJumpToDialogue}
      />
    </div>
  );
}
