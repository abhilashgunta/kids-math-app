import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Home, RotateCcw, Check, Pause, Play, 
  Circle, Square, Triangle, Star, Hexagon, Minus, 
  Calculator, Smile, Heart, HelpCircle, Scale, Shapes, LayoutGrid, Hash, Plus, Volume2, BookOpen
} from 'lucide-react';


// --- Sound Utilities ---
// We use the paths directly. In a real build, ensure these files are in your /$
const sounds = {
  click: '/beep-21.mp3',
  correct: '/button-41.mp3',
  wrong: '/button-44.mp3'
};

const playSound = (type) => {
  try {
    const audio = new Audio(sounds[type]);
    audio.volume = 0.5; 
    audio.play().catch(e => console.log("Audio play failed:", e));
  } catch (err) {
    console.error("Error initializing audio:", err);
  }
};

// --- Text to Speech Utility ---
const speakNumber = (num, text) => {
  if (!window.speechSynthesis) return;
  
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text || num.toString());
  utterance.rate = 0.9; 
  utterance.pitch = 1.1; 
  utterance.volume = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(voice => 
    voice.name.includes("Google US English") || 
    voice.name.includes("Samantha") || 
    voice.lang.startsWith("en")
  );
  
  if (preferredVoice) utterance.voice = preferredVoice;

  window.speechSynthesis.speak(utterance);
};

const App = () => {
  // Views: 'home', 'cat_numbers', 'cat_math', 'cat_shapes', 'cat_words',
  //        'counting', 'counting_voice', 'skip_counting_2', 'skip_counting_10', 'adding', 'subtracting', 'comparison', 'patterns', 'shapes',
  //        'words_animals', 'words_food', 'words_things'
  const [currentView, setCurrentView] = useState('home');

  const navigateTo = (view) => {
    playSound('click');
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-blue-50 font-sans select-none relative overflow-hidden">
      {/* Main Home Screen */}
      {currentView === 'home' && (
        <HomeView onSelectCategory={(cat) => navigateTo(cat)} />
      )}

      {/* Category Sub-menus */}
      {currentView === 'cat_numbers' && (
        <CategoryMenu 
          title="Numbers" 
          onBack={() => navigateTo('home')} 
          items={[
            { id: 'counting', label: 'Count 1-20', icon: <span className="text-6xl font-bold">123</span>, color: 'bg-yellow-400 text-yellow-900' },
            // Changed Orange -> Indigo
            { id: 'counting_voice', label: 'Count 1-20', icon: <Volume2 size={64} strokeWidth={2} />, color: 'bg-indigo-400 text-indigo-900' },
            // Changed Cyan -> Blue
            { id: 'skip_counting_2', label: 'Skip Count by 2', icon: <span className="text-4xl font-bold text-center">2, 4...</span>, color: 'bg-blue-400 text-blue-900' },
            // Changed Teal -> Green
            { id: 'skip_counting_10', label: 'Skip Count by 10', icon: <span className="text-4xl font-bold text-center">10, 20...</span>, color: 'bg-green-400 text-green-900' }
          ]}
          onSelect={(id) => navigateTo(id)}
        />
      )}

      {currentView === 'cat_math' && (
        <CategoryMenu 
          title="Math" 
          onBack={() => navigateTo('home')} 
          items={[
            { id: 'adding', label: 'Add Numbers', icon: <Plus size={64} strokeWidth={4} />, color: 'bg-purple-400 text-purple-900' },
            { id: 'subtracting', label: 'Subtract', icon: <Minus size={64} strokeWidth={4} />, color: 'bg-red-400 text-red-900' }
          ]}
          onSelect={(id) => navigateTo(id)}
        />
      )}

      {currentView === 'cat_shapes' && (
        <CategoryMenu 
          title="Shapes" 
          onBack={() => navigateTo('home')}
          items={[
            { id: 'comparison', label: 'More or Less?', icon: <Scale size={64} strokeWidth={2} />, color: 'bg-green-400 text-green-900' },
            { id: 'patterns', label: 'Patterns', icon: <LayoutGrid size={64} strokeWidth={2} />, color: 'bg-blue-400 text-blue-900' },
            { id: 'shapes', label: 'Find Shape', icon: <Shapes size={64} strokeWidth={2} />, color: 'bg-pink-400 text-pink-900' }
          ]}
          onSelect={(id) => navigateTo(id)}
        />
      )}

      {currentView === 'cat_words' && (
        <CategoryMenu
          title="Words"
          onBack={() => navigateTo('home')}
          items={[
            { id: 'words_animals', label: 'Animals', icon: <span className="text-6xl">🐱</span>, color: 'bg-yellow-400 text-yellow-900' },
            { id: 'words_food', label: 'Food', icon: <span className="text-6xl">🍎</span>, color: 'bg-red-400 text-red-900' },
            { id: 'words_things', label: 'Things', icon: <span className="text-6xl">🚗</span>, color: 'bg-teal-400 text-teal-900' },
          ]}
          onSelect={(id) => navigateTo(id)}
        />
      )}

      {currentView === 'cat_capitals' && (
        <CategoryMenu
          title="Capitals"
          onBack={() => navigateTo('home')}
          items={[
            { id: 'world_capitals', label: 'World Capitals', icon: <span className="text-6xl">🌍</span>, color: 'bg-cyan-200 text-cyan-800' },
            { id: 'state_capitals', label: 'US State Capitals', icon: <span className="text-6xl">🏛️</span>, color: 'bg-rose-200 text-rose-800' },
          ]}
          onSelect={(id) => navigateTo(id)}
        />
      )}

      {/* Games */}
      {currentView === 'counting' && (
        <CountingGame onBack={() => navigateTo('cat_numbers')} onHome={() => navigateTo('home')} />
      )}
      {currentView === 'counting_voice' && (
        <CountingGameVoice onBack={() => navigateTo('cat_numbers')} onHome={() => navigateTo('home')} />
      )}
      
      {/* Reusing SkipCountingGame component with different props */}
      {currentView === 'skip_counting_2' && (
        <SkipCountingGame 
          step={2} 
          title="Skip Counting by 2" 
          themeColor="blue" 
          onBack={() => navigateTo('cat_numbers')} 
          onHome={() => navigateTo('home')} 
        />
      )}
      {currentView === 'skip_counting_10' && (
        <SkipCountingGame 
          step={10} 
          title="Skip Counting by 10" 
          themeColor="green" 
          onBack={() => navigateTo('cat_numbers')} 
          onHome={() => navigateTo('home')} 
        />
      )}

      {currentView === 'adding' && (
        <AddingGame onBack={() => navigateTo('cat_math')} onHome={() => navigateTo('home')} />
      )}
      {currentView === 'subtracting' && (
        <SubtractingGame onBack={() => navigateTo('cat_math')} onHome={() => navigateTo('home')} />
      )}
      {currentView === 'comparison' && (
        <ComparisonGame onBack={() => navigateTo('cat_shapes')} onHome={() => navigateTo('home')} />
      )}
      {currentView === 'patterns' && (
        <PatternGame onBack={() => navigateTo('cat_shapes')} onHome={() => navigateTo('home')} />
      )}
      {currentView === 'shapes' && (
        <ShapeGame onBack={() => navigateTo('cat_shapes')} onHome={() => navigateTo('home')} />
      )}
      {currentView === 'words_animals' && (
        <WordGame category="animals" onBack={() => navigateTo('cat_words')} onHome={() => navigateTo('home')} />
      )}
      {currentView === 'words_food' && (
        <WordGame category="food" onBack={() => navigateTo('cat_words')} onHome={() => navigateTo('home')} />
      )}
      {currentView === 'words_things' && (
        <WordGame category="things" onBack={() => navigateTo('cat_words')} onHome={() => navigateTo('home')} />
      )}

      {currentView === 'world_capitals' && (
        <WorldCapitalsGame onBack={() => navigateTo('cat_capitals')} onHome={() => navigateTo('home')} />
      )}
      {currentView === 'state_capitals' && (
        <StateCapitalsGame onBack={() => navigateTo('cat_capitals')} onHome={() => navigateTo('home')} />
      )}

      {currentView === 'flags' && (
        <FlagsGame onBack={() => navigateTo('home')} onHome={() => navigateTo('home')} />
      )}

      {currentView === 'us_presidents' && (
        <USPresidentsGame onBack={() => navigateTo('home')} onHome={() => navigateTo('home')} />
      )}

      {currentView === 'landmarks' && (
        <LandmarksGame onBack={() => navigateTo('home')} onHome={() => navigateTo('home')} />
      )}

      {currentView === 'history' && (
        <HistoryGame onBack={() => navigateTo('home')} onHome={() => navigateTo('home')} />
      )}

      {currentView === 'languages' && (
        <LanguagesGame onBack={() => navigateTo('home')} onHome={() => navigateTo('home')} />
      )}

      {currentView === 'animals' && (
        <AnimalsGame onBack={() => navigateTo('home')} onHome={() => navigateTo('home')} />
      )}

      {currentView === 'planets' && (
        <PlanetsGame onBack={() => navigateTo('home')} onHome={() => navigateTo('home')} />
      )}
      
      <Footer />
    </div>
  );
};

// --- Shared Components ---

const Logo = ({ className = "", size = "normal" }) => {
  const isLarge = size === "large";
  return (
    <div className={`flex items-center gap-3 font-bold text-blue-600 ${className} ${isLarge ? 'flex-col md:flex-row' : ''}`}>
      <div className={`${isLarge ? 'p-6' : 'p-2'} bg-white rounded-2xl shadow-lg flex items-center justify-center transform -rotate-6`}>
        <Calculator size={isLarge ? 64 : 32} className="text-orange-500" />
      </div>
      <span className={`${isLarge ? 'text-6xl tracking-wider' : 'text-xl'}`}>
        Math for Kids
      </span>
    </div>
  );
};

