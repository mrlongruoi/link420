import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BarChart,
  CheckCircle,
  Palette,
  Shield,
  Smartphone,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const features = [
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Hoàn toàn tùy chỉnh",
    description:
      "Làm cho trang liên kết của bạn trở nên độc đáo với các chủ đề, màu sắc và bố cục tùy chỉnh phù hợp với thương hiệu của bạn.",
  },
  {
    icon: <BarChart className="w-8 h-8" />,
    title: "Phân tích nâng cao",
    description:
      "Phân tích và theo dõi, đối tượng của bạn và tối ưu hóa nội dung với những hiểu biết và báo cáo đầy đủ chi tiết.",
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Thiết bị thông minh được tối ưu hóa",
    description:
      "Trang liên kết của bạn trông hoàn hảo trên mọi thiết bị, từ máy tính để bàn đến điện thoại thông minh.",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Tốc độ truy cập & hiệu suất",
    description:
      "Được tối ưu hóa cho tốc độ với thời gian thực và trải nghiệm người dùng liền mạch.",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Bảo mật & Đáng tin cậy",
    description:
      "Bảo mật cấp doanh nghiệp với cam kết thời gian hoạt động 99,9% để giữ cho các liên kết của bạn luôn có sẵn.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Hợp tác nhóm & quản lý",
    description:
      "Làm việc cùng nhau với nhóm của bạn để quản lý và tối ưu hóa các trang liên kết một cách đơn giản và hiệu quả nhất.",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Content Creator",
    content:
      "Linkify transformed how I share my content. The analytics help me understand what my audience loves most!",
    rating: 5,
  },
  {
    name: "Mike Chen",
    role: "Small Business Owner",
    content:
      "Perfect for my business. Clean, professional, and my customers can easily find all my important links.",
    rating: 5,
  },
  {
    name: "Emma Davis",
    role: "Artist",
    content:
      "The customization options are amazing. My link page perfectly matches my artistic brand and style.",
    rating: 5,
  },
  {
    name: "Sarah Johnson",
    role: "Content Creator",
    content:
      "Linkify transformed how I share my content. The analytics help me understand what my audience loves most!",
    rating: 5,
  },
  {
    name: "Mike Chen",
    role: "Small Business Owner",
    content:
      "Perfect for my business. Clean, professional, and my customers can easily find all my important links.",
    rating: 5,
  },
  {
    name: "Emma Davis",
    role: "Artist",
    content:
      "The customization options are amazing. My link page perfectly matches my artistic brand and style.",
    rating: 5,
  },
];

export default async function Home() {

  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* header section */}
      <Header isFixed={true} />
      {/* hero section */}
      <section className="px-4 lg:px-8 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Một liên kết,
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Giải pháp toàn diện
              </span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto" />
            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Tạo một trang liên kết sinh học đẹp mắt và có thể tùy chỉnh, hiển
              thị tất cả các liên kết quan trọng của bạn. Hoàn hảo cho người
              sáng tạo nội dung, doanh nghiệp và bất cứ ai muốn chia sẻ nhiều
              liên kết dễ dàng
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-pink-700 text-lg px-8 py-6 h-auto"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  Xây dựng miễn phí
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white text-lg px-8 py-6 h-auto"
              >
                <Link href="#features">Xem cách hoạt động</Link>
              </Button>
            </div>

            <div className="pt-12">
              <p className="text-sm text-gray-500 mb-4">
                Được tin tưởng bởi hơn 10.000 nhà sáng tạo trên toàn thế giới
              </p>
              <div className="flex justify-center items-center gap-8 opacity-60">
                <div className="text-2xl font-bold text-gray-400">
                  Nhà sáng tạo
                </div>
                <div className="text-2xl font-bold text-gray-400">
                  Doanh nghiệp
                </div>
                <div className="text-2xl font-bold text-gray-400">
                  Người nổi tiếng
                </div>
                <div className="text-2xl font-bold text-gray-400">Nghệ sĩ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* features section */}
      <section id="features" className="px-4 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Mọi thứ bạn cần
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Các tính năng mạnh mẽ được thiết kế để giúp bạn chia sẻ nội dung
              của mình và phát triển khán giả, khách hàng và người dùng của bạn
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-purple-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* socical section */}
      <section className="px-4 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Được yêu thích bởi các nhà sáng tạo nội dung
            </h2>
            <p className="text-xl text-gray-600">
              Xem những gì người dùng của chúng tôi đang nói về Link420
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl shadow-gray-200/50"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="px-4 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 lg:p-16 text-center text-white shadow-2xl">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Sẵn sàng để bắt đầu?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Tham gia cùng hàng ngàn nhà sáng tạo tin tưởng Link420 để giới
              thiệu nội dung của họ. Tạo trang liên kết đẹp mắt của bạn chỉ
              trong vài phút và bắt đầu chia sẻ ngay hôm nay!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 h-auto font-semibold"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  Tạo Link420 của bạn
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Bắt đầu miễn phí
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Không yêu cầu thẻ tín dụng
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Thiết lập trong 15 giây
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* footer section */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-white/20 px-4 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="text-2xl font-bold text-gray-900">Link420</div>
              <p className="text-gray-600">
                Cách dễ nhất để chia sẻ tất cả các liên kết quan trọng của bạn
                trong một trang đẹp.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <div className="space-y-2 text-gray-600">
                <div>Features</div>
                <div>Pricing</div>
                <div>Analytics</div>
                <div>Integrations</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <div className="space-y-2 text-gray-600">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
                <div>Contact</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <div className="space-y-2 text-gray-600">
                <div>Help Center</div>
                <div>Documentation</div>
                <div>Community</div>
                <div>Status</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; 2025 Mr Longruoi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
