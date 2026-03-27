import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Code2, Microscope, Boxes, Brush, Layers3, CheckCircle2, Sparkles, RotateCcw, Cpu, BookOpen, ClipboardList, FlaskConical, Lightbulb, ArrowDown } from 'lucide-react';
import { cn } from './lib/utils';

const levels: Record<string, { label: string; short: string }> = {
  highschool: { label: 'High School', short: 'HS' },
  undergrad: { label: 'Undergrad', short: 'UG' },
  grad: { label: 'Graduate', short: 'GR' },
};

const projects = {
  'HS-1': {
    id: 'HS-1',
    title: 'Virus Capsid 3D-Print Education Kit',
    summary: 'Build and test a polished physical teaching kit with pentamers, hexamers, and assembly activities that complements The Virus Lesson demos.',
    levels: ['highschool', 'undergrad'],
    duration: ['short'],
    coding: ['low', 'medium'],
    styles: ['hands_on', 'visual'],
    interests: ['outreach', 'capsid', 'general'],
    outputs: ['Printable STL set', 'Assembly guide', 'Photo/video documentation', 'GitHub repo'],
    tags: ['Low risk', 'Outreach', 'Hands-on'],
    lane: 'Physical',
    mentorLoad: 'Low',
  },
  'HS-2': {
    id: 'HS-2',
    title: 'Mini Segmentation Curation and Visualization',
    summary: 'Curate a tiny synthetic or cropped tomogram dataset with masks and build a clear visual comparison gallery of prediction quality.',
    levels: ['highschool', 'undergrad'],
    duration: ['short', 'medium'],
    coding: ['medium', 'high'],
    styles: ['data', 'visual'],
    interests: ['ml', 'general'],
    outputs: ['Small benchmark dataset', 'Viewer/gallery', 'Error notes', 'GitHub repo'],
    tags: ['AI exposure', 'Visual', 'Feasible'],
    lane: 'Data',
    mentorLoad: 'Low-Medium',
  },
  'HS-3': {
    id: 'HS-3',
    title: 'MolViewStory for Virus or p53',
    summary: 'Create an interactive molecular story with scenes, captions, and guided views for teaching, outreach, or recruitment.',
    levels: ['highschool', 'undergrad'],
    duration: ['short', 'medium'],
    coding: ['low', 'medium'],
    styles: ['visual'],
    interests: ['outreach', 'molstar', 'general'],
    outputs: ['Interactive story', 'Captions/script', 'Screenshots', 'Short demo video'],
    tags: ['Reusable', 'Communication', 'Low risk'],
    lane: 'Storytelling',
    mentorLoad: 'Low',
  },
  'HS-4': {
    id: 'HS-4',
    title: 'GitHub Progress Dashboard',
    summary: 'Create a clean project-tracking system with milestones, issue templates, progress reporting, and internship documentation.',
    levels: ['highschool', 'undergrad'],
    duration: ['short'],
    coding: ['low', 'medium'],
    styles: ['organize', 'software'],
    interests: ['general'],
    outputs: ['Project board', 'Milestones', 'Templates', 'README'],
    tags: ['Very low risk', 'Operations', 'Open science'],
    lane: 'Organization',
    mentorLoad: 'Low',
  },
  'UG-1': {
    id: 'UG-1',
    title: 'Mini Ghost-in-the-Cell Pipeline',
    summary: 'Build a scoped end-to-end pilot from model generation to phantom tomogram to packaged masks, focusing on reproducibility and clean outputs.',
    levels: ['undergrad', 'grad'],
    duration: ['medium'],
    coding: ['medium', 'high'],
    styles: ['data', 'research'],
    interests: ['ml', 'sim', 'general'],
    outputs: ['Scripts', 'Mini dataset', 'README', 'Poster-ready figure'],
    tags: ['Core project', 'Reproducible', 'Pipeline'],
    lane: 'Pipeline',
    mentorLoad: 'Medium',
  },
  'UG-2': {
    id: 'UG-2',
    title: 'Synthetic Tomogram Segmentation Benchmark',
    summary: 'Compare a small number of segmentation strategies on a focused synthetic benchmark and summarize where each method succeeds or fails.',
    levels: ['undergrad', 'grad'],
    duration: ['medium'],
    coding: ['medium', 'high'],
    styles: ['data', 'research'],
    interests: ['ml'],
    outputs: ['Benchmark scripts', 'Metrics', 'Figures', 'Summary report'],
    tags: ['Benchmarking', 'AI', 'Clear outcome'],
    lane: 'AI',
    mentorLoad: 'Medium',
  },
  'UG-3': {
    id: 'UG-3',
    title: 'Mesoscope / Mol* Mini-Feature',
    summary: 'Ship one practical feature such as .star loading, .tbl loading, a gizmo, or a modernized viewer workflow.',
    levels: ['undergrad', 'grad'],
    duration: ['medium'],
    coding: ['medium', 'high'],
    styles: ['software'],
    interests: ['molstar', 'general'],
    outputs: ['Working feature', 'Demo file', 'Technical notes', 'Walkthrough video'],
    tags: ['Software', 'GitHub visible', 'Professional'],
    lane: 'Software',
    mentorLoad: 'Medium',
  },
  'UG-4': {
    id: 'UG-4',
    title: 'Simulation Export Bridge',
    summary: 'Prototype one exporter from cellPACK-style models into a simulation-friendly format such as bentopy, .gro, or .lammps.',
    levels: ['undergrad', 'grad'],
    duration: ['medium'],
    coding: ['high', 'medium'],
    styles: ['software', 'research'],
    interests: ['sim'],
    outputs: ['Exporter', 'Example input/output', 'Validation notes', 'Documentation'],
    tags: ['Simulation', 'Modular', 'Technical'],
    lane: 'Simulation',
    mentorLoad: 'Medium',
  },
  'GR-1': {
    id: 'GR-1',
    title: 'HIV Capsid Mesh Prototype',
    summary: 'Implement and evaluate one focused strategy to generate HIV capsid mesh geometry, keeping the scope tight and the outputs testable.',
    levels: ['grad', 'undergrad'],
    duration: ['medium'],
    coding: ['high'],
    styles: ['research'],
    interests: ['capsid', 'general'],
    outputs: ['Mesh generator', 'Visualizations', 'Basic metrics', 'Export format'],
    tags: ['Research', 'Geometry', 'Higher risk'],
    lane: 'Geometry',
    mentorLoad: 'High',
  },
  'GR-2': {
    id: 'GR-2',
    title: 'Integrative Modeling to STA Pre-Alignment Prototype',
    summary: 'Explore a focused proof of concept linking surface geometry or mesh-derived normals to downstream subvolume positioning and rotation.',
    levels: ['grad'],
    duration: ['medium'],
    coding: ['high'],
    styles: ['research'],
    interests: ['capsid', 'sim', 'general'],
    outputs: ['Prototype code', 'Geometry tests', 'Validation figures', 'Technical memo'],
    tags: ['Advanced', 'Research', 'Method development'],
    lane: 'Advanced',
    mentorLoad: 'High',
  },
  'HS-5': {
    id: 'HS-5',
    title: 'CellPaint Educational Gallery',
    summary: 'Use CellPaint to construct scientifically accurate, visually engaging 2D/3D scenes of cellular environments (e.g., blood serum, synapse) for outreach and education.',
    levels: ['highschool', 'undergrad'],
    duration: ['short', 'medium'],
    coding: ['low'],
    styles: ['visual', 'hands_on'],
    interests: ['cellpaint', 'outreach', 'general'],
    outputs: ['Curated scene gallery', 'Educational captions', 'Outreach presentation'],
    tags: ['Art', 'Biology', 'Outreach'],
    lane: 'Storytelling',
    mentorLoad: 'Low',
  },
  'UG-5': {
    id: 'UG-5',
    title: 'CellPaint Feature Development',
    summary: 'Develop new interactive features for CellPaint, such as advanced brush mechanics, 3D export capabilities, or performance optimizations for large scenes.',
    levels: ['undergrad', 'grad'],
    duration: ['medium'],
    coding: ['medium', 'high'],
    styles: ['software'],
    interests: ['cellpaint', 'general'],
    outputs: ['Merged PRs', 'Feature documentation', 'Demo scene'],
    tags: ['Software', 'Interactive', 'WebDev'],
    lane: 'Software',
    mentorLoad: 'Medium',
  },
  'UG-6': {
    id: 'UG-6',
    title: 'cellPACK Recipe Curation & Validation',
    summary: 'Curate and validate biological recipes for cellPACK, ensuring correct stoichiometries and molecular structures for a specific organelle or virus.',
    levels: ['undergrad', 'grad'],
    duration: ['medium'],
    coding: ['low', 'medium'],
    styles: ['data', 'research'],
    interests: ['sim', 'general'],
    outputs: ['Validated recipe file', 'Rendered images', 'Biological reference document'],
    tags: ['Biology', 'Modeling', 'Data'],
    lane: 'Data',
    mentorLoad: 'Low-Medium',
  },
  'UG-7': {
    id: 'UG-7',
    title: 'WebXR Molecular Experience',
    summary: 'Prototype a WebXR/VR experience using Mol* or A-Frame to allow users to step inside a cellPACK model or interact with a virus capsid.',
    levels: ['undergrad', 'grad'],
    duration: ['medium'],
    coding: ['medium', 'high'],
    styles: ['software', 'visual'],
    interests: ['outreach', 'molstar'],
    outputs: ['WebXR prototype', 'User testing notes', 'Demo video'],
    tags: ['VR/AR', 'Interactive', 'Outreach'],
    lane: 'Software',
    mentorLoad: 'High',
  },
};

