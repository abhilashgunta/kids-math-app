# Copilot Instructions

## Commands

```bash
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Production build → dist/
npm run preview   # Preview production build
```

No test runner or linter is configured.

## Architecture

The entire app lives in a **single file: `src/App.jsx`** (~1,100 lines). All components, game logic, utilities, and shared UI are co-located there. There is no component splitting across files.

**Navigation model:** A `currentView` string in the top-level `App` component drives what's rendered. Views are identified by string IDs (`'home'`, `'cat_numbers'`, `'cat_math'`, `'cat_shapes'`, `'counting'`, `'counting_voice'`, `'skip_counting_2'`, `'skip_counting_10'`, `'adding'`, `'subtracting'`, `'comparison'`, `'pattern'`, `'shapes'`). `navigateTo(view)` handles transitions and plays a click sound.

**Component hierarchy:**
```
App                      ← owns currentView, renders one view at a time
├── HomeView             ← 3 category entry points
├── CategoryMenu         ← subcategory list per category
└── Game components      ← CountingGame, CountingGameVoice, SkipCountingGame,
                            AddingGame, SubtractingGame, ComparisonGame,
                            PatternGame, ShapeGame
```

Shared UI components (`Logo`, `NavButtons`, `ControlBar`, `CompletionScreen`, `MenuButton`, `Footer`) are defined at the bottom of `App.jsx` and used across game components.

## Key Conventions

**File layout inside `App.jsx` (top to bottom):**
1. lucide-react icon imports
2. Utility functions: `playSound()`, `speakNumber()`
3. `App` component
4. Shared/UI components
5. Game components
6. `export default App`

**Naming:**
- Components: `PascalCase`
- View IDs: `snake_case` strings (e.g., `'skip_counting_2'`)
- All other functions/vars: `camelCase`

**Styling:** Tailwind CSS utility classes only (loaded via CDN in `index.css`). No custom CSS classes. Use `md:` breakpoints for responsiveness.

**State:** `useState` for all state, `useEffect` for timers/speech, `useRef` for DOM focus. No external state library.

**Audio:** Sound files are in `public/` and referenced as `/filename.mp3`. Three sounds: `beep-21.mp3` (click), `button-41.mp3` (correct), `button-44.mp3` (wrong). Play via `playSound('click' | 'correct' | 'wrong')`.

**Speech:** Text-to-speech uses the Web Speech API via `speakNumber(num, text)`. It prefers a female US English voice and falls back to the first available voice.

**Adding new games:** Create a new component at the bottom of `App.jsx`, add a view ID string, add a `navigateTo` call in the appropriate `CategoryMenu`, and add a render branch in `App`.

## License

CC BY-NC 4.0 — non-commercial use only, attribution required.
