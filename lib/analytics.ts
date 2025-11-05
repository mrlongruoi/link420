// Remove the import since we'll define our own client-side interface
// import {TrackingEvent} from "@/app/api/track-click/route";

import { ClientTrackingData } from "@/lib/types";

/**
 * Build a tracking payload from the provided client data, send it to the tracking API, and return the payload.
 *
 * @param event - Client-provided tracking data (profileUsername, linkId, linkTitle, linkUrl, optional userAgent and referrer)
 * @returns The tracking payload that was sent, containing `profileUsername`, `linkId`, `linkTitle`, `linkUrl`, `userAgent`, and `referrer`, or `undefined` if an error occurred
 */
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