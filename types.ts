export type PartId = 1 | 2 | 3 | 4;

export interface DialogueLine {
  id: string;
  speakerEs: string;
  speakerHy: string;
  textEs: string;
  textHy: string;
  isBlankLine?: boolean;
}

export interface DialogueOption {
  letter: 'A' | 'B' | 'C' | 'D';
  wordEs: string;
  meaningHy: string;
}

export interface OralPrompt {
  roleEs: string;
  roleHy: string;
  scenarioHy: string;
  suggestions: {
    textEs: string;
    textHy: string;
  }[];
}

export interface DialogueItem {
  id: number;
  partId: PartId;
  partTitleEs: string;
  partTitleHy: string;
  titleEs: string;
  titleHy: string;
  category: string;
  lines: DialogueLine[];
  options: DialogueOption[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  targetWord: string;
  explanationHy: string;
  oralPractice: OralPrompt;
}
