
import { AudioSettings, LoopTrack } from '../types';

export class AudioEngine {
  public ctx: AudioContext | null = null;
  public analyser: AnalyserNode | null = null;
  private inputStream: MediaStream | null = null;
  
  // Guitar Chain Nodes
  private inputGain: GainNode | null = null;
  private noiseGate: DynamicsCompressorNode | null = null;
  private inputHPF: BiquadFilterNode | null = null; 
  private driveNode: WaveShaperNode | null = null;
  private bassNode: BiquadFilterNode | null = null;
  private midNode: BiquadFilterNode | null = null;
  private trebleNode: BiquadFilterNode | null = null;
  private cabinetNode: BiquadFilterNode | null = null; 
  
  // Effects
  private delayNode: DelayNode | null = null;
  private delayFeedbackNode: GainNode | null = null;
  private delayGain: GainNode | null = null; 

  private reverbNode: ConvolverNode | null = null;
  private reverbGain: GainNode | null = null; 

  // Chorus Nodes
  private chorusDelayNode: DelayNode | null = null;
  private chorusGain: GainNode | null = null;
  private chorusLFO: OscillatorNode | null = null;
  private chorusLFOGain: GainNode | null = null;

  // Modulation/Dynamics
  private masterMixNode: GainNode | null = null; 
  private tremoloGain: GainNode | null = null;
  private tremoloLFO: OscillatorNode | null = null;
  private tremoloLFOGain: GainNode | null = null;
  
  private compressorNode: DynamicsCompressorNode | null = null;

  private dryNode: GainNode | null = null;
  private outputGain: GainNode | null = null;
  
  // Recorder
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  constructor() {}

  async startInput() {
    if (this.ctx) return;

    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)({
      latencyHint: 'interactive',
      sampleRate: 48000
    });
    
