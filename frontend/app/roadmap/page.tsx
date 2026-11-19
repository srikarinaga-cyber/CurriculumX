import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock3, Rocket, Target } from "lucide-react";

const weeks = [
	[1,"Foundation Reset","Python, statistics, linear algebra","Build a Python-based ML data pipeline",true],
	[2,"Machine Learning Depth","Model evaluation, feature engineering","Deploy a supervised learning benchmark",true],
	[3,"Deep Learning","Neural networks, PyTorch","Classify a real image or text dataset",false],
	[4,"Applied NLP","Embeddings, transformers, RAG","Build a retrieval-augmented assistant",false],
	[5,"Deployment","Docker, APIs, cloud hosting","Package and deploy an inference API",false],
	[6,"Portfolio Sprint","Testing, monitoring, documentation","Publish a complete evaluated project",false],
];

export default function RoadmapPage(){return <main className="min-h-screen bg-[#090D16] text-slate-100"><div className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
<Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-blue-400"><ArrowLeft size={16}/>Back to dashboard</Link>
<div className="mt-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-bold tracking-[.18em] text-blue-400">PERSONALIZED ROADMAP</p><h1 className="mt-2 text-3xl font-bold">Your 6-week growth plan</h1><p className="mt-2 text-sm text-slate-400">A focused sequence built around your missing and weak skills.</p></div><div className="rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-3"><p className="text-xs text-slate-400">Overall progress</p><p className="mt-1 text-lg font-bold text-blue-400">33%</p></div></div>
<div className="mt-8 grid gap-4 lg:grid-cols-2">{weeks.map(([week,title,skills,project,complete],index)=><article key={String(title)} className="glass dynamic-card relative overflow-hidden rounded-2xl p-5" style={{animationDelay:`${index*70}ms`}}><div className="flex items-start justify-between"><div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-500/12 text-sm font-bold text-violet-400">W{String(week)}</div>{complete?<CheckCircle2 className="text-emerald-400"/>:<Target className="text-slate-600"/>}</div><h2 className="mt-5 text-lg font-semibold">{String(title)}</h2><p className="mt-2 text-xs text-slate-500">{String(skills)}</p><div className="mt-5 rounded-xl border border-white/7 bg-white/[0.025] p-3"><p className="text-[10px] font-bold text-slate-500">MINI-PROJECT</p><p className="mt-1 text-sm text-slate-300">{String(project)}</p></div></article>)}</div>
</div></main>}
