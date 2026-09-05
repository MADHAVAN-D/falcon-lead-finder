import { useState } from "react";
import {
  Star,
  Phone,
  Globe,
  Unlink,
  MapPin,
  Trash2,
  Loader2,
  Inbox,
} from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import {
  LEAD_STATUS_LABELS,
  LEAD_STATUS_COLORS,
  type LeadStatus,
} from "@/types/leads";
import type { Id } from "../../convex/_generated/dataModel";

export function SavedLeadsView() {
  const leads = useQuery(api.leads.getLeads, {});
  const updateStatus = useMutation(api.leads.updateLeadStatus);
  const deleteLead = useMutation(api.leads.deleteLead);
  const leadCounts = useQuery(api.leads.getLeadCounts);

  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredLeads =
    leads?.filter(
      (l) => statusFilter === "all" || l.status === statusFilter,
    ) ?? [];

  const handleStatusChange = async (
    leadId: Id<"leads">,
    newStatus: LeadStatus,
  ) => {
    setUpdatingId(String(leadId));
    try {
      await updateStatus({ leadId, status: newStatus });
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (leadId: Id<"leads">) => {
    try {
      await deleteLead({ leadId });
    } catch (error) {
      console.error("Failed to delete lead:", error);
    }
  };

  if (leads === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-[#6b6860]" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}        <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight">Your Saved Leads</h2>
        <p className="mt-1 text-sm text-[#6b6860]">
          Manage prospects and track outreach progress with your team.
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        <button
          onClick={() => setStatusFilter("all")}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            statusFilter === "all"
              ? "border-[#1a1a18] bg-[#1a1a18] text-[#F0EEE6]"
              : "border-[#D4D0C4] bg-white text-[#6b6860] hover:bg-[#E8E5DB]"
          }`}
        >
          All ({leadCounts?.total ?? 0})
        </button>
        {(Object.keys(LEAD_STATUS_LABELS) as LeadStatus[]).map((status) => {
          const count = leadCounts?.[status] ?? 0;
          if (count === 0) return null;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === status
                  ? "border-[#1a1a18] bg-[#1a1a18] text-[#F0EEE6]"
                  : "border-[#D4D0C4] bg-white text-[#6b6860] hover:bg-[#E8E5DB]"
              }`}
            >
              {LEAD_STATUS_LABELS[status]} ({count})
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredLeads.length === 0 && (
        <div className="rounded border border-dashed border-[#D4D0C4] bg-[#FAF9F5] px-6 py-16 text-center">
          <Inbox className="mx-auto size-8 text-[#6b6860]" />
          <p className="mt-4 font-medium">
            {leads.length === 0
              ? "No saved leads yet."
              : "No leads match this filter."}
          </p>
          <p className="mt-2 text-sm text-[#6b6860]">
            {leads.length === 0
              ? "Search for businesses and save potential leads to see them here."
              : "Try a different status filter."}
          </p>
        </div>
      )}

      {/* Leads table */}
      {filteredLeads.length > 0 && (
        <div className="overflow-x-auto rounded border border-[#D4D0C4]">
          <table className="w-full text-left text-sm">
            <thead className="border-b-2 border-[#1a1a18] bg-[#1a1a18] text-[#F0EEE6]">
              <tr>
                <th className="px-4 py-3 text-xs font-bold tracking-wide uppercase">
                  Business
                </th>
                <th className="hidden px-4 py-3 text-xs font-bold tracking-wide uppercase md:table-cell">
                  Rating
                </th>
                <th className="hidden px-4 py-3 text-xs font-bold tracking-wide uppercase lg:table-cell">
                  Website
                </th>
                <th className="px-4 py-3 text-xs font-bold tracking-wide uppercase">
                  Score
                </th>
                <th className="px-4 py-3 text-xs font-bold tracking-wide uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-bold tracking-wide uppercase">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr
                  key={lead._id}
                  className="border-b border-[#D4D0C4] last:border-b-0 hover:bg-[#FAF9F5]"
                >
                  {/* Business info */}
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-bold leading-tight">{lead.businessName}</p>
                      {lead.address && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-[#6b6860]">
                          <MapPin className="size-3 shrink-0" />
                          <span className="line-clamp-1">{lead.address}</span>
                        </p>
                      )}
                      {lead.phone && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-[#6b6860]">
                          <Phone className="size-3 shrink-0" />
                          {lead.phone}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="hidden px-4 py-3 md:table-cell">
                    {lead.rating !== undefined && (
                      <span className="flex items-center gap-1 text-xs">
                        <Star className="size-3 fill-[#B8860B] text-[#B8860B]" />
                        {lead.rating}
                        {lead.reviewCount !== undefined && (
                          <span className="text-[#6b6860]">
                            ({lead.reviewCount})
                          </span>
                        )}
                      </span>
                    )}
                  </td>

                  {/* Website */}
                  <td className="hidden px-4 py-3 lg:table-cell">
                    {lead.websiteStatus === "no_website" ? (
                      <span className="inline-flex items-center gap-1 text-xs text-[#9B2C2C]">
                        <Unlink className="size-3" />
                        No website
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-[#2C5F2D]">
                        <Globe className="size-3" />
                        Has website
                      </span>
                    )}
                  </td>

                  {/* Score */}
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm font-bold ${
                        lead.leadScore >= 70
                          ? "text-[#9B2C2C]"
                          : lead.leadScore >= 40
                            ? "text-[#B8860B]"
                            : "text-[#6b6860]"
                      }`}
                    >
                      {lead.leadScore}
                    </span>
                  </td>

                  {/* Status dropdown */}
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        handleStatusChange(
                          lead._id,
                          e.target.value as LeadStatus,
                        )
                      }
                      disabled={updatingId === lead._id}
                      className={`rounded border px-2 py-1 text-xs font-medium ${
                        LEAD_STATUS_COLORS[lead.status]
                      }`}
                    >
                      {(
                        Object.entries(LEAD_STATUS_LABELS) as [
                          LeadStatus,
                          string,
                        ][]
                      ).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Delete */}
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(lead._id)}
                      className="rounded p-1 text-[#6b6860] hover:bg-[#E8E5DB] hover:text-[#9B2C2C] transition-colors"
                      title="Remove lead"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
