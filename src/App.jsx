import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Home, RotateCcw, Check, Pause, Play, Circle, Square, Triangle, Star, Hexagon, Minus, Calculator, Smile, Heart } from 'lucide-react';

const App = () => {
  // Views: 'home', 'counting', 'adding', 'subtracting'
  const [currentView, setCurrentView] = useState('home');

  return (
    <div className="min-h-screen bg-blue-50 font-sans select-none relative overflow-hidden">
      {currentView === 'home' && (
        <HomeView onSelectActivity={(activity) => setCurrentView(activity)} />
      )}
      {currentView === 'counting' && (
        <CountingGame 
          onBack={() => setCurrentView('home')} 
          onHome={() => setCurrentView('home')} 
        />
      )}
      {currentView === 'adding' && (
        <AddingGame 
          onBack={() => setCurrentView('home')} 
          onHome={() => setCurrentView('home')} 
        />
      )}
      {currentView === 'subtracting' && (
        <SubtractingGame 
          onBack={() => setCurrentView('home')} 
          onHome={() => setCurrentView('home')} 
        />
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

// --- Sub Components ---

const HomeView = ({ onSelectActivity }) => (
  <div className="flex flex-col items-center justify-center min-h-screen relative p-4 space-y-12 pb-16">
    <Logo size="large" />
    
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl justify-center px-4">
      <button 
        onClick={() => onSelectActivity('counting')}
        className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-3xl p-8 shadow-xl flex flex-col items-center transform transition hover:-translate-y-2 group"
      >
        <span className="text-8xl mb-4 font-bold group-hover:scale-110 transition-transform">1-20</span>
        <span className="text-2xl font-bold text-center">Count 1-20</span>
      </button>

      <button 
        onClick={() => onSelectActivity('adding')}
        className="flex-1 bg-purple-400 hover:bg-purple-500 text-purple-900 rounded-3xl p-8 shadow-xl flex flex-col items-center transform transition hover:-translate-y-2 group"
      >
        <span className="text-8xl mb-4 font-bold group-hover:scale-110 transition-transform">+</span >
        <span className="text-2xl font-bold text-center">Add Numbers</span>
      </button>

      <button 
        onClick={() => onSelectActivity('subtracting')}
        className="flex-1 bg-red-400 hover:bg-red-500 text-red-900 rounded-3xl p-8 shadow-xl flex flex-col items-center transform transition hover:-translate-y-2 group"
      >
        <span className="text-8xl mb-4 font-bold group-hover:scale-110 transition-transform"><Minus size={96} strokeWidth={3} /></span>
        {/* Adjusted font size to fit one line */}
        <span className="text-2xl font-bold text-center whitespace-nowrap">Subtract Numbers</span>
      </button>
    </div>
  </div>
);

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-white relative pb-16">
        <div className="absolute top-4 right-4">
          <Logo />
        </div>
        <h2 className="text-5xl font-bold text-green-600 mb-12">Great Job!</h2>
        <div className="flex gap-6">
          <MenuButton onClick={handleRestart} icon={<RotateCcw />} label="Replay" color="bg-blue-500" />
          <MenuButton onClick={onBack} icon={<ArrowLeft />} label="Back" color="bg-gray-500" />
          <MenuButton onClick={onHome} icon={<Home />} label="Home" color="bg-orange-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white w-full relative pb-16">
      <div className="absolute top-4 right-4">
        <Logo />
      </div>
      
      <div className="flex flex-col items-center transform -translate-y-16">
        {/* Fixed: Used inline style for massive font size instead of Tailwind arbitrary value */}
        <span className="font-bold text-black leading-none" style={{ fontSize: '20rem' }}>
          {number}
        </span>
        <span className="text-8xl font-bold text-gray-500 mt-4">
          {numberNames[number - 1]}
        </span>
      </div>

      <div className="absolute bottom-16 flex gap-8">
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="p-6 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200 shadow-lg active:scale-95 transition"
          title={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? <Play size={40} /> : <Pause size={40} />}
        </button>
        <button 
          onClick={handleRestart}
          className="p-6 bg-yellow-100 rounded-full text-yellow-600 hover:bg-yellow-200 shadow-lg active:scale-95 transition"
          title="Restart"
        >
          <RotateCcw size={40} />
        </button>
        <button 
          onClick={onBack}
          className="p-6 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 shadow-lg active:scale-95 transition"
          title="Back"
        >
          <ArrowLeft size={40} />
        </button>
        <button 
          onClick={onHome}
          className="p-6 bg-orange-100 rounded-full text-orange-600 hover:bg-orange-200 shadow-lg active:scale-95 transition"
          title="Home"
        >
          <Home size={40} />
        </button>
      </div>
    </div>
  );
};

const AddingGame = ({ onBack, onHome }) => {
  const [problem, setProblem] = useState({ a: 0, b: 0 });
  const [shapes, setShapes] = useState({ a: Circle, b: Square });
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect', or null
  const [countdown, setCountdown] = useState(5);
  const inputRef = useRef(null);

  const generateProblem = () => {
    // Modified to use numbers 1-6
    const a = Math.floor(Math.random() * 6) + 1;
    const b = Math.floor(Math.random() * 6) + 1;
    
    // Pick random shapes for visual aid
    const availableShapes = [Circle, Square, Triangle, Star, Hexagon, Heart, Smile];
    const shapeA = availableShapes[Math.floor(Math.random() * availableShapes.length)];
    const shapeB = availableShapes[Math.floor(Math.random() * availableShapes.length)];

    setProblem({ a, b });
    setShapes({ a: shapeA, b: shapeB });
    setUserAnswer('');
    setFeedback(null);
    setCountdown(5);
    // Focus input automatically
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    generateProblem();
  }, []);

  // Handle countdown when answer is correct
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
      // Countdown handled by useEffect
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 2000); // Clear incorrect msg after 2s
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
      <div className="absolute top-8 left-8 flex gap-4">
        <button onClick={onBack} className="p-3 bg-white rounded-full shadow text-gray-600 hover:bg-gray-100"><ArrowLeft /></button>
        <button onClick={onHome} className="p-3 bg-white rounded-full shadow text-gray-600 hover:bg-gray-100"><Home /></button>
      </div>

      <div className="absolute top-8 right-8 hidden md:block">
        <Logo />
      </div>

      <div className="bg-white p-12 rounded-3xl shadow-2xl flex flex-col items-center w-full max-w-3xl">
        {/* Math Problem Area */}
        <div className="flex items-start justify-center gap-4 mb-12">
          
          {/* Number A Column */}
          <div className="flex flex-col items-center">
            <span className="text-8xl font-bold text-gray-800">{problem.a}</span>
            {renderShapes(problem.a, shapes.a, "text-blue-400")}
          </div>

          <span className="text-8xl font-bold text-green-500 mt-2">+</span>

          {/* Number B Column */}
          <div className="flex flex-col items-center">
            <span className="text-8xl font-bold text-gray-800">{problem.b}</span>
            {renderShapes(problem.b, shapes.b, "text-purple-400")}
          </div>

          <span className="text-8xl font-bold text-gray-400 mt-2">=</span>

          {/* Answer Column */}
          <div className="flex flex-col items-center">
            <span className="text-8xl font-bold text-blue-600">?</span>
            {/* Empty space to align with shapes */}
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
            placeholder="" 
          />
          
          {feedback !== 'correct' && (
            <button 
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white text-3xl font-bold py-4 rounded-xl shadow-lg mt-4"
            >
              Check Answer
            </button>
          )}
        </form>

        {/* Feedback Area */}
        <div className="h-24 mt-8 flex items-center justify-center">
          {feedback === 'correct' && (
            <div className="text-green-500 text-4xl font-bold flex items-center gap-4 animate-bounce">
              <Check size={48} strokeWidth={4} />
              <span>Correct! Next in {countdown}...</span>
            </div>
          )}
          {feedback === 'incorrect' && (
            <div className="text-red-500 text-4xl font-bold animate-pulse">
              Try Again!
            </div>
          )}
        </div>
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
    // Use numbers 1-6
    const n1 = Math.floor(Math.random() * 6) + 1;
    const n2 = Math.floor(Math.random() * 6) + 1;
    
    // Ensure 'a' is always greater than or equal to 'b' for subtraction
    const a = Math.max(n1, n2);
    const b = Math.min(n1, n2);
    
    // Pick random shapes
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

    const diff = problem.a - problem.b;
    if (parseInt(userAnswer) === diff) {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 relative pb-16">
      <div className="absolute top-8 left-8 flex gap-4">
        <button onClick={onBack} className="p-3 bg-white rounded-full shadow text-gray-600 hover:bg-gray-100"><ArrowLeft /></button>
        <button onClick={onHome} className="p-3 bg-white rounded-full shadow text-gray-600 hover:bg-gray-100"><Home /></button>
      </div>

      <div className="absolute top-8 right-8 hidden md:block">
        <Logo />
      </div>

      <div className="bg-white p-12 rounded-3xl shadow-2xl flex flex-col items-center w-full max-w-3xl">
        {/* Math Problem Area */}
        <div className="flex items-start justify-center gap-4 mb-12">
          
          {/* Number A Column */}
          <div className="flex flex-col items-center">
            <span className="text-8xl font-bold text-gray-800">{problem.a}</span>
            {renderShapes(problem.a, shapes.a, "text-orange-400")}
          </div>

          <span className="text-8xl font-bold text-red-500 mt-2">-</span>

          {/* Number B Column */}
          <div className="flex flex-col items-center">
            <span className="text-8xl font-bold text-gray-800">{problem.b}</span>
            {renderShapes(problem.b, shapes.b, "text-yellow-500")}
          </div>

          <span className="text-8xl font-bold text-gray-400 mt-2">=</span>

          {/* Answer Column */}
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
            placeholder="" 
          />
          
          {feedback !== 'correct' && (
            <button 
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white text-3xl font-bold py-4 rounded-xl shadow-lg mt-4"
            >
              Check Answer
            </button>
          )}
        </form>

        {/* Feedback Area */}
        <div className="h-24 mt-8 flex items-center justify-center">
          {feedback === 'correct' && (
            <div className="text-green-500 text-4xl font-bold flex items-center gap-4 animate-bounce">
              <Check size={48} strokeWidth={4} />
              <span>Correct! Next in {countdown}...</span>
            </div>
          )}
          {feedback === 'incorrect' && (
            <div className="text-red-500 text-4xl font-bold animate-pulse">
              Try Again!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper button component for the menus
const MenuButton = ({ onClick, icon, label, color }) => (
  <button 
    onClick={onClick}
    className={`${color} text-white px-8 py-4 rounded-xl shadow-lg hover:brightness-110 flex items-center gap-2 text-xl font-bold transition transform active:scale-95`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default App;
