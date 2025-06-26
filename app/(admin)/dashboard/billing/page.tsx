import { PricingTable } from "@clerk/nextjs"

const BillingPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-10 text-center md:text-left">
        Quản lý thanh toán của bạn
      </h1>
      <PricingTable/>
    </div>
  )
}

export default BillingPage
