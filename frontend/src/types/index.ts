export interface User {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  avatar?: string;
  isAnonymous: boolean;
  role: 'user' | 'moderator' | 'admin';
  createdAt: string;
}

export interface SessionInfo {
  id: string;
  deviceType: string;
  browser: string;
  os: string;
  ipAddress: string;
  lastActiveAt: string;
  createdAt: string;
}

export interface FieldTemplate {
  key: string;
  labelBn: string;
  labelEn: string;
  type: 'text' | 'number' | 'select' | 'boolean' | 'date';
  required: boolean;
  options?: string[];
  placeholderBn?: string;
  unit?: string;
}

export interface Category {
  _id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  icon: string;
  descriptionBn?: string;
  requiredFields: FieldTemplate[];
  optionalFields: FieldTemplate[];
  order: number;
}

export interface PriceReport {
  id: string;
  userId?: string;
  itemTitle: string;
  price: number;
  formattedPrice: string;
  authorName: string;
  isAnonymous: boolean;
  categorySlug: string;
  location: {
    division: string;
    district: string;
    area: string;
    fullAddress: string;
  };
  condition: string;
  tags: string[];
  attributes: Record<string, any>;
  extraDetails: {
    batteryHealth?: string;
    warranty?: string;
    box?: boolean;
    charger?: boolean;
    repairHistory?: string;
    notes?: string;
    market?: string;
    freshness?: string;
    bookingSource?: string;
    vehicleType?: string;
    serviceType?: string;
  };
  imageUrl: string;
  positiveVotesCount: number;
  negativeVotesCount: number;
  positivePercentage: number;
  negativePercentage: number;
  userVote: 'positive' | 'negative' | null;
  relativeTimeBn: string;
  createdAt: string;
}

export interface PriceSummary {
  hasData: boolean;
  count: number;
  countBn: string;
  recent30DaysCount: number;
  recent30DaysCountBn: string;
  typicalPrice: number;
  typicalPriceFormatted: string;
  minRange: number;
  minRangeFormatted: string;
  maxRange: number;
  maxRangeFormatted: string;
  confidenceLevel: 'high' | 'medium' | 'low';
  confidenceText: string;
  lastUpdatedBn: string;
}

export interface CheckPriceResult {
  status: 'good' | 'fair' | 'high' | 'unknown';
  headlineBn: string;
  descriptionBn: string;
  quotedPrice: number;
  quotedPriceFormatted: string;
  typicalPrice?: number;
  typicalPriceFormatted?: string;
  minTypicalFormatted?: string;
  maxTypicalFormatted?: string;
  sampleCountBn?: string;
}
