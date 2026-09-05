import { DEMO_BUSINESSES, type BusinessResult } from "../../types/leads";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

/**
 * Search for businesses using Google Places API (New) or fall back to demo mode.
 *
 * To use real data:
 * 1. Get a Google Cloud API key with Places API enabled
 * 2. Set GOOGLE_PLACES_API_KEY in your Convex environment
 *
 * API documentation: https://developers.google.com/maps/documentation/places/web-service
 */
export async function searchBusinesses(
  category: string,
  location: string,
): Promise<{ businesses: BusinessResult[]; isDemoMode: boolean }> {
  // If no API key is configured, return demo data
  if (!GOOGLE_PLACES_API_KEY) {
    console.log("[Falcon Lead Finder] No GOOGLE_PLACES_API_KEY configured. Using demo data.");
    const demoResults = filterDemoData(category, location);
    return { businesses: demoResults, isDemoMode: true };
  }

  try {
    const query = `${category} in ${location}`;
    const response = await fetch(
      `https://places.googleapis.com/v1/places:searchText?key=${GOOGLE_PLACES_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.types,places.formattedAddress,places.location,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.businessStatus",
        },
        body: JSON.stringify({
          textQuery: query,
          maxResultCount: 20,
          languageCode: "en",
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("[Falcon Lead Finder] Places API error:", response.status, errorBody);

      if (response.status === 403) {
        throw new Error(
          "API key does not have access to the Places API. Please enable it in your Google Cloud Console.",
        );
      }
      if (response.status === 429) {
        throw new Error(
          "Rate limit exceeded. Please wait a moment and try again.",
        );
      }
      throw new Error(
        "Could not retrieve businesses right now. Please check your API configuration and try again.",
      );
    }

    const data = await response.json();
    const places = data.places || [];

    const businesses: BusinessResult[] = places.map(
      (place: Record<string, unknown>) => {
        const displayName = place.displayName as { text?: string } | undefined;
        const location = place.location as
          | { latitude?: number; longitude?: number }
          | undefined;

        return {
          placeId: (place.id as string) || "",
          name: displayName?.text || "Unknown Business",
          category: extractCategory(place.types as string[] | undefined),
          address: (place.formattedAddress as string) || undefined,
          location: extractLocationFromAddress(
            (place.formattedAddress as string) || "",
          ),
          phone: (place.nationalPhoneNumber as string) || undefined,
          website: (place.websiteUri as string) || undefined,
          websiteStatus: (place.websiteUri as string)
            ? ("website_found" as const)
            : ("no_website" as const),
          rating: place.rating as number | undefined,
          reviewCount: place.userRatingCount as number | undefined,
          latitude: location?.latitude,
          longitude: location?.longitude,
          businessStatus: (place.businessStatus as string) || undefined,
          source: "google_places" as const,
        };
      },
    );

    return { businesses, isDemoMode: false };
  } catch (error) {
    console.error("[Falcon Lead Finder] Search error:", error);
    throw error;
  }
}

/**
 * Filter demo data based on category and location.
 */
function filterDemoData(category: string, location: string): BusinessResult[] {
  const categoryLower = category.toLowerCase();
  const locationLower = location.toLowerCase();

  return DEMO_BUSINESSES.filter((b) => {
    const matchesCategory =
      !category ||
      (b.category && b.category.toLowerCase().includes(categoryLower)) ||
      b.name.toLowerCase().includes(categoryLower);
    const matchesLocation =
      !location ||
      (b.location && b.location.toLowerCase().includes(locationLower)) ||
      (b.address && b.address.toLowerCase().includes(locationLower));
    return matchesCategory && matchesLocation;
  });
}

/**
 * Extract a readable category from Google Places types.
 */
function extractCategory(types?: string[]): string | undefined {
  if (!types || types.length === 0) return undefined;

  // Map common Google types to readable categories
  const categoryMap: Record<string, string> = {
    beauty_salon: "Salon",
    hair_care: "Salon",
    hair_salon: "Salon",
    nail_salon: "Nail Salon",
    spa: "Spa",
    restaurant: "Restaurant",
    cafe: "Cafe",
    store: "Store",
    clothing_store: "Clothing Store",
    electronics_store: "Electronics Store",
    gym: "Gym",
    fitness_center: "Fitness Center",
    dentist: "Dentist",
    doctor: "Doctor",
    hospital: "Hospital",
    pharmacy: "Pharmacy",
    hotel: "Hotel",
    bakery: "Bakery",
    grocery_store: "Grocery Store",
    supermarket: "Supermarket",
    plumber: "Plumber",
    electrician: "Electrician",
    lawyer: "Lawyer",
    accountant: "Accountant",
    real_estate_agency: "Real Estate Agency",
    car_repair: "Auto Repair",
    veterinary_care: "Veterinary",
  };

  for (const type of types) {
    if (categoryMap[type]) {
      return categoryMap[type];
    }
  }

  // Fallback: convert snake_case to Title Case
  const primary = types[0];
  return primary
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Extract city/area from a formatted address string.
 */
function extractLocationFromAddress(address: string): string | undefined {
  if (!address) return undefined;

  // Try to extract a meaningful location portion from the address
  const parts = address.split(",").map((p) => p.trim());
  if (parts.length >= 2) {
    // Return the city/area portion (typically second-to-last or last before state/zip)
    const cityCandidate = parts.length >= 3 ? parts[parts.length - 3] : parts[0];
    const stateCandidate = parts.length >= 3 ? parts[parts.length - 2] : parts[1];
    if (stateCandidate && /^\d/.test(stateCandidate)) {
      return cityCandidate;
    }
    return `${cityCandidate}, ${stateCandidate}`;
  }
  return address;
}
