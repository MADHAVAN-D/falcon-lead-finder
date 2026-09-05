import type { FilterState } from "@/types/leads";
import { Filter, SortAsc, SortDesc } from "lucide-react";

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
  leadCount: number;
}

export function FilterBar({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
  leadCount,
}: FilterBarProps) {
  return (
    <div className="mt-6 flex flex-col gap-3 rounded border-2 border-[#1a1a18] bg-[#FAF9F5] p-3 sm:p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="size-3.5 text-[#6b6860]" />
        <span className="text-xs font-bold tracking-wide uppercase text-[#6b6860]">
          Filters
        </span>

        {/* Potential Leads toggle */}
        <button
          onClick={() =>
            onFiltersChange({
              ...filters,
              showOnlyLeads: !filters.showOnlyLeads,
              websiteFilter: !filters.showOnlyLeads
                ? "no_website"
                : "all",
            })
          }
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            filters.showOnlyLeads
              ? "border-[#E05252] bg-[#E05252] text-white"
              : "border-[#D4D0C4] bg-white text-[#6b6860] hover:bg-[#E8E5DB]"
          }`}
        >
          🦅 Only Potential Leads
        </button>

        {/* Website filter */}
        <select
          value={filters.websiteFilter}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              websiteFilter: e.target.value as FilterState["websiteFilter"],
              showOnlyLeads:
                e.target.value === "no_website" ? true : false,
            })
          }
          className="rounded border border-[#D4D0C4] bg-white px-2 py-1 text-xs text-[#1a1a18]"
        >
          <option value="all">All</option>
          <option value="no_website">No Website</option>
          <option value="website_found">Has Website</option>
        </select>

        {/* Min Rating */}
        <select
          value={filters.minRating}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              minRating: Number(e.target.value),
            })
          }
          className="rounded border border-[#D4D0C4] bg-white px-2 py-1 text-xs text-[#1a1a18]"
        >
          <option value={0}>Any Rating</option>
          <option value={3}>3.0+ Stars</option>
          <option value={3.5}>3.5+ Stars</option>
          <option value={4}>4.0+ Stars</option>
          <option value={4.5}>4.5+ Stars</option>
        </select>

        {/* Sort */}
        <select
          value={`${filters.sortBy}-${filters.sortDirection}`}
          onChange={(e) => {
            const [sortBy, sortDirection] = e.target.value.split("-") as [
              FilterState["sortBy"],
              FilterState["sortDirection"],
            ];
            onFiltersChange({ ...filters, sortBy, sortDirection });
          }}
          className="rounded border border-[#D4D0C4] bg-white px-2 py-1 text-xs text-[#1a1a18]"
        >
          <option value="score-desc">Lead Score ↓</option>
          <option value="score-asc">Lead Score ↑</option>
          <option value="rating-desc">Rating ↓</option>
          <option value="rating-asc">Rating ↑</option>
          <option value="reviews-desc">Reviews ↓</option>
          <option value="name-asc">Name A-Z</option>
        </select>
      </div>

      <div className="text-xs text-[#6b6860]">
        Showing{" "}
        <span className="font-bold text-[#1a1a18]">{filteredCount}</span> of{" "}
        <span className="font-bold text-[#1a1a18]">{totalCount}</span>
        {leadCount > 0 && (
          <>
            {" · "}
            <span className="font-bold text-[#9B2C2C]">
              {leadCount} potential leads
            </span>
          </>
        )}
      </div>
    </div>
  );
}
