/**
 * Speech synthesis utility for authentic Spanish pronunciation.
 */

let activeUtterance: SpeechSynthesisUtterance | null = null;

export function speakSpanish(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();

    // Clean text of blank underscores
    const cleanText = text.replace(/_{2,}/g, '...');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9; // Slightly slower for language learners

    // Find a European or American Spanish voice if available
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find(
      (v) => v.lang === 'es-ES' || v.lang.startsWith('es')
    );
    if (esVoice) {
      utterance.voice = esVoice;
    }

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      activeUtterance = null;
      onEnd?.();
    };

    utterance.onerror = () => {
      activeUtterance = null;
      onEnd?.();
    };

    activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (e) {
    console.error('Speech error', e);
    onEnd?.();
    return false;
  }
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
