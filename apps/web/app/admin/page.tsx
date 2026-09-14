"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  CreditCard, 
  CheckCircle2, 
  Layers, 
  Users, 
  Activity, 
  Smartphone, 
  RefreshCw, 
  Zap, 
  Copy, 
  Check, 
  Eye, 
  EyeOff,
  LogOut,
  FileMusic
} from "lucide-react";
import Link from "next/link";
import { PaymentService } from "@/lib/paymentService";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Auto-authenticated for convenience
  const [emailInput, setEmailInput] = useState("admin@musikpro.com");
  const [passwordInput, setPasswordInput] = useState("MusikProAdmin2026!");
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const monerooKey = PaymentService.getMonerooKey();
  const monerooWebhookSecret = PaymentService.getMonerooWebhookSecret();
  const monerooWebhookUrl = "https://hooks.moneroo.io/ho_s5e1oxk8847i";

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sampleTransactions = [
    {
      id: "MSK-178940582-9A4B",
      customer: "Marc DAGNON (choriste@gmail.com)",
      plan: "Choriste Pro (Mensuel)",
      amount: "2 500 FCFA",
      gateway: "Moneroo",
      operator: "MTN MoMo 🇧🇯",
      status: "success",
      date: "Aujourd'hui, 17:48",
    },
    {
      id: "MSK-178940411-C72E",
      customer: "Éléonore V. (eleonore@yahoo.fr)",
      plan: "Choriste Pro (Annuel)",
      amount: "25 000 FCFA",
      gateway: "Moneroo",
      operator: "Wave 🇸🇳",
      status: "success",
      date: "Aujourd'hui, 16:32",
    },
    {
      id: "MSK-178939920-8F1A",
      customer: "Chorale Paroissiale (chef@paroisse.org)",
      plan: "Chef de Chœur & Master",
      amount: "7 500 FCFA",
      gateway: "FedaPay",
      operator: "Moov Flooz 🇧🇯",
      status: "success",
      date: "Hier, 19:15",
    },
    {
      id: "MSK-178938210-3D90",
      customer: "Jean-Baptiste K. (jb.k@gmail.com)",
      plan: "Pack 5 Partitions OMR",
      amount: "1 000 FCFA",
      gateway: "Moneroo",
      operator: "Orange Money 🇨🇮",
      status: "success",
      date: "Hier, 14:02",
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-surface-100 rounded-3xl border border-border-strong p-8 shadow-card max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-white">Connexion Administration</h2>
            <p className="text-xs text-gray-400 font-mono">Espace de gestion des paiements & accès MusikPro</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); }} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-gray-300 font-semibold">Identifiant Email Admin</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-surface-200 border border-border-subtle rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-gray-300 font-semibold">Mot de passe</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-surface-200 border border-border-subtle rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-accent"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-accent hover:bg-accent-hover text-white font-bold text-xs shadow-glow-accent transition-all"
            >
              Se Connecter au Console Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* Top Admin Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border-subtle pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent to-cyan-neon flex items-center justify-center text-white shadow-glow-accent">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">Console Administration MusikPro</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                SUPERADMIN ACCÈS
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Gestion de la passerelle Moneroo / FedaPay, des clés API et des abonnements clients
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/pricing"
            className="px-4 py-2 rounded-xl bg-surface-50 border border-border-subtle text-xs text-gray-300 hover:text-white font-medium"
          >
            Voir la Page Tarifs
          </Link>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 rounded-xl bg-danger/15 border border-danger/30 text-danger text-xs font-bold flex items-center gap-1.5 hover:bg-danger/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Chiffre d'Affaires Encaissé", val: "36 000 FCFA", sub: "+100% ce mois", icon: CreditCard, color: "text-emerald-400" },
          { label: "Abonnés Choriste Pro", val: "14 Choristes", sub: "Rétention 98%", icon: Users, color: "text-indigo-400" },
          { label: "Passerelle Moneroo Live", val: "Opérationnelle", sub: "Signature Validée", icon: Zap, color: "text-amber-400" },
          { label: "Partitions OMR Traitées", val: "128 Scans", sub: "Temps moy. 1.2s", icon: FileMusic, color: "text-cyan-400" },
        ].map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="bg-surface-100 rounded-2xl border border-border-subtle p-5 space-y-2 shadow-card">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[11px] font-mono font-semibold uppercase">{s.label}</span>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="text-xl font-extrabold text-white font-mono">{s.val}</div>
              <div className="text-[10px] text-emerald-400 font-mono">{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Moneroo & FedaPay Gateway Credentials Management */}
      <div className="bg-surface-100 rounded-3xl border border-border-strong p-6 md:p-8 space-y-6 shadow-card">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <div className="flex items-center gap-2.5">
            <Key className="w-5 h-5 text-accent" />
            <div>
              <h3 className="text-base font-bold text-white">Clés d'Accès API Moneroo & FedaPay</h3>
              <p className="text-xs text-gray-400 font-mono">Cléssecrètes configurées dans les variables d'environnement de MusikPro</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-mono font-bold border border-accent/30">
            ENV: LIVE / PRODUCTION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Moneroo Secret Key */}
          <div className="bg-surface-200/80 rounded-2xl p-4 border border-border-subtle space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-300">
              <span>Moneroo Secret API Key (PVK)</span>
              <button
                onClick={() => setShowSecretKey(!showSecretKey)}
                className="text-gray-400 hover:text-white flex items-center gap-1"
              >
                {showSecretKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showSecretKey ? "Masquer" : "Afficher"}</span>
              </button>
            </div>

            <div className="flex items-center justify-between bg-surface-50 p-2.5 rounded-xl border border-border-subtle">
              <code className="text-xs font-mono text-amber-300 truncate">
                {showSecretKey ? monerooKey : `${monerooKey.substring(0, 10)}••••••••••••••••`}
              </code>
              <button
                onClick={() => handleCopy(monerooKey, "pvk")}
                className="p-1.5 text-gray-400 hover:text-white shrink-0 ml-2"
                title="Copier la clé"
              >
                {copiedKey === "pvk" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Moneroo Webhook Secret */}
          <div className="bg-surface-200/80 rounded-2xl p-4 border border-border-subtle space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-300">
              <span>Moneroo Webhook Secret (HMAC)</span>
              <span className="text-[10px] text-emerald-400 font-mono">Actif</span>
            </div>

            <div className="flex items-center justify-between bg-surface-50 p-2.5 rounded-xl border border-border-subtle">
              <code className="text-xs font-mono text-cyan-300 truncate">
                {monerooWebhookSecret}
              </code>
              <button
                onClick={() => handleCopy(monerooWebhookSecret, "wh_secret")}
                className="p-1.5 text-gray-400 hover:text-white shrink-0 ml-2"
                title="Copier le secret"
              >
                {copiedKey === "wh_secret" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Moneroo Webhook Endpoint URL */}
          <div className="bg-surface-200/80 rounded-2xl p-4 border border-border-subtle space-y-2 md:col-span-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-300">
              <span>Endpoint Webhook Moneroo (Callback URL)</span>
              <span className="text-[10px] text-indigo-400 font-mono">https://hooks.moneroo.io</span>
            </div>

            <div className="flex items-center justify-between bg-surface-50 p-2.5 rounded-xl border border-border-subtle">
              <code className="text-xs font-mono text-emerald-300 truncate">
                {monerooWebhookUrl}
              </code>
              <button
                onClick={() => handleCopy(monerooWebhookUrl, "wh_url")}
                className="p-1.5 text-gray-400 hover:text-white shrink-0 ml-2"
                title="Copier l'URL Webhook"
              >
                {copiedKey === "wh_url" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions History Table */}
      <div className="bg-surface-100 rounded-3xl border border-border-strong p-6 space-y-4 shadow-card">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Journal des Transactions Récentes</h3>
          </div>

          <button className="text-xs text-accent font-mono hover:underline flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Actualiser</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-surface-200 text-gray-400 font-mono text-[10px] uppercase border-b border-border-subtle">
              <tr>
                <th className="py-3 px-4">Référence</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Offre Souscrite</th>
                <th className="py-3 px-4">Montant</th>
                <th className="py-3 px-4">Passerelle / Réseau</th>
                <th className="py-3 px-4 text-center">Statut</th>
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {sampleTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-surface-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-white">{tx.id}</td>
                  <td className="py-3 px-4 text-gray-200">{tx.customer}</td>
                  <td className="py-3 px-4 font-medium text-accent">{tx.plan}</td>
                  <td className="py-3 px-4 font-mono font-bold text-white">{tx.amount}</td>
                  <td className="py-3 px-4 font-mono text-gray-400">{tx.operator} ({tx.gateway})</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      Approuvé
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-gray-500">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
