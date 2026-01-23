// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// API client with authentication
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Erro na requisição');
  }

  return data;
}

// ============================================
// TYPES
// ============================================

export interface Payment {
  id: string;
  bookingId: string;
  asaasId: string;
  asaasCustomerId?: string;
  amount: number;
  netValue?: number;
  method: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  status: string;
  pixQrCode?: string;
  pixCopyPaste?: string;
  boletoUrl?: string;
  boletoBarcode?: string;
  installments?: number;
  dueDate: string;
  paidAt?: string;
  confirmedAt?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PixQrCode {
  image: string; // Base64 encoded QR Code image
  copyPaste: string; // PIX copy/paste code
  expirationDate: string;
}

export interface CreatePixPaymentData {
  cpfCnpj: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  amount?: number;
  description?: string;
}

export interface CreateCreditCardPaymentData {
  cpfCnpj: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  postalCode: string;
  addressNumber: string;
  amount?: number;
  description?: string;
  installments?: number;
  creditCard: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
}

export interface PixPaymentResponse {
  success: boolean;
  data: {
    payment: Payment;
    qrCode: PixQrCode;
  };
  message?: string;
}

export interface CreditCardPaymentResponse {
  success: boolean;
  data: {
    payment: Payment;
    success: boolean;
    status: string;
  };
  message?: string;
}

export interface PaymentsListResponse {
  success: boolean;
  data: Payment[];
}

// ============================================
// PAYMENT SERVICE
// ============================================

/**
 * Create a PIX payment for a booking
 */
export async function createPixPayment(
  bookingId: string,
  data: CreatePixPaymentData
): Promise<PixPaymentResponse> {
  return apiRequest<PixPaymentResponse>(`/payments/${bookingId}/pix`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Create a Credit Card payment for a booking
 */
export async function createCreditCardPayment(
  bookingId: string,
  data: CreateCreditCardPaymentData
): Promise<CreditCardPaymentResponse> {
  return apiRequest<CreditCardPaymentResponse>(`/payments/${bookingId}/card`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Get all payments for a booking
 */
export async function getPaymentsByBooking(
  bookingId: string
): Promise<PaymentsListResponse> {
  return apiRequest<PaymentsListResponse>(`/payments/booking/${bookingId}`);
}

/**
 * Get a single payment by ID
 */
export async function getPaymentById(paymentId: string): Promise<{
  success: boolean;
  data: Payment;
}> {
  return apiRequest(`/payments/${paymentId}`);
}

/**
 * Sync payment status with Asaas
 */
export async function syncPaymentStatus(paymentId: string): Promise<{
  success: boolean;
  data: Payment;
  message?: string;
}> {
  return apiRequest(`/payments/${paymentId}/sync`, {
    method: 'POST',
  });
}

// ============================================
// HELPERS
// ============================================

/**
 * Format currency to Brazilian Real
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Format CPF (###.###.###-##)
 */
export function formatCPF(value: string): string {
  const cpf = value.replace(/\D/g, '');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Format CNPJ (##.###.###/####-##)
 */
export function formatCNPJ(value: string): string {
  const cnpj = value.replace(/\D/g, '');
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Format CPF or CNPJ based on length
 */
export function formatCPFCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 11) {
    return formatCPF(numbers);
  }
  return formatCNPJ(numbers);
}

/**
 * Validate CPF
 */
export function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf[i]) * (10 - i);
  }
  let digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  if (digit !== parseInt(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf[i]) * (11 - i);
  }
  digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  if (digit !== parseInt(cpf[10])) return false;

  return true;
}

/**
 * Validate CNPJ
 */
export function validateCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/\D/g, '');
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj[i]) * weights1[i];
  }
  let digit = sum % 11;
  digit = digit < 2 ? 0 : 11 - digit;
  if (digit !== parseInt(cnpj[12])) return false;

  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj[i]) * weights2[i];
  }
  digit = sum % 11;
  digit = digit < 2 ? 0 : 11 - digit;
  if (digit !== parseInt(cnpj[13])) return false;

  return true;
}

/**
 * Validate CPF or CNPJ
 */
export function validateCPFCNPJ(value: string): boolean {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length === 11) return validateCPF(numbers);
  if (numbers.length === 14) return validateCNPJ(numbers);
  return false;
}

/**
 * Map payment status to display text
 */
export function getPaymentStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: 'Pendente',
    RECEIVED: 'Recebido',
    CONFIRMED: 'Confirmado',
    OVERDUE: 'Vencido',
    REFUNDED: 'Estornado',
    RECEIVED_IN_CASH: 'Recebido em Dinheiro',
    REFUND_REQUESTED: 'Estorno Solicitado',
    REFUND_IN_PROGRESS: 'Estorno em Processamento',
    CHARGEBACK_REQUESTED: 'Chargeback Solicitado',
    CHARGEBACK_DISPUTE: 'Chargeback em Disputa',
    AWAITING_CHARGEBACK_REVERSAL: 'Aguardando Reversão',
    DUNNING_REQUESTED: 'Recuperação Solicitada',
    DUNNING_RECEIVED: 'Recuperação Recebida',
    AWAITING_RISK_ANALYSIS: 'Em Análise de Risco',
  };
  return statusMap[status] || status;
}

/**
 * Map payment status to color
 */
export function getPaymentStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    RECEIVED: 'bg-green-100 text-green-800',
    CONFIRMED: 'bg-green-100 text-green-800',
    OVERDUE: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-gray-100 text-gray-800',
    RECEIVED_IN_CASH: 'bg-green-100 text-green-800',
    REFUND_REQUESTED: 'bg-orange-100 text-orange-800',
    REFUND_IN_PROGRESS: 'bg-orange-100 text-orange-800',
    CHARGEBACK_REQUESTED: 'bg-red-100 text-red-800',
    CHARGEBACK_DISPUTE: 'bg-red-100 text-red-800',
    AWAITING_CHARGEBACK_REVERSAL: 'bg-orange-100 text-orange-800',
    DUNNING_REQUESTED: 'bg-orange-100 text-orange-800',
    DUNNING_RECEIVED: 'bg-green-100 text-green-800',
    AWAITING_RISK_ANALYSIS: 'bg-blue-100 text-blue-800',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Check if payment is considered successful
 */
export function isPaymentSuccessful(status: string): boolean {
  return ['RECEIVED', 'CONFIRMED', 'RECEIVED_IN_CASH'].includes(status);
}
