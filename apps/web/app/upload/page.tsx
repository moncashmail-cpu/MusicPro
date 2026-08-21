"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  Loader2, 
  ArrowRight, 
  Sparkles,
  Layers,
  Music,
  AlertCircle
} from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("Symphonie Pastorale - Extrait");
  const [composer, setComposer] = useState<string>("L. v. Beethoven");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    { name: "Upload de la Partition", desc: "Envoi sécurisé du fichier source PDF / Image" },
    { name: "Reconnaissance Optique (OMR)", desc: "Conversion symbolique vers standard MusicXML" },
    { name: "Séparation des Voix & Notes", desc: "Analyse musicologique et extraction des portées (music21)" },
    { name: "Synthèse Audio Multi-Piste", desc: "Rendu sonore HD via FluidSynth & SoundFonts (.sf2)" },
    { name: "Calcul des Timestamps & Karaoké", desc: "Alignement des notes pour la lecture assistée" },
  ];

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setCurrentStep(1);

    // Simulate animated realistic pipeline execution
    for (let s = 1; s <= 5; s++) {
      setCurrentStep(s);
      await new Promise((r) => setTimeout(r, 900));
    }

    // Redirect to newly created score studio
    router.push("/scores/demo-score");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Importer et Numériser une Partition</h1>
        <p className="text-xs text-gray-400 mt-1">
          Pipeline automatisé : Image/PDF $\rightarrow$ OMR $\rightarrow$ MusicXML $\rightarrow$ Synthèse Audio $\rightarrow$ Synchronisation.
        </p>
      </div>

      {!isProcessing ? (
        <form onSubmit={handleUpload} className="space-y-6">
          {/* File Dropzone */}
          <div className="border-2 border-dashed border-border-strong hover:border-accent rounded-3xl p-10 bg-surface-100/60 text-center space-y-4 transition-all group">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-surface-50 border border-border-subtle flex items-center justify-center text-accent group-hover:scale-110 transition-transform shadow-glow-accent">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Glissez votre partition ici ou{" "}
                <label className="text-accent underline cursor-pointer hover:text-accent-light">
                  parcourez vos fichiers
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFile(e.target.files[0]);
                        setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ""));
                      }
                    }}
                  />
                </label>
              </p>
              <p className="text-xs text-gray-500 font-mono mt-1">
                Formats acceptés : PDF, PNG, JPG (Qualité min: 300 DPI recommandée)
              </p>
            </div>

            {file && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/15 border border-accent/30 text-white text-xs font-mono">
                <FileText className="w-4 h-4 text-accent" />
                <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>

          {/* Metadata Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface-100 p-6 rounded-2xl border border-border-subtle">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Titre de l'œuvre</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Lettre à Élise"
                className="w-full bg-surface-50 border border-border-subtle rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Compositeur / Arrangeur</label>
              <input
                type="text"
                value={composer}
                onChange={(e) => setComposer(e.target.value)}
                placeholder="Ex: Ludwig van Beethoven"
                className="w-full bg-surface-50 border border-border-subtle rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-bold flex items-center justify-center gap-2 shadow-glow-accent btn-magnetic"
          >
            <Sparkles className="w-4 h-4" />
            <span>Lancer la Numérisation & la Synthèse Audio</span>
          </button>
        </form>
      ) : (
        /* Real-time Pipeline Progress Tracker */
        <div className="bg-surface-100 rounded-3xl border border-border-subtle p-8 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
              <p className="text-xs text-gray-400 font-mono">{composer} • En cours de traitement</p>
            </div>
            <div className="flex items-center gap-2 text-accent text-xs font-mono font-bold">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Étape {currentStep} / 5</span>
            </div>
          </div>

          <div className="space-y-4">
            {steps.map((step, idx) => {
              const stepNumber = idx + 1;
              const isDone = currentStep > stepNumber;
              const isCurrent = currentStep === stepNumber;

              return (
                <div
                  key={step.name}
                  className={`p-4 rounded-xl border transition-all flex items-center gap-4 ${
                    isDone
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : isCurrent
                      ? "bg-accent/15 border-accent text-white shadow-glow-accent"
                      : "bg-surface-50 border-border-subtle text-gray-500 opacity-60"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    {isDone ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-accent animate-spin" />
                    ) : (
                      <span className="text-gray-600">{stepNumber}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{step.name}</h4>
                    <p className="text-[11px] opacity-80">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
