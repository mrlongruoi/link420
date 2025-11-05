import CreateLinkForm from "@/components/CreateLinkForm";
import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs/server"
import { fetchQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

async function NewLinkPage() {
    const { has, userId } = await auth();

    const hasTenLinkCapacity = has({ feature: "pro_capacity" });

    const hasUnlimitedLinks = has({ feature: "ultra_capacity" });

    const linkCount = await fetchQuery(
        api.lib.links.getLinkCountByUserId, {
        userId: userId || "",
    }
    );

    // free =3, pro = 10, ultra = infinity
    const access = {
        canCreate: hasUnlimitedLinks
            ? true
            : hasTenLinkCapacity
                ? linkCount < 10
                : linkCount < 3,
        limit: hasUnlimitedLinks ? "unlimited" : hasTenLinkCapacity ? 10 : 3,
        currentCount: linkCount,
    }

    if (!access.canCreate) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl shadow-gray-200/50">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Đã đạt đến giới hạn liên kết
                        </h2>

                        <p className="text-gray-600 mb-4">
                            Bạn đã đạt đến số lượng liên kết tối đa (
                            {access.currentCount}/{access.limit}
                            ).
                            {!hasUnlimitedLinks && " Nâng cấp gói của bạn để thêm nhiều liên kết hơn."}
                        </p>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 text-purple-600/75 hover:text-purple-900 transition-colors font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Quay lại liên kết của tôi
                            </Link>
                            {!hasUnlimitedLinks && (
                                <Link
                                    href="/dashboard/billing"
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Nâng cấp kế hoạch
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    return (
        <>
            <div className="mb-6">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-purple-600/75 hover:text-purple-900 transition-colors font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại liên kết của tôi
                </Link>
            </div>

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-16">

                        {/* left side - title and description */}
                        <div className="lg:w-2/5 lg:sticky lg:top-8">
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                        Tạo liên kết mới
                                    </h1>
                                    <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-4"></div>
                                </div>

                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Thêm một liên kết mới vào trang liên kết trong tiểu sử của bạn. Các liên kết của bạn sẽ xuất hiện theo thứ tự bạn tạo (bạn có thể sắp xếp lại chúng sau), giúp người dùng dễ dàng tìm thấy những gì quan trọng nhất.
                                </p>


                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-gray-600">
                                            Dễ dàng kéo và thả lại
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        <span className="text-gray-600">
                                            Xác thực URL tự động
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-gray-600">
                                            Phân tích theo dõi nhấp
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* right side - form */}
                        <div className="lg:w-3/5">
                            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl shadow-gray-200/50">
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                        Chi tiết liên kết
                                    </h2>
                                    <p className="text-gray-500">
                                        Điền thông tin bên dưới để tạo liên kết của bạn.
                                    </p>
                                </div>

                                <CreateLinkForm/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewLinkPage
