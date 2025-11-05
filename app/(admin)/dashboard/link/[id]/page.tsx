import LinkAnalytics from "@/components/LinkAnalytics";
import { fetchLinkAnalytics } from "@/lib/link-analytics-server";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

interface LinkAnalyticsPageProps {
    params: Promise<{
        id: string;
    }>;
}

/**
 * Renders the analytics page for a link by resolving route params, ensuring an authenticated user, fetching analytics for the link, and falling back to an empty analytics state when no data exists.
 *
 * @param params - A promise that resolves to an object containing the route `id` string for the link.
 * @returns A React element rendering the LinkAnalytics component with either fetched analytics or a structured empty analytics object when data is unavailable.
 */
async function LinkAnalyticsPage({ params }: Readonly<LinkAnalyticsPageProps>) {
    const { id } = await params;

    const user = await currentUser();

    if (!user) {
        notFound();
    }

    const analytics = await fetchLinkAnalytics(user.id, id);

    // If no analytics data found, show the component with empty state
    // The LinkAnalytics component handles the "no data" case gracefully
    if (!analytics) {
        // Return empty analytics object so component can show "no data" state
        const emptyAnalytics = {
            linkId: id,
            linkTitle: "Liên kết này không thể phân tích",
            linkUrl: "Vui lòng đợi phân tích được tạo hoặc kiểm tra lại sau",
            totalClicks: 0,
            uniqueUsers: 0,
            countriesReached: 0,
            dailyData: [],
            countryData: [],
        };

        return <LinkAnalytics analytics={emptyAnalytics} />;
    }

    return (
        <LinkAnalytics analytics={analytics} />
    );
}

export default LinkAnalyticsPage;