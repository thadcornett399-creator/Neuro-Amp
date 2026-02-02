import { AudioSettings, TonePreset } from '../types';

const STORAGE_KEY = 'neuroamp_presets';

const DEFAULT_PRESETS: TonePreset[] = [
  {
    name: "Clean Start",
    description: "Crystal clear tone with a touch of space.",
    readonly: true,
    settings: {
      inputGain: 1.0,
      drive: 0.0,
      driveModel: 'overdrive',
      toneBass: 0.0,
      toneMid: 0.0,
      toneTreble: 0.0,
      delayTime: 0.0,
      delayFeedback: 0.0,
      reverbMix: 0.15,
      chorusMix: 0.0,
      tremoloDepth: 0.0,
      compressorThreshold: -20,
      compressorRatio: 4,
      outputVolume: 0.8
    }
  },
  {
    name: "Blues Breaker",
    description: "Warm overdrive for expressive leads.",
    readonly: true,
    settings: {
        inputGain: 1.2,
        drive: 0.35,
        driveModel: 'overdrive',
        toneBass: 2.0,
        toneMid: 3.5,
        toneTreble: 1.0,
        reverbMix: 0.2,
        delayTime: 0.0,
        delayFeedback: 0.0,
        chorusMix: 0.0,
        tremoloDepth: 0.0,
        compressorThreshold: -15,
        compressorRatio: 3
    }
  },
  {
    name: "Shoegaze Wall",
    description: "Massive distortion washed in reverb.",
    readonly: true,
    settings: {
        inputGain: 1.0,
        drive: 0.8,
        driveModel: 'fuzz',
        toneBass: 4.0,
        toneMid: -2.0,
        toneTreble: 2.0,
        reverbMix: 0.6,
        delayTime: 0.35,
        delayFeedback: 0.6,
        chorusMix: 0.3,
        chorusSpeed: 0.5,
        chorusDepth: 0.8,
        tremoloDepth: 0.4,
        tremoloSpeed: 4.0,
        compressorThreshold: -30,
        compressorRatio: 8
    }
  },
  {
    name: "80s Clean",
    description: "Compressed clean with thick chorus.",
    readonly: true,
    settings: {
        inputGain: 1.4,
        drive: 0.0,
        driveModel: 'overdrive',
        toneBass: -1.0,
        toneMid: 0.0,
        toneTreble: 4.0,
        reverbMix: 0.3,
        delayTime: 0.25,
        delayFeedback: 0.1,
        chorusMix: 0.6,
        chorusSpeed: 2.0,
        chorusDepth: 0.7,
        tremoloDepth: 0.0,
        compressorThreshold: -25,
        compressorRatio: 8
    }
  },
  {
    name: "Slapback Rockabilly",
    description: "Tight delay for that 50s sound.",
    readonly: true,
    settings: {
        inputGain: 1.1,
        drive: 0.15,
        driveModel: 'overdrive',
        toneBass: 1.0,
        toneMid: 2.0,
        toneTreble: 4.0,
        reverbMix: 0.1,
        delayTime: 0.12,
        delayFeedback: 0.3,
        chorusMix: 0.0,
        tremoloDepth: 0.3,
        tremoloSpeed: 6.0,
        compressorThreshold: -15,
        compressorRatio: 3
    }
  }
];

export const presetService = {
  getPresets(): TonePreset[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const userPresets = stored ? JSON.parse(stored) : [];
        return [...DEFAULT_PRESETS, ...userPresets];
    } catch {
        return DEFAULT_PRESETS;
    }
  },

  savePreset(preset: TonePreset) {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const userPresets: TonePreset[] = stored ? JSON.parse(stored) : [];
        
        // Update existing by name or add new
        const index = userPresets.findIndex(p => p.name === preset.name);
        if (index >= 0) {
            userPresets[index] = preset;
        } else {
            userPresets.push(preset);
        }
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userPresets));
    } catch (e) {
        console.error("Failed to save preset", e);
    }
  },

  deletePreset(name: string) {
    // Safety check for defaults
    if (DEFAULT_PRESETS.some(p => p.name === name)) return;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return;
        
        let userPresets: TonePreset[] = JSON.parse(stored);
        userPresets = userPresets.filter(p => p.name !== name);
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userPresets));
    } catch (e) {
        console.error("Failed to delete preset", e);
    }
  }
};