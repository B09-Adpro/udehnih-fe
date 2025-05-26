"use client";

import { useParams} from "next/navigation";
import { PaymentDetailSection } from "@/modules/PaymentModule";
import { Button } from "@/components/ui/button";
import router from "next/router";

export default function PaymentDetailPage() {
  const params = useParams();
  const transactionId = params.id as string;

  if (!transactionId || transactionId === "undefined") {
    return (
      <div className="text-center py-12">
        <p>ID Transaksi tidak valid.</p>
        <Button variant="outline" onClick={() => router.push('/payments/history')}>
          Kembali ke Riwayat Pembayaran
        </Button>
      </div>
    );
  }

  return <PaymentDetailSection transactionId={transactionId} />;
}