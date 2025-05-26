import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, File, Download, RefreshCcw } from "lucide-react";
import { PaymentService, PaymentResponse, RefundRequest } from "@/lib/services/payment.service";
import { toast } from "sonner";
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { PaymentStatusConstants, RefundReasons } from '../constant';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface PaymentDetailSectionProps {
  transactionId: number;
}

const PaymentDetailSection: React.FC<PaymentDetailSectionProps> = ({ transactionId }) => {
  const router = useRouter();
  const [transaction, setTransaction] = useState<PaymentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefundDialogOpen, setRefundDialogOpen] = useState(false);
  const [refundRequest, setRefundRequest] = useState<RefundRequest>({
    reason: '',
    details: ''
  });

  useEffect(() => {
    fetchTransactionDetails();
  }, [transactionId]);

  const fetchTransactionDetails = async () => {
    setIsLoading(true);
    try {
      const response = await PaymentService.getPaymentById(transactionId);
      setTransaction(response);
    } catch (error) {
      let errorMessage = 'Gagal memuat detail transaksi';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefundReasonChange = (value: string) => {
    setRefundRequest({
      ...refundRequest,
      reason: value
    });
  };

  const handleRefundDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRefundRequest({
      ...refundRequest,
      details: e.target.value
    });
  };

  const submitRefundRequest = async () => {
    if (!refundRequest.reason) {
      toast.error('Silakan pilih alasan refund');
      return;
    }

    if (!refundRequest.details || refundRequest.details.length < 10) {
      toast.error('Silakan berikan detail alasan refund (minimal 10 karakter)');
      return;
    }

    setIsLoading(true);
    
    try {
      await PaymentService.requestRefund(transactionId, refundRequest);
      toast.success('Permintaan refund berhasil diajukan');
      setRefundDialogOpen(false);
      await fetchTransactionDetails(); // Refresh transaction details
    } catch (error) {
      let errorMessage = 'Gagal mengajukan permintaan refund';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case PaymentStatusConstants.SUCCESS:
        return <Badge className="bg-green-500">Sukses</Badge>;
      case PaymentStatusConstants.PENDING:
        return <Badge className="bg-yellow-500">Menunggu</Badge>;
      case PaymentStatusConstants.PROCESSING:
        return <Badge className="bg-blue-500">Diproses</Badge>;
      case PaymentStatusConstants.FAILED:
        return <Badge className="bg-red-500">Gagal</Badge>;
      case PaymentStatusConstants.REFUNDED:
        return <Badge className="bg-purple-500">Dikembalikan</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin">
          <RefreshCcw className="w-8 h-8" />
        </div>
        <p className="mt-4">Memuat detail transaksi...</p>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="text-center py-12">
        <p>Transaksi tidak ditemukan</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push('/payment/history')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Riwayat Pembayaran
        </Button>
        <h1 className="text-2xl font-bold">Detail Transaksi</h1>
        <p className="text-muted-foreground">ID Transaksi: #{transaction.transactionId}</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Informasi Transaksi</CardTitle>
              {getStatusBadge(transaction.paymentStatus)}
            </div>
            <CardDescription>
              Tanggal: {format(new Date(transaction.createdAt), 'dd MMMM yyyy, HH:mm')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Nama Kursus</p>
                  <p>{transaction.courseTitle}</p>
                </div>
                <div>
                  <p className="font-medium">Pengajar</p>
                  <p>{transaction.tutorName}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Metode Pembayaran</p>
                  <p>{transaction.paymentMethod === 'credit_card' ? 'Kartu Kredit/Debit' : 'Transfer Bank'}</p>
                </div>
                <div>
                  <p className="font-medium">Jumlah</p>
                  <p className="text-lg font-bold">Rp {transaction.amount.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
              <Button variant="outline" className="flex items-center">
                <File className="w-4 h-4 mr-2" />
                Lihat Invoice
              </Button>
              <Button variant="outline" className="flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Unduh Bukti Pembayaran
              </Button>
              
              {transaction.paymentStatus === PaymentStatusConstants.SUCCESS && (
                <Dialog open={isRefundDialogOpen} onOpenChange={setRefundDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary">Ajukan Pengembalian Dana</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Ajukan Pengembalian Dana</DialogTitle>
                      <DialogDescription>
                        Mohon berikan alasan Anda mengajukan pengembalian dana untuk kursus ini.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="refundReason">Alasan Refund</Label>
                        <Select 
                          value={refundRequest.reason} 
                          onValueChange={handleRefundReasonChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih alasan refund" />
                          </SelectTrigger>
                          <SelectContent>
                            {RefundReasons.map(reason => (
                              <SelectItem key={reason.value} value={reason.value}>
                                {reason.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="refundDetails">Detail Alasan</Label>
                        <Textarea
                          className="resize-none min-h-[100px]"
                          id="refundDetails"
                          placeholder="Berikan detail alasan permintaan refund Anda"
                          value={refundRequest.details}
                          onChange={handleRefundDetailsChange}
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setRefundDialogOpen(false)}>
                        Batal
                      </Button>
                      <Button onClick={submitRefundRequest} disabled={isLoading}>
                        {isLoading ? "Memproses..." : "Ajukan Refund"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentDetailSection;