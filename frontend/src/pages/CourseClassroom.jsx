import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    FaPlay, FaCheckCircle, FaQuestionCircle, FaChevronDown, 
    FaArrowLeft, FaTrophy, FaLightbulb, FaRedo 
} from 'react-icons/fa';

const CourseClassroom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Data States
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Navigation States
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLesson, setActiveLesson] = useState(null); // Video Lesson
  const [viewMode, setViewMode] = useState('video'); // 'video' or 'quiz'

  // Quiz States
  const [currentQuiz, setCurrentQuiz] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    axios.get(`/api/courses/${id}`)
      .then(res => {
        setCourse(res.data.data);
        // Default Play First Lesson
        if (res.data.data.modules?.length > 0) {
            const firstModule = res.data.data.modules[0];
            if (firstModule.lessons?.length > 0) {
                setActiveLesson(firstModule.lessons[0]);
            }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [id]);

  // --- QUIZ LOGIC ---
  const handleStartQuiz = (moduleIndex) => {
      const moduleQuizzes = course.modules[moduleIndex].quiz;
      if (moduleQuizzes && moduleQuizzes.length > 0) {
          setCurrentQuiz(moduleQuizzes);
          setViewMode('quiz');
          setQuizSubmitted(false);
          setUserAnswers({});
          setScore(0);
      } else {
          alert("No quiz available for this module.");
      }
  };

  const handleOptionSelect = (qIndex, optionIndex) => {
      if (quizSubmitted) return; 
      setUserAnswers(prev => ({
          ...prev,
          [qIndex]: optionIndex
      }));
  };

  const handleSubmitQuiz = () => {
      let newScore = 0;
      currentQuiz.forEach((q, index) => {
          if (userAnswers[index] === q.correctAnswer) {
              newScore++;
          }
      });
      setScore(newScore);
      setQuizSubmitted(true);
  };

  if (loading) return (
      <div className="h-screen bg-black flex items-center justify-center text-cyan-500 animate-pulse font-mono">
          LOADING CLASSROOM...
      </div>
  );

  if (!course) return <div className="text-white text-center mt-20">Course Not Found</div>;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-slate-200 font-sans overflow-hidden">
      
      {/* ================= LEFT: MAIN CONTENT AREA (Video/Quiz) ================= */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Top Bar */}
        <div className="h-16 border-b border-white/10 flex items-center px-6 justify-between bg-[#0a0a0a]">
            <button onClick={() => navigate('/my-learning')} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition">
                <FaArrowLeft /> Dashboard
            </button>
            <h1 className="text-sm font-bold text-slate-300 tracking-wide line-clamp-1">{course.title}</h1>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto bg-black relative">
            
            {/* --- VIEW 1: VIDEO PLAYER --- */}
            {viewMode === 'video' && activeLesson && (
                <div className="w-full h-full flex flex-col">
                    <div className="w-full bg-black aspect-video max-h-[70vh] relative shadow-2xl">
                        <video 
                            key={activeLesson.videoUrl} 
                            controls 
                            autoPlay
                            className="w-full h-full object-contain"
                            // 👇 MAIN CHANGE: Removed localhost prefix for Cloudinary Support
                            src={activeLesson.videoUrl} 
                        >
                        </video>
                    </div>
                    <div className="p-8 max-w-4xl mx-auto w-full">
                        <h2 className="text-2xl font-bold text-white mb-2">{activeLesson.title}</h2>
                        <p className="text-slate-500 text-sm mb-6 border-b border-white/10 pb-4">
                            Lesson from module: <span className="text-cyan-500">{course.modules[activeModuleIndex].title}</span>
                        </p>
                        <div className="bg-[#111] p-6 rounded-xl border border-white/10 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Ready for a challenge?</h3>
                                <p className="text-sm text-slate-400">Test your knowledge of this module.</p>
                            </div>
                            <button 
                                onClick={() => handleStartQuiz(activeModuleIndex)}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition flex items-center gap-2"
                            >
                                <FaQuestionCircle /> Take Module Quiz
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- VIEW 2: QUIZ INTERFACE --- */}
            {viewMode === 'quiz' && (
                <div className="p-8 max-w-3xl mx-auto w-full">
                    <div className="mb-8 flex justify-between items-center">
                        <h2 className="text-3xl font-black text-white">Module Quiz</h2>
                        <button onClick={() => setViewMode('video')} className="text-sm text-slate-400 hover:text-white underline">Cancel & Return</button>
                    </div>

                    <div className="space-y-8">
                        {currentQuiz.map((q, qIndex) => (
                            <div key={qIndex} className="bg-[#111] p-6 rounded-2xl border border-white/10">
                                <h3 className="text-lg font-bold text-slate-200 mb-4 flex gap-3">
                                    <span className="text-cyan-500">Q{qIndex + 1}.</span> 
                                    {q.question}
                                </h3>
                                
                                <div className="space-y-2">
                                    {q.options.map((option, optIndex) => {
                                        let optionClass = "bg-black border-white/10 text-slate-400 hover:bg-white/5";
                                        
                                        if (quizSubmitted) {
                                            if (optIndex === q.correctAnswer) {
                                                optionClass = "bg-green-900/20 border-green-500 text-green-400 font-bold";
                                            } else if (userAnswers[qIndex] === optIndex && optIndex !== q.correctAnswer) {
                                                optionClass = "bg-red-900/20 border-red-500 text-red-400";
                                            }
                                        } else if (userAnswers[qIndex] === optIndex) {
                                            optionClass = "bg-indigo-600 text-white border-indigo-500";
                                        }

                                        return (
                                            <div 
                                                key={optIndex}
                                                onClick={() => handleOptionSelect(qIndex, optIndex)}
                                                className={`p-4 rounded-lg border cursor-pointer transition flex justify-between items-center ${optionClass}`}
                                            >
                                                <span>{option}</span>
                                                {quizSubmitted && optIndex === q.correctAnswer && <FaCheckCircle />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 p-6 bg-slate-900 rounded-xl border border-white/10 sticky bottom-6 shadow-2xl">
                        {!quizSubmitted ? (
                            <button 
                                onClick={handleSubmitQuiz}
                                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-lg tracking-wider transition"
                            >
                                SUBMIT ANSWERS
                            </button>
                        ) : (
                            <div className="text-center">
                                <div className="inline-block p-4 rounded-full bg-slate-800 mb-4">
                                    <FaTrophy className="text-4xl text-yellow-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    You Scored {score} / {currentQuiz.length}
                                </h3>
                                <p className="text-slate-400 mb-6">
                                    {score === currentQuiz.length ? "Perfect Score! 🎉" : "Keep practicing! 💪"}
                                </p>
                                <button 
                                    onClick={() => handleStartQuiz(activeModuleIndex)}
                                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold mr-4"
                                >
                                    <FaRedo className="inline mr-2"/> Retry
                                </button>
                                <button 
                                    onClick={() => setViewMode('video')}
                                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold"
                                >
                                    Back to Lesson
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
      </div>

      {/* ================= RIGHT: CURRICULUM SIDEBAR ================= */}
      <div className="w-full lg:w-96 bg-[#080808] border-l border-white/10 flex flex-col h-full">
        
        <div className="p-6 border-b border-white/10 bg-[#050505]">
            <h2 className="font-bold text-slate-200">Course Content</h2>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>{course.modules.length} Modules</span>
                <span>{Math.floor(Math.random() * 90) + 10}% Completed</span>
            </div>
            <div className="w-full h-1 bg-slate-800 mt-3 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 w-1/4"></div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {course.modules.map((module, mIndex) => (
                <div key={mIndex} className="rounded-xl overflow-hidden bg-[#111] border border-white/5">
                    <button 
                        onClick={() => setActiveModuleIndex(activeModuleIndex === mIndex ? null : mIndex)}
                        className={`w-full p-4 flex justify-between items-center text-sm font-bold transition ${
                            activeModuleIndex === mIndex ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50'
                        }`}
                    >
                        <span>Section {mIndex + 1}: {module.title}</span>
                        <FaChevronDown className={`transform transition ${activeModuleIndex === mIndex ? 'rotate-180' : ''}`} />
                    </button>

                    {activeModuleIndex === mIndex && (
                        <div className="bg-black/40 py-2">
                            {module.lessons.map((lesson, lIndex) => (
                                <button 
                                    key={lIndex}
                                    onClick={() => {
                                        setActiveLesson(lesson);
                                        setViewMode('video');
                                    }}
                                    className={`w-full flex items-center gap-3 p-3 pl-6 text-xs transition border-l-2 ${
                                        activeLesson === lesson && viewMode === 'video'
                                        ? 'border-cyan-500 bg-cyan-900/10 text-cyan-400' 
                                        : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${activeLesson === lesson ? 'border-cyan-500' : 'border-slate-600'}`}>
                                        {activeLesson === lesson ? <FaPlay className="text-[8px]" /> : <span className="text-[8px]">{lIndex + 1}</span>}
                                    </div>
                                    <span className="line-clamp-1 text-left flex-1">{lesson.title}</span>
                                    <span className="text-[10px] text-slate-600">10m</span>
                                </button>
                            ))}
                            
                            <button 
                                onClick={() => handleStartQuiz(mIndex)}
                                className={`w-full flex items-center gap-3 p-3 pl-6 text-xs transition border-l-2 border-transparent hover:bg-indigo-900/20 ${viewMode === 'quiz' ? 'text-indigo-400' : 'text-slate-500'}`}
                            >
                                <div className="w-5 h-5 rounded-full flex items-center justify-center border border-indigo-500/50 text-indigo-500">
                                    <FaQuestionCircle className="text-[10px]" />
                                </div>
                                <span className="font-bold">Module Quiz</span>
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>

      </div>

    </div>
  );
};

export default CourseClassroom;