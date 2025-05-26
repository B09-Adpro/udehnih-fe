export const PaymentMethodConstants = {
  CREDIT_CARD: 'credit_card',
  BANK_TRANSFER: 'bank_transfer',
};

export const PaymentStatusConstants = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

export const BankOptions = [
  { value: 'bca', label: 'Bank Central Asia (BCA)' },
  { value: 'mandiri', label: 'Bank Mandiri' },
  { value: 'bni', label: 'Bank Negara Indonesia (BNI)' },
  { value: 'bri', label: 'Bank Rakyat Indonesia (BRI)' },
  { value: 'cimb', label: 'CIMB Niaga' },
];

export const RefundReasons = [
  { value: 'course_not_available', label: 'Kursus tidak tersedia' },
  { value: 'technical_issues', label: 'Masalah teknis' },
  { value: 'changed_mind', label: 'Berubah pikiran' },
  { value: 'not_satisfied', label: 'Tidak puas dengan kursus' },
  { value: 'other', label: 'Lainnya' },
];