// Lead Types
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL_SENT' | 'NEGOTIATION' | 'CONVERTED';
export type LeadSource = 'INSTAGRAM' | 'WHATSAPP' | 'WEBSITE' | 'REFERRAL' | 'FACEBOOK';
export type LeadType = 'TOURIST' | 'LOCAL' | 'CORPORATE';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  status: LeadStatus;
  source: LeadSource;
  type: LeadType;
  desiredDate?: string;
  numberOfPeople?: number;
  tourType?: string;
  budget?: number;
  notes?: string;
  firstContactAt: string;
  lastContactAt?: string;
  tags: string[];
}

// Booking Types
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELED' | 'COMPLETED';
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID';
export type PaymentMethod = 'CASH' | 'PIX' | 'CREDIT_CARD' | 'BANK_TRANSFER';

export interface Booking {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  tourId: string;
  tourName: string;
  boatId?: string;
  date: string;
  startTime: string;
  endTime: string;
  numberOfPeople: number;
  totalValue: number;
  paidValue: number;
  remainingValue: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  status: BookingStatus;
  notes?: string;
  specialRequirements?: string;
  captainName?: string;
  createdAt: string;
}

// Tour Types
export interface Tour {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration: number; // em minutos
  price: number;
  image: string;
  includes: string[];
  requiresLowTide: boolean;
  hasLiveMusic: boolean;
  departureTime?: string;
  bestFor: string[];
  isActive: boolean;
}

// Boat Types
export interface Boat {
  id: string;
  name: string;
  description: string;
  capacity: number;
  brand?: string;
  model?: string;
  year?: number;
  length?: number;
  images: string[];
  features: string[];
  pricePerHour: number;
  pricePerDay: number;
  isActive: boolean;
}

// Tide Types
export type TideQuality = 'ideal' | 'good' | 'regular' | 'bad';
export type TideType = 'low' | 'high';

export interface TideInfo {
  time: string;
  height: number;
  type: TideType;
  quality: TideQuality;
}

export interface TideData {
  date: string;
  tides: TideInfo[];
}

// Weather Types
export type WeatherCondition = 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy' | 'stormy';
export type SeaCondition = 'calm' | 'moderate' | 'rough';
export type WeatherRecommendation = 'ideal' | 'attention' | 'not_recommended';

export interface WeatherData {
  date: string;
  condition: WeatherCondition;
  icon: string;
  tempMax: number;
  tempMin: number;
  rainChance: number;
  windSpeed: number;
  windDirection: string;
  seaCondition: SeaCondition;
  recommendation: WeatherRecommendation;
}

// Message Types
export interface Message {
  id: string;
  conversationId: string;
  sender: 'USER' | 'ADMIN' | 'BOT';
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: Message[];
}

// Interaction Types
export type InteractionType = 'MESSAGE' | 'CALL' | 'EMAIL' | 'NOTE';

export interface Interaction {
  id: string;
  leadId: string;
  type: InteractionType;
  content: string;
  sender: 'USER' | 'ADMIN' | 'BOT';
  timestamp: string;
}
