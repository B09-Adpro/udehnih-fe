import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Building2, Landmark, Banknote, CreditCard } from "lucide-react";
import { PaymentService } from "@/lib/services/payment.service";
import { toast } from "sonner";
import { BankOptions } from '../constant';

interface PaymentBankTransferSectionProps {
  transactionId: string;
  onPaymentComplete: (response: import('@/lib/services/payment.service').PaymentResponse) => void;
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
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    accountNumber: "",
    accountName: "",
    bankName: ""
  });

  const handleBankSelect = (bankValue: string) => {
    setSelectedBank(bankValue);
    const selected = BankOptions.find(bank => bank.value === bankValue);
    if (selected) {
      setPaymentInfo({
        accountNumber: selected.accountNumber || "",
        accountName: selected.accountName || "",
        bankName: selected.label
      });
    }
  };

  const processBankTransfer = async () => {
    if (!selectedBank) {
      toast.error("Silakan pilih bank terlebih dahulu");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await PaymentService.processBankTransfer(transactionId);
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-3xl mx-auto">
          <div className="flex items-center mb-4 justify-center">
            <Building2 className="w-7 h-7 mr-2 text-blue-600" />
            <h3 className="text-xl font-bold">Pembayaran dengan Transfer Bank</h3>
          </div>
          <p className="text-center mb-6 text-gray-700">Pilih salah satu bank berikut untuk melakukan transfer:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
            {BankOptions.map(bank => (
              <button
                key={bank.value}
                type="button"
                className={`w-full max-w-xs border rounded-xl p-6 flex flex-col items-center shadow transition-colors duration-150 hover:shadow-lg focus:outline-none ${selectedBank === bank.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                onClick={() => handleBankSelect(bank.value)}
                disabled={isLoading}
              >
                {/* Logo bank, bisa diganti sesuai kebutuhan */}
                <div className="mb-2">
                  {bank.value === 'bca' && <img src="/bank-bca.svg" alt="BCA" className="h-10" />}
                  {bank.value === 'mandiri' && <img src="/bank-mandiri.svg" alt="Mandiri" className="h-10" />}
                  {bank.value === 'bni' && <img src="/bank-bni.svg" alt="BNI" className="h-10" />}
                  {/* Fallback icon */}
                  {!(bank.value === 'bca' || bank.value === 'mandiri' || bank.value === 'bni') && <Landmark className="h-10 w-10 text-blue-400" />}
                </div>
                <span className="font-semibold text-lg text-center mb-1">{bank.label}</span>
                {bank.accountNumber && (
                  <span className="text-sm text-gray-600">No. Rek: {bank.accountNumber}</span>
                )}
                {bank.accountName && (
                  <span className="text-sm text-gray-600">a.n. {bank.accountName}</span>
                )}
              </button>
            ))}
          </div>

          {selectedBank && (
            <div className="space-y-4 mt-8 max-w-xl mx-auto">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium mb-2 text-blue-700">Instruksi Transfer:</h4>
                <p className="text-sm text-blue-900">
                  Setelah memilih bank, Anda akan mendapatkan nomor rekening tujuan dan kode unik untuk transfer.<br />
                  Pembayaran akan dikonfirmasi dalam 1x24 jam setelah transfer berhasil.
                </p>
              </div>
              <div className="flex space-x-4 pt-4 justify-center">
                <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
                  Kembali
                </Button>
                <Button type="button" className="flex-1" onClick={processBankTransfer} disabled={isLoading}>
                  {isLoading ? "Memproses..." : "Lanjutkan"}
                </Button>
              </div>
            </div>
          )}

          {showConfirmation && (
            <div className="space-y-6 mt-8 max-w-xl mx-auto">
              <div className="p-4 border rounded-lg space-y-3 bg-white">
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
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium mb-2 text-blue-700">Catatan Penting:</h4>
                <ul className="text-sm text-blue-900 list-disc pl-4 space-y-1">
                  <li>Transfer tepat sesuai jumlah yang tertera.</li>
                  <li>Simpan bukti transfer sebagai referensi.</li>
                  <li>Konfirmasi pembayaran setelah Anda melakukan transfer.</li>
                  <li>Pembayaran akan diverifikasi dalam 1x24 jam kerja.</li>
                </ul>
              </div>
              <div className="flex space-x-4 pt-4 justify-center">
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
      </div>
      {/* Sticky footer */}
      <footer className="mt-auto w-full bg-[#101828] text-white py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
          <div>
            <span className="font-bold text-xl">Udehnih</span>
            <p className="mt-2 text-sm max-w-xs">Platform belajar online yang menyediakan kursus dan materi pembelajaran untuk semua tingkat keterampilan.</p>
            <div className="flex space-x-2 mt-2">
              <a href="#" className="hover:underline">Facebook</a>
              <a href="#" className="hover:underline">Twitter</a>
              <a href="#" className="hover:underline">Instagram</a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Jelajahi</h4>
            <ul className="text-sm space-y-1">
              <li><a href="/" className="hover:underline">Beranda</a></li>
              <li><a href="/courses" className="hover:underline">Kursus</a></li>
              <li><a href="/tutor" className="hover:underline">Pengajar</a></li>
              <li><a href="/events" className="hover:underline">Acara</a></li>
              <li><a href="/contact" className="hover:underline">Kontak</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Kategori</h4>
            <ul className="text-sm space-y-1">
              <li>Fisika</li>
              <li>Matematika</li>
              <li>Bahasa</li>
              <li>IPS</li>
              <li>Biologi</li>
              <li>Kimia</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contact Us</h4>
            <ul className="text-sm space-y-1">
              <li><span className="inline-block w-4">📍</span>Jl. Semoga kita sukses dengan tugas yang banyak ini</li>
              <li><span className="inline-block w-4">📞</span>+62 21 7891234</li>
              <li><span className="inline-block w-4">✉️</span>info@udehnih.com</li>
            </ul>
            <div className="mt-2">
              <span className="block mb-1">Berlangganan newsletter kami</span>
              <div className="flex">
                <input type="email" placeholder="Email Anda" className="rounded-l px-2 py-1 text-black" />
                <button className="bg-blue-600 px-3 py-1 rounded-r">✉️</button>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 mt-6">© 2025 Udehnih Learning Platform. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default PaymentBankTransferSection;