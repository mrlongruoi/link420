export interface AnalyticsData {
  totalClicks: number;
  uniqueVisitors: number;
  countriesReached: number;
  totalLinksClicked: number;
  topLinkTitle: string | null;
  topReferrer: string | null;
  firstClick: string | null;
  lastClick: string | null;
}

/**
 * Fetches aggregated analytics for a user over a recent time window.
 *
 * @param userId - Profile user identifier to query
 * @param daysBack - Number of days to include in the aggregation window (defaults to 30)
 * @returns An AnalyticsData object containing:
 *  - totalClicks: total number of clicks
 *  - uniqueVisitors: number of unique visitors
 *  - countriesReached: number of distinct countries reached
 *  - totalLinksClicked: total number of distinct links clicked
 *  - topLinkTitle: title of the top link or `null` if unavailable
 *  - topReferrer: top referrer domain or `null` if unavailable
 *  - firstClick: timestamp of the first recorded click or `null`
 *  - lastClick: timestamp of the last recorded click or `null`
 */
export async function fetchAnalytics(
  userId: string,
  daysBack: number = 30,
): Promise<AnalyticsData> {
  // Check if Tinybird is configured
  if (!process.env.TINYBIRD_SIGNING_KEY || !process.env.TINYBIRD_HOST) {
    // Return empty data when Tinybird is not configured
    return {
      totalClicks: 0,
      uniqueVisitors: 0,
      countriesReached: 0,
      totalLinksClicked: 0,
      topLinkTitle: null,
      topReferrer: null,
      firstClick: null,
      lastClick: null,
    };
  }

  try {
    // Use original profile_summary endpoint to keep topK functionality
    const tinybirdResponse = await fetch(
      `${process.env.TINYBIRD_HOST}/v0/pipes/profile_summary.json?profileUserId=${userId}&days_back=${daysBack}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TINYBIRD_SIGNING_KEY}`,
        },
        next: { revalidate: 0 }, // Cache for 0 seconds
      },
    );

    if (!tinybirdResponse.ok) {
      console.error("Yêu cầu Tinybird không thành công:", await tinybirdResponse.text());
      throw new Error("Không thể lấy phân tích");
    }

    const data = await tinybirdResponse.json();

    // Handle empty response
    if (!data.data || data.data.length === 0) {
      return {
        totalClicks: 0,
        uniqueVisitors: 0,
        countriesReached: 0,
        totalLinksClicked: 0,
        topLinkTitle: null,
        topReferrer: null,
        firstClick: null,
        lastClick: null,
      };
    }

    const analytics = data.data[0];

    return {
      totalClicks: analytics.total_clicks || 0,
      uniqueVisitors: analytics.unique_users || 0,
      countriesReached: analytics.countries_reached || 0,
      totalLinksClicked: analytics.total_links_clicked || 0,
      topLinkTitle: analytics.top_link_title?.[0] || null,
      topReferrer: analytics.top_referrer?.[0] || null,
      firstClick: analytics.first_click || null,
      lastClick: analytics.last_click || null,
    };
  } catch (tinybirdError) {
    console.error("Yêu cầu Tinybird không thành công:", tinybirdError);
    // Return empty data if Tinybird fails
    return {
      totalClicks: 0,
      uniqueVisitors: 0,
      countriesReached: 0,
      totalLinksClicked: 0,
      topLinkTitle: null,
      topReferrer: null,
      firstClick: null,
      lastClick: null,
    };
  }
}