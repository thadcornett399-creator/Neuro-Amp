# 🚀 Getting Started with NeuroAmp

Welcome to NeuroAmp! This guide will help you go from zero to recording professional-sounding guitar in minutes.

---

## 📋 Prerequisites

Before you start, make sure you have:

### Hardware
- ✅ **Computer** with at least 4GB RAM
- ✅ **Microphone** or audio interface
- ✅ **Headphones** (required to prevent feedback!)
- 🎸 **Guitar** or other instrument (optional but recommended)

### Software
- ✅ **Modern web browser**
  - Chrome 100+ (recommended)
  - Edge 100+
  - Brave 1.40+
  - Firefox 100+ (may have slightly higher latency)
  - Safari 15+ (experimental)

---

## ⚡ Quick Start (5 Minutes)

### Option 1: Run Locally (Best Performance)

1. **Install Node.js**
   - Download from [nodejs.org](https://nodejs.org/)
   - Choose the LTS version
   - Verify: `node --version` (should be 16+)

2. **Clone the repository**
   ```bash
   git clone https://github.com/thadcornett399-creator/Neuro-Amp.git
   cd Neuro-Amp
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Get a Gemini API key** (for AI features)
   - Visit [Google AI Studio](https://aistudio.google.com/apikey)
   - Click "Create API Key"
   - Copy your key

5. **Configure environment**
   ```bash
   # Create .env.local file
   echo "VITE_GEMINI_API_KEY=your_api_key_here" > .env.local
   ```

6. **Start the app**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Click "JACK IN" and allow microphone access
   - You're ready to rock! 🎸

### Option 2: Online Demo (Coming Soon)

We're working on hosting a live demo. Check back soon!

---

## 🎸 Your First Recording Session

### Step 1: Setup Your Audio

1. **Click "JACK IN"** on the landing page
2. **Allow microphone access** when prompted
3. **Put on your headphones** to prevent feedback
4. **Select input mode**:
   - 🎸 **Guitar Mode**: For electric guitar (amp modeling)
   - 🎤 **Vocal Mode**: For vocals or acoustic instruments

### Step 2: Dial In Your Tone

#### Manual Tone Shaping

Let's create a classic rock tone:

1. **Pre-Amp Section**:
   - Set "Model" to "Overdrive"
   - Turn "Drive" to about 40%
   - Set "Input" to 100%

2. **Tone Stack**:
   - Bass: +5dB
   - Mid: +3dB
   - Treble: +2dB

3. **Add Some Space**:
   - Delay Time: 0.3s
   - Feedback: 30%
   - Reverb: 20%

4. **Strum and adjust!**

#### AI Tone Generation (Easy Mode)

1. **Find the AI prompt box** (top right, purple icon)
2. **Type what you want**: "warm blues tone with smooth overdrive"
3. **Click "GENERATE"** or press Enter
4. **Watch the magic happen!** ✨

Try these prompts:
- "clean jazz tone with ambient reverb"
- "heavy metal with crushing distortion"
- "bright indie rock sound"
- "country twang with slapback delay"

### Step 3: Add a Beat

1. **Find the "DRUM CORE" section** (first rack unit)
2. **Click ▶️ to start** the drum machine
3. **Select a pattern**: Basic Rock, Jazz, Electronic, etc.
4. **Adjust BPM** to match your song (default: 120)
5. **Control volume** with the drum volume knob

#### AI Drum Generation

1. **Type a description**: "fast punk rock beat"
2. **Click "Generate Pattern"**
3. **The AI creates a custom pattern!**

### Step 4: Record Your First Loop

1. **Open the Loop Station** (right sidebar)
2. **Click the ⏺️ Record button**
3. **Play your riff** - it will loop automatically!
4. **Click ⏹️ Stop** when done
5. **Repeat to layer more tracks!**

### Step 5: Save Your Setup

1. **Click "Memory Bank"** (bottom rack unit)
2. **Enter a name**: "My Awesome Tone"
3. **Click "Save"**
4. **Your settings are stored!**

---

## 🎯 Common Use Cases

### For Practice

**Goal**: Play along with backing drums

1. Start the drum machine (120 BPM, Basic Rock)
2. Use Guitar Mode with light overdrive
3. Add a touch of reverb
4. Play along and have fun!

### For Songwriting

**Goal**: Capture a song idea quickly

1. Start with a drum pattern matching your song
2. Record a rhythm guitar loop
3. Layer a lead guitar part
4. Record a bass line (lower the tone settings)
5. Export your loops for later!

### For Content Creation

**Goal**: Record a guitar track for YouTube

1. Use Vocal Mode for clean, transparent recording
2. Add light compression (Threshold: -20dB)
3. Enhance with EQ as needed
4. Add reverb for space
5. Record and download your track

### For Live Performance

**Goal**: Loop-based live show

1. Pre-save multiple presets for different songs
2. Use the loop station to build arrangements live
3. Switch presets between songs
4. Control everything with keyboard shortcuts

---

## 💡 Tips & Tricks

### Prevent Feedback
- **Always use headphones** when monitoring input
- **Keep microphone away** from speakers
- **Start with low volume** and increase gradually

### Reduce Latency
- **Use Chrome or Edge** (lowest latency)
- **Close other tabs** to free up CPU
- **Disable video** on other tabs
- **Update your audio drivers**
- **Use wired connection** (not Wi-Fi) if possible

### Get Better Tone
- **Less is more** with drive/distortion
- **EQ after drive** for better control
- **Use compression** to even out dynamics
- **Reverb last** in the chain for natural space
- **Reference professional recordings** for inspiration

### Creative Ideas
- **Try extreme settings** - happy accidents happen!
- **Layer multiple loops** with different tones
- **Experiment with modulation** for atmospheric sounds
- **Use tremolo** for rhythmic effects
- **Combine chorus + reverb** for ambient washes

---

## 🐛 Troubleshooting

### "No sound coming through"
- ✅ Check microphone permissions (browser settings)
- ✅ Select correct input device (browser settings > microphone)
- ✅ Turn up Input Gain and Output Volume
- ✅ Check headphones are connected
- ✅ Restart browser

### "Audio is crackling"
- ✅ Close other tabs using audio
- ✅ Reduce CPU usage (close background apps)
- ✅ Lower Drive amount
- ✅ Reduce reverb/delay
- ✅ Try a different browser

### "AI features not working"
- ✅ Check Gemini API key in `.env.local`
- ✅ Verify API key is valid at [AI Studio](https://aistudio.google.com/)
- ✅ Check browser console for errors (F12)
- ✅ Check internet connection

### "High latency / delay in monitoring"
- ✅ Use Chrome or Edge (better Web Audio support)
- ✅ Close other applications
- ✅ Check system audio settings
- ✅ Try disabling effects one by one to find the culprit
- ✅ Reduce buffer size (coming in future update)

### "Preset not loading"
- ✅ Check localStorage is enabled
- ✅ Clear browser cache and try again
- ✅ Export preset as JSON backup
- ✅ Verify preset format is correct

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start/Stop drum machine |
| `R` | Start/Stop recording loop |
| `M` | Toggle drum machine mute |
| `S` | Save current preset |
| `L` | Open preset manager |
| `1-6` | Quick-load preset slots |
| `Esc` | Cancel AI generation |

*(Full keyboard customization coming soon!)*

---

## 🎓 Learning Path

### Week 1: Basics
- ✅ Set up audio and test latency
- ✅ Learn each effect unit
- ✅ Create 5 different tones manually
- ✅ Record your first loop
- ✅ Save 10 presets

### Week 2: AI Features
- ✅ Experiment with AI tone generation
- ✅ Try 20+ different AI prompts
- ✅ Generate custom drum patterns
- ✅ Use Style Assistant for suggestions
- ✅ Share a preset with a friend

### Week 3: Advanced
- ✅ Layer 4+ loops in a song
- ✅ Create complex effect chains
- ✅ Learn optimal signal routing
- ✅ Record a complete song
- ✅ Export and share your work

### Month 2+: Mastery
- ✅ Recreate famous guitar tones
- ✅ Develop your signature sound
- ✅ Contribute presets to community
- ✅ Help others in discussions
- ✅ Consider contributing code!

---

## 📚 Next Steps

Now that you're set up, check out:

- **[FEATURES.md](./FEATURES.md)** - Complete feature list
- **[ROADMAP.md](./ROADMAP.md)** - Upcoming features
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Help build NeuroAmp!
- **GitHub Discussions** - Join the community

---

## 🆘 Need Help?

- 💬 **GitHub Discussions**: Ask questions, share tips
- 🐛 **GitHub Issues**: Report bugs
- 📧 **Email**: thadcornett399-creator@users.noreply.github.com

---

## 🎉 Welcome to the NeuroAmp Community!

You're now part of a growing community of musicians using AI-powered tools to create amazing music. 

**Happy recording! 🎸⚡**
