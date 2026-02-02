<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🎸 NEUROAMP AI

### AI-Powered Guitar Recording Interface & Production Suite

**The future of music production in your browser.** NeuroAmp AI combines cutting-edge Web Audio API technology with Google's Gemini AI to deliver a professional-grade recording interface that understands your creative vision.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)

---

## 🚀 What Makes NeuroAmp Different?

### **1. AI-Powered Tone Generation**
Describe the sound you want in plain English, and watch our AI instantly configure professional-grade effects chains:
- *"warm blues tone with slight crunch"*
- *"bright clean reverb for indie rock"*
- *"heavy metal with tight low end"*

### **2. Intelligent Style Assistant**
Built-in musical knowledge base that suggests:
- Genre-appropriate effects settings
- Drum patterns matching your style
- Preset configurations from legendary artists
- Real-time learning from your preferences

### **3. Complete Production Environment**
Everything you need in one interface:
- **Multi-Track Loop Station** - Layer unlimited guitar loops
- **AI Drum Machine** - Generate custom drum patterns with AI
- **Professional Effects Rack** - Drive, EQ, Modulation, Delay, Reverb, Compression
- **Dual-Mode Input** - Guitar amp modeling OR studio-quality vocal/instrument recording
- **Visual Feedback** - Real-time waveform and frequency visualization

### **4. Zero Installation Required**
Runs entirely in your browser. No plugins, no DAWs, no complicated setup.

---

## ✨ Key Features

### 🎛️ **Professional Effects Processing**
- **Pre-Amp**: Overdrive, Distortion, Fuzz with input/output control
- **Tone Stack**: 3-band EQ (Bass, Mid, Treble) with ±20dB range
- **Modulation**: Chorus and Tremolo effects with full parameter control
- **Temporal**: Delay (0-2s) and Reverb with feedback control
- **Dynamics**: Professional-grade compressor with threshold and ratio control

### 🎹 **Intelligent Drum Core**
- Built-in drum machine with multiple patterns (Rock, Jazz, Electronic, Latin)
- AI-powered pattern generation from text descriptions
- Adjustable BPM (40-200)
- Multiple drum kit sounds (Classic, Vintage, Electronic)

### 🔄 **Infinite Loop Station**
- Record and layer unlimited guitar loops
- Per-track volume and pan control
- Solo and mute functionality
- Visual track management
- Auto-synchronized to drum tempo

### 🧠 **AI Integration**
- Natural language tone generation via Google Gemini
- Contextual style suggestions
- Learning system that adapts to your preferences
- Preset recommendation engine

### 💾 **Smart Preset System**
- Save and recall your favorite settings
- Auto-save recent configurations
- Share presets via URL
- Import/export preset banks

---

## 🎯 Perfect For

- **Guitarists** looking for a portable practice and recording solution
- **Songwriters** who want to quickly capture ideas with professional quality
- **Music Educators** teaching recording techniques and signal processing
- **Content Creators** needing quick, high-quality audio for videos
- **Bedroom Producers** without expensive hardware or studio space
- **Live Performers** wanting backing tracks and loop-based performances

---

## 💻 Getting Started

### **Prerequisites**
- Node.js 16+ installed
- Modern web browser (Chrome, Edge, or Brave recommended)
- Microphone or audio interface
- Headphones (to prevent feedback)

### **Quick Setup**

1. **Clone the repository**
   ```bash
   git clone https://github.com/thadcornett399-creator/Neuro-Amp.git
   cd Neuro-Amp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Gemini API** (for AI features)
   
   Get your free API key at [Google AI Studio](https://aistudio.google.com/apikey)
   
   Then create `.env.local`:
   ```bash
   echo "VITE_GEMINI_API_KEY=your_api_key_here" > .env.local
   ```

4. **Run the app**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   Navigate to `http://localhost:5173` and click "JACK IN" to start recording!

### **Build for Production**
```bash
npm run build
npm run preview
```

---

## 🎓 How to Use

1. **Click "JACK IN"** and allow microphone access
2. **Choose your input mode**: Guitar 🎸 or Vocal 🎤
3. **Adjust the effects** using the rack-mount knobs and selectors
4. **Try the AI Tone Wizard**: Type a description like "clean jazz tone" and hit Generate
5. **Start the drum machine** for rhythm backing
6. **Record loops** in the Loop Station sidebar
7. **Save your favorite settings** in the Memory Bank
8. **Share your setup** via the Share button (generates a shareable URL)

---

## 🏗️ Technical Architecture

### **Built With**
- **React 19.2** - Modern UI framework
- **TypeScript** - Type-safe development
- **Web Audio API** - Real-time audio processing
- **Google Gemini AI** - Natural language understanding
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Responsive styling

### **Audio Engine**
- Real-time signal processing at 44.1kHz
- Low-latency monitoring (<10ms)
- Professional-grade DSP algorithms
- Non-destructive effect chains
- Browser-native audio worklet processing

---

## 📊 Market Opportunity

### **Why This Product Has Commercial Potential**

1. **Growing Market**: The home recording market is expected to reach $1.8B by 2027
2. **Unique Position**: No competitor offers AI-driven tone generation in a browser
3. **Zero Friction**: No installation barrier means higher conversion rates
4. **Subscription Potential**: Freemium model with AI features as premium tier
5. **Education Market**: Perfect for music schools and online courses
6. **Content Creator Demand**: Streamers and YouTubers need quick, quality audio

### **Potential Revenue Models**

- **Freemium**: Basic effects free, AI features require subscription ($9.99/month)
- **Premium Presets**: Artist signature tone packs ($4.99 each)
- **Educational Licensing**: School/institution licenses ($499/year)
- **Cloud Storage**: Save unlimited presets and loops ($4.99/month)
- **API Access**: White-label solution for hardware manufacturers

---

## 🚦 Roadmap

See [ROADMAP.md](./ROADMAP.md) for detailed development plans.

**Next Major Features:**
- [ ] VST plugin export
- [ ] MIDI controller support
- [ ] Cloud collaboration (jam sessions)
- [ ] Mobile app (iOS/Android)
- [ ] More AI models (song arrangement, mastering)
- [ ] Multi-track recording (up to 8 channels)

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**Ways to Contribute:**
- Report bugs and suggest features
- Improve documentation
- Submit effect presets
- Add new AI tone patterns
- Translate to other languages

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

**Commercial Use**: This software is free to use, modify, and distribute, including for commercial purposes.

---

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/thadcornett399-creator/Neuro-Amp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/thadcornett399-creator/Neuro-Amp/discussions)
- **Email**: thadcornett399-creator@users.noreply.github.com

---

## 🙏 Acknowledgments

- Google Gemini AI team for the powerful language model
- Web Audio API community
- All contributors and early adopters

---

<div align="center">
  <strong>Made with ⚡ by passionate musicians and developers</strong>
  <br>
  <sub>Transform your browser into a professional recording studio</sub>
</div>
