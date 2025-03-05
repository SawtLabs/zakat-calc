import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertCalculationSchema, type InsertCalculation } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { calculateZakat, formatCurrency, THRESHOLDS, RATES, isAboveThreshold } from "@/lib/zakat";

export default function ZakatForm() {
  const { toast } = useToast();
  const [assets, setAssets] = useState([{ name: "", value: 0 }]);
  const [calculationResult, setCalculationResult] = useState<ReturnType<typeof calculateZakat> | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: InsertCalculation) => {
      const res = await apiRequest("POST", "/api/calculations", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Calculation Saved",
        description: `Your Zakat calculation has been saved successfully.`,
      });
    },
  });

  const addAsset = () => {
    setAssets([...assets, { name: "", value: 0 }]);
  };

  const removeAsset = (index: number) => {
    setAssets(assets.filter((_, i) => i !== index));
  };

  const getThresholdForAsset = (assetName: string) => {
    const lowerName = assetName.toLowerCase();
    if (lowerName.includes('gold')) {
      return THRESHOLDS.GOLD.value * RATES.GOLD_PER_GRAM;
    }
    if (lowerName.includes('silver')) {
      return THRESHOLDS.SILVER.value * RATES.SILVER_PER_GRAM;
    }
    // For cash and other assets, use gold threshold
    return THRESHOLDS.GOLD.value * RATES.GOLD_PER_GRAM;
  };

  const handleCalculate = () => {
    const result = calculateZakat(assets);
    setCalculationResult(result);
  };

  const handleSubmit = () => {
    if (calculationResult) {
      mutation.mutate({
        assets: assets.filter(asset => asset.name && asset.value > 0),
        currency: "INR",
        nisabValue: calculationResult.zakatableAmount
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Asset Input Fields */}
          <div className="grid grid-cols-12 gap-4 mb-4 font-bold border-b pb-2">
            <div className="col-span-5">Asset Name</div>
            <div className="col-span-5">Value (INR)</div>
            <div className="col-span-2">Action</div>
          </div>

          {assets.map((asset, index) => (
            <div key={index} className="grid grid-cols-12 gap-4">
              <div className="col-span-5">
                <Input
                  placeholder="e.g., Gold, Silver, Cash"
                  value={asset.name}
                  onChange={(e) => {
                    const newAssets = [...assets];
                    newAssets[index].name = e.target.value;
                    setAssets(newAssets);
                  }}
                />
              </div>
              <div className="col-span-5">
                <Input
                  type="number"
                  placeholder="0"
                  value={asset.value}
                  onChange={(e) => {
                    const newAssets = [...assets];
                    newAssets[index].value = parseFloat(e.target.value) || 0;
                    setAssets(newAssets);
                  }}
                />
              </div>
              <div className="col-span-2">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeAsset(index)}
                  disabled={assets.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={addAsset}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>

          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={handleCalculate}
          >
            Calculate Zakat
          </Button>

          {/* Calculation Results with Detailed Explanation */}
          {calculationResult && (
            <div className="mt-6 space-y-4">
              {/* Detailed Breakdown */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="font-bold text-lg">Calculation Breakdown:</h3>
                {assets.map((asset, index) => {
                  if (!asset.name || asset.value <= 0) return null;
                  const threshold = getThresholdForAsset(asset.name);
                  const isEligible = isAboveThreshold(asset);
                  const eligibleAmount = isEligible ? asset.value - threshold : 0;

                  return (
                    <div key={index} className="border-b pb-2">
                      <p className="font-semibold">{asset.name}:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        <li>Total Value: {formatCurrency(asset.value)}</li>
                        <li>Applicable Threshold: {formatCurrency(threshold)}</li>
                        <li>Amount Exceeding Threshold: {formatCurrency(eligibleAmount)}</li>
                        <li className="text-green-600">
                          Zakat Payable on this Asset: {formatCurrency(eligibleAmount * 0.025)}
                        </li>
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Total Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg">
                  <span>Total Zakatable Amount:</span>
                  <span className="font-bold">
                    {formatCurrency(calculationResult.zakatableAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-lg text-green-600">
                  <span>Total Zakat Due (2.5%):</span>
                  <span className="font-bold">
                    {formatCurrency(calculationResult.zakatAmount)}
                  </span>
                </div>
              </div>

              {/* Relevant Hadiths */}
              {calculationResult.hadiths.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg mt-4">
                  <p className="font-semibold mb-2">Relevant Hadiths:</p>
                  {calculationResult.hadiths.map((hadith, index) => (
                    <p key={index} className="text-sm italic text-gray-700">
                      {hadith}
                    </p>
                  ))}
                </div>
              )}

              <Button 
                className="w-full bg-green-600 hover:bg-green-700 mt-4"
                onClick={handleSubmit}
                disabled={mutation.isPending}
              >
                Save Calculation
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}