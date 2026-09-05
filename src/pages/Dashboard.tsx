import { useState, useCallback } from "react";
import { SearchPanel } from "@/components/dashboard/SearchPanel";
import { ResultsGrid } from "@/components/dashboard/ResultsGrid";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { LeadDetailsModal } from "@/components/dashboard/LeadDetailsModal";
import { DemoBanner } from "@/components/dashboard/DemoBanner";
import { SavedLeadsView } from "@/components/dashboard/SavedLeadsView";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Bookmark, Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { api } from "@/convex/_generated/api";
import { useAction, useQuery } from "convex/react";
import type { LeadWithScore, FilterState, SearchResult } from "@/types/leads";
import { DEFAULT_FILTERS } from "@/types/leads";

type ActiveView = "search" | "saved";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const searchAction = useAction(api.searchBusinesses.search);
  const leadCounts = useQuery(api.leads.getLeadCounts);

  const [results, setResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedLead, setSelectedLead] = useState<LeadWithScore | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>("search");

  const handleSearch = useCallback(
    async (category: string, location: string) => {
      setIsSearching(true);
      setSearchError(null);
      setResults(null);

      try {
        const result = await searchAction({ category, location });
        setResults(result);
      } catch (error) {
        console.error("Search error:", error);
        setSearchError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        );
      } finally {
        setIsSearching(false);
      }
    },
    [searchAction],
  );

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Apply filters to results
  const filteredResults = results?.businesses.filter((b) => {
    if (filters.showOnlyLeads && b.websiteStatus !== "no_website") return false;
    if (
      filters.websiteFilter !== "all" &&
      b.websiteStatus !== filters.websiteFilter
    )
      return false;
    if (filters.minRating > 0 && (b.rating ?? 0) < filters.minRating)
      return false;
    if (
      filters.category &&
      b.category &&
      !b.category.toLowerCase().includes(filters.category.toLowerCase())
    )
      return false;
    return true;
  });

  // Sort results
  const sortedResults = filteredResults
    ? [...filteredResults].sort((a, b) => {
        const dir = filters.sortDirection === "asc" ? 1 : -1;
        switch (filters.sortBy) {
          case "score":
            return (b.leadScore - a.leadScore) * dir;
          case "rating":
            return ((b.rating ?? 0) - (a.rating ?? 0)) * dir;
          case "reviews":
            return ((b.reviewCount ?? 0) - (a.reviewCount ?? 0)) * dir;
          case "name":
            return a.name.localeCompare(b.name) * dir;
          default:
            return 0;
        }
      })
    : [];

  return (
    <div className="min-h-screen bg-[#F0EEE6] text-[#1a1a18] font-editorial">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b-2 border-[#1a1a18] bg-[#FAF9F5]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-xl sm:text-2xl">🦅</span>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-wide uppercase leading-tight">
                Falcon Lead Finder
              </h1>
              <p className="text-[10px] sm:text-xs text-[#6b6860] tracking-wider uppercase">
                Lead Discovery — Falcon Sector 1
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* View Toggle */}
            <div className="flex rounded border-2 border-[#1a1a18] overflow-hidden">
              <button
                onClick={() => setActiveView("search")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-colors ${
                  activeView === "search"
                    ? "bg-[#1a1a18] text-[#F0EEE6]"
                    : "text-[#6b6860] hover:bg-[#E8E5DB]"
                }`}
              >
                <Search className="size-3" />
                <span className="hidden sm:inline">Search</span>
              </button>
              <button
                onClick={() => setActiveView("saved")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-colors relative ${
                  activeView === "saved"
                    ? "bg-[#1a1a18] text-[#F0EEE6]"
                    : "text-[#6b6860] hover:bg-[#E8E5DB]"
                }`}
              >
                <Bookmark className="size-3" />
                <span className="hidden sm:inline">Saved</span>
                {leadCounts && leadCounts.total > 0 && (
                  <span className="ml-1 inline-flex size-4 items-center justify-center rounded-full bg-[#E05252] text-[9px] font-bold text-white">
                    {leadCounts.total}
                  </span>
                )}
              </button>
            </div>

            <span className="hidden text-xs text-[#6b6860] md:block">
              {user?.name || user?.email || "Team Member"}
            </span>
            <button
              onClick={handleSignOut}
              className="rounded p-1.5 text-[#6b6860] hover:bg-[#E8E5DB] hover:text-[#1a1a18] transition-colors"
              title="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {activeView === "saved" ? (
          <SavedLeadsView />
        ) : (
          <>
            {/* Search Panel */}
            <SearchPanel onSearch={handleSearch} isLoading={isSearching} />

            {/* Error state */}
            {searchError && (
              <div className="mt-4 rounded border-2 border-[#E05252] bg-[#E05252]/5 px-4 py-3 text-sm text-[#E05252]">
                <p className="font-bold">Search Error</p>
                <p className="mt-1 text-[#E05252]/80">{searchError}</p>
              </div>
            )}

            {/* Loading state */}
            {isSearching && (
              <div className="mt-8 flex flex-col items-center gap-4 py-16">
                <Loader2 className="size-8 animate-spin text-[#6b6860]" />
                <div className="text-center">
                  <p className="text-sm font-bold">Searching businesses...</p>
                  <p className="mt-1 text-xs text-[#6b6860]">
                    Checking website information...
                  </p>
                </div>
              </div>
            )}

            {/* Results */}
            {results && !isSearching && (
              <>
                {results.isDemoMode && <DemoBanner />}

                {results.totalCount === 0 ? (
                  <div className="mt-8 rounded border-2 border-[#D4D0C4] bg-[#FAF9F5] px-6 py-16 text-center">
                    <p className="font-bold">No businesses found.</p>
                    <p className="mt-2 text-sm text-[#6b6860]">
                      Try a broader category or different location.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Filter Bar */}
                    <FilterBar
                      filters={filters}
                      onFiltersChange={setFilters}
                      totalCount={results.totalCount}
                      filteredCount={sortedResults.length}
                      leadCount={results.leadCount}
                    />

                    {/* Results Grid */}
                    <ResultsGrid
                      results={sortedResults}
                      onSelectLead={setSelectedLead}
                    />
                  </>
                )}
              </>
            )}

            {/* Empty state */}
            {!results && !isSearching && !searchError && (
              <div className="mt-12 flex flex-col items-center gap-4 py-20 text-center">
                <div className="inline-flex size-16 items-center justify-center rounded-full border-2 border-dashed border-[#1a1a18]">
                  <Search className="size-6 text-[#6b6860]" />
                </div>
                <div>
                  <p className="font-bold">
                    Search for businesses to get started
                  </p>
                  <p className="mt-2 max-w-sm text-sm text-[#6b6860]">
                    Enter a business category (e.g., Salons) and a location
                    (e.g., Bengaluru) above to discover potential leads.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Lead Details Modal */}
      {selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          searchSource={results?.isDemoMode ? "demo" : "google_places"}
        />
      )}
    </div>
  );
}
