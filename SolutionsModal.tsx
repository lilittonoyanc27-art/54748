import React, { useState } from 'react';
import { X, CheckCircle2, Search, Volume2 } from 'lucide-react';
import { DIALOGUES } from './dialogues.ts';
import { speakSpanish } from './speech.ts';

interface SolutionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToDialogue: (id: number) => void;
}

export const SolutionsModal: React.FC<SolutionsModalProps> = ({
  isOpen,
  onClose,
  onJumpToDialogue,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = DIALOGUES.filter(
    (d) =>
      d.titleEs.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.titleHy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.targetWord.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toString() === searchTerm.trim()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl border border-emerald-300 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-linear-to-r from-emerald-50 via-yellow-50 to-orange-50 dark:from-slate-800 dark:to-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Soluciones — Պատասխաններ
              </h2>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                Բոլոր 20 երկխոսությունների ճիշտ տարբերակներն ու բացատրությունները
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
            <Search className="w-4 h-4 text-orange-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Որոնել ըստ վերնագրի կամ բառի (օր.՝ batería, սրճարան, 1)..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* List of 20 solutions */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.map((d) => {
            const correctOpt = d.options.find((o) => o.letter === d.correctOption);
            const blankLine = d.lines.find((l) => l.isBlankLine);
            const filledTextEs = blankLine
              ? blankLine.textEs.replace('______', d.targetWord)
              : '';

            return (
              <div key={d.id} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-yellow-400 text-yellow-950 font-bold text-xs flex items-center justify-center">
                      {d.id}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                      {d.titleEs} — {d.titleHy}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300">
                      {d.correctOption}) {d.targetWord}
                      {correctOpt?.meaningHy ? ` (${correctOpt.meaningHy})` : ''}
                    </span>
                    <button
                      onClick={() => {
                        onClose();
                        onJumpToDialogue(d.id);
                      }}
                      className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                    >
                      Անցնել հարցին →
                    </button>
                  </div>
                </div>

                {blankLine && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
                    <div className="space-y-1 text-sm">
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {blankLine.speakerEs}:{' '}
                        <span>
                          {blankLine.textEs.split('______')[0]}
                          <strong className="text-emerald-700 dark:text-emerald-400 underline font-bold">
                            {d.targetWord}
                          </strong>
                          {blankLine.textEs.split('______')[1]}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {blankLine.speakerHy}: {blankLine.textHy}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => speakSpanish(filledTextEs)}
                      title="Լսել ամբողջական նախադասությունը"
                      className="p-1.5 rounded-lg text-yellow-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <p className="text-xs text-slate-600 dark:text-slate-300 italic pl-1">
                  💡 {d.explanationHy}
                </p>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              Արդյունք չի գտնվել «{searchTerm}» հարցմամբ:
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold text-white bg-linear-to-r from-emerald-600 to-orange-500 hover:from-emerald-700 hover:to-orange-600 rounded-xl transition-colors cursor-pointer"
          >
            Փակել
          </button>
        </div>
      </div>
    </div>
  );
};
