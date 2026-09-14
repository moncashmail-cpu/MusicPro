import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/lib/paymentService";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-moneroo-signature") || request.headers.get("x-signature") || "";

    const isValid = PaymentService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn("⚠️ Moneroo webhook signature mismatch");
      return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    console.log("🔔 Moneroo Webhook Event Received:", event?.event, event?.data?.id);

    const eventType = event?.event;
    const paymentData = event?.data;

    if (eventType === "payment.success" || eventType === "payment.completed") {
      const planId = paymentData?.metadata?.plan_id || "pro_monthly";
      const customerEmail = paymentData?.customer?.email || paymentData?.metadata?.user_email;
      console.log(`✅ MusikPro Abonnement Activé pour ${customerEmail} - Plan: ${planId}`);
      // In production with database (Supabase/PostgreSQL), update user subscription status here
    }

    return NextResponse.json({ received: true, status: "processed" });
  } catch (error: unknown) {
    console.error("Moneroo Webhook processing error:", error);
    return NextResponse.json({ error: "Erreur traitement webhook" }, { status: 500 });
  }
}
