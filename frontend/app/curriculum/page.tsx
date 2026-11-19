import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, Clock3, Layers3, Sparkles } from "lucide-react";

const subjects = [
  ["Mathematics", "Linear algebra, calculus, probability", "Strong", "bg-blue-500"],
  ["Programming", "Python, C++, algorithms, data structures", "Strong", "bg-violet-500"],
  ["Artificial Intelligence", "Search, agents, ML foundations", "Strong", "bg-cyan-500"],
  ["Deep Learning", "Neural networks, TensorFlow, vision", "Partial", "bg-amber-500"],
  ["Data & Databases", "SQL, data mining, visualization", "Partial", "bg-fuchsia-500"],
  ["Software Engineering", "Version control, testing, deployment", "Gap", "bg-rose-500"],
];

export default function CurriculumPage() {
  return <main className="min-h-screen bg-[#090D16] text-slate-100">
    <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-blue-400"><ArrowLeft size={16}/>Back to dashboard</Link>
      <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div><p className="text-xs font-bold tracking-[.18em] text-blue-400">CURRICULUM ANALYSIS</p><h1 className="mt-2 text-3xl font-bold">B.Sc. AI &amp; ML Curriculum</h1><p className="mt-2 max-w-xl text-sm text-slate-400">Explore academic coverage, identify depth gaps, and align courses with industry outcomes.</p></div>
        <div className="grid grid-cols-3 gap-3"><div className="metric-card"><b>32</b><span>Courses</span></div><div className="metric-card"><b>68%</b><span>Coverage</span></div><div className="metric-card"><b>8</b><span>Strong areas</span></div></div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {subjects.map(([name,description,status,color], index) => <article key={name} className="glass dynamic-card rounded-2xl p-5" style={{animationDelay:`${index*70}ms`}}>
          <div className="flex items-start justify-between"><div className={`grid h-11 w-11 place-items-center rounded-xl ${color}/15 text-white`}><BookOpen size={20}/></div><span className={`status ${status.toLowerCase()}`}>{status}</span></div>
          <h2 className="mt-5 text-lg font-semibold">{name}</h2><p className="mt-2 min-h-10 text-sm leading-6 text-slate-400">{description}</p>
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/5"><div className={`h-full rounded-full ${color}`} style={{width:`${status === "Strong" ? 82 : status === "Partial" ? 58 : 28}%`}}/></div>
        </article>)}
      </div>
      <section className="glass mt-6 grid gap-5 rounded-2xl p-6 lg:grid-cols-[1fr_280px]"><div><p className="section-kicker">CURRICULUM INSIGHT</p><h2 className="mt-2 text-xl font-semibold">Recommended academic enhancements</h2><div className="mt-5 space-y-3">{["Add Docker and container orchestration exercises","Include production model deployment and monitoring","Expand NLP from theory to transformer fine-tuning"].map(item=><div key={item} className="flex items-center gap-3 rounded-xl border border-white/7 bg-white/[0.025] p-3 text-sm"><CheckCircle2 size={17} className="text-emerald-400"/><span>{item}</span></div>)}</div></div><div className="rounded-2xl bg-gradient-to-br from-blue-600/20 to-violet-600/20 p-5"><Sparkles className="text-blue-400"/><p className="mt-4 text-sm text-slate-400">Build a semester portfolio with measurable projects.</p><Link href="/roadmap" className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold">View roadmap</Link></div></section>
    </div>
  </main>;
}
