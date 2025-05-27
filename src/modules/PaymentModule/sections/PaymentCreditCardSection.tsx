import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { PaymentService, CreditCardRequest } from "@/lib/services/payment.service";
import { toast } from "sonner";

interface PaymentCreditCardSectionProps {
  transactionId: string;
  onPaymentComplete: (response: import('@/lib/services/payment.service').PaymentResponse) => void;
  onBack: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const PaymentCreditCardSection: React.FC<PaymentCreditCardSectionProps> = ({
  transactionId,
  onPaymentComplete,
  onBack,
  isLoading,
  setIsLoading
}) => {
  const [cardDetails, setCardDetails] = useState<CreditCardRequest>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvc: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const validateCreditCard = (): boolean => {
    // Simple validation
    if (!cardDetails.cardNumber.trim()) {
      toast.error('Nomor kartu tidak boleh kosong');
      return false;
    }

    if (!cardDetails.cardHolder.trim()) {
      toast.error('Nama pemegang kartu tidak boleh kosong');
      return false;
    }

    if (!cardDetails.expiryDate.trim() || !cardDetails.expiryDate.includes('/')) {
      toast.error('Format tanggal kadaluarsa tidak valid (MM/YY)');
      return false;
    }

    if (!cardDetails.cvc.trim() || cardDetails.cvc.length < 3) {
      toast.error('Kode CVC tidak valid');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCreditCard()) return;
    
    setIsLoading(true);
    
    try {
      const response = await PaymentService.processCardPayment(transactionId, cardDetails);
      toast.success('Pembayaran dengan kartu kredit berhasil!');
      onPaymentComplete(response);
    } catch (error) {
      let errorMessage = 'Gagal memproses pembayaran kartu kredit';
      
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
        <CreditCard className="w-6 h-6 mr-2" />
        <h3 className="text-lg font-medium">Pembayaran dengan Kartu Kredit/Debit</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Nomor Kartu</Label>
          <Input 
            id="cardNumber" 
            placeholder="1234 5678 9012 3456" 
            value={cardDetails.cardNumber}
            onChange={handleInputChange}
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cardHolder">Nama Pemegang Kartu</Label>
          <Input 
            id="cardHolder" 
            placeholder="John Doe" 
            value={cardDetails.cardHolder}
            onChange={handleInputChange}
            required 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Tanggal Kadaluarsa</Label>
            <Input 
              id="expiryDate" 
              placeholder="MM/YY" 
              value={cardDetails.expiryDate}
              onChange={handleInputChange}
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cvc">CVC</Label>
            <Input 
              id="cvc" 
              placeholder="123" 
              value={cardDetails.cvc}
              onChange={handleInputChange}
              required 
            />
          </div>
        </div>
        
        <div className="flex space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
            Kembali
          </Button>
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? "Memproses..." : "Bayar Sekarang"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentCreditCardSection;