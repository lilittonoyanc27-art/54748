import React, { useState } from 'react';
import { X, BookOpen, Volume2, Search, ArrowRight } from 'lucide-react';
import { DIALOGUES } from './dialogues.ts';
import { speakSpanish } from './speech.ts';

interface VocabularyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDialogue: (id: number) => void;
}

export const VocabularyModal: React.FC<VocabularyModalProps> = ({
  isOpen,
  onClose,
  onSelectDialogue,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  // Flatten all options from dialogues
  const vocabItems: {
    wordEs: string;
    meaningHy: string;
    dialogueId: number;
    dialogueTitleEs: string;
    dialogueTitleHy: string;
    isCorrectTarget: boolean;
  }[] = [];

  const seen = new Set<string>();

  DIALOGUES.forEach((d) => {
    d.options.forEach((opt) => {
      const key = `${opt.wordEs}-${opt.meaningHy}`;
      if (!seen.has(key)) {
        seen.add(key);
        vocabItems.push({
          wordEs: opt.wordEs,
          meaningHy: opt.meaningHy,
          dialogueId: d.id,
          dialogueTitleEs: d.titleEs,
          dialogueTitleHy: d.titleHy,
          isCorrectTarget: opt.letter === d.correctOption,
        });
      }
    });
  });

  const filtered = vocabItems.filter(
    (item) =>
      item.wordEs.toLowerCase().includes(search.toLowerCase()) ||
      item.meaningHy.toLowerCase().includes(search.toLowerCase()) ||
      item.dialogueTitleEs.toLowerCase().includes(search.toLowerCase()) ||
      item.dialogueTitleHy.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl border border-orange-300 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-linear-to-r from-orange-50 via-yellow-50 to-emerald-50 dark:from-slate-800 dark:to-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Բառարան և արտահայտություններ
              </h2>
              <p className="text-xs text-orange-800 dark:text-orange-300 font-medium">
                20 երկխոսությունների բոլոր 80 բառերն ու տարբերակները՝ հայերեն բացատրությամբ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Փնտրել իսպաներեն կամ հայերեն բառ (օր.՝ confiar, վստահել)..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-orange-50/50 dark:hover:bg-slate-800 transition-colors flex items-start justify-between gap-3"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
                    {item.wordEs}
                  </span>
                  {item.isCorrectTarget && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                      Ճիշտ պատասխան
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-700 dark:text-slate-300 font-semibold">
                  {item.meaningHy}
                </div>
                <div className="text-xs text-slate-500 pt-0.5">
                  Երկխոսություն #{item.dialogueId}: {item.dialogueTitleEs} ({item.dialogueTitleHy})
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => speakSpanish(item.wordEs)}
                  title="Լսել արտասանությունը"
                  className="p-1.5 rounded-lg text-yellow-500 hover:text-orange-600 hover:bg-yellow-100/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectDialogue(item.dialogueId);
                  }}
                  className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Տեսնել</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400">
              Բառ չի գտնվել «{search}» հարցմամբ:
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center text-xs text-slate-500">
          <span>Ընդհանուր՝ {vocabItems.length} բառապաշարային միավոր</span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold text-white bg-linear-to-r from-orange-500 to-emerald-600 hover:from-orange-600 hover:to-emerald-700 rounded-xl transition-colors cursor-pointer"
          >
            Փակել
          </button>
        </div>
      </div>
    </div>
  );
};

