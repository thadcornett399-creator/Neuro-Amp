import { GoogleGenAI, Type } from "@google/genai";
import { AudioSettings, TonePreset, DrumPattern } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateToneFromDescription(description: string): Promise<Partial<AudioSettings>> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate guitar amp and effect settings for the following description: "${description}". 
      
      Guidelines:
      - Drive: 0.0 (Clean) to 1.0 (Heavy).
      - DriveModel: 'overdrive', 'distortion', or 'fuzz'.
      - Tone (Bass/Mid/Treble): -10 to 10 (dB).
      - DelayTime: 0.0 to 1.0 (Seconds).
      - DelayFeedback: 0.0 to 1.0.
      - ReverbMix: 0.0 (Dry) to 1.0 (Wet).
      - ChorusMix: 0.0 to 1.0.
      - ChorusSpeed: 0.1 to 5.0 (Hz).
      - ChorusDepth: 0.0 to 1.0.
      - TremoloDepth: 0.0 to 1.0.
      - TremoloSpeed: 2.0 to 10.0 (Hz).
      - CompressorThreshold: -60 to 0 (dB).
      - CompressorRatio: 1 to 20.
      - InputGain: usually 1.0, higher for boosters.
      - OutputVolume: usually 0.8.
      
      Return JSON only.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            inputGain: { type: Type.NUMBER },
            drive: { type: Type.NUMBER },
            driveModel: { type: Type.STRING, enum: ['overdrive', 'distortion', 'fuzz'] },
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
          },
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as Partial<AudioSettings>;
  } catch (error) {
    console.error("Gemini Error:", error);
    // Return a safe default if AI fails
    return {
      drive: 0.2,
      reverbMix: 0.2
    };
  }
}

export async function generateDrumPattern(description: string, bpm: number): Promise<DrumPattern> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Create a drum pattern (16 steps) for a track described as: "${description}" at ${bpm} BPM.
            
            Return JSON with:
            - length: 16
            - kick: array of 0 or 1 (16 items)
            - snare: array of 0 or 1 (16 items)
            - hihat: array of 0 or 1 (16 items)
            
            Ensure the groove matches the genre.
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        length: { type: Type.NUMBER },
                        kick: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                        snare: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                        hihat: { type: Type.ARRAY, items: { type: Type.NUMBER } }
                    }
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        return JSON.parse(text) as DrumPattern;

    } catch (e) {
        console.error("Gemini Drum Gen Error", e);
        // Fallback pattern
        return {
            length: 16,
            kick:  [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
            snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
            hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0]
        };
    }
}