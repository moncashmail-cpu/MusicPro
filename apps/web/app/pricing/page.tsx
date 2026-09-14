"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Crown, 
  Music, 
  Headphones, 
  FileCode, 
  Sliders, 
  HelpCircle,
  CheckCircle2,
  X,
  CreditCard,
  Smartphone,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { PRICING_PLANS, PlanConfig } from "@/lib/paymentService";
import { PaymentMethodSelector } from "@/components/payments/PaymentMethodSelector";

function PricingContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const refParam = searchParams.get("ref");
  const planParam = searchParams.get("plan");

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PlanConfig | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  useEffect(() => {
    if (status === "success") {
      setShowSuccessToast(true);
    }
  }, [status]);

  const activeProPlan = billingCycle === "yearly" ? PRICING_PLANS.pro_yearly : PRICING_PLANS.pro_monthly;

  const faqs = [
    {
      q: "Quels sont les moyens de paiement acceptés ?",
      a: "Nous acceptons tous les portefeuilles Mobile Money locaux via Moneroo et FedaPay : MTN Mobile Money (Bénin, Côte d'Ivoire), Moov Money / Flooz (Bénin, Togo, CI), Orange Money (Sénégal, CI, Cameroun), Wave (Sénégal, CI) ainsi que les cartes Visa et Mastercard internationales.",
    },
    {
      q: "Comment fonctionne la séparation des 4 voix SATB ?",
      a: "Notre algorithme OMR associé à music21 analyse la direction des hampes (hampes vers le haut pour Soprano et Ténor, hampes vers le bas pour Alto et Basse) pour isoler mathématiquement chaque pupitre sans bavure harmonique.",
    },
    {
      q: "Puis-je exporter l'audio pour mes choristes ?",
      a: "Absolument. Les membres Pro et Master peuvent télécharger en 1 clic les fichiers MP3 ou WAV de chaque voix isolée avec son synthétisé HD .sf2 pour les envoyer par WhatsApp ou email.",
    },
    {
      q: "Puis-je annuler mon abonnement à tout moment ?",
      a: "Oui, sans aucun engagement ni frais de résiliation. Vous conservez vos accès jusqu'au dernier jour de la période facturée.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-16">
      {/* Success Toast / Notification */}
      {showSuccessToast && (
        <div className="rounded-2xl bg-emerald-500/15 border border-emerald-500/40 p-5 flex items-center justify-between shadow-glow-accent">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Paiement Validé avec Succès !</h4>
              <p className="text-xs text-emerald-300 font-mono">
                Votre abonnement est actif. Réf: {refParam || "MSK-CONFIRMED"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSuccessToast(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-mono font-bold">
          <Crown className="w-3.5 h-3.5" />
          <span>TARIFICATION TRANSPARENTE EN FCFA</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Investissez dans l'excellence vocale de votre chœur
        </h1>
        <p className="text-sm md:text-base text-gray-400">
          Numérisez vos partitions, isolez chaque pupitre (Soprano, Alto, Ténor, Basse) et faites progresser vos choristes en un temps record.
        </p>

        {/* Monthly / Yearly Switch */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <span className={`text-xs font-mono font-bold ${billingCycle === "monthly" ? "text-white" : "text-gray-400"}`}>
            Mensuel
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className="w-14 h-8 bg-surface-50 border border-border-strong rounded-full p-1 transition-colors relative flex items-center"
          >
            <div
              className={`w-6 h-6 rounded-full bg-accent transition-transform shadow-glow-accent ${
                billingCycle === "yearly" ? "translate-x-6 bg-cyan-neon" : "translate-x-0"
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-mono font-bold ${billingCycle === "yearly" ? "text-white" : "text-gray-400"}`}>
              Annuel
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
              -17% (2 Mois Offerts)
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Card 1: Découverte / Gratuit */}
        <div className="bg-surface-100 rounded-3xl border border-border-subtle p-7 flex flex-col justify-between shadow-card hover:border-gray-700 transition-all">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                {PRICING_PLANS.free.name}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">{PRICING_PLANS.free.tagline}</h3>
            </div>

            <div className="flex items-baseline gap-1 pt-2">
              <span className="text-4xl font-black text-white font-mono">0</span>
              <span className="text-xs text-gray-400 font-mono">FCFA / mois</span>
            </div>

            <ul className="space-y-3 pt-4 border-t border-border-subtle">
              {PRICING_PLANS.free.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                  <Check className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/dashboard"
            className="w-full mt-8 py-3 rounded-2xl bg-surface-50 hover:bg-surface-200 border border-border-subtle text-white font-bold text-xs text-center transition-all"
          >
            Commencer Gratuitement
          </Link>
        </div>

        {/* Card 2: Choriste Pro (Featured) */}
        <div className="bg-surface-100 rounded-3xl border-2 border-accent p-7 flex flex-col justify-between shadow-glow-accent relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-accent text-white text-[10px] font-mono font-black uppercase px-4 py-1 rounded-bl-xl tracking-wider">
            {activeProPlan.badge}
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
                {activeProPlan.name}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">{activeProPlan.tagline}</h3>
            </div>

            <div className="flex items-baseline gap-1 pt-2">
              <span className="text-4xl font-black text-white font-mono">
                {activeProPlan.priceXOF.toLocaleString("fr-FR")}
              </span>
              <span className="text-xs text-gray-400 font-mono">
                FCFA {billingCycle === "yearly" ? "/ an" : "/ mois"}
              </span>
            </div>

            <ul className="space-y-3 pt-4 border-t border-border-subtle">
              {activeProPlan.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-200">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setSelectedPlanForCheckout(activeProPlan)}
            className="w-full mt-8 py-3.5 rounded-2xl bg-accent hover:bg-accent-hover text-white font-bold text-xs shadow-glow-accent transition-all btn-magnetic flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>Passer à Choriste Pro</span>
          </button>
        </div>

        {/* Card 3: Chef de Chœur & Master */}
        <div className="bg-surface-100 rounded-3xl border border-border-strong p-7 flex flex-col justify-between shadow-card hover:border-cyan-neon/60 transition-all">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-neon uppercase tracking-wider">
                {PRICING_PLANS.master_monthly.name}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">{PRICING_PLANS.master_monthly.tagline}</h3>
            </div>

            <div className="flex items-baseline gap-1 pt-2">
              <span className="text-4xl font-black text-white font-mono">
                {PRICING_PLANS.master_monthly.priceXOF.toLocaleString("fr-FR")}
              </span>
              <span className="text-xs text-gray-400 font-mono">FCFA / mois</span>
            </div>

            <ul className="space-y-3 pt-4 border-t border-border-subtle">
              {PRICING_PLANS.master_monthly.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                  <Check className="w-4 h-4 text-cyan-neon shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setSelectedPlanForCheckout(PRICING_PLANS.master_monthly)}
            className="w-full mt-8 py-3.5 rounded-2xl bg-surface-50 hover:bg-surface-200 border border-cyan-neon/40 text-cyan-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <Crown className="w-4 h-4 text-cyan-neon" />
            <span>Choisir le Plan Master</span>
          </button>
        </div>
      </div>

      {/* Credit Pack Single Purchase Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-surface-100 via-surface-200 to-surface-100 border border-border-subtle p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Besoin de quelques numérisations ponctuelles ?</h4>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Pack 5 Partitions OMR sans engagement ni abonnement pour seulement 1 000 FCFA (via MTN MoMo, Moov, Wave).
            </p>
          </div>
        </div>

        <button
          onClick={() => setSelectedPlanForCheckout(PRICING_PLANS.pack_credits_5)}
          className="px-6 py-3 rounded-xl bg-surface-50 hover:bg-surface-200 border border-amber-500/40 text-amber-300 hover:text-white font-bold text-xs shrink-0 transition-all font-mono"
        >
          Acheter le Pack (1 000 FCFA)
        </button>
      </div>

      {/* Test 1 FCFA Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950/40 via-surface-100 to-emerald-950/40 border border-emerald-500/40 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-glow-accent">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-black text-white">🧪 Mode Test de Paiement Réel (1 FCFA)</h4>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-mono font-black uppercase">
                TEST DIRECT 1 FCFA
              </span>
            </div>
            <p className="text-xs text-emerald-300 font-mono mt-0.5">
              Tester le flux de paiement réel (MTN MoMo, Moov Flooz, Wave, Orange Money, Carte) pour seulement 1 FCFA.
            </p>
          </div>
        </div>

        <button
          onClick={() => setSelectedPlanForCheckout(PRICING_PLANS.test_1f)}
          className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs shrink-0 transition-all shadow-glow-accent btn-magnetic flex items-center gap-2"
        >
          <Zap className="w-4 h-4 fill-black" />
          <span>Tester le Paiement à 1 FCFA</span>
        </button>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto space-y-6 pt-8">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-white">Questions Fréquentes</h3>
          <p className="text-xs text-gray-400 font-mono">Tout savoir sur le paiement Mobile Money et les abonnements</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-surface-100 border border-border-subtle rounded-2xl p-5 space-y-2">
              <h5 className="text-xs font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-accent shrink-0" />
                <span>{faq.q}</span>
              </h5>
              <p className="text-xs text-gray-400 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Modal */}
      {selectedPlanForCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl">
            <button
              onClick={() => setSelectedPlanForCheckout(null)}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-surface-50 border border-border-strong flex items-center justify-center text-gray-400 hover:text-white shadow-card"
            >
              <X className="w-4 h-4" />
            </button>
            <PaymentMethodSelector
              plan={selectedPlanForCheckout}
              onClose={() => setSelectedPlanForCheckout(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
          <p className="text-xs font-mono text-gray-400">Chargement des offres MusikPro...</p>
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}

