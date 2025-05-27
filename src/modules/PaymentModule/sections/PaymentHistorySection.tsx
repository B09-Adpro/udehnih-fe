import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCcw, ArrowRight, Search } from "lucide-react";
import { PaymentService, PaymentResponse } from "@/lib/services/payment.service";
import { toast } from "sonner";
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { PaymentStatusConstants } from '../constant';
import { Input } from '@/components/ui/input';

const PaymentHistorySection: React.FC = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState<PaymentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  const fetchTransactionHistory = async () => {
    setIsLoading(true);
    try {
      const response = await PaymentService.getTransactionHistory();
      setTransactions(response);
    } catch (error) {
      let errorMessage = 'Gagal memuat riwayat transaksi';
      
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

  const filteredTransactions = transactions.filter(transaction => 
    transaction.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(transaction.transactionId).includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin">
          <RefreshCcw className="w-8 h-8" />
        </div>
        <p className="mt-4">Memuat riwayat transaksi...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Riwayat Pembayaran</h1>
        <p className="text-muted-foreground">Daftar semua transaksi pembayaran Anda</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari transaksi berdasarkan ID atau nama kursus..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-lg mb-4">Tidak ada transaksi yang ditemukan</p>
              {searchTerm ? (
                <Button variant="outline" onClick={() => setSearchTerm('')}>Hapus Pencarian</Button>
              ) : (
                <Button onClick={() => router.push('/')}>Jelajahi Kursus</Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => (
            <Card key={transaction.transactionId} className="overflow-hidden">
              <CardHeader className="bg-muted/50 py-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">
                    Transaksi #{transaction.transactionId}
                  </CardTitle>
                  {getStatusBadge(transaction.paymentStatus)}
                </div>
              </CardHeader>
              <CardContent className="py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{transaction.courseTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.createdAt), 'dd MMM yyyy, HH:mm')}
                    </p>
                    <p className="text-sm">Pengajar: {transaction.tutorName}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                    <p className="font-bold">Rp {transaction.amount.toLocaleString('id-ID')}</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {transaction.paymentMethod === 'credit_card' 
                        ? 'Kartu Kredit/Debit' 
                        : 'Transfer Bank'
                      }
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center"
                      onClick={() => router.push(`/payments/${transaction.transactionId}/detail`)}
                    >
                      Detail Transaksi
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button variant="outline" onClick={fetchTransactionHistory} className="flex items-center" disabled={isLoading}>
          <RefreshCcw className="w-4 h-4 mr-2" />
          Muat Ulang
        </Button>
      </div>
    </div>
  );
};

export default PaymentHistorySection;