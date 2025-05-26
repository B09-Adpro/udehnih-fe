import paymentApi from './paymentApiClient';

// Interfaces
export interface PaymentRequest {
  studentId: number;
  courseId: number;
  courseTitle: string;
  tutorName: string;
  amount: number;
  paymentMethod: string;
}

export interface CreditCardRequest {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvc: string;
}

export interface RefundRequest {
  reason: string;
  details: string;
}

export interface PaymentResponse {
  transactionId: number;
  courseId: number;
  userId: number;
  courseTitle: string;
  tutorName: string;
  amount: number;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface RefundResponse {
  refundId: number;
  transactionId: number;
  reason: string;
  status: string;
  requestedAt: string;
  processedAt: string | null;
  approvedBy: string | null;
}

// Service
export const PaymentService = {
  getPaymentMethods: async (): Promise<string[]> => {
    try {
      const response = await paymentApi.get('/payments/methods');
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to fetch payment methods');
    }
  },

  createPayment: async (request: PaymentRequest): Promise<PaymentResponse> => {
    try {
      const courseApiKey = process.env.NEXT_PUBLIC_COURSE_API_KEY || '';
      const response = await paymentApi.post('/payments', request, {
        headers: {
          'X-API-Key': courseApiKey
        }
      });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to create payment');
    }
  },

  getPaymentById: async (transactionId: number): Promise<any> => {
    try {
      const response = await paymentApi.get(`/payments/${transactionId}`);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to fetch payment details');
    }
  },

  processCardPayment: async (transactionId: number, cardDetails: CreditCardRequest): Promise<PaymentResponse> => {
    try {
      const response = await paymentApi.post(`/payments/${transactionId}/credit-card`, cardDetails);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to process credit card payment');
    }
  },

  processBankTransfer: async (transactionId: number): Promise<PaymentResponse> => {
    try {
      const response = await paymentApi.post(`/payments/${transactionId}/bank-transfer`);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to process bank transfer');
    }
  },

  confirmBankTransfer: async (transactionId: number): Promise<PaymentResponse> => {
    try {
      const response = await paymentApi.post(`/payments/${transactionId}/confirm-transfer`);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to confirm bank transfer');
    }
  },

  requestRefund: async (transactionId: number, refundRequest: RefundRequest): Promise<RefundResponse> => {
    try {
      const response = await paymentApi.post(`/payments/${transactionId}/refund`, refundRequest);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to request refund');
    }
  },

  getTransactionHistory: async (): Promise<PaymentResponse[]> => {
    try {
      const response = await paymentApi.get('/payments/history');
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to fetch transaction history');
    }
  },

  processPayment: async (paymentRequest: PaymentRequest): Promise<{transactionId: number, paymentStatus: string}> => {
    try {
      const response = await paymentApi.post('/payments/process', paymentRequest);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to process payment');
    }
  },

  getAllTransactions: async (apiKey: string): Promise<PaymentResponse[]> => {
    try {
      const response = await paymentApi.get('/payments/transactions', {
        headers: {
          'X-API-Key': apiKey
        }
      });
      return response.data.transactions;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to fetch all transactions');
    }
  },

  getAllRefunds: async (apiKey: string): Promise<RefundResponse[]> => {
    try {
      const response = await paymentApi.get('/payments/refunds', {
        headers: {
          'X-API-Key': apiKey
        }
      });
      return response.data.refunds;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to fetch all refunds');
    }
  },

  getRefundDetails: async (refundId: number, apiKey: string): Promise<RefundResponse> => {
    try {
      const response = await paymentApi.get(`/payments/refunds/${refundId}`, {
        headers: {
          'X-API-Key': apiKey
        }
      });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to fetch refund details');
    }
  }
};