import { NextRequest, NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";
import { api } from "@/convex/_generated/api";
import { ClientTrackingData, ServerTrackingEvent } from "@/lib/types";
import { getClient } from "@/convex/client";

export async function POST(request: NextRequest) {
  try {
    const data: ClientTrackingData = await request.json();

    const geo = geolocation(request);

    const convex = getClient();

    // get user id from username
    const userId = await convex.query(api.lib.usernames.getUserIdBySlug, {
      slug: data.profileUsername,
    });

    if (!userId) {
      return NextResponse.json(
        { error: "Không tìm thấy hồ sơ" },
        { status: 404 },
      );
    }

    // Add server-side data
    const trackingEvent: ServerTrackingEvent = {
      ...data, // client data

      // server data
      timestamp: new Date().toISOString(),
      profileUserId: userId,
      location: {
        ...geo,
      },
      userAgent:
        data.userAgent || request.headers.get("user-agent") || "unknown",
    };

    // Send to Tinybird Events API
    console.log("Gửi sự kiện theo dõi:", trackingEvent);

    if (process.env.TINYBIRD_SIGNING_KEY && process.env.TINYBIRD_HOST) {
      try {
        // Send location as nested object to match schema json paths
        const eventForTinybird = {
          timestamp: trackingEvent.timestamp,
          profileUsername: trackingEvent.profileUsername,
          profileUserId: trackingEvent.profileUserId,
          linkId: trackingEvent.linkId,
          linkTitle: trackingEvent.linkTitle,
          linkUrl: trackingEvent.linkUrl,
          userAgent: trackingEvent.userAgent,
          referrer: trackingEvent.referrer,
          location: {
            country: trackingEvent.location.country || "",
            region: trackingEvent.location.region || "",
            city: trackingEvent.location.city || "",
            latitude: trackingEvent.location.latitude || "",
            longitude: trackingEvent.location.longitude || "",
          },
        };

        console.log(
          "Gửi sự kiện tới Tinybird:",
          JSON.stringify(eventForTinybird, null, 2),
        );

        const tinybirdResponse = await fetch(
          `${process.env.TINYBIRD_HOST}/v0/events?name=link_clicks`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.TINYBIRD_SIGNING_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(eventForTinybird),
          },
        );

        if (!tinybirdResponse.ok) {
          const errorText = await tinybirdResponse.text();

          console.error("Không gửi được tới Tinybird:", errorText);
          // Don't fail the request if Tinybird is down - just log the error
        } else {
          const responseBody = await tinybirdResponse.json();

          console.log("Gửi thành công tới Tinybird:", responseBody);

          if (responseBody.quarantined_rows > 0) {
            console.warn("Một số hàng đã bị cách ly:", responseBody);
          }
        }
      } catch (tinybirdError) {
        console.error("Yêu cầu Tinybird không thành công:", tinybirdError);
        // Don't fail the request if Tinybird is down
      }
    } else {
      console.log("Tinybird chưa được định cấu hình - chỉ ghi sự kiện");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lỗi theo dõi lượt nhấp:", error);

    return NextResponse.json(
      { error: "Không thể theo dõi lượt nhấp" },
      { status: 500 },
    );
  }
}
