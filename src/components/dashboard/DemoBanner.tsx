import { AlertTriangle } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="mt-4 rounded border-2 border-[#B8860B] bg-[#B8860B]/5 px-4 py-3">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[#B8860B]" />
        <div>
          <p className="text-sm font-bold text-[#B8860B] uppercase tracking-wide">
            Demo Mode
          </p>
          <p className="mt-1 text-xs text-[#6b6860]">
            Showing sample data. No external API is configured. Connect your
            Google Places API key for real business results.
          </p>
        </div>
      </div>
    </div>
  );
}
