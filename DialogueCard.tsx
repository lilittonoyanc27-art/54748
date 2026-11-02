import React, { useState } from 'react';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Languages,
  RotateCcw,
  Mic,
  Send,
  Eye,
  EyeOff
} from 'lucide-react';
import { DialogueItem, DialogueOption } from './types.ts';
import { speakSpanish, stopSpeech } from './speech.ts';

interface DialogueCardProps {
  dialogue: DialogueItem;
  userAnswer?: 'A' | 'B' | 'C' | 'D';
  onAnswer: (dialogueId: number, optionLetter: 'A' | 'B' | 'C' | 'D') => void;
  onReset: (dialogueId: number) => void;
  showAllTranslationsGlobal: boolean;
}

export const DialogueCard: React.FC<DialogueCardProps> = ({
  dialogue,
  userAnswer,
  onAnswer,
  onReset,
  showAllTranslationsGlobal,
}) => {
  // Individual line translation visibility (defaults to false unless global toggle is on or clicked)
  const [revealedLines, setRevealedLines] = useState<Record<string, boolean>>({});
  const [activeSpeakingLineId, setActiveSpeakingLineId] = useState<string | null>(null);
  const [showOralPractice, setShowOralPractice] = useState<boolean>(false);
  const [oralInput, setOralInput] = useState<string>('');
  const [oralSubmissions, setOralSubmissions] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>(dialogue.lines[0].speakerEs);

  const isAnswered = userAnswer !== undefined;
  const isCorrect = userAnswer === dialogue.correctOption;

  const toggleLineTranslation = (lineId: string) => {
    setRevealedLines((prev) => ({
      ...prev,
      [lineId]: !isLineRevealed(lineId),
    }));
  };

  const isLineRevealed = (lineId: string) => {
    if (showAllTranslationsGlobal) return true;
    return !!revealedLines[lineId];
  };

  const handleSpeak = (text: string, lineId: string) => {
    if (activeSpeakingLineId === lineId) {
      stopSpeech();
      setActiveSpeakingLineId(null);
      return;
    }
    setActiveSpeakingLineId(lineId);
    speakSpanish(
      text,
      () => setActiveSpeakingLineId(lineId),
      () => setActiveSpeakingLineId(null)
    );
  };

  const handleSelectOption = (letter: 'A' | 'B' | 'C' | 'D') => {
    onAnswer(dialogue.id, letter);
  };

  const handleAddOralContinuation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oralInput.trim()) return;
    setOralSubmissions((prev) => [...prev, oralInput.trim()]);
    setOralInput('');
  };

  // Helper to format line with filled word if answered
  const renderDialogueText = (textEs: string, isBlank: boolean) => {
    if (!isBlank) return <span>{textEs}</span>;

    const parts = textEs.split('______');
    const displayWord = isAnswered
      ? dialogue.options.find((o) => o.letter === userAnswer)?.wordEs || '______'
      : '______';

    return (
      <span>
        {parts[0]}
        <span
          className={`inline-block px-2.5 py-0.5 mx-1 font-bold rounded-lg transition-all ${
            isAnswered
              ? isCorrect
                ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500'
                : 'bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200 ring-2 ring-orange-500 line-through'
              : 'bg-yellow-100 text-yellow-950 dark:bg-yellow-950/80 dark:text-yellow-200 border-b-2 border-orange-500'
          }`}
        >
          {displayWord}
        </span>
        {parts[1] || ''}
      </span>
    );
  };

  return (
    <article className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Top Meta Bar */}
      <div className="px-5 py-3.5 bg-linear-to-r from-emerald-50/50 via-orange-50/40 to-yellow-50/40 dark:from-slate-800/80 dark:to-slate-800/40 border-b border-orange-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
          <span className="font-bold text-orange-600 dark:text-orange-400 px-2 py-0.5 bg-orange-100 dark:bg-orange-950/60 rounded-md">
            № {dialogue.id}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-medium text-emerald-800 dark:text-emerald-300">
            {dialogue.partTitleHy}
          </span>
          <span aria-hidden="true">·</span>
          <span className="hidden sm:inline text-slate-500">{dialogue.category}</span>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          {isAnswered && (
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md ${
                isCorrect
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                  : 'bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300'
              }`}
            >
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ճիշտ է
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5 text-orange-600" /> Փորձիր կրկին
                </>
              )}
            </span>
          )}

          {isAnswered && (
            <button
              onClick={() => onReset(dialogue.id)}
              title="Մաքրել պատասխանը"
              className="p-1.5 text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 rounded-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Card Body */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* Title */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-baseline gap-2 flex-wrap">
            <span className="text-emerald-800 dark:text-emerald-400">{dialogue.titleEs}</span>
            <span className="text-base font-normal text-slate-600 dark:text-slate-400">
              — {dialogue.titleHy}
            </span>
          </h2>
          <p className="mt-1 text-xs text-orange-700 dark:text-orange-300 flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-orange-500" />
            <span>
              Սեղմիր իսպաներեն ցանկացած տողի վրա՝ հայերեն թարգմանությունը բացելու համար։
            </span>
          </p>
        </div>

        {/* Dialog Replicas Container */}
        <div className="space-y-3">
          {dialogue.lines.map((line) => {
            const revealed = isLineRevealed(line.id);
            const isSpeaking = activeSpeakingLineId === line.id;

            return (
              <div
                key={line.id}
                onClick={() => toggleLineTranslation(line.id)}
                className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer select-text ${
                  revealed
                    ? 'bg-yellow-50/70 dark:bg-yellow-950/20 border-yellow-300 dark:border-yellow-900/60 ring-1 ring-yellow-400/40'
                    : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-orange-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    {/* Speaker label */}
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-orange-600 dark:text-orange-400">
                        {line.speakerEs}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] font-normal">
                        ({line.speakerHy})
                      </span>
                    </div>

                    {/* Spanish text */}
                    <div className="text-base sm:text-lg text-slate-900 dark:text-slate-100 font-medium leading-relaxed">
                      {renderDialogueText(line.textEs, !!line.isBlankLine)}
                    </div>

                    {/* Armenian Translation */}
                    {revealed ? (
                      <div className="pt-1.5 text-sm sm:text-base text-slate-700 dark:text-slate-200 font-normal border-t border-yellow-200 dark:border-yellow-900/40 flex items-baseline gap-2">
                        <span className="text-xs text-orange-600 dark:text-orange-400 font-bold shrink-0">
                          Թարգմանություն՝
                        </span>
                        <span>{line.textHy}</span>
                      </div>
                    ) : (
                      <div className="pt-0.5 text-xs text-slate-400 dark:text-slate-500 italic flex items-center gap-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        <Eye className="w-3 h-3 text-yellow-500" />
                        <span>Սեղմիր՝ հայերեն թարգմանությունը տեսնելու համար</span>
                      </div>
                    )}
                  </div>

                  {/* Actions: Audio Pronunciation */}
                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const textToSpeak = line.isBlankLine && isAnswered && isCorrect
                          ? line.textEs.replace('______', dialogue.targetWord)
                          : line.textEs;
                        handleSpeak(textToSpeak, line.id);
                      }}
                      title="Լսել արտասանությունը (Իսպաներեն)"
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        isSpeaking
                          ? 'bg-yellow-400 text-slate-900 animate-pulse'
                          : 'text-slate-400 hover:text-orange-600 dark:hover:text-yellow-400 hover:bg-yellow-100/60 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Options Selection Section */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Ընտրիր ճիշտ բառը (A, B, C, D)
            </span>
            <span className="text-xs text-slate-400">
              1 ճիշտ պատասխան
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {dialogue.options.map((opt: DialogueOption) => {
              const isSelected = userAnswer === opt.letter;
              const isThisCorrect = opt.letter === dialogue.correctOption;

              let btnClasses =
                'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-orange-400 hover:bg-orange-50/40 dark:hover:bg-slate-800';

              if (isAnswered) {
                if (isThisCorrect) {
                  btnClasses =
                    'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/40';
                } else if (isSelected && !isThisCorrect) {
                  btnClasses =
                    'bg-orange-50 dark:bg-orange-950/60 border-orange-500 text-orange-900 dark:text-orange-100 ring-2 ring-orange-500/40';
                } else {
                  btnClasses =
                    'bg-slate-100/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={opt.letter}
                  type="button"
                  onClick={() => handleSelectOption(opt.letter)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer group ${btnClasses}`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isAnswered && isThisCorrect
                        ? 'bg-emerald-600 text-white'
                        : isAnswered && isSelected && !isThisCorrect
                        ? 'bg-orange-600 text-white'
                        : 'bg-yellow-400/80 text-yellow-950 group-hover:bg-orange-500 group-hover:text-white'
                    }`}
                  >
                    {opt.letter}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                      {opt.wordEs}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
                      {opt.meaningHy}
                    </div>
                  </div>
                  {isAnswered && isThisCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {isAnswered && isSelected && !isThisCorrect && (
                    <XCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation & Grammar notes (shown once answered) */}
        {isAnswered && (
          <div
            className={`p-4 rounded-xl border ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : 'bg-orange-50 dark:bg-orange-950/40 border-orange-300 dark:border-orange-800'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <Sparkles
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  isCorrect
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-orange-600 dark:text-orange-400'
                }`}
              />
              <div className="space-y-1 text-sm">
                <div
                  className={`font-bold ${
                    isCorrect
                      ? 'text-emerald-900 dark:text-emerald-200'
                      : 'text-orange-900 dark:text-orange-200'
                  }`}
                >
                  {isCorrect ? 'Ճիշտ է!' : 'Սխալ տարբերակ:'}{' '}
                  Ճիշտ պատասխանն է՝{' '}
                  <span className="font-extrabold underline text-emerald-800 dark:text-emerald-300">
                    {dialogue.correctOption}) {dialogue.targetWord}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  {dialogue.explanationHy}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Oral Practice Section (Práctica oral — Բանավոր պրակտիկա) */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowOralPractice(!showOralPractice)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/15 text-orange-900 dark:text-orange-200 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 text-sm font-bold">
              <MessageSquare className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span>🎭 Բանավոր պրակտիկա (Práctica oral)</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-orange-700 dark:text-orange-300 font-semibold">
              <span>{showOralPractice ? 'Փակել' : 'Շարունակել երկխոսությունը'}</span>
              {showOralPractice ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </button>

          {showOralPractice && (
            <div className="mt-3 p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-orange-200/80 dark:border-slate-800 space-y-4">
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-yellow-50 dark:bg-yellow-950/40 p-3 rounded-lg border border-yellow-200 dark:border-yellow-900/40">
                <strong className="text-yellow-900 dark:text-yellow-300 block mb-1 font-bold">
                  Իրավիճակային հանձնարարություն՝
                </strong>
                {dialogue.oralPractice.scenarioHy}
              </div>

              {/* Model continuation suggestions */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
                  Օրինակելի շարունակություններ (Սեղմիր լսելու համար)՝
                </span>
                <div className="space-y-2">
                  {dialogue.oralPractice.suggestions.map((sug, i) => (
                    <div
                      key={i}
                      className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          «{sug.textEs}»
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300">
                          {sug.textHy}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSpeak(sug.textEs, `oral-${dialogue.id}-${i}`)}
                        className="p-1.5 rounded-md hover:bg-yellow-100 dark:hover:bg-slate-800 text-yellow-600 hover:text-orange-600 transition-colors cursor-pointer shrink-0"
                        title="Լսել իսպաներենով"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive self-practice continuation box */}
              <form onSubmit={handleAddOralContinuation} className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Քո տարբերակը (գրիր կամ կարդա բարձրաձայն)՝
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={oralInput}
                    onChange={(e) => setOralInput(e.target.value)}
                    placeholder="Գրիր 1-2 նախադասություն իսպաներենով..."
                    className="flex-1 px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-linear-to-r from-emerald-600 to-orange-500 hover:from-emerald-700 hover:to-orange-600 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Ավելացնել</span>
                  </button>
                </div>
              </form>

              {/* Added student attempts */}
              {oralSubmissions.length > 0 && (
                <div className="pt-2 space-y-1.5">
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    Քո կազմած նախադասությունները՝
                  </span>
                  {oralSubmissions.map((sub, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs sm:text-sm flex items-center justify-between gap-2"
                    >
                      <span className="text-slate-800 dark:text-slate-200 font-medium">{sub}</span>
                      <button
                        type="button"
                        onClick={() => handleSpeak(sub, `sub-${idx}`)}
                        className="p-1 hover:text-emerald-700 text-emerald-600 transition-colors"
                        title="Լսել"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
