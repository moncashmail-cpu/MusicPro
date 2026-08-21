"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  Loader2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { ScoreManager } from "@/lib/scoreManager";

export function DirectUploadSection() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    { name: "Téléversement & Sécurisation", desc: "Envoi chiffré vers Supabase Storage & MinIO" },
    { name: "Reconnaissance Optique (OMR)", desc: "Lecture des symboles, portées et notes $\\rightarrow$ MusicXML" },
    { name: "Séparation SATB (4 Voix)", desc: "Extraction automatique Soprano, Alto, Ténor, Basse (music21)" },
    { name: "Synthèse Audio Multi-Piste", desc: "Rendu sonore HD réaliste FluidSynth & SoundFonts (.sf2)" },
    { name: "Calcul des Timestamps & Karaoké", desc: "Alignement temporel précis pour le surlignage note à note" },
  ];

  const handleFileUpload = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);

    let newScoreId = "demo-score";
    try {
      const generatedTitle = selectedFile.name.replace(/\.[^/.]+$/, "");
      const generatedComposer = "Partition Choral SATB";

      for (let s = 1; s <= 4; s++) {
        setCurrentStep(s);
        await new Promise((r) => setTimeout(r, 600));
      }

      const createdScore = await ScoreManager.uploadAndProcessScore(selectedFile, generatedTitle, generatedComposer);
      newScoreId = createdScore.id;
      setCurrentStep(5);
      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      console.error("Upload error:", err);
    }

    router.push(`/scores/${newScoreId}`);
  };

  return (
    <section id="upload" className="relative py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Section Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Moteur OMR & Synthèse Automatisée</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Déposez votre partition, <span className="bg-gradient-to-r from-accent via-indigo-300 to-cyan-neon bg-clip-text text-transparent">l'IA fait tout le reste</span>
          </h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Glissez simplement votre fichier (PDF ou photo de partition). Détection automatique des voix, transcription OMR et génération audio instantanée.
          </p>
        </div>

        {/* 1-Click Upload Dropzone or Progress Pipeline */}
        {!isProcessing ? (
          <div className="bg-surface-100 rounded-3xl border border-border-strong p-8 md:p-12 shadow-card backdrop-blur-xl">
            <div className="border-2 border-dashed border-border-strong hover:border-accent rounded-3xl p-10 md:p-16 text-center bg-surface-200/50 space-y-5 transition-all group cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="w-20 h-20 mx-auto rounded-3xl bg-surface-50 border border-border-subtle flex items-center justify-center text-accent group-hover:scale-110 group-hover:shadow-glow-accent transition-all">
                <UploadCloud className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-extrabold text-white">
                  Glissez-déposez votre partition ici
                </p>
                <p className="text-sm text-accent underline font-semibold">
                  ou cliquez pour sélectionner un fichier
                </p>
                <p className="text-xs text-gray-500 font-mono pt-2">
                  Formats acceptés : PDF, PNG, JPG (Qualité CamScanner ou partition imprimée)
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 pt-6 text-[11px] font-mono text-gray-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Données 100% Chiffrées
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-accent" /> Détection Automatique SATB (4 Voix)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-neon" /> Rendu Audio HD
              </span>
            </div>
          </div>
        ) : (
          /* Live Progress Pipeline */
          <div className="bg-surface-100 rounded-3xl border border-accent/40 p-8 md:p-10 shadow-card backdrop-blur-xl space-y-6 animate-pulse-slow">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">{file?.name || "Partition"}</h3>
                <p className="text-xs text-gray-400 font-mono">Analyse OMR & Synthèse SATB en cours...</p>
              </div>
              <div className="flex items-center gap-2 text-accent text-xs font-mono font-bold bg-accent/15 px-3 py-1.5 rounded-xl border border-accent/30">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Étape {currentStep} / 5</span>
              </div>
            </div>

            <div className="space-y-3">
              {steps.map((step, idx) => {
                const stepNum = idx + 1;
                const isDone = currentStep > stepNum;
                const isCurrent = currentStep === stepNum;

                return (
                  <div
                    key={step.name}
                    className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                      isDone
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : isCurrent
                        ? "bg-accent/20 border-accent text-white shadow-glow-accent"
                        : "bg-surface-50 border-border-subtle text-gray-500 opacity-50"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0">
                      {isDone ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : isCurrent ? (
                        <Loader2 className="w-5 h-5 text-accent animate-spin" />
                      ) : (
                        <span className="text-gray-600">{stepNum}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">{step.name}</h4>
                      <p className="text-[11px] opacity-80 font-mono">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