const questions = [
  {
    key: 'level',
    title: 'Student level',
    description: 'Start with expected independence and depth.',
    icon: GraduationCap,
    options: [
      { value: 'highschool', label: 'High School', hint: 'Short scope, visible outputs, lower technical risk' },
      { value: 'undergrad', label: 'Undergrad', hint: 'Moderate independence with coding or analysis' },
      { value: 'grad', label: 'Graduate', hint: 'Higher autonomy and more technical depth' },
    ],
  },
  {
    key: 'duration',
    title: 'Project length',
    description: 'Match ambition to the calendar, not to optimism.',
    icon: Layers3,
    options: [
      { value: 'short', label: 'About 1 month', hint: 'Best for high school or a compact summer slot' },
      { value: 'medium', label: 'About 2 months', hint: 'Best for SURF, REACH, or deeper undergraduate work' },
    ],
  },
  {
    key: 'coding',
    title: 'Coding comfort',
    description: 'Enough skill to finish matters more than theoretical interest.',
    icon: Code2,
    options: [
      { value: 'low', label: 'Low', hint: 'Little to no coding' },
      { value: 'medium', label: 'Moderate', hint: 'Can use notebooks and adapt scripts' },
      { value: 'high', label: 'Strong', hint: 'Can build and debug independently' },
    ],
  },
  {
    key: 'style',
    title: 'Preferred work style',
    description: 'This usually predicts success better than raw CV sparkle.',
    icon: Brush,
    options: [
      { value: 'hands_on', label: 'Hands-on / fabrication', hint: '3D printing, assembly, testing' },
      { value: 'visual', label: 'Visual / communication', hint: 'Stories, demos, design, educational material' },
      { value: 'data', label: 'Data / images', hint: 'Masks, datasets, comparisons, evaluation' },
      { value: 'software', label: 'Software / engineering', hint: 'Features, viewers, clean tools' },
      { value: 'research', label: 'Research / modeling', hint: 'Geometry, methods, simulations' },
      { value: 'organize', label: 'Documentation / coordination', hint: 'Tracking, GitHub structure, reproducibility' },
    ],
  },
  {
    key: 'interest',
    title: 'Main scientific interest',
    description: 'Pick the lane most likely to keep the student engaged.',
    icon: Microscope,
    options: [
      { value: 'outreach', label: 'Outreach & education', hint: 'Virus Lesson, demos, teaching tools' },
      { value: 'cellpaint', label: 'CellPaint', hint: 'Interactive painting, UI/UX, educational scenes' },
      { value: 'ml', label: 'AI / segmentation', hint: 'Masks, predictions, benchmarking' },
      { value: 'capsid', label: 'Capsid geometry', hint: 'Mesh, fullerene, assembly structure' },
      { value: 'molstar', label: 'Mol* / Mesoscope', hint: 'Viewer features and molecular visualization' },
      { value: 'sim', label: 'Simulation & cellPACK', hint: 'Exports, formats, model-to-sim workflows, recipes' },
      { value: 'general', label: 'General / mixed', hint: 'Keep options open and flexible' },
    ],
  },
];

