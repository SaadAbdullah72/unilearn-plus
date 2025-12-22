import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaVideo, FaQuestionCircle, FaSave, FaUpload, FaChevronDown } from 'react-icons/fa';

const AddEditCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 1. Basic Course Info
  const [courseInfo, setCourseInfo] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Development', // Default
    level: 'Beginner'
  });
  const [thumbnail, setThumbnail] = useState(null);

  // 2. Curriculum State
  const [modules, setModules] = useState([
    {
      title: "Module 1: Introduction",
      lessons: [{ title: "", video: null }],
      // Quiz structure with options
      quiz: [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }] 
    }
  ]);

  // --- HANDLERS ---
  const handleInfoChange = (e) => setCourseInfo({ ...courseInfo, [e.target.name]: e.target.value });

  // Modules
  const addModule = () => {
    setModules([...modules, { title: "", lessons: [], quiz: [] }]);
  };

  const removeModule = (index) => {
    const list = [...modules];
    list.splice(index, 1);
    setModules(list);
  };

  const handleModuleTitleChange = (e, index) => {
    const list = [...modules];
    list[index].title = e.target.value;
    setModules(list);
  };

  // Lessons
  const addLesson = (moduleIndex) => {
    const list = [...modules];
    list[moduleIndex].lessons.push({ title: "", video: null });
    setModules(list);
  };

  const handleLessonChange = (e, mIndex, lIndex, field) => {
    const list = [...modules];
    if (field === 'video') {
        list[mIndex].lessons[lIndex].video = e.target.files[0];
    } else {
        list[mIndex].lessons[lIndex].title = e.target.value;
    }
    setModules(list);
  };

  // Quiz
  const addQuiz = (moduleIndex) => {
    const list = [...modules];
    list[moduleIndex].quiz.push({ question: "", options: ["", "", "", ""], correctAnswer: 0 });
    setModules(list);
  };

  const handleQuizQuestionChange = (e, mIndex, qIndex) => {
    const list = [...modules];
    list[mIndex].quiz[qIndex].question = e.target.value;
    setModules(list);
  };

  const handleQuizOptionChange = (e, mIndex, qIndex, optionIndex) => {
    const list = [...modules];
    list[mIndex].quiz[qIndex].options[optionIndex] = e.target.value;
    setModules(list);
  };

  const handleCorrectAnswerChange = (e, mIndex, qIndex) => {
    const list = [...modules];
    list[mIndex].quiz[qIndex].correctAnswer = parseInt(e.target.value);
    setModules(list);
  };

  // --- SUBMIT LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', courseInfo.title);
    formData.append('description', courseInfo.description);
    formData.append('price', courseInfo.price);
    formData.append('category', courseInfo.category);
    if (thumbnail) formData.append('image', thumbnail);

    // Prepare JSON data (excluding file objects)
    const modulesTextData = modules.map(m => ({
        title: m.title,
        quiz: m.quiz, // Full quiz data goes here
        lessons: m.lessons.map(l => ({ title: l.title })) 
    }));
    formData.append('modules', JSON.stringify(modulesTextData));

    // Append Video Files
    modules.forEach((mod, mIndex) => {
        mod.lessons.forEach((less, lIndex) => {
            if (less.video) {
                formData.append(`video_${mIndex}_${lIndex}`, less.video);
            }
        });
    });

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      formData.append('instructorId', user._id);
      formData.append('instructorName', user.name);

      await axios.post('/api/courses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("✅ Course Published Successfully!");
      navigate('/'); // Go to Home Page (Where it will show up instantly)
    } catch (err) {
      console.error(err);
      alert("❌ Upload Failed: " + err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 pt-24 px-4 pb-20 flex justify-center font-sans">
        <div className="w-full max-w-5xl">
            
            <h1 className="text-4xl font-black text-white mb-8 tracking-tight border-b border-white/10 pb-6">
                <span className="text-cyan-500">INSTRUCTOR</span> CONSOLE
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* 1. BASIC DETAILS */}
                <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <span className="bg-cyan-900/30 text-cyan-400 w-8 h-8 rounded flex items-center justify-center text-sm">01</span>
                        Course Metadata
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Course Title</label>
                            <input required type="text" name="title" onChange={handleInfoChange} placeholder="e.g. Master Advanced React Patterns" className="w-full bg-black border border-white/20 p-4 rounded-xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition" />
                        </div>
                        
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Category</label>
                            <div className="relative">
                                <select name="category" onChange={handleInfoChange} className="w-full bg-black border border-white/20 p-4 rounded-xl text-white appearance-none outline-none focus:border-cyan-500">
                                    <option value="Development">Development</option>
                                    <option value="Design">Design</option>
                                    <option value="Business">Business</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="AI">AI & Data Science</option>
                                </select>
                                <FaChevronDown className="absolute right-4 top-5 text-slate-500 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Price (PKR)</label>
                            <input required type="number" name="price" onChange={handleInfoChange} placeholder="5000" className="w-full bg-black border border-white/20 p-4 rounded-xl text-white focus:border-cyan-500 outline-none transition" />
                        </div>

                        <div className="col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Description</label>
                            <textarea required name="description" onChange={handleInfoChange} rows="4" className="w-full bg-black border border-white/20 p-4 rounded-xl text-white focus:border-cyan-500 outline-none transition"></textarea>
                        </div>

                        <div className="col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Thumbnail Image</label>
                            <div className="relative border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-cyan-500/50 hover:bg-cyan-900/5 transition cursor-pointer group">
                                <input type="file" onChange={(e) => setThumbnail(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                                <FaUpload className="mx-auto text-3xl mb-3 text-slate-600 group-hover:text-cyan-400 transition" />
                                <p className="text-sm text-slate-400 group-hover:text-white transition">Click to upload cover image</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. CURRICULUM */}
                <div className="space-y-6">
                    <div className="flex justify-between items-end">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="bg-purple-900/30 text-purple-400 w-8 h-8 rounded flex items-center justify-center text-sm">02</span>
                            Curriculum Builder
                        </h3>
                        <button type="button" onClick={addModule} className="bg-white text-black px-5 py-2 rounded-lg font-bold text-xs uppercase hover:bg-cyan-400 transition shadow-lg shadow-white/10">+ Add Module</button>
                    </div>

                    {modules.map((module, mIndex) => (
                        <div key={mIndex} className="bg-[#0f0f0f] border border-white/10 p-6 rounded-2xl relative shadow-lg">
                            <button type="button" onClick={() => removeModule(mIndex)} className="absolute top-4 right-4 text-slate-600 hover:text-red-500 transition"><FaTrash /></button>

                            {/* Module Title */}
                            <div className="mb-8">
                                <label className="text-[10px] font-bold text-purple-400 uppercase block mb-2 tracking-widest">Module {mIndex + 1}</label>
                                <input type="text" value={module.title} onChange={(e) => handleModuleTitleChange(e, mIndex)} placeholder="Module Title (e.g. Intro to React)" className="w-full bg-black border border-white/20 p-3 rounded-lg text-white focus:border-purple-500 outline-none font-bold text-lg" />
                            </div>

                            {/* Lessons */}
                            <div className="space-y-4 mb-8 pl-4 border-l-2 border-white/10">
                                {module.lessons.map((lesson, lIndex) => (
                                    <div key={lIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-black/40 p-4 rounded-lg border border-white/5">
                                        <input type="text" value={lesson.title} onChange={(e) => handleLessonChange(e, mIndex, lIndex, 'title')} placeholder={`Lesson ${lIndex + 1} Title`} className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                                        <input type="file" accept="video/*" onChange={(e) => handleLessonChange(e, mIndex, lIndex, 'video')} className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-cyan-900/30 file:text-cyan-400 hover:file:bg-cyan-900/50" />
                                    </div>
                                ))}
                                <button type="button" onClick={() => addLesson(mIndex)} className="text-xs font-bold text-cyan-500 flex items-center gap-2 hover:text-white transition mt-2">
                                    <div className="w-6 h-6 rounded-full bg-cyan-900/30 flex items-center justify-center"><FaVideo size={10}/></div>
                                    Add Video Lesson
                                </button>
                            </div>

                            {/* Quiz Section */}
                            <div className="bg-black/30 p-6 rounded-xl border border-dashed border-white/10">
                                <h4 className="text-sm font-bold text-slate-300 mb-6 flex items-center gap-2"><FaQuestionCircle className="text-yellow-500" /> Module Quiz</h4>
                                {module.quiz.map((q, qIndex) => (
                                    <div key={qIndex} className="mb-6 p-4 bg-black rounded-lg border border-white/5">
                                        <input type="text" value={q.question} onChange={(e) => handleQuizQuestionChange(e, mIndex, qIndex)} placeholder="Question Text?" className="w-full bg-transparent border-b border-white/20 p-2 text-sm text-white mb-4 focus:border-yellow-500 outline-none" />
                                        
                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                            {q.options.map((opt, oIndex) => (
                                                <input key={oIndex} type="text" value={opt} onChange={(e) => handleQuizOptionChange(e, mIndex, qIndex, oIndex)} placeholder={`Option ${oIndex + 1}`} className="bg-[#111] border border-white/10 p-2 rounded text-xs text-slate-300 focus:border-white/40 outline-none" />
                                            ))}
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-slate-500">Correct Option (1-4):</span>
                                            <select onChange={(e) => handleCorrectAnswerChange(e, mIndex, qIndex)} className="bg-[#111] border border-white/10 text-white text-xs p-1 rounded">
                                                <option value={0}>Option 1</option>
                                                <option value={1}>Option 2</option>
                                                <option value={2}>Option 3</option>
                                                <option value={3}>Option 4</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addQuiz(mIndex)} className="text-xs font-bold text-yellow-500 hover:text-white transition">+ Add Question</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* SUBMIT */}
                <div className="pt-8 border-t border-white/10 sticky bottom-0 bg-[#050505] py-4 z-10">
                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl text-lg uppercase tracking-widest transition flex items-center justify-center gap-3 shadow-2xl">
                        {loading ? <span className="animate-pulse">🚀 UPLOADING TO CLOUD...</span> : <><FaSave /> PUBLISH COURSE</>}
                    </button>
                </div>

            </form>
        </div>
    </div>
  );
};

export default AddEditCourse;