const Footer = () => (
  <div className="absolute bottom-2 w-full text-center text-gray-400 text-sm font-medium z-50">
    Built by <a href="https://www.linkedin.com/in/abilashgunta/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 hover:underline transition-colors">Abilash Gunta</a>
  </div>
);

// --- Menu Components ---

const HomeView = ({ onSelectCategory }) => (
  <div className="flex flex-col items-center justify-center min-h-screen relative p-4 pb-20">
    <div className="mb-12">
      <Logo size="large" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-5xl px-4">
      <CategoryButton 
        onClick={() => onSelectCategory('cat_numbers')} 
        color="bg-yellow-100 text-yellow-800 border-4 border-yellow-400"
        icon={<Hash size={80} />}
        label="Numbers"
      />
      <CategoryButton 
        onClick={() => onSelectCategory('cat_math')} 
        color="bg-purple-100 text-purple-800 border-4 border-purple-400"
        icon={<div className="flex gap-2"><Plus size={40} /><Minus size={40} /></div>}
        label="Math"
      />
      <CategoryButton 
        onClick={() => onSelectCategory('cat_shapes')} 
        color="bg-blue-100 text-blue-800 border-4 border-blue-400"
        icon={<Shapes size={80} />}
        label="Shapes"
      />
      <CategoryButton 
        onClick={() => onSelectCategory('cat_words')} 
        color="bg-green-100 text-green-800 border-4 border-green-400"
        icon={<BookOpen size={80} />}
        label="Words"
      />
      <CategoryButton 
        onClick={() => onSelectCategory('flags')} 
        color="bg-red-100 text-red-800 border-4 border-red-400"
        icon={<span style={{fontSize: 56}}>🏳️‍🌈</span>}
        label="Flags"
      />
      <CategoryButton 
        onClick={() => onSelectCategory('cat_capitals')} 
        color="bg-cyan-100 text-cyan-800 border-4 border-cyan-400"
        icon={<span style={{fontSize: 56}}>🌍</span>}
        label="Capitals"
      />
      <CategoryButton 
        onClick={() => onSelectCategory('us_presidents')} 
        color="bg-indigo-100 text-indigo-800 border-4 border-indigo-400"
        icon={<span style={{fontSize: 56}}>🎩</span>}
        label="Presidents"
      />
      <CategoryButton 
        onClick={() => onSelectCategory('landmarks')} 
        color="bg-orange-100 text-orange-800 border-4 border-orange-400"
        icon={<span style={{fontSize: 56}}>🏛️</span>}
        label="Landmarks"
      />
      <CategoryButton 
        onClick={() => onSelectCategory('history')} 
        color="bg-amber-100 text-amber-800 border-4 border-amber-400"
        icon={<span style={{fontSize: 56}}>📜</span>}
        label="History"
      />
      <CategoryButton 
        onClick={() => onSelectCategory('languages')} 
        color="bg-lime-100 text-lime-800 border-4 border-lime-400"
        icon={<span style={{fontSize: 56}}>🗣️</span>}
        label="Languages"
      />
      <CategoryButton 
        onClick={() => onSelectCategory('animals')} 
        color="bg-emerald-100 text-emerald-800 border-4 border-emerald-400"
        icon={<span style={{fontSize: 56}}>🐘</span>}
        label="Animals"
      />
      <CategoryButton 
        onClick={() => onSelectCategory('planets')} 
        color="bg-fuchsia-100 text-fuchsia-800 border-4 border-fuchsia-400"
        icon={<span style={{fontSize: 56}}>🚀</span>}
        label="Planets"
      />
    </div>
  </div>
);

const CategoryMenu = ({ title, onBack, items, onSelect }) => (
  <div className="flex flex-col items-center justify-center min-h-screen relative p-4 pb-20">
    <div className="absolute top-8 left-8">
      <button onClick={onBack} className="p-3 bg-white rounded-full shadow text-gray-600 hover:bg-gray-100">
        <ArrowLeft size={32} />
      </button>
    </div>
    <div className="absolute top-8 right-8 hidden md:block"><Logo /></div>

    <h2 className="text-5xl font-bold text-gray-700 mb-12">{title}</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4 justify-items-center">
      {items.map((item) => (
        <HomeButton 
          key={item.id}
          onClick={() => onSelect(item.id)} 
          color={item.color}
          icon={item.icon}
          label={item.label}
        />
      ))}
    </div>
  </div>
);

const CategoryButton = ({ onClick, color, icon, label, subLabel }) => (
  <button 
    onClick={onClick}
    className={`${color} rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center gap-4 transform transition hover:-translate-y-2 hover:shadow-2xl h-80 w-full`}
  >
    <div className="p-4 bg-white/50 rounded-full mb-2">
      {icon}
    </div>
    <span className="text-4xl font-bold text-center">{label}</span>
    {subLabel && <span className="text-lg opacity-75 font-medium">{subLabel}</span>}
  </button>
);

const HomeButton = ({ onClick, color, icon, label }) => (
  <button 
    onClick={onClick}
    className={`${color} hover:brightness-110 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center gap-4 transform transition hover:-translate-y-2 group h-64 w-full max-w-sm`}
  >
    <div className="group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <span className="text-2xl font-bold text-center">{label}</span>
  </button>
);

// --- Games ---

const CountingGame = ({ onBack, onHome }) => {
  const [number, setNumber] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const numberNames = [
    "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"
  ];

  useEffect(() => {
    let interval;
    if (!isFinished && !isPaused) {
      interval = setInterval(() => {
        setNumber((prev) => {
          if (prev >= 20) {
            setIsFinished(true);
            return 20;
          }
          return prev + 1;
        });
      }, 2000); 
    }
    return () => clearInterval(interval);
  }, [isFinished, isPaused]);

  const handleRestart = () => {
    setNumber(1);
    setIsFinished(false);
    setIsPaused(false);
    playSound('click');
  };

  if (isFinished) {
    return (
      <CompletionScreen onRestart={handleRestart} onBack={onBack} onHome={onHome} />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white w-full relative pb-16">
      <NavButtons onBack={onBack} onHome={onHome} />
      <div className="absolute top-4 right-4">
        <Logo />
      </div>
      
      <div className="flex flex-col items-center transform -translate-y-16">
        <span className="font-bold text-black leading-none" style={{ fontSize: '15rem' }}>
          {number}
        </span>
        <span className="text-6xl font-bold text-gray-500 mt-4">
          {numberNames[number - 1]}
        </span>
      </div>

      <ControlBar 
        isPaused={isPaused} 
        onPauseToggle={() => { setIsPaused(!isPaused); playSound('click'); }} 
        onRestart={handleRestart} 
      />
    </div>
  );
};

const CountingGameVoice = ({ onBack, onHome }) => {
  const [number, setNumber] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const numberNames = [
    "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"
  ];

  // Ensure voices are loaded
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    // Speak the first number immediately
    if (!isPaused && !isFinished) {
      speakNumber(1, "one");
    }
  }, []);

  useEffect(() => {
    let interval;
    if (!isFinished && !isPaused) {
      interval = setInterval(() => {
        setNumber((prev) => {
          const next = prev + 1;
          if (next > 20) {
            setIsFinished(true);
            return 20;
          }
          // Speak the new number
          speakNumber(next, numberNames[next - 1]);
          return next;
        });
      }, 2500); // Slightly slower (2.5s) to allow speech to finish
    }
    return () => clearInterval(interval);
  }, [isFinished, isPaused]);

  const handleRestart = () => {
    setNumber(1);
    setIsFinished(false);
    setIsPaused(false);
    playSound('click');
    speakNumber(1, "one");
  };

  const handlePause = () => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    playSound('click');
    if (newPausedState) {
      window.speechSynthesis.cancel();
    } else {
      // Resume speaking current number
      speakNumber(number, numberNames[number - 1]);
    }
  };

  if (isFinished) {
    return (
      <CompletionScreen onRestart={handleRestart} onBack={onBack} onHome={onHome} />
    );
  }

  return (
    // Changed Orange -> Indigo
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50 w-full relative pb-16">
      <NavButtons onBack={onBack} onHome={onHome} />
      <div className="absolute top-4 right-4">
        <Logo />
      </div>
      
      <div className="flex flex-col items-center transform -translate-y-16">
        <span className="font-bold text-indigo-600 leading-none" style={{ fontSize: '15rem' }}>
          {number}
        </span>
        <span className="text-6xl font-bold text-gray-500 mt-4">
          {numberNames[number - 1]}
        </span>
        <div className="mt-8 p-3 bg-white rounded-full shadow-sm text-gray-400 flex items-center gap-2">
          <Volume2 size={24} />
          <span className="text-sm font-medium">Voice On</span>
        </div>
      </div>

      <ControlBar 
        isPaused={isPaused} 
        onPauseToggle={handlePause} 
        onRestart={handleRestart} 
      />
    </div>
  );
};

