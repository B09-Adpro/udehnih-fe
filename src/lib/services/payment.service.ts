import { UUID } from 'crypto';
import paymentApi from './paymentApiClient';

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
  transactionId: UUID;
  courseId: number;
  userId: number;
  courseTitle: string;
  tutorName: string;
  amount: number;
  paymentStatus: string;
  paymentMethod: string;
  paymentDetails: PaymentDetails
  createdAt: string;
  updatedAt: string;
}

export interface PaymentDetailDTO {
  transactionId: UUID;
  courseId: number;
  userId: number;
  courseTitle: string;
  tutorName: string;
  amount: number;
  paymentStatus: string;
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
  refundId: UUID;
  transactionId: UUID;
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
      const response = await paymentApi.get('api/payments/methods');
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to fetch payment methods');
    }
  },

  createPayment: async (request: PaymentRequest): Promise<PaymentResponse> => {
    try {
      const courseApiKey = process.env.NEXT_PUBLIC_COURSE_API_KEY || '';
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

  getTransactionDetails: async (transactionId: UUID, options?: { 
    apiKey?: string}): Promise<PaymentDetailDTO> => {
    try {
      const headers: Record<string, string> = {};
      
      if (options?.apiKey) {
        headers['X-API-Key'] = options.apiKey;
      }
      
      const authToken = localStorage.getItem('auth_token');
      if (!options?.apiKey && authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const response = await paymentApi.get(`api/payments/${transactionId}`, {
        headers
      });
      
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string; status?: string}, status?: number}};

      throw new Error(axiosError.response?.data?.message || 'Failed to fetch transaction details');
    }
  },

  getPaymentById: async (transactionId: UUID): Promise<any> => {
    try {
      const response = await paymentApi.get(`api/payments/${transactionId}`);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to fetch payment details');
    }
  },

  processCardPayment: async (transactionId: UUID, cardDetails: CreditCardRequest): Promise<PaymentResponse> => {
    try {
      const response = await paymentApi.post(`api/payments/${transactionId}/credit-card`, cardDetails);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to process credit card payment');
    }
  },

  processBankTransfer: async (transactionId: UUID): Promise<PaymentResponse> => {
    try {
      const response = await paymentApi.post(`api/payments/${transactionId}/bank-transfer`);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to process bank transfer');
    }
  },

  confirmBankTransfer: async (transactionId: UUID): Promise<PaymentResponse> => {
    try {
      const response = await paymentApi.post(`api/payments/${transactionId}/confirm-transfer`);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {response?: {data?: {message?: string}}};
      throw new Error(axiosError.response?.data?.message || 'Failed to confirm bank transfer');
    }
  },

  requestRefund: async (transactionId: UUID, refundRequest: RefundRequest): Promise<RefundResponse> => {
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

  getRefundDetails: async (refundId: UUID, apiKey: string): Promise<RefundResponse> => {
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
  }
};