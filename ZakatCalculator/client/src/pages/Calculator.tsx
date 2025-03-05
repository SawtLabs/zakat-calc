import IslamicPattern from "@/components/IslamicPattern";
import ZakatForm from "@/components/ZakatForm";

export default function Calculator() {
  return (
    <div className="space-y-6 py-6">
      <IslamicPattern />
      
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Zakat Calculator</h1>
        <p className="mt-2 text-gray-600">
          Enter your assets and liabilities to calculate your Zakat
        </p>
      </div>

      <ZakatForm />
    </div>
  );
}
