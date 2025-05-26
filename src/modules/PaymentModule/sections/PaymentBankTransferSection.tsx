import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaymentService } from "@/lib/services/payment.service";
import { toast } from "sonner";
import { BankOptions } from '../constant';
import { UUID } from 'crypto';

interface PaymentBankTransferSectionProps {
  transactionId: UUID;
  onPaymentComplete: (response: any) => void;
  onBack: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const PaymentBankTransferSection: React.FC<PaymentBankTransferSectionProps> = ({
  transactionId,
  onPaymentComplete,
  onBack,
  isLoading,
  setIsLoading
}) => {
  const [bankCode, setBankCode] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    accountNumber: "8800123456789",
    accountName: "PT Udehnih Education",
    bankName: ""
  });

  const handleBankSelect = (value: string) => {
    setBankCode(value);
    
    // Set bank name based on selected value
    const selectedBank = BankOptions.find(bank => bank.value === value);
    if (selectedBank) {
      setPaymentInfo(prev => ({
        ...prev,
        bankName: selectedBank.label
      }));
    }
  };

  const processBankTransfer = async () => {
    if (!bankCode) {
      toast.error("Silakan pilih bank terlebih dahulu");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await PaymentService.processBankTransfer(transactionId);
      setShowConfirmation(true);
    } catch (error) {
      let errorMessage = 'Gagal memproses permintaan transfer bank';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmBankTransfer = async () => {
    setIsLoading(true);
    
    try {
      const response = await PaymentService.confirmBankTransfer(transactionId);
      toast.success('Konfirmasi transfer bank berhasil!');
      onPaymentComplete(response);
    } catch (error) {
      let errorMessage = 'Gagal mengkonfirmasi transfer bank';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Building2 className="w-6 h-6 mr-2" />
        <h3 className="text-lg font-medium">Pembayaran dengan Transfer Bank</h3>
      </div>
      
      {!showConfirmation ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bankName">Pilih Bank</Label>
            <Select value={bankCode} onValueChange={handleBankSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih bank Anda" />
              </SelectTrigger>
              <SelectContent>
                {BankOptions.map(bank => (
                  <SelectItem key={bank.value} value={bank.value}>{bank.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Instruksi Transfer:</h4>
            <p className="text-sm text-muted-foreground">
              Setelah memilih bank, Anda akan mendapatkan nomor rekening tujuan dan kode unik untuk transfer.
              Pembayaran akan dikonfirmasi dalam 1x24 jam setelah transfer berhasil.
            </p>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
              Kembali
            </Button>
            <Button type="button" className="flex-1" onClick={processBankTransfer} disabled={isLoading || !bankCode}>
              {isLoading ? "Memproses..." : "Lanjutkan"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 border rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Bank:</span>
              <span>{paymentInfo.bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Nomor Rekening:</span>
              <span>{paymentInfo.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Atas Nama:</span>
              <span>{paymentInfo.accountName}</span>
            </div>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Catatan Penting:</h4>
            <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
              <li>Transfer tepat sesuai jumlah yang tertera.</li>
              <li>Simpan bukti transfer sebagai referensi.</li>
              <li>Konfirmasi pembayaran setelah Anda melakukan transfer.</li>
              <li>Pembayaran akan diverifikasi dalam 1x24 jam kerja.</li>
            </ul>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowConfirmation(false)} disabled={isLoading}>
              Kembali
            </Button>
            <Button type="button" className="flex-1" onClick={confirmBankTransfer} disabled={isLoading}>
              {isLoading ? "Memproses..." : "Konfirmasi Telah Transfer"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentBankTransferSection;