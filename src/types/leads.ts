// Normalized business result from any API source
export interface BusinessResult {
  placeId: string;
  name: string;
  category?: string;
  address?: string;
  location?: string;
  phone?: string;
  website?: string;
  websiteStatus: "no_website" | "website_found";
  rating?: number;
  reviewCount?: number;
  latitude?: number;
  longitude?: number;
  businessStatus?: string;
  source: "google_places" | "demo";
}

// Lead score breakdown item
export interface ScoreReason {
  label: string;
  points: number;
  met: boolean;
}

// Full lead with scoring
export interface LeadWithScore extends BusinessResult {
  leadScore: number;
  scoreBreakdown: ScoreReason[];
}

// Search parameters
export interface SearchParams {
  category: string;
  location: string;
}

// Search result returned from the action
export interface SearchResult {
  businesses: LeadWithScore[];
  totalCount: number;
  leadCount: number;
  isDemoMode: boolean;
  searchedAt: number;
}

// Saved lead in database
export interface SavedLead {
  _id: string;
  userId: string;
  businessName: string;
  category?: string;
  location?: string;
  address?: string;
  phone?: string;
  website?: string;
  websiteStatus: string;
  rating?: number;
  reviewCount?: number;
  leadScore: number;
  scoreBreakdown: string[];
  placeId?: string;
  status: LeadStatus;
  searchSource?: string;
  createdAt: number;
  updatedAt: number;
}

// Lead status enum values
export type LeadStatus =
  | "new"
  | "researching"
  | "contacted"
  | "responded"
  | "interested"
  | "client"
  | "not_interested";

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  researching: "Researching",
  contacted: "Contacted",
  responded: "Responded",
  interested: "Interested",
  client: "Client",
  not_interested: "Not Interested",
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  researching: "bg-amber-100 text-amber-800 border-amber-200",
  contacted: "bg-purple-100 text-purple-800 border-purple-200",
  responded: "bg-teal-100 text-teal-800 border-teal-200",
  interested: "bg-green-100 text-green-800 border-green-200",
  client: "bg-emerald-100 text-emerald-800 border-emerald-200",
  not_interested: "bg-gray-100 text-gray-600 border-gray-200",
};

// Filter state
export interface FilterState {
  showOnlyLeads: boolean;
  websiteFilter: "all" | "no_website" | "website_found";
  minRating: number;
  category: string;
  sortBy: "score" | "rating" | "reviews" | "name";
  sortDirection: "asc" | "desc";
}

export const DEFAULT_FILTERS: FilterState = {
  showOnlyLeads: false,
  websiteFilter: "all",
  minRating: 0,
  category: "",
  sortBy: "score",
  sortDirection: "desc",
};

// Demo data for when API is not configured
export const DEMO_BUSINESSES: BusinessResult[] = [
  {
    placeId: "demo_1",
    name: "Glow Beauty Salon",
    category: "Salon",
    address: "123 MG Road, Bengaluru, Karnataka 560001",
    location: "Bengaluru",
    phone: "+91 80 4567 8901",
    website: undefined,
    websiteStatus: "no_website",
    rating: 4.6,
    reviewCount: 187,
    source: "demo",
  },
  {
    placeId: "demo_2",
    name: "Style Studio Hair & Beauty",
    category: "Salon",
    address: "45 Brigade Road, Bengaluru, Karnataka 560025",
    location: "Bengaluru",
    phone: "+91 80 2345 6789",
    website: "https://stylestudio.example.com",
    websiteStatus: "website_found",
    rating: 4.3,
    reviewCount: 94,
    source: "demo",
  },
  {
    placeId: "demo_3",
    name: "Luxe Hair Lounge",
    category: "Salon",
    address: "78 Koramangala 5th Block, Bengaluru, Karnataka 560095",
    location: "Bengaluru",
    phone: "+91 80 6789 0123",
    website: undefined,
    websiteStatus: "no_website",
    rating: 4.8,
    reviewCount: 312,
    source: "demo",
  },
  {
    placeId: "demo_4",
    name: "Urban Cuts Barbershop",
    category: "Salon",
    address: "22 Indiranagar 100ft Road, Bengaluru, Karnataka 560038",
    location: "Bengaluru",
    phone: "+91 80 3456 7890",
    website: "https://urbancuts.example.com",
    websiteStatus: "website_found",
    rating: 4.1,
    reviewCount: 56,
    source: "demo",
  },
  {
    placeId: "demo_5",
    name: "Radiance Spa & Salon",
    category: "Salon",
    address: "90 Jayanagar 4th Block, Bengaluru, Karnataka 560041",
    location: "Bengaluru",
    phone: "+91 80 7890 1234",
    website: undefined,
    websiteStatus: "no_website",
    rating: 4.5,
    reviewCount: 203,
    source: "demo",
  },
  {
    placeId: "demo_6",
    name: "The Hair Company",
    category: "Salon",
    address: "156 Whitefield Main Road, Bengaluru, Karnataka 560066",
    location: "Bengaluru",
    phone: undefined,
    website: "https://thehaircompany.example.com",
    websiteStatus: "website_found",
    rating: 3.9,
    reviewCount: 42,
    source: "demo",
  },
  {
    placeId: "demo_7",
    name: "Crown Beauty Works",
    category: "Salon",
    address: "34 JP Nagar 7th Phase, Bengaluru, Karnataka 560078",
    location: "Bengaluru",
    phone: "+91 80 5678 9012",
    website: undefined,
    websiteStatus: "no_website",
    rating: 4.2,
    reviewCount: 88,
    source: "demo",
  },
  {
    placeId: "demo_8",
    name: "Blossom Beauty Salon",
    category: "Salon",
    address: "67 HSR Layout Sector 2, Bengaluru, Karnataka 560102",
    location: "Bengaluru",
    phone: "+91 80 9012 3456",
    website: undefined,
    websiteStatus: "no_website",
    rating: 4.7,
    reviewCount: 156,
    source: "demo",
  },
  {
    placeId: "demo_9",
    name: "Prestige Hair Studio",
    category: "Salon",
    address: "123 BTM Layout 2nd Stage, Bengaluru, Karnataka 560076",
    location: "Bengaluru",
    phone: "+91 80 1234 5678",
    website: "https://prestigehair.example.com",
    websiteStatus: "website_found",
    rating: 4.4,
    reviewCount: 71,
    source: "demo",
  },
  {
    placeId: "demo_10",
    name: "Serenity Beauty Lounge",
    category: "Salon",
    address: "89 Electronic City Phase 1, Bengaluru, Karnataka 560100",
    location: "Bengaluru",
    phone: "+91 80 4321 8765",
    website: undefined,
    websiteStatus: "no_website",
    rating: 4.9,
    reviewCount: 245,
    source: "demo",
  },
  {
    placeId: "demo_11",
    name: "Classic Cuts Salon",
    category: "Salon",
    address: "45 Malleshwaram 8th Cross, Bengaluru, Karnataka 560003",
    location: "Bengaluru",
    phone: "+91 80 8765 4321",
    website: "https://classiccuts.example.com",
    websiteStatus: "website_found",
    rating: 4.0,
    reviewCount: 33,
    source: "demo",
  },
  {
    placeId: "demo_12",
    name: "Aura Hair & Wellness",
    category: "Salon",
    address: "112 Frazer Town, Bengaluru, Karnataka 560005",
    location: "Bengaluru",
    phone: "+91 80 2468 1357",
    website: undefined,
    websiteStatus: "no_website",
    rating: 4.3,
    reviewCount: 119,
    source: "demo",
  },
];
