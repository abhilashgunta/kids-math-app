import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Home, RotateCcw, Check, Pause, Play, 
  Circle, Square, Triangle, Star, Hexagon, Minus, 
  Calculator, Smile, Heart, HelpCircle, Scale, Shapes, LayoutGrid, Hash, Plus 
} from 'lucide-react';

const App = () => {
  // Views: 'home', 'cat_numbers', 'cat_math', 'cat_shapes', 
  //        'counting', 'adding', 'subtracting', 'comparison', 'patterns', 'shapes'
  const [currentView, setCurrentView] = useState('home');

  return (
    <div className="min-h-screen bg-blue-50 font-sans select-none relative overflow-hidden">
      {/* Main Home Screen */}
      {currentView === 'home' && (
        <HomeView onSelectCategory={(cat) => setCurrentView(cat)} />
      )}

      {/* Category Sub-menus */}
      {currentView === 'cat_numbers' && (
        <CategoryMenu 
          title="Numbers" 
          onBack={() => setCurrentView('home')} 
          items={[
            { id: 'counting', label: 'Count 1-20', icon: <span className="text-6xl font-bold">123</span>, color: 'bg-yellow-400 text-yellow-900' }
          ]}
          onSelect={(id) => setCurrentView(id)}
        />
      )}

      {currentView === 'cat_math' && (
        <CategoryMenu 
          title="Math" 
          onBack={() => setCurrentView('home')} 
          items={[
            { id: 'adding', label: 'Add Numbers', icon: <Plus size={64} strokeWidth={4} />, color: 'bg-purple-400 text-purple-900' },
            { id: 'subtracting', label: 'Subtract', icon: <Minus size={64} strokeWidth={4} />, color: 'bg-red-400 text-red-900' }
          ]}
          onSelect={(id) => setCurrentView(id)}
        />
      )}

      {currentView === 'cat_shapes' && (
        <CategoryMenu 
          title="Shapes" 
          onBack={() => setCurrentView('home')} 
          items={[
            { id: 'comparison', label: 'More or Less?', icon: <Scale size={64} strokeWidth={2} />, color: 'bg-green-400 text-green-900' },
            { id: 'patterns', label: 'Patterns', icon: <LayoutGrid size={64} strokeWidth={2} />, color: 'bg-blue-400 text-blue-900' },
            { id: 'shapes', label: 'Find Shape', icon: <Shapes size={64} strokeWidth={2} />, color: 'bg-pink-400 text-pink-900' }
          ]}
          onSelect={(id) => setCurrentView(id)}
        />
      )}

      {/* Games - onBack returns to their specific category */}
      {currentView === 'counting' && (
        <CountingGame onBack={() => setCurrentView('cat_numbers')} onHome={() => setCurrentView('home')} />
      )}
      {currentView === 'adding' && (
        <AddingGame onBack={() => setCurrentView('cat_math')} onHome={() => setCurrentView('home')} />
      )}
      {currentView === 'subtracting' && (
        <SubtractingGame onBack={() => setCurrentView('cat_math')} onHome={() => setCurrentView('home')} />
      )}
      {currentView === 'comparison' && (
        <ComparisonGame onBack={() => setCurrentView('cat_shapes')} onHome={() => setCurrentView('home')} />
      )}
      {currentView === 'patterns' && (
        <PatternGame onBack={() => setCurrentView('cat_shapes')} onHome={() => setCurrentView('home')} />
      )}
      {currentView === 'shapes' && (
        <ShapeGame onBack={() => setCurrentView('cat_shapes')} onHome={() => setCurrentView('home')} />
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
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl px-4">
      <CategoryButton 
        onClick={() => onSelectCategory('cat_numbers')} 
        color="bg-yellow-100 text-yellow-800 border-4 border-yellow-400"
        icon={<Hash size={80} />}
        label="Numbers"
        // subLabel removed
      />
      <CategoryButton 
        onClick={() => onSelectCategory('cat_math')} 
        color="bg-purple-100 text-purple-800 border-4 border-purple-400"
        icon={<div className="flex gap-2"><Plus size={40} /><Minus size={40} /></div>}
        label="Math" 
        // subLabel removed
      />
      <CategoryButton 
        onClick={() => onSelectCategory('cat_shapes')} 
        color="bg-blue-100 text-blue-800 border-4 border-blue-400"
        icon={<Shapes size={80} />}
        label="Shapes"
        // subLabel removed
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
      }, 2000); // 2 seconds per number
    }
    return () => clearInterval(interval);
  }, [isFinished, isPaused]);

  const handleRestart = () => {
    setNumber(1);
    setIsFinished(false);
    setIsPaused(false);
  };

  if (isFinished) {
    return (
      <CompletionScreen onRestart={handleRestart} onBack={onBack} onHome={onHome} />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white w-full relative pb-16">
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
        onPauseToggle={() => setIsPaused(!isPaused)} 
        onRestart={handleRestart} 
        onBack={onBack} 
        onHome={onHome} 
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
    } else {
      setFeedback('incorrect');
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
    if (parseInt(userAnswer) === diff) { setFeedback('correct'); } 
    else { setFeedback('incorrect'); setTimeout(() => setFeedback(null), 2000); }
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
    } else {
      setFeedback('incorrect');
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
    } else {
      setFeedback('incorrect');
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
    } else {
      setFeedback('incorrect');
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

const NavButtons = ({ onBack, onHome }) => (
  <div className="absolute top-8 left-8 flex gap-4 z-10">
    <button onClick={onBack} className="p-3 bg-white rounded-full shadow text-gray-600 hover:bg-gray-100"><ArrowLeft /></button>
    <button onClick={onHome} className="p-3 bg-white rounded-full shadow text-gray-600 hover:bg-gray-100"><Home /></button>
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
    <button onClick={onBack} className="p-6 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 shadow-lg active:scale-95 transition">
      <ArrowLeft size={40} />
    </button>
    <button onClick={onHome} className="p-6 bg-orange-100 rounded-full text-orange-600 hover:bg-orange-200 shadow-lg active:scale-95 transition">
      <Home size={40} />
    </button>
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
      <MenuButton onClick={onBack} icon={<ArrowLeft />} label="Back" color="bg-gray-500" />
      <MenuButton onClick={onHome} icon={<Home />} label="Home" color="bg-orange-500" />
    </div>
  </div>
);

const MenuButton = ({ onClick, icon, label, color }) => (
  <button onClick={onClick} className={`${color} text-white px-8 py-4 rounded-xl shadow-lg hover:brightness-110 flex items-center gap-2 text-xl font-bold transition transform active:scale-95`}>
    {icon}
    <span>{label}</span>
  </button>
);

export default App;