// --- Generic Skip Counting Game ---
const SkipCountingGame = ({ onBack, onHome, step = 2, title, themeColor = "blue" }) => {
  const [filledCount, setFilledCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Numbers to fill (10 cells for both games)
  const totalCells = 10;

  // Color Themes mapping - UPDATED to standard colors
  const themes = {
    blue: {
      bg: 'bg-blue-50',
      title: 'text-blue-700',
      active: 'bg-white text-blue-600',
      inactive: 'bg-blue-100/50 border-blue-200'
    },
    green: {
      bg: 'bg-green-50',
      title: 'text-green-700',
      active: 'bg-white text-green-600',
      inactive: 'bg-green-100/50 border-green-200'
    }
  };

  const currentTheme = themes[themeColor] || themes.blue;

  useEffect(() => {
    let interval;
    if (!isFinished && !isPaused) {
      interval = setInterval(() => {
        setFilledCount((prev) => {
          if (prev >= totalCells) {
            setIsFinished(true);
            return totalCells;
          }
          return prev + 1;
        });
      }, 2000); 
    }
    return () => clearInterval(interval);
  }, [isFinished, isPaused]);

  const handleRestart = () => {
    setFilledCount(0);
    setIsFinished(false);
    setIsPaused(false);
    playSound('click');
  };

  if (isFinished) {
    return (
      <CompletionScreen onRestart={handleRestart} onBack={onBack} onHome={onHome} />
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${currentTheme.bg} w-full relative pb-16`}>
      <NavButtons onBack={onBack} onHome={onHome} />
      <div className="absolute top-4 right-4">
        <Logo />
      </div>

      <div className="flex flex-col items-center w-full max-w-4xl px-4">
        <h2 className={`text-4xl font-bold ${currentTheme.title} mb-12`}>{title}</h2>
        
        {/* Grid Container: 2 columns x 5 rows */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
          {Array.from({ length: totalCells }).map((_, index) => {
            const number = (index + 1) * step;
            const isVisible = index < filledCount;
            
            return (
              <div 
                key={index}
                className={`
                  h-24 md:h-32 rounded-2xl flex items-center justify-center text-5xl md:text-6xl font-bold shadow-md transition-all duration-500 transform
                  ${isVisible 
                    ? `${currentTheme.active} scale-100 opacity-100` 
                    : `${currentTheme.inactive} text-transparent scale-95 opacity-50 border-2 border-dashed`
                  }
                `}
              >
                {number}
              </div>
            );
          })}
        </div>
      </div>

      <ControlBar 
        isPaused={isPaused} 
        onPauseToggle={() => { setIsPaused(!isPaused); playSound('click'); }} 
        onRestart={handleRestart} 
      />
    </div>
  );
};

const AddingGame = ({ onBack, onHome }) => {
  const [problem, setProblem] = useState({ a: 0, b: 0 });
  const [shapes, setShapes] = useState({ a: Circle, b: Square });
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null); 
  const [countdown, setCountdown] = useState(5);
  const inputRef = useRef(null);

  const generateProblem = () => {
    const a = Math.floor(Math.random() * 6) + 1;
    const b = Math.floor(Math.random() * 6) + 1;
    
    const availableShapes = [Circle, Square, Triangle, Star, Hexagon, Heart, Smile];
    const shapeA = availableShapes[Math.floor(Math.random() * availableShapes.length)];
    const shapeB = availableShapes[Math.floor(Math.random() * availableShapes.length)];

    setProblem({ a, b });
    setShapes({ a: shapeA, b: shapeB });
    setUserAnswer('');
    setFeedback(null);
    setCountdown(5);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    generateProblem();
  }, []);

  useEffect(() => {
    let timer;
    if (feedback === 'correct') {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            generateProblem();
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [feedback]);

  const checkAnswer = (e) => {
    e.preventDefault();
    if (!userAnswer) return;

    const sum = problem.a + problem.b;
    if (parseInt(userAnswer) === sum) {
      setFeedback('correct');
      playSound('correct');
    } else {
      setFeedback('incorrect');
      playSound('wrong');
      setTimeout(() => setFeedback(null), 2000); 
    }
  };

  const renderShapes = (count, ShapeComponent, color) => (
    <div className="flex flex-wrap justify-center gap-2 mt-4 w-32">
      {Array.from({ length: count }).map((_, i) => (
        <ShapeComponent key={i} size={28} className={`${color} fill-current`} />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 relative pb-16">
      <NavButtons onBack={onBack} onHome={onHome} />
      <div className="absolute top-8 right-8 hidden md:block"><Logo /></div>

      <div className="bg-white p-12 rounded-3xl shadow-2xl flex flex-col items-center w-full max-w-3xl">
        <div className="flex items-start justify-center gap-4 mb-12">
          <div className="flex flex-col items-center">
            <span className="text-8xl font-bold text-gray-800">{problem.a}</span>
            {renderShapes(problem.a, shapes.a, "text-blue-400")}
          </div>
          <span className="text-8xl font-bold text-green-500 mt-2">+</span>
          <div className="flex flex-col items-center">
            <span className="text-8xl font-bold text-gray-800">{problem.b}</span>
            {renderShapes(problem.b, shapes.b, "text-purple-400")}
          </div>
          <span className="text-8xl font-bold text-gray-400 mt-2">=</span>
          <div className="flex flex-col items-center">
            <span className="text-8xl font-bold text-blue-600">?</span>
            <div className="mt-4 w-32 h-6"></div> 
          </div>
        </div>

        <form onSubmit={checkAnswer} className="flex flex-col items-center w-full gap-6">
          <input
            ref={inputRef}
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={feedback === 'correct'}
            className="w-48 text-center text-6xl p-4 border-4 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
          />
          {feedback !== 'correct' && (
            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white text-3xl font-bold py-4 rounded-xl shadow-lg mt-4">
              Check Answer
            </button>
          )}
        </form>

        <Feedback feedback={feedback} countdown={countdown} />
      </div>
    </div>
  );
};

const SubtractingGame = ({ onBack, onHome }) => {
  const [problem, setProblem] = useState({ a: 0, b: 0 });
  const [shapes, setShapes] = useState({ a: Circle, b: Square });
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null); 
  const [countdown, setCountdown] = useState(5);
  const inputRef = useRef(null);

  const generateProblem = () => {
    const n1 = Math.floor(Math.random() * 6) + 1;
    const n2 = Math.floor(Math.random() * 6) + 1;
    const a = Math.max(n1, n2);
    const b = Math.min(n1, n2);
    
    const availableShapes = [Circle, Square, Triangle, Star, Hexagon, Heart, Smile];
    const shapeA = availableShapes[Math.floor(Math.random() * availableShapes.length)];
    const shapeB = availableShapes[Math.floor(Math.random() * availableShapes.length)];

    setProblem({ a, b });
    setShapes({ a: shapeA, b: shapeB });
    setUserAnswer('');
    setFeedback(null);
    setCountdown(5);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => { generateProblem(); }, []);

  useEffect(() => {
    let timer;
    if (feedback === 'correct') {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) { clearInterval(timer); generateProblem(); return 5; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [feedback]);

  const checkAnswer = (e) => {
    e.preventDefault();
    if (!userAnswer) return;
    const diff = problem.a - problem.b;
    if (parseInt(userAnswer) === diff) { 
      setFeedback('correct'); 
      playSound('correct');
    } else { 
      setFeedback('incorrect'); 
      playSound('wrong');
      setTimeout(() => setFeedback(null), 2000); 
    }
  };

  const renderShapes = (count, ShapeComponent, color) => (
    <div className="flex flex-wrap justify-center gap-2 mt-4 w-32">
      {Array.from({ length: count }).map((_, i) => (
        <ShapeComponent key={i} size={28} className={`${color} fill-current`} />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 relative pb-16">
      <NavButtons onBack={onBack} onHome={onHome} />
      <div className="absolute top-8 right-8 hidden md:block"><Logo /></div>

      <div className="bg-white p-12 rounded-3xl shadow-2xl flex flex-col items-center w-full max-w-3xl">
        <div className="flex items-start justify-center gap-4 mb-12">
          <div className="flex flex-col items-center">
            <span className="text-8xl font-bold text-gray-800">{problem.a}</span>
            {renderShapes(problem.a, shapes.a, "text-orange-400")}
          </div>
          <span className="text-8xl font-bold text-red-500 mt-2">-</span>
          <div className="flex flex-col items-center">
            <span className="text-8xl font-bold text-gray-800">{problem.b}</span>
            {renderShapes(problem.b, shapes.b, "text-yellow-500")}
          </div>
          <span className="text-8xl font-bold text-gray-400 mt-2">=</span>
          <div className="flex flex-col items-center">
            <span className="text-8xl font-bold text-blue-600">?</span>
            <div className="mt-4 w-32 h-6"></div> 
          </div>
        </div>

        <form onSubmit={checkAnswer} className="flex flex-col items-center w-full gap-6">
          <input
            ref={inputRef}
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={feedback === 'correct'}
            className="w-48 text-center text-6xl p-4 border-4 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
          />
          {feedback !== 'correct' && (
            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white text-3xl font-bold py-4 rounded-xl shadow-lg mt-4">
              Check Answer
            </button>
          )}
        </form>
        <Feedback feedback={feedback} countdown={countdown} />
      </div>
    </div>
  );
};

const ComparisonGame = ({ onBack, onHome }) => {
  const [counts, setCounts] = useState({ left: 0, right: 0 });
  const [question, setQuestion] = useState('more'); // 'more' or 'less'
  const [feedback, setFeedback] = useState(null);
  const [countdown, setCountdown] = useState(3);

  const generateProblem = () => {
    let l, r;
    do {
      l = Math.floor(Math.random() * 9) + 1;
      r = Math.floor(Math.random() * 9) + 1;
    } while (l === r); // Ensure they are different

    setCounts({ left: l, right: r });
    setQuestion(Math.random() > 0.5 ? 'more' : 'less');
    setFeedback(null);
    setCountdown(3);
  };

  useEffect(() => { generateProblem(); }, []);

  useEffect(() => {
    let timer;
    if (feedback === 'correct') {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) { clearInterval(timer); generateProblem(); return 3; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [feedback]);

  const handleChoice = (side) => {
    if (feedback === 'correct') return;

    const isLeftMore = counts.left > counts.right;
    const isCorrect = (question === 'more' && ((side === 'left' && isLeftMore) || (side === 'right' && !isLeftMore))) ||
                      (question === 'less' && ((side === 'left' && !isLeftMore) || (side === 'right' && isLeftMore)));
    
    if (isCorrect) {
      setFeedback('correct');
      playSound('correct');
    } else {
      setFeedback('incorrect');
      playSound('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const renderGroup = (count, side) => (
    <button 
      onClick={() => handleChoice(side)}
      className="bg-white p-8 rounded-3xl shadow-xl hover:bg-blue-50 transition transform hover:scale-105 active:scale-95 flex flex-wrap justify-center gap-4 content-center w-full h-80"
    >
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={48} className="text-yellow-400 fill-current drop-shadow-sm" />
      ))}
    </button>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 relative pb-16">
      <NavButtons onBack={onBack} onHome={onHome} />
      <div className="absolute top-8 right-8 hidden md:block"><Logo /></div>

      <div className="w-full max-w-4xl px-4 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center bg-white px-8 py-4 rounded-full shadow-md">
          Which side has <span className={question === 'more' ? 'text-green-600' : 'text-red-500'}>{question.toUpperCase()}</span>?
        </h2>

        <div className="grid grid-cols-2 gap-8 w-full">
          {renderGroup(counts.left, 'left')}
          {renderGroup(counts.right, 'right')}
        </div>

        <div className="h-24 mt-8">
           <Feedback feedback={feedback} countdown={countdown} />
        </div>
      </div>
    </div>
  );
};

const PatternGame = ({ onBack, onHome }) => {
  const [sequence, setSequence] = useState([]);
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [countdown, setCountdown] = useState(3);

  const shapes = [
    { id: 'circle', component: Circle, color: 'text-red-500' },
    { id: 'square', component: Square, color: 'text-blue-500' },
    { id: 'triangle', component: Triangle, color: 'text-green-500' },
    { id: 'star', component: Star, color: 'text-yellow-500' },
  ];

  const generateProblem = () => {
    // Pick two random shapes for a simple ABAB pattern
    const s1 = shapes[Math.floor(Math.random() * shapes.length)];
    let s2 = shapes[Math.floor(Math.random() * shapes.length)];
    while (s2.id === s1.id) s2 = shapes[Math.floor(Math.random() * shapes.length)];

    // Pattern type: A B A B ?
    const newSeq = [s1, s2, s1, s2]; 
    setSequence(newSeq);
    setCorrectAnswer(s1); // The next one should be s1 (A)

    // Generate options: Correct Answer + 2 Random Distractors
    let opts = [s1];
    while (opts.length < 3) {
      const rand = shapes[Math.floor(Math.random() * shapes.length)];
      if (!opts.find(o => o.id === rand.id)) opts.push(rand);
    }
    setOptions(opts.sort(() => Math.random() - 0.5));
    setFeedback(null);
    setCountdown(3);
  };

  useEffect(() => { generateProblem(); }, []);

  useEffect(() => {
    let timer;
    if (feedback === 'correct') {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) { clearInterval(timer); generateProblem(); return 3; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [feedback]);

  const handleChoice = (option) => {
    if (feedback === 'correct') return;
    if (option.id === correctAnswer.id) {
      setFeedback('correct');
      playSound('correct');
    } else {
      setFeedback('incorrect');
      playSound('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 relative pb-16">
      <NavButtons onBack={onBack} onHome={onHome} />
      <div className="absolute top-8 right-8 hidden md:block"><Logo /></div>

      <div className="w-full max-w-4xl px-4 flex flex-col items-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-12">Complete the Pattern</h2>

        {/* Sequence Display */}
        <div className="flex gap-4 md:gap-8 bg-white p-8 rounded-3xl shadow-lg mb-12 items-center justify-center">
          {sequence.map((item, i) => (
            <item.component key={i} size={64} className={`${item.color} fill-current`} />
          ))}
          <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center text-4xl font-bold text-gray-500">?</div>
        </div>

        {/* Options */}
        <div className="flex gap-8">
          {options.map((opt, i) => (
            <button 
              key={i}
              onClick={() => handleChoice(opt)}
              className="bg-white p-6 rounded-2xl shadow-md hover:scale-110 transition active:scale-95"
            >
              <opt.component size={64} className={`${opt.color} fill-current`} />
            </button>
          ))}
        </div>

        <div className="h-24 mt-8">
           <Feedback feedback={feedback} countdown={countdown} />
        </div>
      </div>
    </div>
  );
};

const ShapeGame = ({ onBack, onHome }) => {
  const [target, setTarget] = useState(null);
  const [items, setItems] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [countdown, setCountdown] = useState(3);

  const shapeTypes = [
    { name: 'Circle', component: Circle },
    { name: 'Square', component: Square },
    { name: 'Triangle', component: Triangle },
    { name: 'Star', component: Star },
    { name: 'Hexagon', component: Hexagon },
  ];

  const colors = [
    { name: 'Red', class: 'text-red-500' },
    { name: 'Blue', class: 'text-blue-500' },
    { name: 'Green', class: 'text-green-500' },
    { name: 'Orange', class: 'text-orange-500' },
  ];

  const generateProblem = () => {
    const tShape = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const tColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Correctly merge properties so we don't overwrite 'name' with color name
    const newTarget = { 
      ...tShape, 
      colorName: tColor.name, 
      class: tColor.class, 
      id: 'target' 
    };

    setTarget(newTarget);

    // Generate distractors
    let newItems = [];
    for (let i = 0; i < 8; i++) {
      const s = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      const c = colors[Math.floor(Math.random() * colors.length)];
      // Also apply correct merging here to be safe and consistent
      newItems.push({ 
        ...s, 
        colorName: c.name, 
        class: c.class, 
        id: `distractor-${i}` 
      });
    }
    // Add target and shuffle
    newItems.push(newTarget);
    setItems(newItems.sort(() => Math.random() - 0.5));
    setFeedback(null);
    setCountdown(3);
  };

  useEffect(() => { generateProblem(); }, []);

  useEffect(() => {
    let timer;
    if (feedback === 'correct') {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) { clearInterval(timer); generateProblem(); return 3; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [feedback]);

  const handleChoice = (item) => {
    if (feedback === 'correct') return;
    if (item.id === 'target') {
      setFeedback('correct');
      playSound('correct');
    } else {
      setFeedback('incorrect');
      playSound('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50 relative pb-16">
      <NavButtons onBack={onBack} onHome={onHome} />
      <div className="absolute top-8 right-8 hidden md:block"><Logo /></div>

      <div className="w-full max-w-4xl px-4 flex flex-col items-center">
        {target && (
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-12 text-center">
            {/* Correctly display Color Name + Shape Name */}
            Find the <span className={target.class}>{target.colorName} {target.name}</span>
          </h2>
        )}

        <div className="flex flex-wrap justify-center gap-8 max-w-2xl">
          {items.map((item, i) => (
            <button 
              key={i}
              onClick={() => handleChoice(item)}
              className="p-4 rounded-xl hover:bg-white hover:shadow-lg transition transform hover:scale-110 active:scale-90"
            >
              <item.component size={item.name === 'Star' ? 56 : 64} className={`${item.class} fill-current`} />
            </button>
          ))}
        </div>

        <div className="h-24 mt-8">
           <Feedback feedback={feedback} countdown={countdown} />
        </div>
      </div>
    </div>
  );
};

// --- Reusable UI Helpers ---

const NavButtons = ({ onBack, onHome, silent = false }) => (
  <div className="absolute top-8 left-8 flex gap-4 z-10">
    <button onClick={() => { if (!silent) playSound('click'); onBack(); }} className="p-3 bg-white rounded-full shadow text-gray-600 hover:bg-gray-100"><ArrowLeft /></button>
    <button onClick={() => { if (!silent) playSound('click'); onHome(); }} className="p-3 bg-white rounded-full shadow text-gray-600 hover:bg-gray-100"><Home /></button>
  </div>
);

const ControlBar = ({ isPaused, onPauseToggle, onRestart, onBack, onHome }) => (
  <div className="absolute bottom-16 flex gap-8 z-10">
    <button onClick={onPauseToggle} className="p-6 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200 shadow-lg active:scale-95 transition">
      {isPaused ? <Play size={40} /> : <Pause size={40} />}
    </button>
    <button onClick={onRestart} className="p-6 bg-yellow-100 rounded-full text-yellow-600 hover:bg-yellow-200 shadow-lg active:scale-95 transition">
      <RotateCcw size={40} />
    </button>
    {onBack && (
      <button onClick={() => { playSound('click'); onBack(); }} className="p-6 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 shadow-lg active:scale-95 transition">
        <ArrowLeft size={40} />
      </button>
    )}
    {onHome && (
      <button onClick={() => { playSound('click'); onHome(); }} className="p-6 bg-orange-100 rounded-full text-orange-600 hover:bg-orange-200 shadow-lg active:scale-95 transition">
        <Home size={40} />
      </button>
    )}
  </div>
);

const Feedback = ({ feedback, countdown }) => {
  if (feedback === 'correct') {
    return (
      <div className="text-green-500 text-4xl font-bold flex items-center gap-4">
        <Check size={48} strokeWidth={4} />
        <span>Correct! Next in {countdown}...</span>
      </div>
    );
  }
  if (feedback === 'incorrect') {
    return (
      <div className="text-red-500 text-4xl font-bold animate-pulse">
        Try Again!
      </div>
    );
  }
  return null;
};

const CompletionScreen = ({ onRestart, onBack, onHome }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white relative pb-16">
    <div className="absolute top-4 right-4"><Logo /></div>
    <h2 className="text-5xl font-bold text-green-600 mb-12">Great Job!</h2>
    <div className="flex gap-6">
      <MenuButton onClick={onRestart} icon={<RotateCcw />} label="Replay" color="bg-blue-500" />
      <MenuButton onClick={() => { playSound('click'); onBack(); }} icon={<ArrowLeft />} label="Back" color="bg-gray-500" />
      <MenuButton onClick={() => { playSound('click'); onHome(); }} icon={<Home />} label="Home" color="bg-orange-500" />
    </div>
  </div>
);

const MenuButton = ({ onClick, icon, label, color }) => (
  <button onClick={onClick} className={`${color} text-white px-8 py-4 rounded-xl shadow-lg hover:brightness-110 flex items-center gap-2 text-xl font-bold transition transform active:scale-95`}>
    {icon}
    <span>{label}</span>
  </button>
);

const wordSets = {
  animals: [
    { emoji: '🐱', word: 'Cat' },
    { emoji: '🐶', word: 'Dog' },
    { emoji: '🐸', word: 'Frog' },
    { emoji: '🐘', word: 'Elephant' },
    { emoji: '🦁', word: 'Lion' },
    { emoji: '🐧', word: 'Penguin' },
    { emoji: '🦊', word: 'Fox' },
    { emoji: '🐼', word: 'Panda' },
    { emoji: '🦋', word: 'Butterfly' },
    { emoji: '🐬', word: 'Dolphin' },
  ],
  food: [
    { emoji: '🍎', word: 'Apple' },
    { emoji: '🍌', word: 'Banana' },
    { emoji: '🍊', word: 'Orange' },
    { emoji: '🍇', word: 'Grapes' },
    { emoji: '🍓', word: 'Strawberry' },
    { emoji: '🥕', word: 'Carrot' },
    { emoji: '🌽', word: 'Corn' },
    { emoji: '🍕', word: 'Pizza' },
    { emoji: '🍦', word: 'Ice Cream' },
    { emoji: '🍰', word: 'Cake' },
  ],
  things: [
    { emoji: '📚', word: 'Book' },
    { emoji: '⚽', word: 'Ball' },
    { emoji: '🚗', word: 'Car' },
    { emoji: '🚂', word: 'Train' },
    { emoji: '✈️', word: 'Plane' },
    { emoji: '🏠', word: 'House' },
    { emoji: '🌳', word: 'Tree' },
    { emoji: '🌻', word: 'Flower' },
    { emoji: '⭐', word: 'Star' },
    { emoji: '🌈', word: 'Rainbow' },
  ],
};

const WordGame = ({ category, onBack, onHome }) => {
  const words = wordSets[category] || wordSets.animals;
  const [index, setIndex] = useState(0);
  const [showWord, setShowWord] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || isFinished) return;

    if (!showWord) {
      // Show picture only for 2 seconds, then reveal word
      const timer = setTimeout(() => setShowWord(true), 2000);
      return () => clearTimeout(timer);
    } else {
      // Show word for 2 seconds, then advance
      const timer = setTimeout(() => {
        if (index >= words.length - 1) {
          setIsFinished(true);
        } else {
          setIndex((prev) => prev + 1);
          setShowWord(false);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [index, showWord, isPaused, isFinished]);

  const handleRestart = () => {
    setIndex(0);
    setShowWord(false);
    setIsFinished(false);
    setIsPaused(false);
    playSound('click');
  };

  if (isFinished) {
    return <CompletionScreen onRestart={handleRestart} onBack={onBack} onHome={onHome} />;
  }

  const current = words[index];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 w-full relative pb-16">
      <NavButtons onBack={onBack} onHome={onHome} />
      <div className="absolute top-4 right-4"><Logo /></div>

      <div className="flex flex-col items-center gap-8">
        <span style={{ fontSize: '12rem', lineHeight: 1 }}>{current.emoji}</span>
        <span
          className={`text-7xl font-bold text-green-700 transition-all duration-500 ${
            showWord ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          {current.word}
        </span>
      </div>

      <ControlBar
        isPaused={isPaused}
        onPauseToggle={() => { setIsPaused(!isPaused); playSound('click'); }}
        onRestart={handleRestart}
      />
    </div>
  );
};

// --- Flags Game ---
const FlagsGame = ({ onBack, onHome }) => {
  const [mode, setMode] = useState(null); // 'countries' or 'states'
  const [gameMode, setGameMode] = useState(null); // 'game' or 'learn'
  const [started, setStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Setup options
  const [timerSeconds, setTimerSeconds] = useState(5);
  const [showRegionHint, setShowRegionHint] = useState(true);
  const [regionFilter, setRegionFilter] = useState('All');
  const [limit, setLimit] = useState('All');
  const [randomMode, setRandomMode] = useState('shuffle'); // shuffle | alphabetical | by-region

  // Runtime
  const [flags, setFlags] = useState([]);
  const [order, setOrder] = useState([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [regionsList, setRegionsList] = useState([]);
  const [counts, setCounts] = useState({ countries: 0, states: 0 });

  // Load enriched countries + states on mount (cache for quick filtering)
  useEffect(() => {
    fetch('/flags/countries_with_regions.json')
      .then((r) => r.json())
      .then((list) => {
        // store in global cache for quick access
        window.__countries_cache = list;
        setCounts(c => ({ ...c, countries: list.length }));
        const regs = Array.from(new Set(list.map((l) => l.region).filter(Boolean))).sort();
        setRegionsList(regs);
      })
      .catch(() => {});

    fetch('/flags/states.json')
      .then((r) => r.json())
      .then((list) => {
        const st = list.map((f) => ({ filename: f, label: f.replace(/\.svg$/i, ''), region: 'United States' }));
        window.__states_cache = st;
        setCounts(c => ({ ...c, states: st.length }));
      })
      .catch(() => {});
  }, []);

  // When starting or when options change, build the working list
  useEffect(() => {
    if (!started || !mode) return;

    const source = (mode === 'countries' ? (window.__countries_cache || []) : (window.__states_cache || []));

    let filtered = source.slice();
    if (mode === 'countries' && regionFilter && regionFilter !== 'All') {
      filtered = filtered.filter((f) => (f.region || 'Unknown') === regionFilter);
    }

    if (limit !== 'All') {
      const n = parseInt(limit, 10);
      if (!isNaN(n)) filtered = filtered.slice(0, n);
    }

    // Ordering
    let ordered = filtered.slice();
    if (randomMode === 'shuffle') ordered.sort(() => Math.random() - 0.5);
    else if (randomMode === 'alphabetical') ordered.sort((a, b) => a.label.localeCompare(b.label));
    else if (randomMode === 'by-region') ordered.sort((a, b) => ((a.region || '').localeCompare(b.region || '') || a.label.localeCompare(b.label)));

    setFlags(ordered);
    setOrder(ordered.map((_, i) => i));
    setIndex(0);
    setShowAnswer(false);
    setIsFinished(false);
    setIsPaused(false);
  }, [started, mode, regionFilter, limit, randomMode]);

  // Game loop
  useEffect(() => {
    if (!started || isPaused || isFinished || flags.length === 0) return;
    let t;
    if (!showAnswer) {
      t = setTimeout(() => setShowAnswer(true), timerSeconds * 1000);
    } else {
      t = setTimeout(() => {
        if (index >= flags.length - 1) setIsFinished(true);
        else { setIndex((i) => i + 1); setShowAnswer(false); }
      }, timerSeconds * 1000);
    }
    return () => clearTimeout(t);
  }, [started, index, showAnswer, isPaused, timerSeconds, flags, isFinished]);

  // derived current flag (safe even before lists load)
  const current = (order && order.length > 0 && flags && flags.length > 0) ? flags[order[index]] : null;
  const imgSrc = current ? `/flags/${encodeURIComponent(current.filename)}` : '';

  // Speak the flag name when the answer is revealed
  useEffect(() => {
    if (showAnswer && current && !isPaused && !isMuted) {
      try {
        speakNumber(null, current.label);
      } catch (err) {
        console.error('TTS error:', err);
      }
    }
  }, [showAnswer, current, isPaused, isMuted]);

  const handleRestart = () => {
    // reapply ordering for shuffle
    if (randomMode === 'shuffle') setFlags((prev) => prev.slice().sort(() => Math.random() - 0.5));
    setIndex(0);
    setShowAnswer(false);
    setIsFinished(false);
    setIsPaused(false);
    setStarted(true);
    if (!isMuted) playSound('click');
  };

  // Mode selector
  if (!mode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white w-full relative pb-16">
        <NavButtons onBack={onBack} onHome={onHome} silent={isMuted} />
        <div className="absolute top-4 right-4"><Logo /></div>

        <div className="flex flex-col items-center gap-6">
          <h2 className="text-4xl font-bold text-gray-800">Flags</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <button onClick={() => setMode('countries')} className="bg-white p-6 rounded-2xl shadow-xl text-left w-72">
              <div className="text-2xl font-bold">Countries</div>
              <div className="text-sm text-gray-500 mt-2">{counts.countries} flags</div>
            </button>

            <button onClick={() => setMode('states')} className="bg-white p-6 rounded-2xl shadow-xl text-left w-72">
              <div className="text-2xl font-bold">US States</div>
              <div className="text-sm text-gray-500 mt-2">{counts.states} flags</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Learn mode
  if (!started && mode && gameMode === 'learn') {
    const source = (mode === 'countries' ? (window.__countries_cache || []) : (window.__states_cache || []));
    const allItems = source.slice().sort((a, b) => a.label.localeCompare(b.label));
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white w-full relative pb-16">
        <NavButtons onBack={() => { setMode(null); setGameMode(null); }} onHome={onHome} silent={isMuted} />
        <div className="absolute top-4 right-4"><Logo /></div>

        <div className="flex flex-col items-center gap-6 w-full max-w-7xl px-4">
          <h2 className="text-4xl font-bold text-gray-800">{mode === 'countries' ? 'Countries' : 'US States'} - Learn</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full pb-20 overflow-y-auto max-h-screen">
            {allItems.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center gap-2">
                <img src={`/flags/${encodeURIComponent(item.filename)}`} alt={item.label} className="w-32 h-24 object-contain shadow-sm" />
                <div className="text-sm font-medium text-gray-800 text-center">{item.label}</div>
                {item.region && mode === 'countries' && <div className="text-xs text-gray-500">{item.region}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Game or Setup: show choose game or learn
  if (!started && mode && gameMode === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white w-full relative pb-16">
        <NavButtons onBack={() => setMode(null)} onHome={onHome} silent={isMuted} />
        <div className="absolute top-4 right-4"><Logo /></div>

        <div className="flex flex-col items-center gap-6">
          <h2 className="text-4xl font-bold text-gray-800">{mode === 'countries' ? 'Countries' : 'US States'}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <button onClick={() => setGameMode('game')} className="bg-blue-100 p-8 rounded-2xl shadow-xl text-center w-72 hover:bg-blue-200">
              <div className="text-3xl font-bold text-blue-800">Game</div>
              <div className="text-sm text-blue-600 mt-2">Guess the flags with timer</div>
            </button>

            <button onClick={() => setGameMode('learn')} className="bg-green-100 p-8 rounded-2xl shadow-xl text-center w-72 hover:bg-green-200">
              <div className="text-3xl font-bold text-green-800">Learn</div>
              <div className="text-sm text-green-600 mt-2">Browse all flags</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Setup screen (timer, region limit, randomization) - only for game mode
  if (!started && mode && gameMode === 'game') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white w-full relative pb-16">
        <NavButtons onBack={() => { setMode(null); if (!isMuted) playSound('click'); }} onHome={onHome} silent={isMuted} />
        <div className="absolute top-4 right-4"><Logo /></div>

        <div className="flex flex-col items-center gap-6">
          <h2 className="text-4xl font-bold text-gray-800">{mode === 'countries' ? 'Countries' : 'US States'}</h2>

          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
            <div className="text-gray-700">Set the timer (seconds) for guess and reveal</div>
            <input type="number" min="1" value={timerSeconds} onChange={(e) => setTimerSeconds(Math.max(1, parseInt(e.target.value) || 1))} className="w-24 p-2 border rounded text-center text-2xl" />

            {mode === 'countries' && (
              <div className="w-full flex flex-col items-center gap-2">
                <label className="text-sm font-medium">Region filter</label>
                <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} className="p-2 border rounded w-52 text-sm">
                  <option value="All">All</option>
                  {regionsList.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            )}

            <div className="w-full flex flex-col items-center gap-2">
              <label className="text-sm font-medium">Limit set</label>
              <select value={limit} onChange={(e) => setLimit(e.target.value)} className="p-2 border rounded w-52 text-sm">
                <option value="All">All</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <div className="w-full flex flex-col items-center gap-2">
              <label className="text-sm font-medium">Order</label>
              <select value={randomMode} onChange={(e) => setRandomMode(e.target.value)} className="p-2 border rounded w-52 text-sm">
                <option value="shuffle">Shuffle</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="by-region">Group by region</option>
              </select>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input id="regionHint" type="checkbox" checked={showRegionHint} onChange={(e) => setShowRegionHint(e.target.checked)} />
              <label htmlFor="regionHint" className="text-sm">Show region hint when answer is revealed</label>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input id="muteToggle" type="checkbox" checked={isMuted} onChange={(e) => setIsMuted(e.target.checked)} />
              <label htmlFor="muteToggle" className="text-sm">Mute sounds and voice</label>
            </div>

            <div className="mt-4 flex gap-4">
              <button onClick={() => { setStarted(true); if (!isMuted) playSound('click'); }} className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold">Start</button>
              <button onClick={() => { setMode(null); if (!isMuted) playSound('click'); }} className="bg-gray-200 px-6 py-3 rounded-xl">Back</button>
            </div>

            <div className="mt-2 text-sm text-gray-400">{counts[mode]} cards available</div>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return <CompletionScreen onRestart={handleRestart} onBack={() => { setStarted(false); setMode(null); }} onHome={onHome} />;
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white w-full relative pb-16">
      <NavButtons onBack={() => { setStarted(false); setMode(null); }} onHome={onHome} silent={isMuted} />
      <div className="absolute top-4 right-4"><Logo /></div>

      <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-3xl flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{mode === 'countries' ? 'Countries' : 'US States'}</h2>
          <div className="text-sm text-gray-500">Card {index + 1} / {flags.length}</div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center">
          {current ? (
            <>
              <img src={imgSrc} alt={current.label} className="w-96 h-56 object-contain shadow-md bg-white rounded" />

              {/* empty until reveal */}
              <div className="mt-6 text-5xl font-bold text-gray-800 h-16 flex items-center justify-center">
                {showAnswer ? (
                  <div className="flex flex-col items-center">
                    <div>{current.label}</div>
                    {showRegionHint && current.region && <div className="text-sm text-gray-400 mt-1">{current.region}</div>}
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <div className="p-12">Loading flags...</div>
          )}
        </div>

        <div className="mt-2 text-sm text-gray-500">Timer: {timerSeconds}s (guess), {timerSeconds}s (reveal)</div>
      </div>

      <ControlBar
        isPaused={isPaused}
        onPauseToggle={() => { const newState = !isPaused; setIsPaused(newState); if (!isMuted) playSound('click'); if (newState) window.speechSynthesis?.cancel(); }}
        onRestart={handleRestart}
      />
    </div>
  );
};

// --- World Capitals Game ---
const WorldCapitalsGame = ({ onBack, onHome }) => {
  const [gameMode, setGameMode] = useState(null); // 'game' or 'learn'
  const [started, setStarted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(5);
  const [limit, setLimit] = useState('All');
  const [randomMode, setRandomMode] = useState('shuffle');
  const [regionFilter, setRegionFilter] = useState('All');
  const [showRegionHint, setShowRegionHint] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const [flags, setFlags] = useState([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [regionsList, setRegionsList] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch('/capitals/countries_capitals.json')
      .then((r) => r.json())
      .then((list) => {
        window.__world_caps_cache = list;
        setCount(list.length);
        const regs = Array.from(new Set(list.map((l) => l.region).filter(Boolean))).sort();
        setRegionsList(regs);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!started) return;
    const source = window.__world_caps_cache || [];
    let filtered = source.slice();
    if (regionFilter && regionFilter !== 'All') filtered = filtered.filter((f) => (f.region || 'Unknown') === regionFilter);

    if (limit !== 'All') {
      const n = parseInt(limit, 10);
      if (!isNaN(n)) filtered = filtered.slice(0, n);
    }

    let ordered = filtered.slice();
    if (randomMode === 'shuffle') ordered.sort(() => Math.random() - 0.5);
    else if (randomMode === 'alphabetical') ordered.sort((a, b) => (a.capital || '').localeCompare(b.capital || ''));
    else if (randomMode === 'by-region') ordered.sort((a, b) => ((a.region || '').localeCompare(b.region || '') || (a.capital || '').localeCompare(b.capital || '')));

    setFlags(ordered);
    setIndex(0);
    setShowAnswer(false);
    setIsFinished(false);
    setIsPaused(false);
  }, [started, regionFilter, limit, randomMode]);

  // Game loop
  useEffect(() => {
    if (!started || isPaused || isFinished || flags.length === 0) return;
    let t;
    if (!showAnswer) t = setTimeout(() => setShowAnswer(true), timerSeconds * 1000);
    else t = setTimeout(() => {
      if (index >= flags.length - 1) setIsFinished(true);
      else { setIndex((i) => i + 1); setShowAnswer(false); }
    }, timerSeconds * 1000);
    return () => clearTimeout(t);
  }, [started, index, showAnswer, isPaused, timerSeconds, flags, isFinished]);

  const handleRestart = () => {
    if (randomMode === 'shuffle') setFlags((prev) => prev.slice().sort(() => Math.random() - 0.5));
    setIndex(0);
    setShowAnswer(false);
    setIsFinished(false);
    setIsPaused(false);
    setStarted(true);
    if (!isMuted) playSound('click');
  };

  const current = flags[index] || null;
  const imgSrc = current ? `/flags/${encodeURIComponent(current.filename)}` : '';

  // Speak the country name when the card appears (guess phase)
  useEffect(() => {
    if (!showAnswer && current && !isPaused && !isMuted) {
      try {
        if (current.label) speakNumber(null, current.label);
      } catch (err) {
        console.error('TTS error:', err);
      }
    }
  }, [index, isPaused, isMuted]);

  // Speak the capital when revealed
  useEffect(() => {
    if (showAnswer && current && !isPaused && !isMuted) {
      try {
        if (current.capital) speakNumber(null, current.capital);
      } catch (err) {
        console.error('TTS error:', err);
      }
    }
  }, [showAnswer, current, isPaused, isMuted]);

  if (!started) {
    if (!gameMode) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white w-full relative pb-16">
          <NavButtons onBack={onBack} onHome={onHome} silent={isMuted} />
          <div className="absolute top-4 right-4"><Logo /></div>

          <div className="flex flex-col items-center gap-6">
            <h2 className="text-4xl font-bold text-gray-800">World Capitals</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <button onClick={() => setGameMode('game')} className="bg-blue-100 p-8 rounded-2xl shadow-xl text-center w-72 hover:bg-blue-200">
                <div className="text-3xl font-bold text-blue-800">Game</div>
                <div className="text-sm text-blue-600 mt-2">Guess the capitals</div>
              </button>

              <button onClick={() => setGameMode('learn')} className="bg-green-100 p-8 rounded-2xl shadow-xl text-center w-72 hover:bg-green-200">
                <div className="text-3xl font-bold text-green-800">Learn</div>
                <div className="text-sm text-green-600 mt-2">Browse all capitals</div>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (gameMode === 'learn') {
      const source = window.__world_caps_cache || [];
      const allItems = source.slice().sort((a, b) => a.label.localeCompare(b.label));
      
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white w-full relative pb-16">
          <NavButtons onBack={() => setGameMode(null)} onHome={onHome} silent={isMuted} />
          <div className="absolute top-4 right-4"><Logo /></div>

          <div className="flex flex-col items-center gap-6 w-full max-w-7xl px-4">
            <h2 className="text-4xl font-bold text-gray-800">World Capitals - Learn</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full pb-20 overflow-y-auto max-h-screen">
              {allItems.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center gap-2">
                  <img src={`/flags/${encodeURIComponent(item.filename)}`} alt={item.label} className="w-32 h-24 object-contain shadow-sm" />
                  <div className="text-sm font-bold text-gray-800">{item.label}</div>
                  <div className="text-md font-semibold text-indigo-600">{item.capital}</div>
                  {item.region && <div className="text-xs text-gray-500">{item.region}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white w-full relative pb-16">
        <NavButtons onBack={() => setGameMode(null)} onHome={onHome} silent={isMuted} />
        <div className="absolute top-4 right-4"><Logo /></div>

        <div className="flex flex-col items-center gap-6">
          <h2 className="text-4xl font-bold text-gray-800">World Capitals</h2>

          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
            <div className="text-gray-700">Set the timer (seconds) for guess and reveal</div>
            <input type="number" min="1" value={timerSeconds} onChange={(e) => setTimerSeconds(Math.max(1, parseInt(e.target.value) || 1))} className="w-24 p-2 border rounded text-center text-2xl" />

            <div className="w-full flex flex-col items-center gap-2">
              <label className="text-sm font-medium">Region filter</label>
              <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} className="p-2 border rounded w-52 text-sm">
                <option value="All">All</option>
                {regionsList.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="w-full flex flex-col items-center gap-2">
              <label className="text-sm font-medium">Limit set</label>
              <select value={limit} onChange={(e) => setLimit(e.target.value)} className="p-2 border rounded w-52 text-sm">
                <option value="All">All</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <div className="w-full flex flex-col items-center gap-2">
              <label className="text-sm font-medium">Order</label>
              <select value={randomMode} onChange={(e) => setRandomMode(e.target.value)} className="p-2 border rounded w-52 text-sm">
                <option value="shuffle">Shuffle</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="by-region">Group by region</option>
              </select>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input id="regionHint" type="checkbox" checked={showRegionHint} onChange={(e) => setShowRegionHint(e.target.checked)} />
              <label htmlFor="regionHint" className="text-sm">Show region hint when answer is revealed</label>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input id="muteToggle" type="checkbox" checked={isMuted} onChange={(e) => setIsMuted(e.target.checked)} />
              <label htmlFor="muteToggle" className="text-sm">Mute sounds and voice</label>
            </div>

            <div className="mt-4 flex gap-4">
              <button onClick={() => { setStarted(true); if (!isMuted) playSound('click'); }} className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold">Start</button>
              <button onClick={() => { onBack(); if (!isMuted) playSound('click'); }} className="bg-gray-200 px-6 py-3 rounded-xl">Back</button>
            </div>

            <div className="mt-2 text-sm text-gray-400">{count} cards available</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white w-full relative pb-16">
      <NavButtons onBack={() => { setStarted(false); setIsPaused(false); setIsFinished(false); setRegionFilter('All'); onBack(); }} onHome={onHome} silent={isMuted} />
      <div className="absolute top-4 right-4"><Logo /></div>

      <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-3xl flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">World Capitals</h2>
          <div className="text-sm text-gray-500">Card {index + 1} / {flags.length}</div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center">
          {current ? (
            <>
              <img src={imgSrc} alt={current.label} className="w-96 h-56 object-contain shadow-md bg-white rounded" />

              <div className="mt-4 text-3xl font-bold text-gray-700">{current.label}</div>

              <div className="mt-6 text-4xl font-bold text-gray-800 h-16 flex items-center justify-center">
                {showAnswer ? current.capital : ''}
              </div>
              {showAnswer && showRegionHint && current.region && (
                <div className="text-sm text-gray-400 mt-2">{current.region}</div>
              )}
            </>
          ) : (
            <div className="p-12">Loading capitals...</div>
          )}
        </div>

        <div className="mt-2 text-sm text-gray-500">Timer: {timerSeconds}s (guess), {timerSeconds}s (reveal)</div>
      </div>

      <ControlBar
        isPaused={isPaused}
        onPauseToggle={() => { const newState = !isPaused; setIsPaused(newState); if (!isMuted) playSound('click'); if (newState) window.speechSynthesis?.cancel(); }}
        onRestart={handleRestart}
      />
    </div>
  );
};

// --- US State Capitals Game ---
const StateCapitalsGame = ({ onBack, onHome }) => {
  const [gameMode, setGameMode] = useState(null); // 'game' or 'learn'
  const [started, setStarted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(5);
  const [limit, setLimit] = useState('All');
  const [randomMode, setRandomMode] = useState('shuffle');
  const [isMuted, setIsMuted] = useState(false);

  const [flags, setFlags] = useState([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch('/capitals/states_capitals.json')
      .then((r) => r.json())
      .then((list) => {
        window.__states_caps_cache = list;
        setCount(list.length);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!started) return;
    const source = window.__states_caps_cache || [];
    let filtered = source.slice();
    if (limit !== 'All') {
      const n = parseInt(limit, 10);
      if (!isNaN(n)) filtered = filtered.slice(0, n);
    }

    let ordered = filtered.slice();
    if (randomMode === 'shuffle') ordered.sort(() => Math.random() - 0.5);
    else if (randomMode === 'alphabetical') ordered.sort((a, b) => (a.label || '').localeCompare(b.label || ''));

    setFlags(ordered);
    setIndex(0);
    setShowAnswer(false);
    setIsFinished(false);
    setIsPaused(false);
  }, [started, limit, randomMode]);

  // Game loop
  useEffect(() => {
    if (!started || isPaused || isFinished || flags.length === 0) return;
    let t;
    if (!showAnswer) t = setTimeout(() => setShowAnswer(true), timerSeconds * 1000);
    else t = setTimeout(() => {
      if (index >= flags.length - 1) setIsFinished(true);
      else { setIndex((i) => i + 1); setShowAnswer(false); }
    }, timerSeconds * 1000);
    return () => clearTimeout(t);
  }, [started, index, showAnswer, isPaused, timerSeconds, flags, isFinished]);

  const handleRestart = () => {
    if (randomMode === 'shuffle') setFlags((prev) => prev.slice().sort(() => Math.random() - 0.5));
    setIndex(0);
    setShowAnswer(false);
    setIsFinished(false);
    setIsPaused(false);
    setStarted(true);
    if (!isMuted) playSound('click');
  };

  const current = flags[index] || null;
  const imgSrc = current ? `/flags/${encodeURIComponent(current.filename)}` : '';

  // Speak the state name when the card appears (guess phase)
  useEffect(() => {
    if (!showAnswer && current && !isPaused && !isMuted) {
      try {
        if (current.label) speakNumber(null, current.label);
      } catch (err) {
        console.error('TTS error:', err);
      }
    }
  }, [index, isPaused, isMuted]);

  // Speak the capital when revealed
  useEffect(() => {
    if (showAnswer && current && !isPaused && !isMuted) {
      try {
        if (current.capital) speakNumber(null, current.capital);
      } catch (err) {
        console.error('TTS error:', err);
      }
    }
  }, [showAnswer, current, isPaused, isMuted]);

  if (!started) {
    if (!gameMode) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white w-full relative pb-16">
          <NavButtons onBack={onBack} onHome={onHome} silent={isMuted} />
          <div className="absolute top-4 right-4"><Logo /></div>

          <div className="flex flex-col items-center gap-6">
            <h2 className="text-4xl font-bold text-gray-800">US State Capitals</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <button onClick={() => setGameMode('game')} className="bg-blue-100 p-8 rounded-2xl shadow-xl text-center w-72 hover:bg-blue-200">
                <div className="text-3xl font-bold text-blue-800">Game</div>
                <div className="text-sm text-blue-600 mt-2">Guess the capitals</div>
              </button>

              <button onClick={() => setGameMode('learn')} className="bg-green-100 p-8 rounded-2xl shadow-xl text-center w-72 hover:bg-green-200">
                <div className="text-3xl font-bold text-green-800">Learn</div>
                <div className="text-sm text-green-600 mt-2">Browse all capitals</div>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (gameMode === 'learn') {
      const source = window.__states_caps_cache || [];
      const allItems = source.slice().sort((a, b) => a.label.localeCompare(b.label));
      
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white w-full relative pb-16">
          <NavButtons onBack={() => setGameMode(null)} onHome={onHome} silent={isMuted} />
          <div className="absolute top-4 right-4"><Logo /></div>

          <div className="flex flex-col items-center gap-6 w-full max-w-7xl px-4">
            <h2 className="text-4xl font-bold text-gray-800">US State Capitals - Learn</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full pb-20 overflow-y-auto max-h-screen">
              {allItems.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center gap-2">
                  <img src={`/flags/${encodeURIComponent(item.filename)}`} alt={item.label} className="w-32 h-24 object-contain shadow-sm" />
                  <div className="text-sm font-bold text-gray-800">{item.label}</div>
                  <div className="text-md font-semibold text-rose-600">{item.capital}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white w-full relative pb-16">
        <NavButtons onBack={() => setGameMode(null)} onHome={onHome} silent={isMuted} />
        <div className="absolute top-4 right-4"><Logo /></div>

        <div className="flex flex-col items-center gap-6">
          <h2 className="text-4xl font-bold text-gray-800">US State Capitals</h2>

          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
            <div className="text-gray-700">Set the timer (seconds) for guess and reveal</div>
            <input type="number" min="1" value={timerSeconds} onChange={(e) => setTimerSeconds(Math.max(1, parseInt(e.target.value) || 1))} className="w-24 p-2 border rounded text-center text-2xl" />

            <div className="w-full flex flex-col items-center gap-2">
              <label className="text-sm font-medium">Limit set</label>
              <select value={limit} onChange={(e) => setLimit(e.target.value)} className="p-2 border rounded w-52 text-sm">
                <option value="All">All</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>

            <div className="w-full flex flex-col items-center gap-2">
              <label className="text-sm font-medium">Order</label>
              <select value={randomMode} onChange={(e) => setRandomMode(e.target.value)} className="p-2 border rounded w-52 text-sm">
                <option value="shuffle">Shuffle</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input id="muteToggleStates" type="checkbox" checked={isMuted} onChange={(e) => setIsMuted(e.target.checked)} />
              <label htmlFor="muteToggleStates" className="text-sm">Mute sounds and voice</label>
            </div>

            <div className="mt-4 flex gap-4">
              <button onClick={() => { setStarted(true); if (!isMuted) playSound('click'); }} className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold">Start</button>
              <button onClick={() => { onBack(); if (!isMuted) playSound('click'); }} className="bg-gray-200 px-6 py-3 rounded-xl">Back</button>
            </div>

            <div className="mt-2 text-sm text-gray-400">{count} cards available</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white w-full relative pb-16">
      <NavButtons onBack={() => { setStarted(false); setIsPaused(false); setIsFinished(false); onBack(); }} onHome={onHome} silent={isMuted} />
      <div className="absolute top-4 right-4"><Logo /></div>

      <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-3xl flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">US State Capitals</h2>
          <div className="text-sm text-gray-500">Card {index + 1} / {flags.length}</div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center">
          {current ? (
            <>
              <img src={imgSrc} alt={current.label} className="w-96 h-56 object-contain shadow-md bg-white rounded" />

              <div className="mt-4 text-3xl font-bold text-gray-700">{current.label}</div>

              <div className="mt-6 text-4xl font-bold text-gray-800 h-16 flex items-center justify-center">{showAnswer ? current.capital : ''}</div>
            </>
          ) : (
            <div className="p-12">Loading state capitals...</div>
          )}
        </div>

        <div className="mt-2 text-sm text-gray-500">Timer: {timerSeconds}s (guess), {timerSeconds}s (reveal)</div>
      </div>

      <ControlBar
        isPaused={isPaused}
        onPauseToggle={() => { const newState = !isPaused; setIsPaused(newState); if (!isMuted) playSound('click'); if (newState) window.speechSynthesis?.cancel(); }}
        onRestart={handleRestart}
      />
    </div>
  );
};

// --- US Presidents Game ---
const USPresidentsGame = ({ onBack, onHome }) => {
  const [gameMode, setGameMode] = useState(null); // 'game' or 'learn'
  const [started, setStarted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(5);
  const [limit, setLimit] = useState('All');
  const [randomMode, setRandomMode] = useState('shuffle');
  const [isMuted, setIsMuted] = useState(false);

  const [presidents, setPresidents] = useState([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch('/presidents/presidents.json')
      .then((r) => r.json())
      .then((list) => {
        window.__presidents_cache = list;
        setCount(list.length);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!started) return;
    const source = window.__presidents_cache || [];
    let filtered = source.slice();
    if (limit !== 'All') {
      const n = parseInt(limit, 10);
      if (!isNaN(n)) filtered = filtered.slice(0, n);
    }

    let ordered = filtered.slice();
    if (randomMode === 'shuffle') ordered.sort(() => Math.random() - 0.5);
    else if (randomMode === 'alphabetical') ordered.sort((a, b) => a.name.localeCompare(b.name));

    setPresidents(ordered);
    setIndex(0);
    setShowAnswer(false);
    setIsFinished(false);
    setIsPaused(false);
  }, [started, limit, randomMode]);

  // Game loop
  useEffect(() => {
    if (!started || isPaused || isFinished || presidents.length === 0) return;
    let t;
    if (!showAnswer) t = setTimeout(() => setShowAnswer(true), timerSeconds * 1000);
    else t = setTimeout(() => {
      if (index >= presidents.length - 1) setIsFinished(true);
      else { setIndex((i) => i + 1); setShowAnswer(false); }
    }, timerSeconds * 1000);
    return () => clearTimeout(t);
  }, [started, index, showAnswer, isPaused, timerSeconds, presidents, isFinished]);

  const handleRestart = () => {
    if (randomMode === 'shuffle') setPresidents((prev) => prev.slice().sort(() => Math.random() - 0.5));
    setIndex(0);
    setShowAnswer(false);
    setIsFinished(false);
    setIsPaused(false);
    setStarted(true);
    if (!isMuted) playSound('click');
  };

  const current = presidents[index] || null;
  const question = current ? `Who is the ${current.number}${current.number === 1 ? 'st' : current.number === 2 ? 'nd' : current.number === 3 ? 'rd' : 'th'} president of the United States?` : '';

  // Speak the question when card appears (guess phase)
  useEffect(() => {
    if (!showAnswer && current && !isPaused && !isMuted) {
      try {
        speakNumber(null, question);
      } catch (err) {
        console.error('TTS error:', err);
      }
    }
  }, [index, isPaused, isMuted]);

  // Speak the answer when revealed
  useEffect(() => {
    if (showAnswer && current && !isPaused && !isMuted) {
      try {
        speakNumber(null, current.name);
      } catch (err) {
        console.error('TTS error:', err);
      }
    }
  }, [showAnswer, current, isPaused, isMuted]);

  if (!started) {
    if (!gameMode) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white w-full relative pb-16">
          <NavButtons onBack={onBack} onHome={onHome} silent={isMuted} />
          <div className="absolute top-4 right-4"><Logo /></div>

          <div className="flex flex-col items-center gap-6">
            <h2 className="text-4xl font-bold text-gray-800">US Presidents</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <button onClick={() => setGameMode('game')} className="bg-blue-100 p-8 rounded-2xl shadow-xl text-center w-72 hover:bg-blue-200">
                <div className="text-3xl font-bold text-blue-800">Game</div>
                <div className="text-sm text-blue-600 mt-2">Guess the presidents</div>
              </button>

              <button onClick={() => setGameMode('learn')} className="bg-green-100 p-8 rounded-2xl shadow-xl text-center w-72 hover:bg-green-200">
                <div className="text-3xl font-bold text-green-800">Learn</div>
                <div className="text-sm text-green-600 mt-2">Browse all presidents</div>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (gameMode === 'learn') {
      const source = window.__presidents_cache || [];
      const allItems = source.slice().sort((a, b) => a.number - b.number);
      
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white w-full relative pb-16">
          <NavButtons onBack={() => setGameMode(null)} onHome={onHome} silent={isMuted} />
          <div className="absolute top-4 right-4"><Logo /></div>

          <div className="flex flex-col items-center gap-6 w-full max-w-7xl px-4">
            <h2 className="text-4xl font-bold text-gray-800">US Presidents - Learn</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full pb-20 overflow-y-auto max-h-screen">
              {allItems.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center gap-2">
                  <div className="text-lg font-bold text-indigo-600">#{item.number}</div>
                  <div className="text-md font-bold text-gray-800 text-center">{item.name}</div>
                  <div className="text-sm text-gray-600">{item.terms} {item.terms === 1 ? 'term' : 'terms'}</div>
                  <div className="text-xs text-gray-500">{item.years}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white w-full relative pb-16">
        <NavButtons onBack={() => setGameMode(null)} onHome={onHome} silent={isMuted} />
        <div className="absolute top-4 right-4"><Logo /></div>

        <div className="flex flex-col items-center gap-6">
          <h2 className="text-4xl font-bold text-gray-800">US Presidents</h2>

          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
            <div className="text-gray-700">Set the timer (seconds) for guess and reveal</div>
            <input type="number" min="1" value={timerSeconds} onChange={(e) => setTimerSeconds(Math.max(1, parseInt(e.target.value) || 1))} className="w-24 p-2 border rounded text-center text-2xl" />

            <div className="w-full flex flex-col items-center gap-2">
              <label className="text-sm font-medium">Limit set</label>
              <select value={limit} onChange={(e) => setLimit(e.target.value)} className="p-2 border rounded w-52 text-sm">
                <option value="All">All (46)</option>
                <option value="10">First 10</option>
                <option value="20">First 20</option>
                <option value="30">First 30</option>
              </select>
            </div>

            <div className="w-full flex flex-col items-center gap-2">
              <label className="text-sm font-medium">Order</label>
              <select value={randomMode} onChange={(e) => setRandomMode(e.target.value)} className="p-2 border rounded w-52 text-sm">
                <option value="shuffle">Random</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input id="muteTogglePresidents" type="checkbox" checked={isMuted} onChange={(e) => setIsMuted(e.target.checked)} />
              <label htmlFor="muteTogglePresidents" className="text-sm">Mute sounds and voice</label>
            </div>

            <div className="mt-4 flex gap-4">
              <button onClick={() => { setStarted(true); if (!isMuted) playSound('click'); }} className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold">Start</button>
              <button onClick={() => { onBack(); if (!isMuted) playSound('click'); }} className="bg-gray-200 px-6 py-3 rounded-xl">Back</button>
            </div>

            <div className="mt-2 text-sm text-gray-400">{count} presidents available</div>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return <CompletionScreen onRestart={handleRestart} onBack={onBack} onHome={onHome} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white w-full relative pb-16">
      <NavButtons onBack={() => { setStarted(false); setIsPaused(false); setIsFinished(false); onBack(); }} onHome={onHome} silent={isMuted} />
      <div className="absolute top-4 right-4"><Logo /></div>

      <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-3xl flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">US Presidents</h2>
          <div className="text-sm text-gray-500">Card {index + 1} / {presidents.length}</div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center min-h-96 justify-center">
          {current ? (
            <>
              <div className="text-2xl font-bold text-gray-700 text-center mb-8">{question}</div>

              <div className="mt-6 text-5xl font-bold text-indigo-700 text-center h-24 flex flex-col items-center justify-center">
                {showAnswer ? (
                  <>
                    <div>{current.name}</div>
                    <div className="text-xl text-gray-600 mt-4">
                      {current.terms} {current.terms === 1 ? 'term' : 'terms'} • {current.years}
                    </div>
                  </>
                ) : null}
              </div>
            </>
          ) : (
            <div className="p-12 text-gray-500">Loading presidents...</div>
          )}
        </div>

        <div className="mt-2 text-sm text-gray-500">Timer: {timerSeconds}s (guess), {timerSeconds}s (reveal)</div>
      </div>

      <ControlBar
        isPaused={isPaused}
        onPauseToggle={() => { const newState = !isPaused; setIsPaused(newState); if (!isMuted) playSound('click'); if (newState) window.speechSynthesis?.cancel(); }}
        onRestart={handleRestart}
      />
    </div>
  );
};

export default App;
