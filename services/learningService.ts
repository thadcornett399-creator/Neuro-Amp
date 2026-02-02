import { GoogleGenAI, Type } from "@google/genai";
import { AudioSettings, RhythmSettings, UsageLog, StyleAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const STORAGE_KEY = 'neuroamp_usage_history';
const MAX_HISTORY = 20;

export const learningService = {
  logSession(audioSettings: AudioSettings, rhythmSettings: RhythmSettings) {
    try {
      const log: UsageLog = {
        timestamp: Date.now(),
        audioSettings,
        rhythmSettings
      };

      const historyStr = localStorage.getItem(STORAGE_KEY);
      let history: UsageLog[] = historyStr ? JSON.parse(historyStr) : [];
      
      // Add new log
      history.unshift(log);
      
      // Keep limited history
      if (history.length > MAX_HISTORY) {
        history = history.slice(0, MAX_HISTORY);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error("Failed to log session", e);
    }
  },

  getHistory(): UsageLog[] {
    try {
      const str = localStorage.getItem(STORAGE_KEY);
      return str ? JSON.parse(str) : [];
    } catch {
      return [];
    }
  },

  async analyzeStyle(): Promise<StyleAnalysis> {
    const history = this.getHistory();
    if (history.length === 0) {
      throw new Error("Not enough data to analyze. Record some loops first!");
    }

    // Prepare data summary for AI to reduce token usage
    const summary = history.map(h => ({
      date: new Date(h.timestamp).toDateString(),
      driveModel: h.audioSettings.driveModel || 'overdrive',
      drive: h.audioSettings.drive.toFixed(2),
      tempo: h.rhythmSettings.bpm,
      pattern: h.rhythmSettings.pattern,
      drumKit: {
          k: h.rhythmSettings.kickType || 'classic',
          s: h.rhythmSettings.snareType || 'classic',
          h: h.rhythmSettings.hihatType || 'classic'
      },
      fx: {
        reverb: h.audioSettings.reverbMix.toFixed(2),
        delay: h.audioSettings.delayTime.toFixed(2),
        chorus: h.audioSettings.chorusMix ? h.audioSettings.chorusMix.toFixed(2) : "0.00",
        tremolo: h.audioSettings.tremoloDepth ? h.audioSettings.tremoloDepth.toFixed(2) : "0.00",
        compRatio: h.audioSettings.compressorRatio ? h.audioSettings.compressorRatio.toFixed(1) : "1.0"
      },
      tone: {
         bass: h.audioSettings.toneBass,
         mid: h.audioSettings.toneMid,
         treble: h.audioSettings.toneTreble
      }
    }));

    const prompt = `
      Analyze this guitar player's usage history: ${JSON.stringify(summary)}.
      
      1. Identify their "Sonic Fingerprint" (e.g., "Aggressive Thrash", "Ambient Post-Rock", "Clean Funk", "Blues Dad").
      2. Suggest 2 creative presets that fit their style but push boundaries or offer a complementary tone.
      
      Return JSON with:
      - fingerprint (string)
      - suggestions (array of objects with title, reasoning, settings (AudioSettings partial), rhythm (optional bpm/patternName))
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              fingerprint: { type: Type.STRING },
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    reasoning: { type: Type.STRING },
                    settings: {
                      type: Type.OBJECT,
                      properties: {
                        inputGain: { type: Type.NUMBER },
                        drive: { type: Type.NUMBER },
                        driveModel: { type: Type.STRING },
                        toneBass: { type: Type.NUMBER },
                        toneMid: { type: Type.NUMBER },
                        toneTreble: { type: Type.NUMBER },
                        delayTime: { type: Type.NUMBER },
                        delayFeedback: { type: Type.NUMBER },
                        reverbMix: { type: Type.NUMBER },
                        chorusMix: { type: Type.NUMBER },
                        chorusSpeed: { type: Type.NUMBER },
                        chorusDepth: { type: Type.NUMBER },
                        tremoloSpeed: { type: Type.NUMBER },
                        tremoloDepth: { type: Type.NUMBER },
                        compressorThreshold: { type: Type.NUMBER },
                        compressorRatio: { type: Type.NUMBER },
                        outputVolume: { type: Type.NUMBER },
                      }
                    },
                    rhythm: {
                      type: Type.OBJECT,
                      properties: {
                        bpm: { type: Type.NUMBER },
                        patternName: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("AI analysis failed");

      return JSON.parse(text) as StyleAnalysis;
    } catch (e) {
      console.error("Style analysis failed", e);
      // Fallback
      return {
        fingerprint: "Eclectic Explorer",
        suggestions: [
          {
            title: "Classic Crunch",
            reasoning: "A versatile tone that fits your variable style.",
            settings: { drive: 0.4, toneMid: 2.0 },
            rhythm: { bpm: 110 }
          }
        ]
      };
    }
  }
};