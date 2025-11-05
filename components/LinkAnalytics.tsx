import { LinkAnalyticsData } from "@/lib/link-analytics-server";
import { Protect } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import {
    Users,
    MousePointer,
    Globe,
    TrendingUp,
    ExternalLink,
    MapPin,
    ArrowLeft,
    BarChart3,
    Lock,
} from "lucide-react";
import Link from "next/link";

interface LinkAnalyticsProps {
    analytics: LinkAnalyticsData;
}

async function LinkAnalytics({ analytics }: Readonly<LinkAnalyticsProps>) {
    const { has } = await auth();

    const hasAnalyticsAccess = has({ feature: "analytics" });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            month: "short",
            day: "numeric",
        });
    };

    const formatUrl = (url: string) => {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.replace("www.", "");
        } catch {
            return url;
        }
    };

    if (!hasAnalyticsAccess) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8 mb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-2xl p-8 shadow-xl shadow-gray-200/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gray-400 rounded-xl">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Phân tích liên kết
                                </h2>
                                <p className="text-gray-600">
                                    🔒 Nâng cấp để mở khóa những hiểu biết sâu sắc
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 space-y-6">
                            <div className="flex items-center gap-4 text-gray-600">
                                <MousePointer className="w-5 h-5" />
                                <span>Theo dõi tổng số lần nhấp và mức độ tương tác</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600">
                                <Users className="w-5 h-5" />
                                <span>Giám sát số lượng khách truy cập</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600">
                                <Globe className="w-5 h-5" />
                                <span>Xem phân bố địa lý</span>
                            </div>
                        </div>
                        <div className="mt-8 bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-gray-500">
                                Nhận thông tin chi tiết về hiệu suất liên kết của bạn với Pro của chúng tôi
                                và kế hoạch Ultra
                            </p>
                            <Link
                                href="/dashboard/billing"
                                className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Nâng cấp ngay
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header with back button */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8 mb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl shadow-gray-200/50">
                        <div className="flex items-center gap-4 mb-6">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="font-medium">Quay lại Trang tổng quan</span>
                            </Link>
                        </div>

                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {analytics.linkTitle}
                            </h1>
                            <Link
                                href={analytics.linkUrl}
                                className="flex items-center gap-2 text-gray-600"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span className="text-sm">{formatUrl(analytics.linkUrl)}</span>
                            </Link>
                        </div>

                        {/* Summary Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Total Clicks */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-blue-500 rounded-xl">
                                        <MousePointer className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-blue-600">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-blue-600 mb-1">
                                        Tổng số lượt nhấp
                                    </p>
                                    <p className="text-3xl font-bold text-blue-900">
                                        {analytics.totalClicks.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Unique Users */}
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-purple-500 rounded-xl">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-purple-600">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-purple-600 mb-1">
                                        Người dùng truy cập
                                    </p>
                                    <p className="text-3xl font-bold text-purple-900">
                                        {analytics.uniqueUsers.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Countries Reached */}
                            <Protect
                                plan="ultra"
                                fallback={
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 opacity-75">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-green-500/50 rounded-xl">
                                                <Globe className="w-6 h-6 text-white/75" />
                                            </div>
                                            <div className="text-green-600/75">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-green-600/75 mb-1">
                                                Vị trí
                                            </p>
                                            <p className="text-3xl font-bold text-green-900/75">
                                                Nâng cấp lên Ultra
                                            </p>
                                        </div>
                                    </div>
                                }
                            >
                                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-green-500 rounded-xl">
                                            <Globe className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-green-600">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-green-600 mb-1">
                                            Vị trí
                                        </p>
                                        <p className="text-3xl font-bold text-green-900">
                                            {analytics.countriesReached.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </Protect>
                        </div>
                    </div>
                </div>
            </div>

            {/* daily performance chart */}
            {analytics.dailyData.length > 0 && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8 mb-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl shadow-gray-200/50">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-slate-500 rounded-xl">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Hiệu suất hàng ngày
                                    </h2>
                                    <p className="text-gray-600">Hoạt động 30 ngày qua</p>
                                </div>
                            </div>

                            {/* Simple bar chart representation */}
                            <div className="space-y-4">
                                {analytics.dailyData.slice(0, 10).map((day) => {
                                    const maxClicks = Math.max(
                                        ...analytics.dailyData.map((d) => d.clicks),
                                    );
                                    const width =
                                        maxClicks > 0 ? (day.clicks / maxClicks) * 100 : 0;

                                    return (
                                        <div key={day.date} className="flex items-center gap-4">
                                            <div className="w-16 text-sm text-gray-600 font-medium">
                                                {formatDate(day.date)}
                                            </div>
                                            <div className="flex-1 relative">
                                                <div className="bg-gray-200 rounded-full h-8 relative overflow-hidden">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${width}%` }}
                                                    >
                                                        <div className="absolute inset-0 flex items-center px-3">
                                                            <span className="text-sm font-medium text-white">
                                                                {day.clicks} lượt truy cập
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    <span>{day.uniqueUsers}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Globe className="w-4 h-4" />
                                                    <span>{day.countries}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {analytics.dailyData.length > 10 && (
                                <div className="mt-6 text-center">
                                    <p className="text-gray-500 text-sm">
                                        Hiển thị 10 ngày qua • {analytics.dailyData.length}ngày
                                        tổng cộng
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Country Analytics */}
            <Protect
                plan="ultra"
                fallback={
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8 mb-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-2xl p-8 shadow-xl shadow-gray-200/50">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-gray-400 rounded-xl">
                                        <Globe className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Vị trí
                                        </h2>
                                        <p className="text-gray-600">
                                            🔒 Nâng cấp lên Ultra để mở khóa phân tích quốc gia
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center">
                                    <div className="bg-gray-100 rounded-lg p-4 text-center w-full">
                                        <p className="text-gray-500">
                                            Tính năng này chỉ có trên gói Ultra
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            >
                {analytics.countryData.length > 0 && (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8 mb-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl shadow-gray-200/50">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-green-500 rounded-xl">
                                        <Globe className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Vị trí
                                        </h2>
                                        <p className="text-gray-600">
                                            Phân phối nhấp chuột theo vị trí
                                        </p>
                                    </div>
                                </div>

                                {/* Country list */}
                                <div className="space-y-3">
                                    {analytics.countryData.map((country) => {
                                        // Use the percentage from Tinybird directly for bar width
                                        const width = country.percentage || 0;

                                        return (
                                            <div
                                                key={country.country}
                                                className="flex items-center gap-4"
                                            >
                                                <div className="w-32 text-sm text-gray-900 font-medium truncate">
                                                    {country.country}
                                                </div>
                                                <div className="flex-1 relative">
                                                    <div className="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                                                        <div
                                                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full transition-all duration-500"
                                                            style={{ width: `${width}%` }}
                                                        >
                                                            <div className="absolute inset-0 flex items-center px-3">
                                                                <span className="text-xs font-medium text-white">
                                                                    {country.clicks} truy cập
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-16 text-right">
                                                    <span className="text-sm font-medium text-gray-600">
                                                        {country.percentage.toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {analytics.countryData.length >= 20 && (
                                    <div className="mt-6 text-center">
                                        <p className="text-gray-500 text-sm">
                                            Hiển thị 20 vị trí hàng đầu
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Protect>

            {/* No data state */}
            {analytics.dailyData.length === 0 && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl shadow-gray-200/50 text-center">
                            <div className="text-gray-400 mb-4">
                                <BarChart3 className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Chưa có dữ liệu phân tích
                            </h3>
                            <p className="text-gray-600">
                                Dữ liệu phân tích sẽ xuất hiện ở đây khi liên kết này bắt đầu nhận
                                lượt truy cập.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LinkAnalytics;