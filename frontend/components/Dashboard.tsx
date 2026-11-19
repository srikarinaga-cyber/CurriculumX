"use client";

import { useMemo, useState } from "react";
import { BarChart3, BriefcaseBusiness, CheckCircle2, Download, FlaskConical, Gauge, GraduationCap, Menu, Search, Sparkles, Upload, X } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "/api"
    : "http://localhost:8000");

const sampleText = `B.Sc. Artificial Intelligence and Machine Learning
Linear Algebra, Probability and Statistics, Calculus, Discrete Mathematics,
Programming in Python and C++, Data Structures and Algorithms,
Database Management Systems, Operating Systems, Computer Networks,
Artificial Intelligence, Machine Learning, Data Mining, Supervised Learning,
Unsupervised Learning, Neural Networks, Computer Vision, NLP,
Deep Learning with TensorFlow, Scikit-Learn, Software Engineering, Data Visualization.`;

const roleOptions = ["AI/ML Engineer", "Full-Stack AI Developer", "Data Scientist", "NLP Research Assistant"];

type MatrixRow = { syllabusTopic: string; industrySkill: string; domain: string; score: number; status: string };
type Analysis = { readiness: number; counts: Record<string, number>; matrix: MatrixRow[]; breakdown: {domain:string; academic:number; demand:number}[]; roadmap: {week:number; title:string; skills:string[]; project:string; milestone:string}[]; metrics:{tfidf:{precision:number;recall:number};semantic:{precision:number;recall:number};engine:string}; targetRole:string };

