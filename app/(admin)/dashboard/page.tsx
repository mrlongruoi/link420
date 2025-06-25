import { currentUser } from "@clerk/nextjs/server";
import UsernameForm from "@/components/UsernameForm";

const DashboardPage = async () => {

  //chua dong toi cu de vay
  const user = await currentUser();
  return (
    <div>
      {/* analytics metrics - premium */}

      {/* customize link420 link url form */}
      {/* Customize Linktree link URL form */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl shadow-gray-200/50">
            <UsernameForm />
          </div>
        </div>
      </div>
      {/* page customization section */}

      {/* manage links section */}
    </div>
  );
};

export default DashboardPage;
