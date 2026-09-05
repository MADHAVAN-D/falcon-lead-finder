import { useState, type FormEvent } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchPanelProps {
  onSearch: (category: string, location: string) => void;
  isLoading: boolean;
}

export function SearchPanel({ onSearch, isLoading }: SearchPanelProps) {
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const cat = category.trim();
    const loc = location.trim();

    if (!cat || !loc) {
      setError("Please enter both a business category and location.");
      return;
    }

    setError(null);
    onSearch(cat, loc);
  };

  return (
    <div className="rounded border-2 border-[#1a1a18] bg-[#FAF9F5] p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold tracking-tight">Find New Leads</h2>
        <p className="mt-1 text-sm text-[#6b6860]">
          Search for local businesses that are missing a web presence.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor="category"
              className="mb-1 block text-xs font-bold tracking-wide uppercase text-[#6b6860]"
            >
              Business Category
            </label>
            <Input
              id="category"
              placeholder="e.g. Salon, Cafe, Gym, Restaurant"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setError(null);
              }}
              disabled={isLoading}
              className="border-[#D4D0C4] bg-white placeholder:text-[#9B978E] focus:border-[#1a1a18] focus:ring-[#1a1a18]"
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="mb-1 block text-xs font-bold tracking-wide uppercase text-[#6b6860]"
            >
              Location
            </label>
            <Input
              id="location"
              placeholder="e.g. Bengaluru, Mumbai, Delhi"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setError(null);
              }}
              disabled={isLoading}
              className="border-[#D4D0C4] bg-white placeholder:text-[#9B978E] focus:border-[#1a1a18] focus:ring-[#1a1a18]"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-[#9B2C2C]">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded bg-[#1a1a18] px-6 py-2.5 text-sm font-bold text-[#F0EEE6] transition-colors hover:bg-[#2a2a28] disabled:opacity-50 sm:self-start"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Search className="size-4" />
          )}
          {isLoading ? "Searching..." : "Find Leads"}
        </button>
      </form>
    </div>
  );
}