function scoreProjects(answers: Record<string, string>) {
  return Object.values(projects)
    .map((project) => {
      let score = 0;
      if (project.levels.includes(answers.level)) score += 8;
      if (project.duration.includes(answers.duration)) score += 6;
      if (project.coding.includes(answers.coding)) score += 5;
      if (project.styles.includes(answers.style)) score += 6;
      if (project.interests.includes(answers.interest)) score += 6;

      if (answers.level === 'highschool' && project.id.startsWith('HS')) score += 3;
      if (answers.level === 'undergrad' && project.id.startsWith('UG')) score += 3;
      if (answers.level === 'grad' && project.id.startsWith('GR')) score += 3;

      if (answers.duration === 'short' && ['GR-1', 'GR-2', 'UG-1', 'UG-4', 'UG-5', 'UG-6', 'UG-7'].includes(project.id)) score -= 4;
      if (answers.coding === 'low' && ['UG-1', 'UG-2', 'UG-3', 'UG-4', 'UG-5', 'UG-7', 'GR-1', 'GR-2'].includes(project.id)) score -= 5;
      if (answers.style === 'hands_on' && !['HS-1', 'HS-5'].includes(project.id)) score -= 1;

      return { ...project, score };
    })
    .sort((a, b) => b.score - a.score);
}

