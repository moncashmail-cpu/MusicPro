"use client";

import { useState } from "react";
import { 
  CreditCard, 
  Smartphone, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  Lock, 
  Zap,
  Globe2,
  ExternalLink
} from "lucide-react";
import { PlanConfig } from "@/lib/paymentService";

interface PaymentMethodSelectorProps {
  plan: PlanConfig;
  onSuccess?: (paymentId: string) => void;
  onClose?: () => void;
}

export type PaymentOperator = "mtn_bj" | "moov_bj" | "orange_ci" | "wave_ci" | "mtn_ci" | "card";

const OPERATORS = [
  {
    id: "mtn_bj" as PaymentOperator,
    name: "MTN MoMo",
    country: "Bénin 🇧🇯",
    dialCode: "+229",
    color: "from-amber-400 to-yellow-500",
    badgeBg: "bg-amber-500/15 border-amber-500/40 text-amber-300",
    gateway: "moneroo",
  },
  {
    id: "moov_bj" as PaymentOperator,
    name: "Moov Flooz",
    country: "Bénin 🇧🇯 / Togo 🇹🇬",
    dialCode: "+229",
    color: "from-blue-600 to-cyan-500",
    badgeBg: "bg-blue-500/15 border-blue-500/40 text-blue-300",
    gateway: "fedapay",
  },
  {
    id: "orange_ci" as PaymentOperator,
    name: "Orange Money",
    country: "Côte d'Ivoire 🇨🇮 / SN 🇸🇳",
    dialCode: "+225",
    color: "from-orange-500 to-amber-500",
    badgeBg: "bg-orange-500/15 border-orange-500/40 text-orange-300",
    gateway: "moneroo",
  },
  {
    id: "wave_ci" as PaymentOperator,
    name: "Wave Money",
    country: "Sénégal 🇸🇳 / CI 🇨🇮",
    dialCode: "+225",
    color: "from-sky-400 to-cyan-400",
    badgeBg: "bg-sky-500/15 border-sky-500/40 text-sky-300",
    gateway: "moneroo",
  },
  {
    id: "card" as PaymentOperator,
    name: "Carte Bancaire",
    country: "Visa / Mastercard",
    dialCode: "+229",
    color: "from-indigo-500 to-purple-600",
    badgeBg: "bg-indigo-500/15 border-indigo-500/40 text-indigo-300",
    gateway: "moneroo",
  },
];