export default function Dashboard() {
  const [role, setRole] = useState(roleOptions[0]);
  const [syllabus, setSyllabus] = useState(sampleText);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [metricsOpen, setMetricsOpen] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("Overview");

  async function runAnalysis() {
    setLoading(true); setError("");
    try {
      const response = await fetch(`${API}/analyze`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({syllabus_text:syllabus,target_role:role}) });
      if (!response.ok) throw new Error("Backend unavailable");
      setAnalysis(await response.json());
    } catch (err) { setError("Could not reach the FastAPI backend. Start it on port 8000, then try again."); }
    finally { setLoading(false); }
  }

  async function loadSample() {
    setSyllabus(sampleText);
  }

  async function uploadPdf(file?: File) {
    if (!file) return;
    setLoading(true); setError("");
    const form = new FormData(); form.append("file", file);
    try {
      const response = await fetch(`${API}/analyze/pdf?target_role=${encodeURIComponent(role)}`, {method:"POST",body:form});
      if (!response.ok) throw new Error("PDF analysis failed");
      setAnalysis(await response.json());
    } catch { setError("Upload failed. Confirm the backend is running and the PDF contains extractable text."); }
    finally { setLoading(false); }
  }

  function exportMarkdown() {
    if (!analysis) return;
    const lines = [`# CurriculumX Roadmap — ${analysis.targetRole}`, "", `Readiness: ${analysis.readiness}%`, "", "## Weekly roadmap"];
    analysis.roadmap.forEach(w => lines.push(`### Week ${w.week}: ${w.title}`, "", `- Skills: ${w.skills.join(", ")}`, `- Project: ${w.project}`, `- Milestone: ${w.milestone}`, ""));
    const blob = new Blob([lines.join("\n")], {type:"text/markdown"});
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href=url; a.download="curriculumx-roadmap.md"; a.click(); URL.revokeObjectURL(url);
  }

  const pieData = useMemo(() => analysis ? [
    {name:"Covered",value:analysis.counts.covered,color:"#22C55E"},
    {name:"Partial",value:analysis.counts.partial,color:"#F59E0B"},
    {name:"Missing",value:analysis.counts.missing,color:"#EF4444"}
  ] : [], [analysis]);

  function navigateTo(section: string) {
    setActiveSection(section);
    if (section === "Benchmarks") {
      setMetricsOpen(true);
      return;
    }
    const targetId = section === "Overview" ? "overview" : section === "Curriculum" ? "curriculum" : "career-match";
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return <main className="min-h-screen bg-[#090D16] text-slate-100">
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[240px] border-r border-white/7 bg-[#0B101C]/95 px-4 py-5 lg:block">
      <div className="mb-8 flex items-center gap-3 px-2"><div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-[0_0_24px_rgba(59,130,246,.35)]"><GraduationCap size={20}/></div><span className="text-lg font-bold">Curriculum<span className="text-blue-400">X</span></span></div>
      <nav className="space-y-1 text-sm">
        {[['Overview',Gauge],['Curriculum',GraduationCap],['Career Match',BriefcaseBusiness],['Benchmarks',FlaskConical]].map(([label,Icon],i) => { const I=Icon as typeof Gauge; return <button key={String(label)} onClick={()=>navigateTo(String(label))} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 ${activeSection===label?'bg-blue-500/12 text-blue-300':'text-slate-400 hover:bg-white/5 hover:text-white'}`}><I size={17}/>{String(label)}</button>})}
      </nav>
      <div className="absolute bottom-5 left-4 right-4 rounded-xl border border-white/8 bg-white/[0.03] p-3"><p className="text-xs text-slate-500">Portfolio workspace</p><p className="mt-1 text-sm font-medium">B.Sc. AI/ML</p></div>
    </aside>

    <div className="lg:ml-[240px]">
      <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-white/7 bg-[#090D16]/85 px-5 backdrop-blur-xl lg:px-8"><div className="flex items-center gap-3"><button className="lg:hidden"><Menu size={20}/></button><div><p className="text-xs text-slate-500">Intelligence workspace</p><h1 className="text-base font-semibold">Career Readiness Dashboard</h1></div></div><button onClick={()=>setMetricsOpen(true)} className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:border-violet-400/40"><FlaskConical size={15} className="text-violet-400"/>Model metrics</button></header>

      <div className="mx-auto max-w-[1450px] p-5 lg:p-8">
        <section id="overview" className="mb-6 grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
          <div className="glass rounded-2xl p-5"><div className="mb-4 flex items-center justify-between"><div><p className="section-kicker">INPUT MODULE</p><h2 className="mt-1 font-semibold">Syllabus intelligence</h2></div><button onClick={loadSample} className="flex items-center gap-2 rounded-lg border border-blue-400/20 bg-blue-500/8 px-3 py-2 text-xs text-blue-300 hover:bg-blue-500/15"><Sparkles size={14}/>Load sample syllabus</button></div>
            <textarea value={syllabus} onChange={e=>setSyllabus(e.target.value)} className="h-28 w-full resize-none rounded-xl border border-white/8 bg-[#080C14] p-4 text-sm leading-6 text-slate-300 outline-none transition focus:border-blue-500/50" placeholder="Paste syllabus topics, courses, or learning outcomes..."/>
            <div className="mt-4 flex flex-wrap items-center gap-3"><label className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5"><Upload size={14}/><span>Upload PDF</span><input type="file" accept="application/pdf" className="hidden" onChange={e=>uploadPdf(e.target.files?.[0])}/></label><select value={role} onChange={e=>setRole(e.target.value)} className="rounded-lg border border-white/10 bg-[#0E1420] px-3 py-2 text-xs outline-none"><option>AI/ML Engineer</option><option>Full-Stack AI Developer</option><option>Data Scientist</option><option>NLP Research Assistant</option></select><button onClick={runAnalysis} disabled={loading} className="ml-auto flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-xs font-semibold shadow-[0_8px_30px_rgba(59,130,246,.18)] disabled:opacity-60"><Search size={14}/>{loading?"Analyzing...":"Run analysis"}</button></div>
          </div>
          <div className="glass flex flex-col justify-between rounded-2xl p-5"><p className="section-kicker">TARGET ROLE</p><div className="mt-3"><div className="mb-3 flex h-11 items-center gap-3 rounded-xl border border-violet-400/20 bg-violet-500/8 px-3"><BriefcaseBusiness size={18} className="text-violet-400"/><div><p className="text-sm font-medium">{role}</p><p className="text-[10px] text-slate-500">12 industry requirements</p></div></div><div className="grid grid-cols-3 gap-2"><div className="stat-chip"><b>{analysis?.counts.covered ?? "—"}</b><span>Covered</span></div><div className="stat-chip"><b>{analysis?.counts.partial ?? "—"}</b><span>Partial</span></div><div className="stat-chip"><b>{analysis?.counts.missing ?? "—"}</b><span>Missing</span></div></div></div></div>
        </section>

        {error&&<div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/8 px-4 py-3 text-sm text-red-300">{error}</div>}

        {analysis ? <>
          <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-[.65fr_1.35fr]">
            <div className="glass rounded-2xl p-5"><div className="flex items-start justify-between"><div><p className="section-kicker">INDUSTRY READINESS</p><h2 className="mt-1 font-semibold">Readiness score</h2></div><Gauge size={18} className="text-blue-400"/></div><div className="mt-4 flex items-center gap-5"><div className="relative h-36 w-36"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{value:analysis.readiness},{value:100-analysis.readiness}]} dataKey="value" innerRadius={55} outerRadius={68} startAngle={90} endAngle={-270} stroke="none"><Cell fill="#3B82F6"/><Cell fill="#171D2A"/></Pie></PieChart></ResponsiveContainer><div className="absolute inset-0 grid place-items-center text-center"><div><b className="text-3xl">{analysis.readiness}%</b><p className="text-[10px] text-slate-500">READY</p></div></div></div><div className="flex-1 space-y-3">{pieData.map(d=><div key={d.name} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-slate-400"><i className="h-2 w-2 rounded-full" style={{background:d.color}}/>{d.name}</span><b>{d.value}</b></div>)}</div></div></div>
            <div className="glass rounded-2xl p-5"><div className="flex items-start justify-between"><div><p className="section-kicker">DOMAIN COVERAGE</p><h2 className="mt-1 font-semibold">Academic vs. industry demand</h2></div><BarChart3 size={18} className="text-violet-400"/></div><div className="mt-3 h-[210px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={analysis.breakdown} barGap={4}><CartesianGrid stroke="#FFFFFF0A" vertical={false}/><XAxis dataKey="domain" tick={{fill:"#64748B",fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#64748B",fontSize:10}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:"#101620",border:"1px solid #ffffff12",borderRadius:"10px",fontSize:12}}/><Bar dataKey="academic" fill="#3B82F6" radius={[5,5,0,0]} name="Academic coverage"/><Bar dataKey="demand" fill="#8B5CF6" radius={[5,5,0,0]} name="Industry demand"/></BarChart></ResponsiveContainer></div></div>
          </section>

          <section id="curriculum" className="mb-6 grid scroll-mt-24 gap-4 xl:grid-cols-[1.35fr_.65fr]">
            <div className="glass overflow-hidden rounded-2xl"><div className="flex items-center justify-between border-b border-white/7 px-5 py-4"><div><p className="section-kicker">SKILL-GAP MATRIX</p><h2 className="mt-1 font-semibold">Syllabus to industry mapping</h2></div><span className="text-xs text-slate-500">Dense cosine similarity</span></div><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="border-b border-white/7 text-slate-500"><tr><th className="px-5 py-3 font-medium">Syllabus topic</th><th className="px-5 py-3 font-medium">Industry skill</th><th className="px-5 py-3 font-medium">Domain</th><th className="px-5 py-3 font-medium">Similarity</th><th className="px-5 py-3 font-medium">Status</th></tr></thead><tbody>{analysis.matrix.slice(0,10).map((row,i)=><tr key={i} className="border-b border-white/5 text-slate-300"><td className="px-5 py-3.5">{row.syllabusTopic}</td><td className="px-5 py-3.5 font-medium text-white">{row.industrySkill}</td><td className="px-5 py-3.5 text-slate-400">{row.domain}</td><td className="px-5 py-3.5"><span className="rounded-md bg-blue-500/10 px-2 py-1 text-blue-300">{row.score.toFixed(3)}</span></td><td className="px-5 py-3.5"><span className={`status ${row.status.toLowerCase()}`}>{row.status}</span></td></tr>)}</tbody></table></div></div>
            <div className="glass rounded-2xl p-5"><div className="mb-5 flex items-center justify-between"><div><p className="section-kicker">PERSONALIZED ROADMAP</p><h2 className="mt-1 font-semibold">Week-by-week upskilling plan</h2></div><button onClick={exportMarkdown} className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs hover:border-blue-400/40"><Download size={14}/>Export Markdown</button></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{analysis.roadmap.map(w=><article key={w.week} className="group rounded-xl border border-white/8 bg-white/[0.025] p-4 transition hover:-translate-y-0.5 hover:border-blue-400/20"><div className="mb-3 flex items-center justify-between"><span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500/12 text-xs font-bold text-blue-300">W{w.week}</span><CheckCircle2 size={16} className="text-slate-700 group-hover:text-blue-400"/></div><h3 className="text-sm font-semibold">{w.title}</h3><p className="mt-2 text-xs text-slate-500">{w.skills.join(" • ")}</p><p className="mt-3 text-xs leading-5 text-slate-400">{w.project}</p><p className="mt-3 border-t border-white/7 pt-3 text-[11px] text-violet-300">Milestone: {w.milestone}</p></article>)}</div></div>
          </section>

          <section id="career-match" className="mb-6 scroll-mt-24 grid gap-4 md:grid-cols-2 xl:grid-cols-[.65fr_1.35fr]">
            <div className="glass rounded-2xl p-5"><div className="flex items-start justify-between"><div><p className="section-kicker">CAREER MATCH</p><h2 className="mt-1 font-semibold">Top matching roles</h2></div></div><div className="mt-4 space-y-3">{analysis.breakdown.map((d,i)=><div key={i} className="flex items-center justify-between rounded-xl bg-white/[0.03] p-4 text-sm transition hover:bg-white/5"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-500/12 text-blue-400">{i===0?<GraduationCap size={20}/>:i===1?<BriefcaseBusiness size={20}/>:<FlaskConical size={20}/>}</div><div className="min-w-0 flex-1"><p className="font-medium text-white">{d.domain}</p><p className="text-xs text-slate-500">{d.academic.toFixed(1)} hrs · {d.demand.toFixed(1)} pts</p></div></div><div className="flex items-center gap-2"><b className="text-2xl text-blue-400">{d.academic.toFixed(2)}</b><span className="text-xs text-slate-500">{i===0?"Best match":i===1?"Next best match":"Match score"}</span></div></div>)}</div></div>
          </section>
        </> : <section className="glass grid min-h-[280px] place-items-center rounded-2xl text-center"><div><div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/10 text-blue-400"><Sparkles/></div><h2 className="font-semibold">No analysis yet</h2><p className="mt-2 text-sm text-slate-500">Load the sample syllabus and run an analysis to see your readiness.</p></div></section>}
      </div>
    </div>

    {metricsOpen&&<><button aria-label="Close metrics" className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm" onClick={()=>setMetricsOpen(false)}/><aside className="fixed right-0 top-0 z-50 h-screen w-full max-w-md border-l border-white/10 bg-[#0B101C] p-6 shadow-2xl"><div className="flex items-center justify-between"><div><p className="section-kicker">RESEARCH BENCHMARK</p><h2 className="mt-1 text-lg font-semibold">Model metrics</h2></div><button onClick={()=>setMetricsOpen(false)}><X size={18}/></button></div>{analysis?<div className="mt-8 space-y-4"><div className="rounded-xl border border-white/8 p-4"><p className="text-sm font-medium">TF-IDF baseline</p><div className="mt-4 grid grid-cols-2 gap-3"><div className="metric"><span>Precision</span><b>{analysis.metrics.tfidf.precision}%</b></div><div className="metric"><span>Recall</span><b>{analysis.metrics.tfidf.recall}%</b></div></div></div><div className="rounded-xl border border-violet-400/15 bg-violet-500/5 p-4"><p className="text-sm font-medium">Dense semantic embeddings</p><div className="mt-4 grid grid-cols-2 gap-3"><div className="metric"><span>Precision</span><b>{analysis.metrics.semantic.precision}%</b></div><div className="metric"><span>Recall</span><b>{analysis.metrics.semantic.recall}%</b></div></div></div><p className="text-xs leading-5 text-slate-500">Engine: {analysis.metrics.engine}. Semantic thresholds: strong ≥ 0.72, partial ≥ 0.42, missing below 0.42.</p></div>:<p className="mt-8 text-sm text-slate-500">Run an analysis to inspect benchmark results.</p>}</aside></>}
  </main>;
}
