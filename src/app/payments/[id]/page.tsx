"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PaymentService, PaymentDetailDTO } from "@/lib/services/payment.service";
import PaymentCreditCardSection from "@/modules/PaymentModule/sections/PaymentCreditCardSection";
import PaymentBankTransferSection from "@/modules/PaymentModule/sections/PaymentBankTransferSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, CreditCard, Loader2, RefreshCw } from "lucide-react";
import { UUID } from "crypto";

export default function PaymentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const transactionId = params.id as UUID;

  const [paymentDetail, setPaymentDetail] = useState<PaymentDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchPaymentDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await PaymentService.getTransactionDetails(transactionId);
      setPaymentDetail(data);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil detail pembayaran");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
  }, [transactionId]);

  // Handler untuk ketika pembayaran selesai
  const handlePaymentComplete = () => {
    router.push('/payment/history');
  };

  // Handler untuk kembali ke halaman sebelumnya
  const handleBack = () => {
    router.back();
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <h3 className="text-lg font-semibold mb-2">Memuat Detail Pembayaran</h3>
            <p className="text-gray-600 text-center">
              Mohon tunggu sebentar, kami sedang mengambil informasi pembayaran Anda...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-lg mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-xl text-red-800">Oops! Terjadi Kesalahan</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
              <Button 
                onClick={fetchPaymentDetails}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Coba Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No Data State
  if (!paymentDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-lg mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <CardTitle className="text-xl text-gray-800">Data Pembayaran Tidak Ditemukan</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Maaf, kami tidak dapat menemukan detail pembayaran dengan ID transaksi yang Anda berikan. 
              Pastikan link yang Anda akses sudah benar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => router.push('/payment/history')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Lihat Riwayat Pembayaran
              </Button>
              <Button 
                onClick={fetchPaymentDetails}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Muat Ulang
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Routing otomatis berdasarkan metode pembayaran
  if (paymentDetail.paymentMethod === "Credit Card") {
    return (
      <PaymentCreditCardSection 
        transactionId={transactionId}
        onPaymentComplete={handlePaymentComplete}
        onBack={handleBack}
        isLoading={isProcessing}
        setIsLoading={setIsProcessing}
      />
    );
  }
  
  if (paymentDetail.paymentMethod === "Bank Transfer") {
    return (
      <PaymentBankTransferSection 
        transactionId={transactionId}
        onPaymentComplete={handlePaymentComplete}
        onBack={handleBack}
        isLoading={isProcessing}
        setIsLoading={setIsProcessing}
      />
    );
  }

  // Unknown Payment Method State
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <CardTitle className="text-xl text-yellow-800">Metode Pembayaran Tidak Dikenali</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Metode pembayaran "<span className="font-semibold">{paymentDetail.paymentMethod}</span>" 
            belum didukung atau tidak dikenali oleh sistem kami.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Detail Transaksi:</strong><br />
              ID: {paymentDetail.transactionId}<br />
              Kursus: {paymentDetail.courseTitle}<br />
              Metode: {paymentDetail.paymentMethod}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
            <Button 
              onClick={() => router.push('/payment/history')}
              className="flex items-center gap-2"
            >
              Lihat Riwayat Pembayaran
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}