export function PaymentMethodSelector({ plan, onSuccess, onClose }: PaymentMethodSelectorProps) {
  const [selectedOperator, setSelectedOperator] = useState<PaymentOperator>("mtn_bj");
  const [selectedGateway, setSelectedGateway] = useState<"moneroo" | "fedapay">("moneroo");
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeOp = OPERATORS.find((o) => o.id === selectedOperator) || OPERATORS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Veuillez saisir votre adresse email pour recevoir la confirmation.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fullPhone = phone ? `${activeOp.dialCode}${phone.replace(/\s+/g, "")}` : undefined;

      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          gateway: selectedGateway,
          operator: selectedOperator,
          customer: {
            first_name: firstName || "Choriste",
            last_name: lastName || "MusikPro",
            email: email,
            phone: fullPhone,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error || "Impossible d'initialiser le paiement sécurisé");
      }

      // Open Moneroo or FedaPay checkout
      window.location.href = data.checkoutUrl;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur de paiement";
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface-100 rounded-3xl border border-border-strong p-6 md:p-8 shadow-card backdrop-blur-2xl max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-border-subtle pb-5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-mono font-bold">
              PAIEMENT SÉCURISÉ
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
              Moneroo + FedaPay
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-2 tracking-tight">
            Souscrire à {plan.name}
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Montant total : <strong className="text-white text-sm">{plan.priceXOF.toLocaleString("fr-FR")} FCFA</strong>
            {plan.period === "month" && " / mois"}
            {plan.period === "year" && " / an"}
          </p>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent to-cyan-neon flex items-center justify-center text-white shadow-glow-accent">
          <Lock className="w-5 h-5" />
        </div>
      </div>

      {/* Gateway Switcher (Moneroo vs FedaPay) */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-accent" />
          <span>Passerelle de Paiement :</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSelectedGateway("moneroo")}
            className={`p-3 rounded-2xl border text-left transition-all ${
              selectedGateway === "moneroo"
                ? "bg-accent/15 border-accent shadow-glow-accent ring-1 ring-accent"
                : "bg-surface-50 border-border-subtle hover:border-gray-600 text-gray-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Moneroo Live</span>
              {selectedGateway === "moneroo" && <CheckCircle2 className="w-4 h-4 text-accent" />}
            </div>
            <p className="text-[10px] text-gray-400 font-mono mt-1">Multi-pays • MoMo, Wave, Card</p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedGateway("fedapay")}
            className={`p-3 rounded-2xl border text-left transition-all ${
              selectedGateway === "fedapay"
                ? "bg-cyan-neon/15 border-cyan-neon shadow-glow-cyan ring-1 ring-cyan-neon"
                : "bg-surface-50 border-border-subtle hover:border-gray-600 text-gray-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">FedaPay Direct</span>
              {selectedGateway === "fedapay" && <CheckCircle2 className="w-4 h-4 text-cyan-neon" />}
            </div>
            <p className="text-[10px] text-gray-400 font-mono mt-1">Bénin 🇧🇯, Togo 🇹🇬, CI 🇨🇮</p>
          </button>
        </div>
      </div>

      {/* Operator Selection */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-accent" />
          <span>Sélectionnez votre moyen de paiement :</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {OPERATORS.map((op) => {
            const isSelected = selectedOperator === op.id;
            return (
              <button
                key={op.id}
                type="button"
                onClick={() => {
                  setSelectedOperator(op.id);
                  if (op.id === "moov_bj") setSelectedGateway("fedapay");
                  else if (op.id === "wave_ci" || op.id === "orange_ci") setSelectedGateway("moneroo");
                }}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden flex items-center justify-between ${
                  isSelected
                    ? "bg-surface-50 border-accent shadow-sm ring-1 ring-accent"
                    : "bg-surface-200/50 border-border-subtle hover:border-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${op.color} flex items-center justify-center text-white shadow-sm font-bold text-xs`}>
                    {op.id === "card" ? <CreditCard className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{op.name}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{op.country}</div>
                  </div>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${op.badgeBg}`}>
                  {op.dialCode}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Details */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-semibold text-gray-400">Prénom</label>
            <input
              type="text"
              placeholder="Marc"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-surface-200 border border-border-subtle rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-semibold text-gray-400">Nom</label>
            <input
              type="text"
              placeholder="Dagnon"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-surface-200 border border-border-subtle rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-semibold text-gray-400">
            Adresse Email <span className="text-accent">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="choriste@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-surface-200 border border-border-subtle rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        {selectedOperator !== "card" && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-semibold text-gray-400">
              Numéro de téléphone ({activeOp.name})
            </label>
            <div className="flex gap-2">
              <span className="bg-surface-50 border border-border-subtle rounded-xl px-3 py-2.5 text-xs font-mono text-gray-300 flex items-center">
                {activeOp.dialCode}
              </span>
              <input
                type="tel"
                placeholder="61 00 00 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 bg-surface-200 border border-border-subtle rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-mono"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {/* CTA Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-accent to-indigo-600 hover:from-accent-hover hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow-accent transition-all duration-200 btn-magnetic disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Génération du lien sécurisé...</span>
            </>
          ) : (
            <>
              <span>Payer {plan.priceXOF.toLocaleString("fr-FR")} FCFA en toute sécurité</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Security Trust Badges */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500 font-mono pt-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Chiffrement SSL 256-bit
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5 text-accent" />
            Agrément UEMOA / CEMAC
          </span>
        </div>
      </form>
    </div>
  );
}
