import { useState } from "react";
import {
  X,
  Star,
  Phone,
  Globe,
  Unlink,
  MapPin,
  ExternalLink,
  CheckCircle,
  Bookmark,
  Loader2,
  MessageSquare,
  Send,
  Trash2,
} from "lucide-react";
import type { LeadWithScore } from "@/types/leads";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useAuth } from "@/hooks/use-auth";

interface LeadDetailsModalProps {
  lead: LeadWithScore;
  onClose: () => void;
  searchSource?: string;
}

export function LeadDetailsModal({
  lead,
  onClose,
  searchSource,
}: LeadDetailsModalProps) {
  const { isAuthenticated } = useAuth();
  const saveLead = useMutation(api.leads.saveLead);
  const addComment = useMutation(api.leads.addComment);
  const deleteComment = useMutation(api.leads.deleteComment);
  const savedLeads = useQuery(
    api.leads.isLeadSaved,
    lead.placeId ? { placeId: lead.placeId } : "skip",
  );

  // Get the saved lead ID so we can fetch comments
  const savedLead = useQuery(
    api.leads.getLeads,
    {},
  );
  const currentSavedLead = savedLead?.find(
    (l) => l.placeId === lead.placeId,
  );
  const comments = useQuery(
    api.leads.getComments,
    currentSavedLead ? { leadId: currentSavedLead._id } : "skip",
  );

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const isAlreadySaved = saved || savedLeads === true;

  const handleSave = async () => {
    if (!isAuthenticated || !lead.placeId) return;
    setSaving(true);
    setSaveError(null);
    try {
      await saveLead({
        businessName: lead.name,
        category: lead.category,
        location: lead.location,
        address: lead.address,
        phone: lead.phone,
        website: lead.website,
        websiteStatus: lead.websiteStatus,
        rating: lead.rating,
        reviewCount: lead.reviewCount,
        leadScore: lead.leadScore,
        scoreBreakdown: lead.scoreBreakdown.map(
          (r) => `${r.met ? "✓" : "✗"} ${r.label} (+${r.points})`,
        ),
        placeId: lead.placeId,
        searchSource: searchSource,
      });
      setSaved(true);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Failed to save lead.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = async () => {
    if (!currentSavedLead || !commentText.trim()) return;
    setSubmittingComment(true);
    try {
      await addComment({
        leadId: currentSavedLead._id,
        text: commentText.trim(),
      });
      setCommentText("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment({ commentId: commentId as any });
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const isLead = lead.websiteStatus === "no_website";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded border-2 border-[#1a1a18] bg-[#FAF9F5] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-[#1a1a18] p-5">
          <div>
            <h2 className="text-lg font-bold leading-tight">{lead.name}</h2>
            {lead.category && (
              <p className="mt-1 text-xs text-[#6b6860]">{lead.category}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-[#6b6860] hover:bg-[#E8E5DB] transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Status badges */}
          <div className="flex flex-wrap gap-2">
            {isLead ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E05252]/10 px-3 py-1 text-xs font-bold text-[#E05252]">
                <Unlink className="size-3" />
                NO WEBSITE LISTED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2C5F2D]/10 px-3 py-1 text-xs font-bold text-[#2C5F2D]">
                <Globe className="size-3" />
                WEBSITE FOUND
              </span>
            )}
            {isLead && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E05252] px-3 py-1 text-xs font-bold text-white">
                🦅 POTENTIAL LEAD
              </span>
            )}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {lead.rating !== undefined && (
              <div className="flex items-center gap-2">
                <Star className="size-4 fill-[#B8860B] text-[#B8860B]" />
                <span>
                  <span className="font-bold">{lead.rating}</span> rating
                </span>
              </div>
            )}
            {lead.reviewCount !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-[#6b6860]">
                  {lead.reviewCount.toLocaleString()} reviews
                </span>
              </div>
            )}
            {lead.address && (
              <div className="col-span-2 flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#6b6860]" />
                <span>{lead.address}</span>
              </div>
            )}
            {lead.phone && (
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-[#6b6860]" />
                <span>{lead.phone}</span>
              </div>
            )}
            {lead.website && (
              <div className="flex items-center gap-2">
                <Globe className="size-4 text-[#6b6860]" />
                <a
                  href={lead.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#6b6860] hover:text-[#1a1a18] underline"
                >
                  Visit website
                  <ExternalLink className="size-3" />
                </a>
              </div>
            )}
          </div>

          {/* Lead Score */}
          <div className="rounded border-2 border-[#1a1a18] bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold tracking-wide uppercase text-[#6b6860]">
                Potential Lead Score
              </h3>
              <span
                className={`text-lg font-bold ${
                  lead.leadScore >= 70
                    ? "text-[#E05252]"
                    : lead.leadScore >= 40
                      ? "text-[#B8860B]"
                      : "text-[#6b6860]"
                }`}
              >
                {lead.leadScore}/100
              </span>
            </div>

            {/* Score bar */}
            <div className="mt-2 h-2 rounded-full bg-[#E8E5DB]">
              <div
                className={`h-full rounded-full transition-all ${
                  lead.leadScore >= 70
                    ? "bg-[#E05252]"
                    : lead.leadScore >= 40
                      ? "bg-[#B8860B]"
                      : "bg-[#6b6860]"
                }`}
                style={{ width: `${lead.leadScore}%` }}
              />
            </div>

            {/* Score breakdown */}
            <div className="mt-3 space-y-1.5">
              <p className="text-[10px] font-bold tracking-wide uppercase text-[#6b6860]">
                Why this score?
              </p>
              {lead.scoreBreakdown.map((reason, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs"
                >
                  {reason.met ? (
                    <CheckCircle className="size-3 shrink-0 text-[#2C5F2D]" />
                  ) : (
                    <span className="inline-block size-3 shrink-0 rounded-full border border-[#D4D0C4]" />
                  )}
                  <span
                    className={
                      reason.met ? "font-medium" : "text-[#6b6860]"
                    }
                  >
                    {reason.label}
                  </span>
                  <span className="ml-auto text-[10px] text-[#6b6860]">
                    +{reason.points}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Team Notes */}
          {currentSavedLead && (
            <div className="rounded border-2 border-[#1a1a18] bg-white p-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="size-4 text-[#6b6860]" />
                <h3 className="text-xs font-bold tracking-wide uppercase text-[#6b6860]">
                  Team Notes
                </h3>
              </div>

              {/* Comments list */}
              {comments && comments.length > 0 && (
                <div className="space-y-3 mb-3">
                  {comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="rounded bg-[#F0EEE6] p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">
                          {comment.authorName}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#6b6860]">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-[#6b6860] hover:text-[#E05252] transition-colors"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 text-sm">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add comment */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a note for the team..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !submittingComment) {
                      handleAddComment();
                    }
                  }}
                  className="flex-1 rounded border border-[#D4D0C4] bg-[#F0EEE6] px-3 py-2 text-sm placeholder:text-[#9B978E] focus:border-[#1a1a18] focus:ring-[#1a1a18] outline-none"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim() || submittingComment}
                  className="rounded bg-[#1a1a18] px-3 py-2 text-[#F0EEE6] hover:bg-[#2a2a28] disabled:opacity-50 transition-colors"
                >
                  {submittingComment ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Place ID */}
          {lead.placeId && (
            <div className="text-xs text-[#6b6860]">
              <span className="font-medium">Place ID:</span> {lead.placeId}
            </div>
          )}

          {/* Save error */}
          {saveError && (
            <p className="text-xs text-[#E05252]">{saveError}</p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-2 border-[#1a1a18] p-5">
          {isAuthenticated ? (
            <button
              onClick={handleSave}
              disabled={isAlreadySaved || saving}
              className={`inline-flex w-full items-center justify-center gap-2 rounded px-4 py-2.5 text-sm font-bold transition-colors ${
                isAlreadySaved
                  ? "bg-[#2C5F2D]/10 text-[#2C5F2D] cursor-default"
                  : "bg-[#1a1a18] text-[#F0EEE6] hover:bg-[#2a2a28]"
              } disabled:opacity-50`}
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : isAlreadySaved ? (
                <CheckCircle className="size-4" />
              ) : (
                <Bookmark className="size-4" />
              )}
              {isAlreadySaved ? "Lead Saved" : "Save Lead"}
            </button>
          ) : (
            <p className="text-center text-xs text-[#6b6860]">
              Sign in to save leads and add team notes.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
