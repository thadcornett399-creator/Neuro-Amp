# 🤝 Contributing to NeuroAmp

First off, thank you for considering contributing to NeuroAmp! It's people like you that make NeuroAmp such a great tool for musicians worldwide.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Community](#community)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code:

- **Be Respectful**: Treat everyone with respect and kindness
- **Be Collaborative**: Work together and help each other
- **Be Inclusive**: Welcome newcomers and diverse perspectives
- **Be Patient**: Remember that everyone is learning
- **Give Credit**: Acknowledge others' contributions

Report unacceptable behavior to: thadcornett399-creator@users.noreply.github.com

---

## 🌟 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When reporting a bug, include:**
- Browser and version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or audio recordings if applicable
- Console errors (F12 > Console tab)

**Template:**
```markdown
**Browser:** Chrome 120
**OS:** Windows 11
**Steps to Reproduce:**
1. Click "JACK IN"
2. Adjust Drive to maximum
3. Audio cuts out

**Expected:** Distorted but continuous audio
**Actual:** Audio completely stops

**Console Errors:**
AudioContext error: ...
```

### 💡 Suggesting Features

We love feature suggestions! Before creating enhancement suggestions:

1. Check the [ROADMAP.md](./ROADMAP.md) - it might already be planned
2. Search existing issues to avoid duplicates
3. Provide a clear use case explaining *why* this feature would be valuable

**Template:**
```markdown
**Feature:** Tap tempo for drum machine

**Problem:** Hard to match BPM to song I'm playing along with

**Solution:** Button that detects BPM from taps

**Alternatives:** Manual BPM slider (current), audio BPM detection

**Additional Context:** Common in hardware drum machines
```

### 🎨 Contributing Presets

Share your awesome tones with the community!

1. Create your preset in NeuroAmp
2. Click "SHARE SETUP" to get the URL
3. Open an issue with the `preset` label
4. Include:
   - Preset name (e.g., "Warm Blues Lead")
   - Description (genre, style, inspiration)
   - Settings URL
   - Audio demo (optional but appreciated!)

### 📝 Improving Documentation

Documentation improvements are always welcome:
- Fix typos
- Clarify confusing sections
- Add examples
- Translate to other languages
- Create video tutorials

---

## 🛠️ Development Setup

### Prerequisites

- **Node.js** 16+ and npm
- **Git** for version control
- **Modern browser** (Chrome/Edge recommended for development)
- **Audio interface** or built-in microphone for testing

### Setup Steps

1. **Fork the repository** on GitHub

2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Neuro-Amp.git
   cd Neuro-Amp
   ```

3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/thadcornett399-creator/Neuro-Amp.git
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Set up environment:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Gemini API key
   ```

6. **Start development server:**
   ```bash
   npm run dev
   ```

7. **Open browser** to `http://localhost:5173`

### Project Structure

```
Neuro-Amp/
├── components/          # React UI components
│   ├── Knob.tsx        # Rotary knob control
│   ├── RackUnit.tsx    # Effects rack container
│   ├── Visualizer.tsx  # Audio visualization
│   ├── Looper.tsx      # Loop station UI
│   ├── DrumMachine.tsx # Drum sequencer
│   ├── StyleAssistant.tsx # AI style helper
│   └── PresetManager.tsx  # Preset system
├── services/           # Core logic
│   ├── audioEngine.ts  # Web Audio API processing
│   ├── geminiService.ts # AI integration
│   ├── learningService.ts # ML for presets
│   ├── presetService.ts   # Preset storage
│   └── trackStorage.ts    # Loop management
├── App.tsx             # Main application
├── types.ts            # TypeScript definitions
└── index.tsx           # Entry point
```

---

## 💻 Coding Guidelines

### TypeScript

- **Always use TypeScript** - no `.js` files
- **Define types** for all props and state
- **Use interfaces** over `type` for object shapes
- **Avoid `any`** - use `unknown` if truly necessary

**Example:**
```typescript
// ✅ Good
interface KnobProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

// ❌ Bad
function Knob(props: any) { ... }
```

### React

- **Functional components** with hooks (no class components)
- **Named exports** for components
- **Use `React.FC`** for component types
- **Memoize expensive operations** with `useMemo`/`useCallback`
- **Keep components focused** - single responsibility

