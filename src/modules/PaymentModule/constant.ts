export const PaymentMethodConstants = {
  CREDIT_CARD: 'Credit Card',
  BANK_TRANSFER: 'Bank Transfer',
};

export const PaymentStatusConstants = {
  PENDING: 'PENDING',
  PROCESSING: 'processing',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

export const BankOptions = [
  { value: 'bca', label: 'Bank Central Asia (BCA)', accountNumber: '123-456-7890', accountName: 'Udehnih' },
  { value: 'mandiri', label: 'Bank Mandiri', accountNumber: '456-789-0123', accountName: 'Udehnih' },
  { value: 'bni', label: 'Bank Negara Indonesia (BNI)', accountNumber: '987-654-3210', accountName: 'Udehnih' },
];

export const RefundReasons = [
  { value: 'course_not_available', label: 'Kursus tidak tersedia' },
  { value: 'technical_issues', label: 'Masalah teknis' },
  { value: 'changed_mind', label: 'Berubah pikiran' },
  { value: 'not_satisfied', label: 'Tidak puas dengan kursus' },
  { value: 'other', label: 'Lainnya' },
];

export enum PaymentStatusEnum {
  WAITING_PAYMENT = 'WAITING_PAYMENT',
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export enum RefundStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum BankEnum {
  BCA = 'BCA',
  BNI = 'BNI',
  MANDIRI = 'MANDIRI',
  BRI = 'BRI',
  CIMB = 'CIMB',
}