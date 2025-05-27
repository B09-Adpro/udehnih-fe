import { formatPriceIDR } from "../../CourseDetailModule/utils"
import { CheckoutSummaryProps } from "../interface"

export function CheckoutSummary({ title, instructor, price, category }: CheckoutSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
      <h2 className="text-lg font-semibold mb-4">Ringkasan Kursus</h2>
      
      <div className="mb-4 pb-4 border-b">
        <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
        <div className="text-sm text-gray-600 mb-2">Oleh: {instructor}</div>
        <div className="inline-block bg-gray-100 text-xs px-2 py-1 rounded text-gray-700">{category}</div>
      </div>
      
      <div className="space-y-2 mb-4 pb-4 border-b">
        <div className="flex justify-between">
          <span className="text-gray-600">Harga Kursus</span>
          <span className="font-medium">{formatPriceIDR(price)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Pajak</span>
          <span className="font-medium">Termasuk</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center font-semibold text-lg">
        <span>Total</span>
        <span className="text-primary">{formatPriceIDR(price)}</span>
      </div>
      
      <div className="mt-4 pt-4 border-t text-xs text-gray-500">
        <p>
          Dengan melakukan pendaftaran, Anda menyetujui Syarat & Ketentuan serta Kebijakan Privasi Udehnih.
        </p>
      </div>
    </div>
  )
}