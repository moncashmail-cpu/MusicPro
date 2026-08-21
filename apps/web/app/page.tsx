"use client";

import Link from "next/link";
import { 
  Sparkles, 
  UploadCloud, 
  Play, 
  ArrowRight, 
  Layers, 
  Sliders, 
  Music, 
  Headphones, 
  FileCode, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Eye, 
  Volume2, 
  BookOpen, 
  Users, 
  Award,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import { HeroLivePreview } from "@/components/landing/HeroLivePreview";
import { DirectUploadSection } from "@/components/landing/DirectUploadSection";

export default function LandingPage() {
  const steps = [
    {
      number: "01",
      title: "Scannez votre Partition",
      desc: "Importez n'importe quelle photo, scan ou fichier PDF de partition (monophonique, polyphonique ou chorale SATB).",
      icon: UploadCloud,
      gradient: "from-indigo-500 to-accent",
    },
    {
      number: "02",
      title: "Séparation SATB & Analyse OMR",
      desc: "L'intelligence artificielle convertit les symboles en MusicXML et extrait automatiquement chaque portée (Soprano, Alto, Ténor, Basse).",
      icon: Sliders,
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      number: "03",
      title: "Studio Interactif & Lecture Assistée",
      desc: "Écoutez la synthèse sonore réaliste, surlignez chaque note en temps réel et isolez les voix pour un apprentissage instantané.",
      icon: Headphones,
      gradient: "from-emerald-500 to-teal-600",
    },
  ];

  const features = [
    {
      title: "Reconnaissance Optique (OMR) Haute Fidélité",
      desc: "Conversion instantanée de vos partitions manuscrites ou imprimées vers le standard universel MusicXML avec correction structurelle.",
      icon: Eye,
      tag: "OMR ENGINE"
    },
    {
      title: "Quatuor Polyphonique SATB à 4 Voix",
      desc: "Détection et séparation automatique des tessitures vocales : Soprano, Alto, Ténor et Basse avec boutons SOLO et MUTE dédiés.",
      icon: Sliders,
      tag: "MULTI-TRACK"
    },
    {
      title: "Mode Pédagogique pour Non-Lecteurs",
      desc: "Surlignage synchronisé note par note style karaoké avec traduction instantanée du solfège en français (Do, Ré, Mi...) sous chaque note.",
      icon: Sparkles,
      tag: "PEDAGOGY"
    },
    {
      title: "Synthèse Sonore FluidSynth & SoundFonts HD",
      desc: "Génération audio multi-piste haute définition sans rendu robotique grâce à des banques sonores d'instruments acoustiques .sf2.",
      icon: Volume2,
      tag: "AUDIO SYNTH"
    },
    {
      title: "Contrôle Temporel & Métronome de Mesure",
      desc: "Ralentissez le morceau (0.5x, 0.75x, 1.0x, 1.25x) sans déformation de hauteur pour travailler les passages difficiles à votre rythme.",
      icon: Zap,
      tag: "TEMPO CONTROL"
    },
    {
      title: "Exports Universels en 1 Clic",
      desc: "Téléchargez les pistes audio séparées en MP3/WAV ou le fichier MusicXML complet pour l'éditer dans MuseScore, Finale ou Sibelius.",
      icon: FileCode,
      tag: "EXPORTS"
    },
  ];

  const testimonials = [
    {
      quote: "Une révolution pour notre chorale paroissiale ! Nos choristes non-lecteurs de solfège peuvent désormais répéter leur voix de ténor à la maison en écoutant uniquement leur ligne avec le nom des notes affiché.",
      author: "Marc D.",
      role: "Chef de Chœur & Directeur Musical",
    },
    {
      quote: "L'isolation instantanée des 4 voix SATB et le surlignage temps réel m'ont permis d'apprendre des pièces polyphoniques de Mozart trois fois plus vite qu'auparavant.",
      author: "Éléonore V.",
      role: "Choriste Alto & Pianiste amateur",
    },
    {
      quote: "Le moteur OMR combiné à la synthèse FluidSynth est d'une précision remarquable. On dépose le PDF et en 10 secondes on a une maquette audio propre pour travailler.",
      author: "Julien R.",
      role: "Professeur de Solfège & Compositeur",
    },
  ];

  const faqs = [
    {
      q: "Quels formats de partitions sont acceptés ?",
      a: "Vous pouvez importer des documents PDF de plusieurs pages ainsi que des images haute résolution aux formats PNG, JPG et JPEG. Le moteur prend en charge les partitions chorales SATB, les portées de piano et les instruments solistes."
    },
    {
      q: "Comment fonctionne le mode pour non-lecteurs de solfège ?",
      a: "Le mode non-lecteur surligne la note en cours de lecture en temps réel sur la portée et affiche simultanément son nom en solfège français (Do, Ré, Mi, Fa, Sol, La, Si) ou anglo-saxon (C, D, E, F...). Vous pouvez également ralentir le tempo pour apprendre pas à pas."
    },
    {
      q: "Puis-je isoler une seule voix (ex: Soprano ou Basse) ?",
      a: "Absolument. Grâce à la console de mixage SATB intégrée, vous disposez de boutons SOLO et MUTE pour chaque voix. Vous pouvez par exemple couper votre propre voix pour chanter par-dessus l'accompagnement des trois autres."
    },
    {
      q: "Puis-je exporter les fichiers audio et MusicXML ?",
      a: "Oui ! Chaque partition génère des fichiers audio MP3 par voix isolée, un mixage audio global et le fichier source MusicXML prêt pour Finale, Sibelius ou MuseScore."
    }
  ];

  return (
    <div className="space-y-24 animate-fade-in pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 pb-12">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-accent/20 rounded-full blur-[140px] pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[250px] bg-cyan-neon/15 rounded-full blur-[120px] pointer-events-none -z-10"></div>

        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-100 border border-border-strong text-white text-xs font-mono shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-neon animate-pulse"></span>
            <span className="text-gray-300">Plateforme OMR & Synthèse Audio SATB</span>
            <span className="text-accent font-bold">v1.0</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Transformez vos partitions en{" "}
            <span className="bg-gradient-to-r from-accent via-indigo-300 to-cyan-neon bg-clip-text text-transparent">
              audio interactif
            </span>{" "}
            & voix séparées.
          </h1>

          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Numérisez vos partitions en un clic. Isolez les voix <strong className="text-white">Soprano, Alto, Ténor et Basse</strong>, et suivez la lecture grâce au surlignage synchronisé note par note adapté aux non-lecteurs.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="#upload"
              className="px-8 py-4 rounded-2xl bg-accent hover:bg-accent-hover text-white text-sm font-bold flex items-center gap-2.5 shadow-glow-accent btn-magnetic"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Numériser une partition (Gratuit)</span>
            </a>
            <Link
              href="/scores/demo-score"
              className="px-8 py-4 rounded-2xl bg-surface-100 border border-border-strong hover:border-accent text-white text-sm font-semibold flex items-center gap-2.5 transition-all hover:bg-surface-50"
            >
              <Play className="w-4 h-4 text-cyan-neon fill-cyan-neon" />
              <span>Ouvrir le Studio Démo</span>
            </Link>
          </div>
        </div>

        {/* Live Interactive Hero Preview Widget */}
        <div className="mt-14 max-w-4xl mx-auto">
          <HeroLivePreview />
        </div>
      </section>

      {/* 2. DIRECT UPLOAD SECTION */}
      <DirectUploadSection />

      {/* 3. COMMENT ÇA MARCHE (3 STEPS) */}
      <section id="how-it-works" className="relative py-12 px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-100 border border-border-subtle text-gray-400 text-xs font-mono">
            <span>FLUX INTUITIF</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Comment fonctionne <span className="text-accent">MusikPro</span> ?
          </h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Une technologie de pointe orchestrée en 3 étapes simples pour rendre la musique accessible à tous.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.number}
                className="bg-surface-100 rounded-3xl border border-border-subtle p-8 shadow-card relative overflow-hidden flex flex-col justify-between group hover:border-accent/40 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${s.gradient} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-extrabold font-mono text-gray-700 group-hover:text-accent transition-colors">
                      {s.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{s.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURES SHOWCASE */}
      <section id="features" className="relative py-12 px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-neon/10 border border-cyan-neon/20 text-cyan-neon text-xs font-mono">
            <span>FONCTIONNALITÉS EXCLUSIVES</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Conçu pour les chorales, musiciens & débutants
          </h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Tous les outils nécessaires pour déchiffrer, écouter et répéter sans aucune barrière technique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="bg-surface-100 rounded-3xl border border-border-subtle p-7 shadow-card hover:border-border-strong transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-surface-50 border border-border-subtle flex items-center justify-center text-accent">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-surface-50 text-gray-400 border border-border-subtle">
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">{f.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. TÉMOIGNAGES & SOCIAL PROOF */}
      <section className="relative py-12 px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span>RETOURS D'EXPÉRIENCE</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Adopté par les passionnés de chant et de solfège
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-surface-100 rounded-3xl border border-border-subtle p-8 shadow-card flex flex-col justify-between space-y-6"
            >
              <p className="text-xs text-gray-300 leading-relaxed italic">
                « {t.quote} »
              </p>
              <div className="border-t border-border-subtle pt-4">
                <h4 className="text-sm font-bold text-white">{t.author}</h4>
                <p className="text-[11px] text-gray-400 font-mono">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section id="faq" className="relative py-12 px-4 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-100 border border-border-subtle text-gray-400 text-xs font-mono">
            <HelpCircle className="w-3.5 h-3.5 text-accent" />
            <span>FOIRE AUX QUESTIONS</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Questions Fréquentes
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-surface-100 rounded-2xl border border-border-subtle p-6 shadow-card space-y-2"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-accent font-mono">Q.</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FINAL CTA BANNER */}
      <section className="relative max-w-5xl mx-auto px-4">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-surface-100 to-surface-200 border border-accent/30 p-10 md:p-14 text-center space-y-6 shadow-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Prêt à donner de la voix à vos partitions ?
          </h2>
          <p className="text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Rejoignez des centaines de musiciens et chorales qui utilisent MusikPro pour numériser, séparer les voix et répéter facilement.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#upload"
              className="px-8 py-4 rounded-2xl bg-accent hover:bg-accent-hover text-white text-sm font-bold flex items-center gap-2 shadow-glow-accent btn-magnetic"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Numériser ma première partition</span>
            </a>
            <Link
              href="/scores/demo-score"
              className="px-8 py-4 rounded-2xl bg-surface-50 border border-border-subtle hover:border-border-strong text-white text-sm font-semibold transition-colors"
            >
              <span>Tester le Studio Interactif</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-border-subtle pt-12 text-center text-xs text-gray-500 font-mono space-y-4">
        <div className="flex items-center justify-center gap-6 text-gray-400">
          <a href="#demo" className="hover:text-white transition-colors">Démonstrateur</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">Comment ça marche</a>
          <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
          <a href="#upload" className="hover:text-white transition-colors">Numériser</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>
        <p>© 2026 MusikPro. Architecture OMR & Synthèse Audio Multi-Piste. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
