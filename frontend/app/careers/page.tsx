import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, Building2, CircleDollarSign, MapPin, TrendingUp } from "lucide-react";

const careers = [
  {title:"AI/ML Engineer",company:"Technology & AI",fit:92,color:"text-blue-400",skills:"Python, Deep Learning, MLOps"},
  {title:"Full-Stack AI Developer",company:"Product Engineering",fit:78,color:"text-violet-400",skills:"React, APIs, RAG, Cloud"},
  {title:"Data Scientist",company:"Analytics & Research",fit:74,color:"text-cyan-400",skills:"Statistics, SQL, Visualization"},
  {title:"NLP Research Assistant",company:"Research & Labs",fit:69,color:"text-fuchsia-400",skills:"Transformers, LLMs, PyTorch"},
];

export default function CareersPage() {
  return <main className="min-h-screen bg-[#090D16] text-slate-100"><div className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
    <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-blue-400"><ArrowLeft size={16}/>Back to dashboard</Link>
    <div className="mt-8"><p className="text-xs font-bold tracking-[.18em] text-violet-400">CAREER INTELLIGENCE</p><h1 className="mt-2 text-3xl font-bold">Explore target career paths</h1><p className="mt-2 text-sm text-slate-400">Compare your academic profile against modern industry roles.</p></div>
    <div className="mt-8 grid gap-4 md:grid-cols-2">{careers.map((career,index)=><article key={career.title} className="glass dynamic-card rounded-2xl p-5" style={{animationDelay:`${index*80}ms`}}>
      <div className="flex items-start justify-between"><div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-500/10"><BriefcaseBusiness className={career.color}/></div><span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-400">{career.fit}% fit</span></div>
      <h2 className="mt-5 text-xl font-semibold">{career.title}</h2><p className="mt-2 flex items-center gap-2 text-xs text-slate-500"><Building2 size={14}/>{career.company}</p>
      <p className="mt-5 text-sm text-slate-400"><span className="text-slate-500">Core skills:</span> {career.skills}</p>
      <div className="mt-5 flex items-center justify-between border-t border-white/7 pt-4"><div className="flex gap-4 text-xs text-slate-500"><span className="flex items-center gap-1"><MapPin size={13}/>Remote</span><span className="flex items-center gap-1"><CircleDollarSign size={13}/>High demand</span></div><Link href="/roadmap" className="text-xs font-semibold text-blue-400">Create plan →</Link></div>
    </article>)}</div>
  </div></main>;
}