function matchReasons(project: any, answers: Record<string, string>) {
  const reasons = [];
  if (project.levels.includes(answers.level)) reasons.push(`Well scoped for ${levels[answers.level]?.label || 'this'} students`);
  if (project.duration.includes(answers.duration)) reasons.push('Fits the available time window');
  if (project.coding.includes(answers.coding)) reasons.push('Matches the coding comfort level');
  if (project.styles.includes(answers.style)) reasons.push('Fits the preferred work style');
  if (project.interests.includes(answers.interest)) reasons.push('Aligned with the student’s main interest');
  return reasons.slice(0, 3);
}

function recommendationTone(score: number) {
  if (score >= 28) return { label: 'Excellent fit', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  if (score >= 22) return { label: 'Strong fit', style: 'bg-blue-50 text-blue-700 border-blue-200' };
  if (score >= 16) return { label: 'Possible fit', style: 'bg-amber-50 text-amber-700 border-amber-200' };
  return { label: 'Stretch', style: 'bg-slate-100 text-slate-700 border-slate-200' };
}

function QuestionNode({ 
  question, 
  selectedValue, 
  onSelect, 
  index 
}: { 
  question: typeof questions[0]; 
  selectedValue?: string; 
  onSelect: (val: string) => void; 
  index: number;
}) {
  const Icon = question.icon;
  const isAnswered = !!selectedValue;

  return (
    <motion.div 
      id={`question-${index}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full flex flex-col items-center relative z-10"
    >
      <div className="flex flex-col items-center text-center mb-8">
        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 shadow-sm",
          isAnswered ? "bg-indigo-600 text-white shadow-indigo-200" : "bg-white border border-slate-200 text-slate-500"
        )}>
          <Icon className="w-8 h-8" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{question.title}</h2>
        <p className="text-slate-500 mt-3 max-w-lg text-lg">{question.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {question.options.map((opt) => {
          const isSelected = selectedValue === opt.value;
          const isOtherSelected = isAnswered && !isSelected;

          return (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={cn(
                "relative p-6 rounded-3xl border-2 text-left transition-all duration-300 group",
                isSelected 
                  ? "border-indigo-600 bg-indigo-50/80 shadow-lg shadow-indigo-100 ring-4 ring-indigo-600/10 scale-[1.02]" 
                  : isOtherSelected
                    ? "border-slate-100 bg-slate-50/50 opacity-40 hover:opacity-100 hover:scale-[1.01]"
                    : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md hover:-translate-y-1"
              )}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className={cn(
                  "font-semibold text-xl transition-colors",
                  isSelected ? "text-indigo-900" : "text-slate-900 group-hover:text-indigo-700"
                )}>
                  {opt.label}
                </h3>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-indigo-600 rounded-full p-1"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </div>
              <p className={cn(
                "text-sm leading-relaxed transition-colors",
                isSelected ? "text-indigo-700/80" : "text-slate-500 group-hover:text-slate-600"
              )}>
                {opt.hint}
              </p>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

function RecommendationCard({ project, answers, rank }: { project: any, answers: Record<string, string>, rank: number }) {
  const tone = recommendationTone(project.score);
  const icons: Record<string, any> = {
    Physical: Boxes,
    Data: Cpu,
    Storytelling: BookOpen,
    Organization: ClipboardList,
    Pipeline: Layers3,
    AI: Cpu,
    Software: Code2,
    Simulation: FlaskConical,
    Geometry: Boxes,
    Advanced: Lightbulb,
  };
  const Icon = icons[project.lane] || Microscope;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: rank * 0.15, ease: "easeOut" }}
      className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
    >
      <div className="p-6 md:p-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="rounded-2xl bg-slate-100 p-4 shrink-0">
              <Icon className="h-8 w-8 text-slate-700" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{project.title}</h3>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mb-4">
                <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{project.id}</span>
                <span className="hidden sm:inline">•</span>
                <span>Mentor load: {project.mentorLoad}</span>
                <span className="hidden sm:inline">•</span>
                <span>{project.lane}</span>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
                {project.summary}
              </p>
            </div>
          </div>
          <div className="flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0">
            <div className={cn("px-4 py-1.5 rounded-full text-sm font-semibold border", tone.style)}>
              {tone.label}
            </div>
            <div className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-sm font-semibold">
              Rank #{rank + 1}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Why it fits</h4>
            <ul className="space-y-3">
              {matchReasons(project, answers).map((reason, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-base">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Expected Outputs</h4>
            <div className="flex flex-wrap gap-2">
              {project.outputs.map((item: string) => (
                <span key={item} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1.5 border border-slate-200 text-slate-500 rounded-xl text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ResultsNode({ answers }: { answers: Record<string, string> }) {
  const ranking = useMemo(() => scoreProjects(answers), [answers]);
  const topRecommendations = ranking.slice(0, 3);

  return (
    <motion.div 
      id="results"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full flex flex-col items-center mt-8 relative z-10"
    >
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-xl shadow-indigo-200 rotate-3">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Your Project Matches</h2>
        <p className="text-slate-500 mt-4 max-w-xl text-lg md:text-xl">
          Based on your choices, here are the best-fit projects ranked by feasibility and alignment.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 w-full">
        {topRecommendations.map((project, idx) => (
          <RecommendationCard key={project.id} project={project} answers={answers} rank={idx} />
        ))}
      </div>
      
      <div className="mt-20 mb-32">
         <button 
           onClick={() => {
             window.scrollTo({ top: 0, behavior: 'smooth' });
             setTimeout(() => window.location.reload(), 500);
           }}
           className="flex items-center gap-2 px-8 py-4 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-900/20"
         >
           <RotateCcw className="w-5 h-5" />
           Start Over
         </button>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelect = (key: string, value: string) => {
    const qIndex = questions.findIndex(q => q.key === key);
    const newAnswers = { ...answers };
    newAnswers[key] = value;
    
    // Clear subsequent answers
    for (let i = qIndex + 1; i < questions.length; i++) {
      delete newAnswers[questions[i].key];
    }
    setAnswers(newAnswers);
    
    // Scroll to next question after a short delay
    setTimeout(() => {
      const nextEl = document.getElementById(`question-${qIndex + 1}`);
      if (nextEl) {
        const yOffset = -100; // Offset to not stick to the very top
        const y = nextEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else if (qIndex === questions.length - 1) {
        const resultsEl = document.getElementById('results');
        if (resultsEl) {
          const yOffset = -50;
          const y = resultsEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    }, 150);
  };

  const isComplete = Object.keys(answers).length === questions.length;

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="pt-20 pb-12 px-4 text-center max-w-3xl mx-auto relative z-10">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-6 text-indigo-600">
          <Microscope className="w-8 h-8" />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
          Intern Project Planner
        </h1>
        <p className="text-xl text-slate-500 leading-relaxed">
          A decision tree to match students to feasible summer projects across outreach, segmentation, Mol*, simulation, and integrative modeling.
        </p>
      </header>

      {/* Decision Tree Container */}
      <main className="relative max-w-5xl mx-auto px-4 pb-24">
        {/* The central trunk line (rendered dynamically between nodes) */}
        <div className="flex flex-col items-center w-full">
          <AnimatePresence>
            {questions.map((q, index) => {
              const isVisible = index === 0 || answers[questions[index - 1].key];
              if (!isVisible) return null;
              
              return (
                <React.Fragment key={q.key}>
                  {/* Connecting line from previous */}
                  {index > 0 && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 80, opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="w-1 bg-indigo-100 my-4 rounded-full relative"
                    >
                      {/* Animated dot moving down the line */}
                      <motion.div 
                        initial={{ top: 0, opacity: 0 }}
                        animate={{ top: "100%", opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-400"
                      />
                    </motion.div>
                  )}
                  
                  <QuestionNode 
                    question={q} 
                    selectedValue={answers[q.key]} 
                    onSelect={(val) => handleSelect(q.key, val)} 
                    index={index} 
                  />
                </React.Fragment>
              )
            })}
            
            {/* Results section */}
            {isComplete && (
              <React.Fragment key="results-section">
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 120, opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="w-1 bg-gradient-to-b from-indigo-100 to-purple-200 my-4 rounded-full relative"
                >
                   <motion.div 
                      initial={{ top: 0, opacity: 0 }}
                      animate={{ top: "100%", opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-400"
                    />
                </motion.div>
                <ResultsNode answers={answers} />
              </React.Fragment>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
