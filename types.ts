
export interface AudioSettings {
  inputMode: 'guitar' | 'vocal';
  inputGain: number;
  drive: number;
  driveModel: 'overdrive' | 'distortion' | 'fuzz';
  toneBass: number;
  toneMid: number;
  toneTreble: number;
  delayTime: number;
  delayFeedback: number;
  reverbMix: number;
  chorusSpeed: number;
  chorusDepth: number;
  chorusMix: number;
  tremoloSpeed: number;
  tremoloDepth: number;
  compressorThreshold: number;
  compressorRatio: number;
  outputVolume: number;
  noiseGate: number;
}

export interface LoopTrack {
  id: string;
  blob: Blob;
  url: string;
  duration: number;
  isMuted: boolean;
  isSolo: boolean;
  volume: number;
  pan: number;
  name: string;
  timestamp: number;
  isReversed?: boolean;
  speed: number; // 0.5, 1, 2
}

export enum RecorderState {
  Idle = 'IDLE',
  Recording = 'RECORDING',
  Playing = 'PLAYING',
}

export interface TonePreset {
  name: string;
  description: string;
  settings: Partial<AudioSettings>;
  readonly?: boolean;
}

export interface UsageLog {
  timestamp: number;
  audioSettings: AudioSettings;
}

export interface StyleAnalysis {
  fingerprint: string;
  suggestions: StyleSuggestion[];
}

export interface StyleSuggestion {
  title: string;
  reasoning: string;
  settings: Partial<AudioSettings>;
}