    try {
      this.inputStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
          channelCount: 1,
          latency: 0
        } as any
      });
    } catch (e) {
      console.error("Microphone access denied", e);
      throw e;
    }

    const source = this.ctx.createMediaStreamSource(this.inputStream);
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 2048;

    this.inputGain = this.ctx.createGain();
    
    // Noise Gate
    this.noiseGate = this.ctx.createDynamicsCompressor();
    this.noiseGate.threshold.value = -40;
    this.noiseGate.ratio.value = 20;
    this.noiseGate.attack.value = 0.001;
    this.noiseGate.release.value = 0.1;

    this.inputHPF = this.ctx.createBiquadFilter();
    this.inputHPF.type = 'highpass';
    this.inputHPF.frequency.value = 80;

    this.driveNode = this.ctx.createWaveShaper();
    this.driveNode.oversample = '4x';

    this.bassNode = this.ctx.createBiquadFilter();
    this.midNode = this.ctx.createBiquadFilter();
    this.trebleNode = this.ctx.createBiquadFilter();
    
    this.cabinetNode = this.ctx.createBiquadFilter();
    this.cabinetNode.type = 'lowpass';
    this.cabinetNode.frequency.value = 4500;

    this.delayNode = this.ctx.createDelay(5.0);
    this.delayFeedbackNode = this.ctx.createGain();
    this.delayGain = this.ctx.createGain();
    
    this.reverbNode = this.ctx.createConvolver();
    this.reverbGain = this.ctx.createGain(); 

    this.chorusDelayNode = this.ctx.createDelay(1.0);
    this.chorusGain = this.ctx.createGain();
    this.chorusLFO = this.ctx.createOscillator();
    this.chorusLFOGain = this.ctx.createGain();

    this.masterMixNode = this.ctx.createGain();
    this.tremoloGain = this.ctx.createGain();
    this.tremoloLFO = this.ctx.createOscillator();
    this.tremoloLFOGain = this.ctx.createGain();
    this.compressorNode = this.ctx.createDynamicsCompressor();

    this.dryNode = this.ctx.createGain();
    this.outputGain = this.ctx.createGain();

    this.bassNode.type = 'lowshelf';
    this.bassNode.frequency.value = 320;
    this.midNode.type = 'peaking';
    this.midNode.frequency.value = 1000;
    this.trebleNode.type = 'highshelf';
    this.trebleNode.frequency.value = 3200;

    this.chorusLFO.type = 'sine';
    this.chorusLFO.start();
    this.chorusDelayNode.delayTime.value = 0.03; 

    this.tremoloLFO.type = 'sine';
    this.tremoloLFO.start();

    this.makeDistortionCurve(0, 'overdrive', 'guitar');
    this.createImpulseResponse();

    // Routing
    source.connect(this.inputGain);
    this.inputGain.connect(this.noiseGate);
    this.noiseGate.connect(this.inputHPF);
    this.inputHPF.connect(this.driveNode);
    this.driveNode.connect(this.bassNode);
    this.bassNode.connect(this.midNode);
    this.midNode.connect(this.trebleNode);
    this.trebleNode.connect(this.cabinetNode);

    const signalOut = this.cabinetNode;
    signalOut.connect(this.dryNode);

    signalOut.connect(this.delayNode);
    this.delayNode.connect(this.delayFeedbackNode);
    this.delayFeedbackNode.connect(this.delayNode);
    this.delayNode.connect(this.delayGain);

    signalOut.connect(this.reverbNode);
    this.reverbNode.connect(this.reverbGain);

    this.chorusLFO.connect(this.chorusLFOGain);
    this.chorusLFOGain.connect(this.chorusDelayNode.delayTime);
    signalOut.connect(this.chorusDelayNode);
    this.chorusDelayNode.connect(this.chorusGain);

    this.dryNode.connect(this.masterMixNode);
    this.delayGain.connect(this.masterMixNode);
    this.reverbGain.connect(this.masterMixNode);
    this.chorusGain.connect(this.masterMixNode);

    this.masterMixNode.connect(this.tremoloGain);
    this.tremoloLFO.connect(this.tremoloLFOGain);
    this.tremoloLFOGain.connect(this.tremoloGain.gain);

    this.tremoloGain.connect(this.compressorNode);
    this.compressorNode.connect(this.outputGain);

    this.outputGain.connect(this.ctx.destination);
    this.outputGain.connect(this.analyser);
  }

  updateSettings(settings: AudioSettings) {
    if (!this.inputGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    
    this.inputGain.gain.setTargetAtTime(settings.inputGain, now, 0.1);
    this.noiseGate!.threshold.setTargetAtTime(settings.noiseGate, now, 0.1);
    
    this.makeDistortionCurve(settings.drive, settings.driveModel, settings.inputMode);

    if (settings.inputMode === 'vocal') {
        this.inputHPF!.frequency.setTargetAtTime(60, now, 0.1);
        this.cabinetNode!.frequency.setTargetAtTime(20000, now, 0.1);
    } else {
        this.inputHPF!.frequency.setTargetAtTime(80, now, 0.1);
        this.cabinetNode!.frequency.setTargetAtTime(4500, now, 0.1);
    }
    
    this.bassNode!.gain.setTargetAtTime(settings.toneBass, now, 0.1);
    this.midNode!.gain.setTargetAtTime(settings.toneMid, now, 0.1);
    this.trebleNode!.gain.setTargetAtTime(settings.toneTreble, now, 0.1);

    this.delayNode!.delayTime.setTargetAtTime(settings.delayTime, now, 0.1);
    this.delayFeedbackNode!.gain.setTargetAtTime(settings.delayFeedback, now, 0.1);
    this.reverbGain!.gain.setTargetAtTime(settings.reverbMix, now, 0.1);
    this.delayGain!.gain.setTargetAtTime(0.8, now, 0.1);

    this.chorusLFO!.frequency.setTargetAtTime(settings.chorusSpeed, now, 0.1);
    this.chorusLFOGain!.gain.setTargetAtTime(settings.chorusDepth * 0.005, now, 0.1); 
    this.chorusGain!.gain.setTargetAtTime(settings.chorusMix, now, 0.1);

    this.tremoloLFO!.frequency.setTargetAtTime(settings.tremoloSpeed, now, 0.1);
    const depth = Math.min(1, Math.max(0, settings.tremoloDepth));
    const lfoAmp = depth / 2;
    this.tremoloGain!.gain.setTargetAtTime(1 - lfoAmp, now, 0.1);
    this.tremoloLFOGain!.gain.setTargetAtTime(lfoAmp, now, 0.1);

    this.compressorNode!.threshold.setTargetAtTime(settings.compressorThreshold, now, 0.1);
    this.compressorNode!.ratio.setTargetAtTime(settings.compressorRatio, now, 0.1);
    this.outputGain!.gain.setTargetAtTime(settings.outputVolume, now, 0.1);
  }

  makeDistortionCurve(amount: number, model: 'overdrive' | 'distortion' | 'fuzz' = 'overdrive', inputMode: 'guitar' | 'vocal' = 'guitar') {
    if (!this.driveNode) return;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    const drive = amount * 100;

    for (let i = 0; i < n_samples; ++i) {
      const x = i * 2 / n_samples - 1;
      let y = x;
      if (inputMode === 'vocal') {
        y = x;
      } else if (model === 'fuzz') {
        const k = drive * 2;
        y = (3 + k) *