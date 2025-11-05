// Remove the import since we'll define our own client-side interface
// import {TrackingEvent} from "@/app/api/track-click/route";

import { ClientTrackingData } from "@/lib/types";

export async function trackLinkClick(event: ClientTrackingData) {
  try {
    const trackingData = {
      profileUsername: event.profileUsername,
      linkId: event.linkId,
      linkTitle: event.linkTitle,
      linkUrl: event.linkUrl,
      userAgent: event.userAgent || navigator.userAgent,
      referrer: event.referrer || document.referrer || "direct",
    };

    console.log("Đã theo dõi lượt nhấp vào liên kết:", trackingData);

    // Send to your API endpoint which forwards to Tinybird
    await fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trackingData),
    });

    return trackingData;
  } catch (error) {
    console.error("Không thể theo dõi lượt nhấp vào liên kết:", error);
  }
}
