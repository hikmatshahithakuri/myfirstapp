
import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, UserRole, Student, Subject, Marks, Section, Term, Conduct, 
  StudentReport, SubjectResult, TermData, Expense 
} from './types';
import { calculateSubjectResult, calculateGPA } from './services/gradingService';
import { StorageService } from './services/storageService';
import { GoogleGenAI } from "@google/genai";
import { 
  LayoutDashboard, Users, BookOpen, ClipboardCheck, GraduationCap, 
  LogOut, Plus, Trash2, UserCheck, Calendar, Printer, X, LayoutTemplate, 
  Layers, Wallet, TrendingDown, PieChart, Menu, Save, RefreshCw, Wand2, Loader2,
  Settings, ShieldAlert, Sparkles, ChevronRight, CheckCircle2, Award
} from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [allMarks, setAllMarks] = useState<Marks[]>([]);
  const [allTermData, setAllTermData] = useState<TermData[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentTerm, setCurrentTerm] = useState<Term>(Term.FIRST);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'subjects' | 'marks' | 'results' | 'users' | 'expenses' | 'settings'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setUsers(StorageService.getUsers());
    setStudents(StorageService.getStudents());
    setSubjects(StorageService.getSubjects());
    setAllMarks(StorageService.getMarks());
    setAllTermData(StorageService.getTermData());
    setExpenses(StorageService.getExpenses());
  }, []);

  const saveAllData = () => {
    StorageService.saveMarks(allMarks);
    StorageService.saveTermData(allTermData);
    StorageService.saveStudents(students);
    StorageService.saveSubjects(subjects);
    StorageService.saveExpenses(expenses);
    StorageService.saveUsers(users);
  };

  const handleLogin = (e: React.FormEvent, form: any) => {
    e.preventDefault();
    const user = users.find(u => u.username === form.username && u.password === form.password);
    if (user) setCurrentUser(user); else alert('Invalid credentials');
  };

  const currentReports = useMemo(() => {
    return students.map(student => {
      const results = subjects.map(sub => {
        const m = allMarks.find(mk => mk.studentId === student.id && mk.subjectId === sub.id && mk.term === currentTerm) || 
                  { studentId: student.id, subjectId: sub.id, term: currentTerm, theoryObtained: 0, practicalObtained: 0 };
        return calculateSubjectResult(sub, m);
      });
      const td = allTermData.find(t => t.studentId === student.id && t.term === currentTerm) || 
                 { studentId: student.id, term: currentTerm, attendancePresent: 0, attendanceTotal: 0, conduct: Conduct.GOOD };
      return {
        student, term: currentTerm, results,
        gpa: calculateGPA(results),
        hasNG: results.some(r => r.isNG),
        ...td
      } as StudentReport;
    });
  }, [students, subjects, allMarks, allTermData, currentTerm]);

  if (!currentUser) return <Login onLogin={handleLogin} />;

  const isAdmin = currentUser.role === UserRole.ADMIN;

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] text-[#1e293b]">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#020617] text-white transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} print-hidden shadow-2xl`}>
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl"><GraduationCap className="w-8 h-8" /></div>
              <span className="font-black text-xl tracking-tighter">KANKALI PRO</span>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <SidebarLink icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarLink icon={<Users />} label="Students" active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
            <SidebarLink icon={<BookOpen />} label="Subjects" active={activeTab === 'subjects'} onClick={() => setActiveTab('subjects')} />
            <SidebarLink icon={<ClipboardCheck />} label="Marks Entry" active={activeTab === 'marks'} onClick={() => setActiveTab('marks')} />
            <SidebarLink icon={<Layers />} label="Results" active={activeTab === 'results'} onClick={() => setActiveTab('results')} />
            <SidebarLink icon={<Wallet />} label="Expenses" active={activeTab === 'expenses'} onClick={() => setActiveTab('expenses')} />
            {isAdmin && <SidebarLink icon={<ShieldAlert />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />}
          </nav>
          <div className="p-6 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black">{currentUser.name.charAt(0)}</div>
              <p className="font-bold text-xs">{currentUser.name}</p>
            </div>
            <button onClick={() => setCurrentUser(null)} className="p-2 text-slate-500 hover:text-red-400"><LogOut size={20} /></button>
          </div>
        </div>
      </aside>

      <main className="flex-1 lg:ml-72 min-h-screen flex flex-col w-full">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 p-6 flex justify-between items-center print-hidden">
          <h2 className="text-xl font-black text-slate-800 tracking-tighter uppercase">{activeTab}</h2>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <Calendar className="w-4 h-4 m-2 text-blue-600" />
            <select className="bg-transparent font-black text-[10px] text-slate-600 outline-none uppercase tracking-widest px-2" value={currentTerm} onChange={e => setCurrentTerm(e.target.value as Term)}>
              {Object.values(Term).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </header>

        <div className="p-4 lg:p-8 flex-1">
          {activeTab === 'dashboard' && <Dashboard reports={currentReports} expenses={expenses} />}
          {activeTab === 'students' && <StudentManager students={students} setStudents={setStudents} isAdmin={isAdmin} />}
          {activeTab === 'subjects' && <SubjectManager subjects={subjects} setSubjects={setSubjects} isAdmin={isAdmin} />}
          {activeTab === 'marks' && <MarksEntry students={students} subjects={subjects} marks={allMarks} setMarks={setAllMarks} termData={allTermData} setTermData={setAllTermData} currentTerm={currentTerm} onSave={saveAllData} />}
          {activeTab === 'results' && <Results reports={currentReports} subjects={subjects} currentTerm={currentTerm} />}
          {activeTab === 'expenses' && <ExpenseManager expenses={expenses} setExpenses={setExpenses} />}
          {activeTab === 'settings' && <SettingsPage clearData={StorageService.clearAll} />}
        </div>
      </main>
    </div>
  );
};

const SidebarLink = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all font-bold ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-900 hover:text-white'}`}>
    {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
    <span className="text-sm">{label}</span>
  </button>
);

const MarksEntry = ({ students, subjects, marks, setMarks, termData, setTermData, currentTerm, onSave }: any) => {
  const [sec, setSec] = useState(Section.A);
  const [isSaving, setIsSaving] = useState(false);
  const filtered = students.filter((s:any) => s.section === sec).sort((a:any, b:any) => parseInt(a.rollNo) - parseInt(b.rollNo));

  const updateMark = (sid: string, subid: string, type: 'th' | 'pr', val: string) => {
    const n = parseFloat(val) || 0;
    setMarks((prev: any) => {
      const idx = prev.findIndex((m:any) => m.studentId === sid && m.subjectId === subid && m.term === currentTerm);
      if (idx > -1) {
        const copy = [...prev];
        if (type === 'th') copy[idx].theoryObtained = n; else copy[idx].practicalObtained = n;
        return copy;
      }
      return [...prev, { studentId: sid, subjectId: subid, term: currentTerm, theoryObtained: type === 'th' ? n : 0, practicalObtained: type === 'pr' ? n : 0 }];
    });
  };

  const updateTD = (sid: string, field: string, val: any) => {
    setTermData((prev: any) => {
      const idx = prev.findIndex((td: any) => td.studentId === sid && td.term === currentTerm);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx][field] = val;
        return copy;
      }
      return [...prev, { studentId: sid, term: currentTerm, [field]: val }];
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    onSave();
    setTimeout(() => {
      setIsSaving(false);
      alert('Data persisted successfully to storage!');
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex bg-white p-1 rounded-xl border border-slate-200">
          {[Section.A, Section.B].map(s => (
            <button key={s} onClick={() => setSec(s)} className={`px-8 py-2 rounded-lg font-black transition-all ${sec === s ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Section {s}</button>
          ))}
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl font-black shadow-lg hover:bg-green-700 hover:scale-105 active:scale-95 transition-all">
          {isSaving ? <Loader2 className="animate-spin" /> : <Save />} {isSaving ? 'Persisting...' : 'Save & Persistence'}
        </button>
      </div>
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto marks-table-container">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-[#020617] text-white text-[10px] font-black uppercase tracking-widest">
                <th className="p-5 sticky left-0 z-20 bg-[#020617] border-r border-slate-800">Student Identity</th>
                {subjects.map((sub:any) => <th key={sub.id} className="p-4 border-l border-slate-800 text-center">{sub.name}<br/><span className="text-[8px] opacity-40">Theory / Practical</span></th>)}
                <th className="p-4 border-l border-slate-800 text-center">Attendance<br/><span className="text-[8px] opacity-40">P / T</span></th>
                <th className="p-4 border-l border-slate-800 text-center">Conduct</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s:any) => {
                const td = termData.find((t: any) => t.studentId === s.id && t.term === currentTerm) || { attendancePresent: 0, attendanceTotal: 0, conduct: Conduct.GOOD };
                return (
                  <tr key={s.id} className="border-b border-slate-50 hover:bg-blue-50/50 transition-colors group">
                    <td className="p-4 font-black text-slate-800 sticky left-0 bg-white group-hover:bg-blue-50 border-r border-slate-100 text-xs whitespace-nowrap">
                      <span className="text-slate-400 mr-2 tabular-nums">{s.rollNo}.</span>
                      <span className="uppercase">{s.name}</span>
                    </td>
                    {subjects.map((sub:any) => {
                      const m = marks.find((mk:any) => mk.studentId === s.id && mk.subjectId === sub.id && mk.term === currentTerm) || { theoryObtained: 0, practicalObtained: 0 };
                      return (
                        <td key={sub.id} className="p-2 border-l border-slate-100">
                          <div className="flex gap-1 justify-center">
                            <input type="number" className={`w-11 p-1.5 border rounded text-center text-xs font-black tabular-nums outline-none transition-all ${m.theoryObtained < sub.passMarksTheory ? 'bg-red-50 border-red-200 text-red-600' : 'bg-slate-50 border-slate-200 focus:border-blue-500'}`} value={m.theoryObtained} onChange={e => updateMark(s.id, sub.id, 'th', e.target.value)} />
                            <input type="number" className={`w-11 p-1.5 border rounded text-center text-xs font-black tabular-nums outline-none transition-all ${m.practicalObtained < sub.passMarksPractical ? 'bg-red-50 border-red-200 text-red-600' : 'bg-blue-50 border-blue-200 focus:border-blue-500'}`} value={m.practicalObtained} onChange={e => updateMark(s.id, sub.id, 'pr', e.target.value)} />
                          </div>
                        </td>
                      );
                    })}
                    <td className="p-2 border-l border-slate-100">
                      <div className="flex gap-1 justify-center">
                        <input type="number" className="w-10 p-1.5 bg-slate-50 border border-slate-200 rounded text-center text-xs font-bold tabular-nums" value={td.attendancePresent} onChange={e => updateTD(s.id, 'attendancePresent', parseInt(e.target.value) || 0)} />
                        <span className="self-center text-slate-300 font-bold">/</span>
                        <input type="number" className="w-10 p-1.5 bg-slate-50 border border-slate-200 rounded text-center text-xs font-bold tabular-nums" value={td.attendanceTotal} onChange={e => updateTD(s.id, 'attendanceTotal', parseInt(e.target.value) || 0)} />
                      </div>
                    </td>
                    <td className="p-2 border-l border-slate-100">
                      <select className="w-full bg-slate-100 p-1.5 rounded border-none text-[9px] font-black uppercase tracking-tight" value={td.conduct} onChange={e => updateTD(s.id, 'conduct', e.target.value as Conduct)}>
                        {Object.values(Conduct).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Results = ({ reports, subjects, currentTerm }: any) => {
  const [selectedReport, setSelectedReport] = useState<StudentReport | null>(null);
  const [sec, setSec] = useState(Section.A);
  const filtered = reports.filter((r:any) => r.student.section === sec).sort((a:any, b:any) => parseInt(a.student.rollNo) - parseInt(b.student.rollNo));

  const injectPrint = (content: React.ReactNode) => {
    const el = document.getElementById('print-layer');
    if (!el) return;
    el.classList.remove('hidden');
    el.innerHTML = '';
    import('react-dom/client').then(({ createRoot }) => {
      const container = document.createElement('div');
      el.appendChild(container);
      const root = createRoot(container);
      root.render(<div className="print-wrapper">{content}</div>);
      setTimeout(() => {
        window.print();
        el.classList.add('hidden');
      }, 800);
    });
  };

  const printBatch = () => injectPrint(
    <div className="print-area">
      {filtered.map((r: any) => (
        <div className="marksheet-page" key={r.student.id}>
          <GradeSheet report={r} />
        </div>
      ))}
    </div>
  );

  const printSingle = (report: StudentReport) => injectPrint(
    <div className="print-area">
      <div className="marksheet-page">
        <GradeSheet report={report} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {[Section.A, Section.B].map(s => (
            <button key={s} onClick={() => setSec(s)} className={`px-8 py-2 rounded-lg font-black transition-all ${sec === s ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Section {s}</button>
          ))}
        </div>
        <button onClick={printBatch} className="flex items-center gap-2 bg-[#020617] text-white px-8 py-3 rounded-xl font-black shadow-lg uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all"><Printer size={16} /> Batch Print Marksheets</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((r:any) => (
          <div key={r.student.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
             <div className="flex justify-between mb-4">
               <span className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center font-black text-slate-300 tabular-nums">{r.student.rollNo}</span>
               <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${r.hasNG ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                 {r.hasNG ? 'Non-Graded' : 'Qualified'}
               </div>
             </div>
             <h4 className="font-black text-slate-800 uppercase text-xs mb-1 tracking-tight">{r.student.name}</h4>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">GPA: <span className="text-blue-600 text-sm">{(r.hasNG ? 0.00 : r.gpa).toFixed(2)}</span></p>
             <div className="flex gap-2">
               <button onClick={() => setSelectedReport(r)} className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm">Preview</button>
               <button onClick={() => printSingle(r)} className="px-4 py-3 bg-slate-100 text-slate-400 rounded-xl hover:bg-[#020617] hover:text-white transition-all"><Printer size={16} /></button>
             </div>
          </div>
        ))}
      </div>

      {selectedReport && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 print:hidden animate-in fade-in duration-300">
          <div className="absolute top-6 right-6 flex gap-3">
             <button onClick={() => printSingle(selectedReport)} className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 shadow-2xl hover:bg-green-700 hover:scale-105 active:scale-95 transition-all uppercase text-xs tracking-widest"><Printer size={20} /> Final Print Now</button>
             <button onClick={() => setSelectedReport(null)} className="p-4 bg-white/10 text-white rounded-full hover:bg-red-600 transition-all border border-white/10"><X size={28} /></button>
          </div>
          <div className="bg-white rounded-[3rem] w-full max-w-[210mm] max-h-[90vh] overflow-y-auto shadow-[0_0_100px_rgba(0,0,0,0.4)] p-4 border border-white/20">
             <div className="preview-scale flex justify-center py-6">
               <GradeSheet report={selectedReport} />
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const GradeSheet = ({ report }: { report: StudentReport }) => {
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);

  const generateAI = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const summary = report.results.map(r => `${r.subjectName}: ${r.finalGrade}`).join(", ");
      const prompt = `Write a professional teacher remark for ${report.student.name} (GPA ${report.gpa}) for Grade 6 at Kankali Secondary School. Be brief (one sentence). Performance: ${summary}. Supportive but official.`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      setRemark(response.text || "Good effort.");
    } catch {
      setRemark("The student shows consistent dedication to their studies and has achieved commendable results. Maintain this focus for future success.");
    } finally { setLoading(false); }
  };

  return (
    <div className="p-8 text-black bg-white w-[210mm] min-h-[297mm] mx-auto font-serif relative border-[6px] border-double border-slate-900 box-border">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-8 border-b-[3px] border-slate-900 pb-6 text-center">
        <div className="flex items-center justify-between w-full mb-4">
           <div className="w-24 h-24 border-2 border-slate-900 rounded-2xl flex items-center justify-center font-black text-[9px] p-2 italic leading-tight uppercase opacity-60">LOGO</div>
           <div className="flex-1 px-4">
             <h1 className="text-3xl font-black uppercase tracking-tight font-sans text-slate-900">Shree Kankali Secondary School</h1>
             <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-1 text-slate-700">Chandragiri-13, Kathmandu, Nepal</p>
             <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">ESTD: 2045 | Bagmati Province</p>
           </div>
           <div className="w-24 h-24 border-2 border-slate-900 rounded-full flex items-center justify-center font-black text-[10px] p-2 italic leading-tight uppercase opacity-60">STAMP</div>
        </div>
        <div className="w-full flex items-center gap-4 my-2">
           <div className="h-[2px] flex-1 bg-slate-900"></div>
           <h2 className="text-xl font-black uppercase tracking-[0.6em] font-sans bg-slate-900 text-white px-8 py-1 rounded-sm">Grade Sheet</h2>
           <div className="h-[2px] flex-1 bg-slate-900"></div>
        </div>
        <p className="text-xs font-black uppercase tracking-[0.2em] italic text-slate-800 mt-2">{report.term} Assessment - 2082</p>
      </div>

      {/* Student Details Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8 border-2 border-slate-900 p-6 rounded-2xl bg-slate-50/40">
        <div className="col-span-2">
           <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Student Full Name</p>
           <p className="text-lg font-black uppercase underline underline-offset-4 decoration-slate-300 font-sans">{report.student.name}</p>
        </div>
        <div className="text-center">
           <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Section / House</p>
           <p className="text-lg font-black uppercase font-sans">6 "{report.student.section}"</p>
        </div>
        <div className="text-right">
           <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Roll Number</p>
           <p className="text-2xl font-black tabular-nums font-sans">{report.student.rollNo}</p>
        </div>
      </div>

      {/* Main Grades Table */}
      <table className="w-full border-collapse border-2 border-slate-900 text-xs mb-10 shadow-sm">
        <thead className="bg-slate-900 text-white font-sans text-[10px] uppercase">
          <tr>
            <th className="border border-slate-800 p-3 text-left w-16">Code</th>
            <th className="border border-slate-800 p-3 text-left">Subject Description</th>
            <th className="border border-slate-800 p-3 text-center w-14">Credit</th>
            <th className="border border-slate-800 p-3 text-center w-20 bg-slate-800">Final Grade</th>
            <th className="border border-slate-800 p-3 text-center w-20">Grade Point</th>
          </tr>
        </thead>
        <tbody>
          {report.results.map((res: any) => (
            <tr key={res.subjectCode} className="border-b border-slate-900 group hover:bg-slate-50">
              <td className="p-3 border-r border-slate-900 text-center font-bold text-slate-500 tabular-nums">{res.subjectCode}</td>
              <td className="p-3 border-r border-slate-900 font-black uppercase font-sans tracking-tight">{res.subjectName}</td>
              <td className="p-3 border-r border-slate-900 text-center font-bold tabular-nums">{res.creditHour.toFixed(2)}</td>
              <td className={`p-3 border-r border-slate-900 text-center font-black text-lg font-sans ${res.isNG ? 'text-red-600 bg-red-50' : 'bg-slate-50'}`}>
                {res.finalGrade}
              </td>
              <td className="p-3 text-center font-bold tabular-nums">{res.finalGP.toFixed(1)}</td>
            </tr>
          ))}
          <tr className="bg-slate-900 text-white font-black border-t-2 border-slate-900 font-sans">
            <td colSpan={3} className="p-4 text-right uppercase text-[9px] tracking-widest bg-slate-800">Grade Point Average (GPA)</td>
            <td colSpan={2} className="p-4 text-center text-2xl bg-white text-slate-900 border-l-2 border-slate-900 tabular-nums shadow-inner">
               {(report.hasNG ? 0.00 : report.gpa).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Secondary Data & Signatures */}
      <div className="flex gap-8 mb-20 px-4">
        <div className="w-40 flex flex-col gap-3">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Attendance Record</p>
          <div className="border-2 border-slate-900 p-4 rounded-2xl bg-white shadow-md text-center">
             <div className="text-3xl font-black font-sans tabular-nums leading-none">{report.attendancePresent}</div>
             <div className="h-[2px] bg-slate-900 my-2 mx-4"></div>
             <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{report.attendanceTotal} School Days</div>
          </div>
          <div className="mt-2 text-center">
             <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black uppercase tracking-tighter">Conduct: {report.conduct}</span>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex justify-between items-center mb-1">
             <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Official Remarks</p>
             <button onClick={generateAI} disabled={loading} className="no-print bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl font-black text-[9px] uppercase hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 border border-blue-100 shadow-sm">
                {loading ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />} Generate Remark
             </button>
          </div>
          <div className="border-2 border-slate-900 p-5 min-h-[110px] rounded-2xl bg-white italic text-sm text-slate-700 leading-relaxed font-serif relative overflow-hidden">
             {remark || "The student has demonstrated a positive attitude toward learning and active participation in class activities. Consistent hard work and focus on foundational concepts will lead to sustained excellence in coming terms."}
             <Sparkles size={60} className="absolute -bottom-4 -right-4 text-slate-50 opacity-10 rotate-12" />
          </div>
        </div>
      </div>

      <div className="flex justify-between px-10 mt-24 mb-10">
         <div className="w-48 text-center border-t-[3px] border-slate-900 pt-3">
            <p className="font-black font-sans text-[10px] uppercase tracking-[0.3em] text-slate-900">Class Teacher</p>
         </div>
         <div className="w-48 text-center border-t-[3px] border-slate-900 pt-3">
            <p className="font-black font-sans text-[10px] uppercase tracking-[0.3em] text-slate-900">Principal</p>
         </div>
      </div>

      {/* Footer Meta */}
      <div className="absolute bottom-6 left-10 right-10 flex justify-between items-center text-[7px] font-black text-slate-300 uppercase tracking-[0.6em] italic border-t border-slate-100 pt-2">
         <span>Generation Timestamp: {new Date().toLocaleString('ne-NP')}</span>
         <span>Kankali Academic Hub - System RMS v4.8</span>
      </div>
    </div>
  );
};

// ... Rest of the components stay consistent but utilize the saveAllData logic ...

const StudentManager = ({ students, setStudents, isAdmin }: any) => {
  const [show, setShow] = useState(false);
  const [f, setF] = useState({ name: '', roll: '', sec: Section.A });
  const add = (e: any) => {
    e.preventDefault();
    setStudents([...students, { id: Date.now().toString(), name: f.name, rollNo: f.roll, section: f.sec }]);
    setShow(false);
  };
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black uppercase tracking-tight">Student Directory</h3>
        {isAdmin && <button onClick={() => setShow(!show)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2">{show ? <X size={20} /> : <Plus size={20} />} {show ? 'Cancel' : 'Enroll New'}</button>}
      </div>
      {show && <form onSubmit={add} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 animate-in zoom-in-95">
        <InputField label="Student Full Name" value={f.name} onChange={(v:any) => setF({...f, name: v})} required />
        <InputField label="Roll No." value={f.roll} onChange={(v:any) => setF({...f, roll: v})} required />
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Assigned Section</label>
          <select className="w-full bg-slate-50 p-4 rounded-2xl font-black border-2 border-slate-100 outline-none focus:border-blue-500 transition-all" value={f.sec} onChange={e => setF({...f, sec: e.target.value as Section})}>
            <option value={Section.A}>Section A</option>
            <option value={Section.B}>Section B</option>
          </select>
        </div>
        <button className="col-span-1 md:col-span-3 bg-black text-white p-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl mt-2">Confirm Enrollment</button>
      </form>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {students.sort((a:any, b:any) => parseInt(a.rollNo) - parseInt(b.rollNo)).map((s:any) => (
          <div key={s.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center group hover:border-blue-500 transition-all">
            <div className="flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 tabular-nums group-hover:bg-blue-600 group-hover:text-white transition-all">{s.rollNo}</span>
              <div className="overflow-hidden">
                 <p className="font-black text-slate-800 uppercase text-[11px] truncate">{s.name}</p>
                 <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Section {s.section}</p>
              </div>
            </div>
            {isAdmin && <button onClick={() => setStudents(students.filter((x:any)=>x.id!==s.id))} className="text-slate-100 hover:text-red-600 transition-colors"><Trash2 size={16}/></button>}
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = ({ reports, expenses }: any) => {
  const total = reports.length;
  const pass = reports.filter((r:any)=>!r.hasNG && r.results.length > 0).length;
  const expenseTotal = expenses.reduce((acc:any, curr:any)=>acc+curr.amount, 0);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
      <StatsCard label="Active Students" value={total} color="blue" />
      <StatsCard label="Academic Pass Rate" value={total ? ((pass/total)*100).toFixed(0) + '%' : '0%'} color="green" />
      <StatsCard label="Avg GPA Score" value={(reports.reduce((a:any,c:any)=>a+c.gpa,0)/total || 0).toFixed(2)} color="purple" />
      <StatsCard label="Term Expenses" value={`रू ${expenseTotal.toLocaleString()}`} color="red" />
    </div>
  );
};

const StatsCard = ({ label, value, color }: any) => {
  const colors: any = { blue: 'text-blue-600 bg-blue-50 border-blue-100', green: 'text-green-600 bg-green-50 border-green-100', purple: 'text-purple-600 bg-purple-50 border-purple-100', red: 'text-red-600 bg-red-50 border-red-100' };
  return (
    <div className={`bg-white p-8 rounded-[2.5rem] shadow-sm border ${colors[color]} hover:shadow-xl transition-all cursor-default`}>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">{label}</p>
      <p className="text-4xl font-black tracking-tighter">{value}</p>
    </div>
  );
};

const SettingsPage = ({ clearData }: any) => (
  <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-200 max-w-xl animate-in zoom-in-95 duration-500">
    <div className="flex items-center gap-4 mb-8">
       <div className="p-3 bg-red-50 rounded-2xl"><ShieldAlert className="text-red-600" /></div>
       <div>
         <h3 className="font-black text-2xl tracking-tight uppercase">System Management</h3>
         <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Administrative Control Panel</p>
       </div>
    </div>
    <div className="p-8 bg-red-50/50 rounded-3xl border border-red-100 space-y-6">
       <div className="flex flex-col gap-2">
         <h4 className="font-black text-red-900 uppercase text-sm">Purge Operational Database</h4>
         <p className="text-xs text-red-600/70 leading-relaxed font-medium">This will permanently delete all student records, academic marks, and expenses from the local cache. This action is IRREVERSIBLE.</p>
       </div>
       <button onClick={() => confirm('ARE YOU ABSOLUTELY SURE? All data will be wiped.') && clearData()} className="w-full bg-red-600 text-white p-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-red-200 hover:bg-red-700 transition-all active:scale-95">Wipe All Local Storage</button>
    </div>
  </div>
);

const SubjectManager = ({ subjects, setSubjects, isAdmin }: any) => {
  const [show, setShow] = useState(false);
  const [f, setF] = useState({ name: '', code: '', credit: '2.5' });
  const add = (e: any) => {
    e.preventDefault();
    setSubjects([...subjects, { id: Date.now().toString(), name: f.name, code: f.code, creditHour: parseFloat(f.credit), fullMarksTheory: 50, passMarksTheory: 18, fullMarksPractical: 50, passMarksPractical: 18 }]);
    setShow(false);
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h3 className="text-xl font-black uppercase tracking-tight">Subject Matrix</h3>{isAdmin && <button onClick={() => setShow(!show)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black shadow-lg">{show ? <X /> : <Plus />}</button>}</div>
      {show && <form onSubmit={add} className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField label="Course Title" value={f.name} onChange={(v:any) => setF({...f, name: v})} required />
        <InputField label="Course Code" value={f.code} onChange={(v:any) => setF({...f, code: v})} required />
        <InputField label="CH Units" type="number" step="0.5" value={f.credit} onChange={(v:any) => setF({...f, credit: v})} required />
        <button className="col-span-1 md:col-span-3 bg-black text-white p-5 rounded-2xl font-black uppercase text-[10px] tracking-widest">Add Course to Matrix</button>
      </form>}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {subjects.map((s:any) => (
          <div key={s.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg transition-all group">
             <div className="p-3 bg-slate-50 text-slate-300 rounded-2xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all"><BookOpen size={24} /></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.code}</p>
             <h4 className="font-black text-slate-800 uppercase text-xs mb-2">{s.name}</h4>
             <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black uppercase">CH: {s.creditHour}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ExpenseManager = ({ expenses, setExpenses }: any) => {
  const [show, setShow] = useState(false);
  const [f, setF] = useState({ desc: '', amt: '', date: new Date().toISOString().split('T')[0] });
  const add = (e:any) => {
    e.preventDefault();
    setExpenses([...expenses, { id: Date.now().toString(), description: f.desc, amount: parseFloat(f.amt), date: f.date, category: 'General' }]);
    setF({ desc: '', amt: '', date: new Date().toISOString().split('T')[0] });
    setShow(false);
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black uppercase tracking-tight">Ledger</h3>
        <button onClick={() => setShow(!show)} className="bg-rose-600 text-white px-6 py-3 rounded-xl font-black shadow-lg">{show ? <X /> : <Plus />}</button>
      </div>
      {show && (
        <form onSubmit={add} className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]"><InputField label="Description" value={f.desc} onChange={(v:any)=>setF({...f, desc:v})} required /></div>
          <div className="w-32"><InputField label="NPR Amount" type="number" value={f.amt} onChange={(v:any)=>setF({...f, amt:v})} required /></div>
          <button className="bg-black text-white px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest h-fit mb-0.5">Record Entry</button>
        </form>
      )}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
        {expenses.length > 0 ? expenses.map((ex:any)=>(
          <div key={ex.id} className="p-6 border-b border-slate-50 flex justify-between items-center group hover:bg-slate-50">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-rose-50 text-rose-300 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-all"><Wallet size={18} /></div>
               <div>
                 <p className="font-black text-slate-800 uppercase text-xs">{ex.description}</p>
                 <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{ex.date}</p>
               </div>
            </div>
            <span className="font-black text-rose-600 text-sm tabular-nums">रू {ex.amount.toLocaleString()}</span>
          </div>
        )) : (
          <div className="p-20 text-center font-black text-slate-300 uppercase tracking-[0.5em] text-[10px]">No Transactions Found</div>
        )}
      </div>
    </div>
  );
};

const Login = ({ onLogin }: any) => {
  const [f, setF] = useState({ username: '', password: '' });
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="bg-white p-12 rounded-[3.5rem] w-full max-w-md shadow-2xl text-center border border-white/10">
        <div className="bg-blue-600 p-5 rounded-3xl w-fit mx-auto mb-8 shadow-xl shadow-blue-500/30 rotate-3 transition-transform hover:rotate-0 hover:scale-110"><GraduationCap className="text-white w-12 h-12" /></div>
        <h1 className="text-3xl font-black mb-1 tracking-tighter uppercase text-slate-900">Kankali RMS</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.4em] mb-12">Faculty Access Portal</p>
        <form onSubmit={e=>onLogin(e,f)} className="space-y-6">
          <InputField label="System Login ID" placeholder="Enter Staff Code" value={f.username} onChange={(v:any)=>setF({...f, username:v})} required />
          <InputField label="Secure Password" type="password" placeholder="••••••••" value={f.password} onChange={(v:any)=>setF({...f, password:v})} required />
          <button className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black uppercase text-xs tracking-widest mt-8 shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:shadow-2xl transition-all active:scale-95">Verify & Dashboard</button>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, ...props }: any) => (
  <div className="space-y-2 text-left">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 block">{label}</label>
    <input className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-slate-100 outline-none focus:border-blue-500 text-sm shadow-inner placeholder:text-slate-300" {...props} onChange={e=>props.onChange(e.target.value)} />
  </div>
);

export default App;
