import { Star, Phone, Globe, Unlink, MapPin, ExternalLink } from "lucide-react";
import type { LeadWithScore } from "@/types/leads";

interface ResultsGridProps {
  results: LeadWithScore[];
  onSelectLead: (lead: LeadWithScore) => void;
}

export function ResultsGrid({ results, onSelectLead }: ResultsGridProps) {
  if (results.length === 0) {
    return (
      <div className="mt-6 rounded border border-[#D4D0C4] bg-[#FAF9F5] px-6 py-16 text-center">
        <p className="font-medium">No results match your filters.</p>
        <p className="mt-2 text-sm text-[#6b6860]">
          Try adjusting your filters or broadening your search.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {results.map((lead) => (
        <LeadCard key={lead.placeId} lead={lead} onSelect={onSelectLead} />
      ))}
    </div>
  );
}

function LeadCard({
  lead,
  onSelect,
}: {
  lead: LeadWithScore;
  onSelect: (lead: LeadWithScore) => void;
}) {
  const isLead = lead.websiteStatus === "no_website";

  return (
    <div
      onClick={() => onSelect(lead)}
      className={`group cursor-pointer rounded border p-4 transition-all hover:shadow-md ${          isLead
          ? "border-[#E05252]/40 bg-white"
          : "border-[#D4D0C4] bg-[#FAF9F5]"
      }`}
    >
      {/* Top row: name + score */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold leading-tight">{lead.name}</h3>
        <div
          className={`shrink-0 rounded px-2 py-0.5 text-xs font-bold ${
            lead.leadScore >= 70
              ? "bg-[#9B2C2C] text-white"
              : lead.leadScore >= 40
                ? "bg-[#B8860B] text-white"
                : "bg-[#E8E5DB] text-[#1a1a18]"
          }`}
        >
          {lead.leadScore}
        </div>
      </div>

      {/* Category */}
      {lead.category && (
        <p className="mt-1 text-xs text-[#6b6860]">{lead.category}</p>
      )}

      {/* Rating + Reviews */}
      <div className="mt-3 flex items-center gap-3 text-xs">
        {lead.rating !== undefined && (
          <span className="flex items-center gap-1">
            <Star className="size-3 fill-[#B8860B] text-[#B8860B]" />
            <span className="font-medium">{lead.rating}</span>
          </span>
        )}
        {lead.reviewCount !== undefined && (
          <span className="text-[#6b6860]">
            {lead.reviewCount.toLocaleString()} reviews
          </span>
        )}
      </div>

      {/* Address */}
      {lead.address && (
        <p className="mt-2 flex items-start gap-1.5 text-xs text-[#6b6860]">
          <MapPin className="mt-0.5 size-3 shrink-0" />
          <span className="line-clamp-2">{lead.address}</span>
        </p>
      )}

      {/* Phone */}
      {lead.phone && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#6b6860]">
          <Phone className="size-3 shrink-0" />
          {lead.phone}
        </p>
      )}

      {/* Website status */}
      <div className="mt-3 border-t border-[#D4D0C4] pt-3">
        {isLead ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E05252]/10 px-2.5 py-1 text-xs font-bold text-[#E05252]">
              <Unlink className="size-3" />
              NO WEBSITE LISTED
            </span>              <span className="text-[10px] font-bold tracking-wide text-[#E05252]">
              🦅 POTENTIAL LEAD
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2C5F2D]/10 px-2.5 py-1 text-xs font-bold text-[#2C5F2D]">
              <Globe className="size-3" />
              WEBSITE FOUND
            </span>
            {lead.website && (
              <a
                href={lead.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[10px] text-[#6b6860] hover:text-[#1a1a18] flex items-center gap-0.5"
              >
                <ExternalLink className="size-2.5" />
                Visit
              </a>
            )}
          </div>
        )}
      </div>

      {/* View details hint */}
      <p className="mt-3 text-[10px] tracking-wide uppercase text-[#6b6860] group-hover:text-[#1a1a18] transition-colors">
        Click to view details →
      </p>
    </div>
  );
}
