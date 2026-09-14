import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const event = await request.json();
    console.log("🔔 FedaPay Webhook Event Received:", event?.name, event?.entity?.id);

    const eventName = event?.name;
    const transaction = event?.entity;

    if (eventName === "transaction.approved") {
      console.log(`✅ FedaPay Transaction Approuvée : ${transaction?.id} - Montant: ${transaction?.amount} XOF`);
      // Update subscriber status
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error("FedaPay Webhook processing error:", error);
    return NextResponse.json({ error: "Erreur traitement webhook FedaPay" }, { status: 500 });
  }
}
