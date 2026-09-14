import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/lib/paymentService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("paymentId") || searchParams.get("ref");
    const gateway = (searchParams.get("gateway") || "moneroo") as "moneroo" | "fedapay";

    if (!paymentId) {
      return NextResponse.json({ error: "Identifiant de paiement manquant" }, { status: 400 });
    }

    const verification = await PaymentService.verifyPayment(paymentId, gateway);

    return NextResponse.json({
      success: true,
      paymentId,
      status: verification.status,
      details: verification.data,
    });
  } catch (error: unknown) {
    console.error("Payment verification API error:", error);
    const errMessage = error instanceof Error ? error.message : "Erreur lors de la vérification du paiement";
    return NextResponse.json(
      { error: errMessage },
      { status: 500 }
    );
  }
}
