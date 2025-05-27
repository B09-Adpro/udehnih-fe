import paymentApi from './paymentApiClient';
import { PaymentStatusEnum, RefundStatusEnum } from '@/modules/PaymentModule/constant';

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
  transactionId: string; // Ubah UUID menjadi string
  courseId: number;
  userId: number;
  courseTitle: string;
  tutorName: string;
  amount: number;
  paymentStatus: PaymentStatusEnum;
  paymentMethod: string;
  paymentDetails: PaymentDetails
  createdAt: string;
  updatedAt: string;
}

export interface PaymentDetailDTO {
  transactionId: string; // Ubah UUID menjadi string
  courseId: number;
  userId: number;
  courseTitle: string;
  tutorName: string;
  amount: number;
  paymentStatus: PaymentStatusEnum;
  paymentMethod: string;
  bankName?: string;
  paymentDetails: PaymentDetails;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentDetails {
  confirmation: boolean;
  confirmedAt: string | null;
  adminApproval: boolean;
  approvedAt: string | null;
  approvedBy: string | null;
}

export interface RefundResponse {
  refundId: string; // Ubah UUID menjadi string
  transactionId: string; // Ubah UUID menjadi string
  reason: string;
  status: RefundStatusEnum;
  requestedAt: string;
  processedAt: string | null;
  approvedBy: string | null;
}

// Service
export const PaymentService = {
  getPaymentMethods: async (): Promise<string[]> => {
    try {
      const response = await paymentApi.get('api/payments/methods');
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to fetch payment methods');
    }
  },

  createPayment: async (request: PaymentRequest): Promise<PaymentResponse> => {
    try {
      const courseApiKey = process.env.NEXT_PUBLIC_API_URL_COURSE || '';
      console.log('Using API key:', courseApiKey ? 'Key exists (not showing for security)' : 'No key found');
      
      const response = await paymentApi.post('api/payments', request, {
        headers: {
          'X-API-Key': courseApiKey
        }
      });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}, status?: number}};
      console.error('Payment error details:', {
        status: axiosError.response?.status,
        message: axiosError.response?.data?.message,
        requestData: request
      });
      throw new Error(axiosError.response?.data?.message || 'Failed to create payment');
    }
  },

  getTransactionDetails: async (transactionId: string, options?: { apiKey?: string }): Promise<PaymentDetailDTO> => {
    if (!transactionId) {
      throw new Error('Transaction ID is required and must be valid.');
    }

    try {
      const headers: Record<string, string> = {};

      if (options?.apiKey) {
        headers['X-API-Key'] = options.apiKey;
      }

      const authToken = localStorage.getItem('auth_token');
      if (!options?.apiKey && authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await paymentApi.get(`api/payments/${transactionId}`, { headers });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string; status?: string }, status?: number } };
      throw new Error(axiosError.response?.data?.message || 'Failed to fetch transaction details');
    }
  },

  getPaymentById: async (transactionId: string): Promise<any> => {
    try {
      const response = await paymentApi.get(`api/payments/${transactionId}`);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to fetch payment details');
    }
  },

  processCardPayment: async (transactionId: string, cardDetails: CreditCardRequest): Promise<PaymentResponse> => {
    try {
      const response = await paymentApi.post(`api/payments/${transactionId}/credit-card`, cardDetails);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to process credit card payment');
    }
  },

  processBankTransfer: async (transactionId: string): Promise<PaymentResponse> => {
    try {
      const response = await paymentApi.post(`api/payments/${transactionId}/bank-transfer`);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to process bank transfer');
    }
  },

  confirmBankTransfer: async (transactionId: string): Promise<PaymentResponse> => {
    try {
      const response = await paymentApi.post(`api/payments/${transactionId}/confirm-transfer`);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to confirm bank transfer');
    }
  },

  requestRefund: async (transactionId: string, refundRequest: RefundRequest): Promise<RefundResponse> => {
    try {
      const response = await paymentApi.post(`api/payments/${transactionId}/refund`, refundRequest);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to request refund');
    }
  },

  getTransactionHistory: async (): Promise<PaymentResponse[]> => {
    try {
      const response = await paymentApi.get('api/payments/history');
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to fetch transaction history');
    }
  },

  processPayment: async (paymentRequest: PaymentRequest): Promise<{transactionId: number, paymentStatus: string}> => {
    try {
      const response = await paymentApi.post('api/payments/process', paymentRequest);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to process payment');
    }
  },

  getAllTransactions: async (apiKey: string): Promise<PaymentResponse[]> => {
    try {
      const response = await paymentApi.get('api/payments/transactions', {
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
      const response = await paymentApi.get('api/payments/refunds', {
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

  getRefundDetails: async (refundId: string, apiKey: string): Promise<RefundResponse> => {
    try {
      const response = await paymentApi.get(`api/payments/refunds/${refundId}`, {
        headers: {
          'X-API-Key': apiKey
        }
      });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to fetch refund details');
    }
  },

  cancelPayment: async (transactionId: string): Promise<PaymentResponse> => {
    const dashboardApiKey = process.env.NEXT_PUBLIC_DASHBOARD_API_KEY || '';
    const body = { status: "CANCELLED" };
    try {
      const response = await paymentApi.put(
        `api/payments/${transactionId}/status`,
        body,
        { headers: { 'X-API-Key': dashboardApiKey } }
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to cancel payment');
    }
  }
};