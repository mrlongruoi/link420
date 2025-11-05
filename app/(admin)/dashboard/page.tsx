import UsernameForm from "@/components/UsernameForm";
import CustomizationForm from "@/components/CustomizationForm";
import ManageLinks from "@/components/ManageLinks";
import { currentUser } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { fetchAnalytics } from "@/lib/analytics-server";
import { Protect } from "@clerk/nextjs";
import { Lock } from "lucide-react";
import DashboardMetrics from "@/components/DashboardMetrics";

const DashboardPage = async () => {
  const user = await currentUser();

  const preloadedLinks = await preloadQuery(api.lib.links.getLinksByUserId, { userId: user!.id });

  const analytics = await fetchAnalytics(user!.id);

  return (
    <div>
      {/* analytics metrics - premium */}
      <Protect
        feature="analytics"
        fallback={
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8 mb-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-2xl p-8 shadow-xl shadow-gray-200/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gray-400 rounded-xl">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Tổng quan về phân tích
                    </h2>
                    <p className="text-gray-600">
                      🔒 Nâng cấp lên Pro/Ultra để mở khóa phân tích
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <div className="bg-gray-100 rounded-lg p-4 text-center w-full">
                    <p className="text-gray-500">
                      Nhận thông tin chi tiết về hiệu suất liên kết của bạn với các gói Pro và Ultra
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      >
        <DashboardMetrics analytics={analytics} />
      </Protect>

      {/* customize link420 link url form */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl shadow-gray-200/50">
            <UsernameForm />
          </div>
        </div>
      </div>

      {/* page customization section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <CustomizationForm />
        </div>
      </div>

      {/* manage links section */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-16">

            {/* left side - title and description */}
            <div className="lg:w-2/5 lg:sticky lg:top-8">
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    Quản lý liên kết của bạn
                  </h1>
                  <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-4"></div>
                </div>

                <p className="text-lg text-gray-600 leading-relaxed">
                  Sắp xếp và tùy chỉnh trang liên kết trong tiểu sử của bạn. Kéo và thả để sắp xếp lại, chỉnh sửa chi tiết hoặc xóa các liên kết không còn cần thiết.
                </p>

                <div className="space-y-4 pt-4">
                  {/* bullet 1 */}
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Kéo và thả để sắp xếp lại</span>
                  </div>

                  {/* bullet 2 */}
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">Cập nhật theo thời gian thực</span>
                  </div>

                  {/* bullet 3 */}
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">
                      Phân tích theo dõi lượt nhấp
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* right side - link management */}
            <div className="lg:w-3/5">
              <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl shadow-gray-200/50">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Liên kết của bạn
                  </h2>
                  <p className="text-gray-500">
                    Kéo để sắp xếp lại, nhấp để sửa hoặc xóa các liên kết không mong muốn.
                  </p>
                </div>

                <ManageLinks preloadedLinks={preloadedLinks} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
