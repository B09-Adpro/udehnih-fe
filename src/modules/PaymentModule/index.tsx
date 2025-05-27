import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CreditCard, Building2, ArrowLeft } from "lucide-react";
import { useRouter } from 'next/navigation';
import PaymentCreditCardSection from './sections/PaymentCreditCardSection';
import PaymentBankTransferSection from './sections/PaymentBankTransferSection';
import { PaymentService, PaymentRequest } from '@/lib/services/payment.service';
import { toast } from 'sonner';
import { PaymentMethodConstants } from './constant';

export interface PaymentModuleProps {
  courseId?: number;
  courseTitle?: string;
  tutorName?: string;
  amount?: number;
  studentId?: number;
}

const PaymentModule: React.FC<PaymentModuleProps> = ({
  courseId,
  courseTitle,
  tutorName,
  amount,
  studentId
}) => {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethodConstants.CREDIT_CARD);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [stage, setStage] = useState<'method_selection' | 'payment_details'>('method_selection');

  // Gabungkan data course dari props
  const courseData = {
    courseId,
    courseTitle,
    tutorName,
    amount,
    studentId,
  };

  const handleInitiatePayment = async () => {
    setIsProcessing(true);

    try {
      if (
        !courseData.studentId ||
        !courseData.courseId ||
        !courseData.courseTitle ||
        !courseData.tutorName ||
        !courseData.amount
      ) {
        toast.error('Data kursus tidak lengkap untuk pembayaran.');
        setIsProcessing(false);
        return;
      }

      const paymentRequest: PaymentRequest = {
        studentId: courseData.studentId,
        courseId: courseData.courseId,
        courseTitle: courseData.courseTitle,
        tutorName: courseData.tutorName,
        amount: courseData.amount,
        paymentMethod: paymentMethod
      };

      const response = await PaymentService.createPayment(paymentRequest);
      setTransactionId(response.transactionId);
      setStage('payment_details');
      toast.info('Silakan selesaikan proses pembayaran');
    } catch (error) {
      let errorMessage = 'Gagal membuat transaksi pembayaran';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentComplete = (response: any) => {
    toast.success('Pembayaran berhasil diproses!');
    router.push(`/payments/${response.transactionId || transactionId}`);
  };

  const handleGoBack = () => {
    if (stage === 'payment_details') {
      setStage('method_selection');
    } else {
      router.back();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <h1 className="text-3xl font-bold">Pembayaran Kursus</h1>
        <p className="text-muted-foreground">
          {stage === 'method_selection'
            ? 'Pilih metode pembayaran yang Anda inginkan'
            : 'Selesaikan proses pembayaran Anda'
          }
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Course Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Pesanan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Kursus:</span>
              <span>{courseData.courseTitle || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Instruktur:</span>
              <span>{courseData.tutorName || '-'}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>Rp {courseData.amount?.toLocaleString('id-ID') || '0'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {stage === 'method_selection' ? 'Metode Pembayaran' : 'Detail Pembayaran'}
            </CardTitle>
            <CardDescription>
              {stage === 'method_selection'
                ? 'Pilih cara pembayaran yang Anda inginkan'
                : `Pembayaran dengan ${paymentMethod === PaymentMethodConstants.CREDIT_CARD
                  ? 'kartu kredit/debit'
                  : 'transfer bank'
                }`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stage === 'method_selection' ? (
              <div className="space-y-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value={PaymentMethodConstants.CREDIT_CARD} id="credit_card" />
                    <Label htmlFor="credit_card" className="flex items-center cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Kartu Kredit/Debit
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value={PaymentMethodConstants.BANK_TRANSFER} id="bank_transfer" />
                    <Label htmlFor="bank_transfer" className="flex items-center cursor-pointer flex-1">
                      <Building2 className="w-5 h-5 mr-2" />
                      Transfer Bank
                    </Label>
                  </div>
                </RadioGroup>

                <Button
                  onClick={handleInitiatePayment}
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Memproses..." : "Lanjutkan Pembayaran"}
                </Button>
              </div>
            ) : (
              <>
                {paymentMethod === PaymentMethodConstants.CREDIT_CARD && transactionId && (
                  <PaymentCreditCardSection
                    transactionId={transactionId as `${string}-${string}-${string}-${string}-${string}`}
                    onPaymentComplete={handlePaymentComplete}
                    onBack={handleGoBack}
                    isLoading={isProcessing}
                    setIsLoading={setIsProcessing}
                  />
                )}

                {paymentMethod === PaymentMethodConstants.BANK_TRANSFER && transactionId && (
                  <PaymentBankTransferSection
                    transactionId={transactionId as `${string}-${string}-${string}-${string}-${string}`}
                    onPaymentComplete={handlePaymentComplete}
                    onBack={handleGoBack}
                    isLoading={isProcessing}
                    setIsLoading={setIsProcessing}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Named exports for specific sections
export { default as PaymentCreditCardSection } from './sections/PaymentCreditCardSection';
export { default as PaymentBankTransferSection } from './sections/PaymentBankTransferSection';
export { default as PaymentDetailSection } from './sections/PaymentDetailSection';
export { default as PaymentHistorySection } from './sections/PaymentHistorySection';

export default PaymentModule;