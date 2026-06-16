"use client";

import { useWedding } from "@/lib/store";
import { GlobalSearch } from "./GlobalSearch";
import { Notifications } from "./Notifications";
import { ProfileMenu } from "./ProfileMenu";
import { LotusMark } from "@/components/ui/Logo";
import { MapPin, CalendarRange } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function WeddingHeader() {
  const wedding = useWedding();
  const dateRange =
    wedding.startDate && wedding.endDate
      ? `${formatDate(wedding.startDate, "short").replace(/,.*/, "")}–${formatDate(wedding.endDate, "long")}`
      : wedding.startDate
      ? formatDate(wedding.startDate, "long")
      : "Dates to be set";

  return (
    <header className="sticky top-0 z-30 border-b border-gold-100 bg-ivory-100/85 backdrop-blur-md">
      <div className="flex items-center gap-3 px-4 py-3 md:px-6">
        <div data-tour="wedding-header" className="flex min-w-0 items-center gap-3">
          <div className="hidden h-11 w-11 shrink-0 place-items-center rounded-xl bg-white shadow-soft sm:grid">
            <LotusMark className="h-7" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate font-serif text-xl font-semibold leading-tight text-ink">
              {wedding.weddingName || "Your Wedding"}
            </h2>
            <div className="flex items-center gap-3 text-xs text-ink-muted">
              {wedding.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {wedding.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <CalendarRange className="h-3 w-3" /> {dateRange}
              </span>
            </div>
          </div>
        </div>

        <div className="ml-auto hidden flex-1 justify-center px-4 md:flex">
          <GlobalSearch />
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Notifications />
          <ProfileMenu />
        </div>
      </div>
      <div className="px-4 pb-3 md:hidden">
        <GlobalSearch />
      </div>
    </header>
  );
}