**Example:**
```typescript
// ✅ Good
export const Knob: React.FC<KnobProps> = ({ label, value, onChange }) => {
  const rotation = useMemo(() => (value * 270) - 135, [value]);
  
  return (
    <div className="knob">
      {/* ... */}
    </div>
  );
};

// ❌ Bad - doing too much in one component
const MegaComponent = () => { /* 500 lines */ };
```

### Audio Code

- **Always clean up** AudioNodes in useEffect cleanup
- **Handle AudioContext state** properly (suspended, running)
- **Use try/catch** around Web Audio API calls
- **Test on multiple browsers** (Chrome, Firefox, Safari)

**Example:**
```typescript
useEffect(() => {
  const oscillator = audioContext.createOscillator();
  oscillator.connect(destination);
  oscillator.start();
  
  // Cleanup is critical!
  return () => {
    oscillator.stop();
    oscillator.disconnect();
  };
}, []);
```

### Styling

- **Use Tailwind classes** - avoid custom CSS
- **Mobile-first** responsive design
- **Dark theme** as default
- **Consistent spacing** - use Tailwind scale (4, 8, 16, etc.)

---

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Commit Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Formatting, missing semicolons, etc.
- `refactor:` - Code change that neither fixes a bug nor adds a feature
- `perf:` - Performance improvement
- `test:` - Adding tests
- `chore:` - Maintenance, dependencies

### Examples

```bash
feat: add tap tempo to drum machine
fix: prevent feedback loop in delay effect
docs: update README with installation steps
refactor: extract audio processing to separate service
perf: optimize loop rendering with React.memo
```

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Example:**
```
feat(drum-machine): add custom pattern creation

Users can now create and save custom drum patterns through the UI.
Patterns are saved to localStorage and persist across sessions.

Closes #42
```

---

## 🔄 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feat/my-awesome-feature
   ```

2. **Make your changes** following coding guidelines

3. **Test thoroughly**
   - Manual testing in browser
   - Check console for errors
   - Test on different browsers if possible
   - Verify audio functionality

4. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add harmonizer effect"
   ```

5. **Keep your fork updated**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

6. **Push to your fork**
   ```bash
   git push origin feat/my-awesome-feature
   ```

7. **Create Pull Request** on GitHub
   - Fill out the PR template
   - Link related issues
   - Add screenshots/videos for UI changes
   - Request review from maintainers

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated if needed
- [ ] No console errors or warnings
- [ ] Tested in at least 2 browsers
- [ ] Audio functionality verified with real input

---

## 🧪 Testing

Currently, we don't have automated tests (contributions welcome!), so manual testing is crucial:

### Testing Checklist

**Audio Processing:**
- [ ] Input gain works correctly
- [ ] Each effect produces expected output
- [ ] No audio glitches or crackling
- [ ] No feedback loops
- [ ] Latency is acceptable (<20ms)

**UI/UX:**
- [ ] All controls respond to input
- [ ] Knobs rotate smoothly
- [ ] Buttons change state properly
- [ ] Layout works on mobile
- [ ] No visual glitches

**AI Features:**
- [ ] Tone generation produces reasonable settings
- [ ] Error handling for API failures
- [ ] Loading states display correctly

---

## 🎓 Learning Resources

New to Web Audio API or React? Check these out:

### Web Audio
- [MDN Web Audio API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Web Audio API Book](https://webaudioapi.com/)
- [Chrome Web Audio Demos](https://github.com/GoogleChrome/web-audio-samples)

### React & TypeScript
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Music DSP
- [Digital Signal Processing Basics](https://dsp.stackexchange.com/)
- [Audio Effect Theory](https://ccrma.stanford.edu/~jos/)

---

## 💬 Community

Join the conversation:

- **GitHub Discussions**: Ask questions, share ideas
- **GitHub Issues**: Bug reports and feature requests
- **Discord** (coming soon): Real-time chat with contributors

### Getting Help

Stuck? Here's how to get help:

1. Search existing issues and discussions
2. Check the [README.md](./README.md) and [FEATURES.md](./FEATURES.md)
3. Ask in GitHub Discussions
4. Tag maintainers in your issue (use sparingly)

---

## 🏆 Recognition

Contributors are recognized in:
- README.md Contributors section
- Release notes for significant contributions
- Special role in Discord (coming soon)

Top contributors may receive:
- Early access to new features
- Lifetime premium account (when launched)
- NeuroAmp swag (stickers, shirts)

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## 🙏 Thank You!

Every contribution, no matter how small, makes NeuroAmp better. We appreciate your time and effort!

**Happy coding! 🎸⚡**
