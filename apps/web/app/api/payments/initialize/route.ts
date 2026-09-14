import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/lib/paymentService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, customer, gateway, operator, returnUrl } = body;

    if (!planId) {
      return NextResponse.json({ error: "Le paramètre planId est requis" }, { status: 400 });
    }

    if (!customer?.email) {
      return NextResponse.json({ error: "L'adresse email du client est requise" }, { status: 400 });
    }

    const origin = request.headers.get("origin") || request.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const computedReturnUrl = returnUrl || `${origin}/pricing?status=success`;

    const result = await PaymentService.initializePayment({
      planId,
      customer,
      gateway: gateway || "moneroo",
      operator,
      returnUrl: computedReturnUrl,
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Payment initialization API error:", error);
    const errMessage = error instanceof Error ? error.message : "Erreur interne lors de l'initialisation du paiement";
    return NextResponse.json(
      { error: errMessage },
      { status: 500 }
    );
  }
}
