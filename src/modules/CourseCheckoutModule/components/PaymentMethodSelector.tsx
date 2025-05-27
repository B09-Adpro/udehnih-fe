import { CreditCard, Building } from "lucide-react"
import { PaymentMethod } from ".."

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onChange: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({ selectedMethod, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <div 
        className={`border rounded-lg p-4 cursor-pointer transition-all ${
          selectedMethod === "Credit Card"
            ? "border-primary bg-primary/5"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => onChange("Credit Card")}
      >
        <div className="flex items-center">
          <div className={`w-5 h-5 rounded-full border ${
            selectedMethod === "Credit Card"
              ? "border-primary"
              : "border-gray-400"
          } flex items-center justify-center mr-3`}>
            {selectedMethod === "Credit Card" && (
              <div className="w-3 h-3 rounded-full bg-primary"></div>
            )}
          </div>
          
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 text-gray-500 mr-2" />
            <span className="font-medium">Credit Card</span>
          </div>
        </div>
        
        {selectedMethod === "Credit Card" && (
          <div className="mt-4 pl-8">
            <p className="text-sm text-gray-600 mb-3">
              Pembayaran aman dengan kartu kredit Anda
            </p>
            <div className="flex space-x-2">
              <div className="bg-gray-100 px-3 py-1 text-sm rounded text-gray-700">Visa</div>
              <div className="bg-gray-100 px-3 py-1 text-sm rounded text-gray-700">Mastercard</div>
              <div className="bg-gray-100 px-3 py-1 text-sm rounded text-gray-700">JCB</div>
            </div>
          </div>
        )}
      </div>
      
      <div 
        className={`border rounded-lg p-4 cursor-pointer transition-all ${
          selectedMethod === "Bank Transfer"
            ? "border-primary bg-primary/5"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => onChange("Bank Transfer")}
      >
        <div className="flex items-center">
          <div className={`w-5 h-5 rounded-full border ${
            selectedMethod === "Bank Transfer"
              ? "border-primary"
              : "border-gray-400"
          } flex items-center justify-center mr-3`}>
            {selectedMethod === "Bank Transfer" && (
              <div className="w-3 h-3 rounded-full bg-primary"></div>
            )}
          </div>
          
          <div className="flex items-center">
            <Building className="h-6 w-6 text-gray-500 mr-2" />
            <span className="font-medium">Bank Transfer</span>
          </div>
        </div>
        
        {selectedMethod === "Bank Transfer" && (
          <div className="mt-4 pl-8">
            <p className="text-sm text-gray-600 mb-3">
              Transfer ke rekening bank yang tertera setelah konfirmasi pendaftaran
            </p>
            <div className="flex space-x-2">
              <div className="bg-gray-100 px-3 py-1 text-sm rounded text-gray-700">BCA</div>
              <div className="bg-gray-100 px-3 py-1 text-sm rounded text-gray-700">Mandiri</div>
              <div className="bg-gray-100 px-3 py-1 text-sm rounded text-gray-700">BNI</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}