import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AlertTriangle, CheckCircle2, DollarSign, Save } from "lucide-react";

interface PricingSettings {
  monitoring_price: number;
  filing_base_price: number;
  tier1_min: number;
  tier1_max: number;
  tier1_discount: number; // Volume discount percentage for Tier 1
  tier2_min: number;
  tier2_max: number;
  tier2_discount: number; // Volume discount percentage for Tier 2
  tier3_min: number;
  tier3_max: number;
  tier3_discount: number; // Volume discount percentage for Tier 3
  tier4_min: number;
  tier4_discount: number;
}

export default function AdminPricingSettings() {
  const [settings, setSettings] = useState<PricingSettings>({
    monitoring_price: 249,
    filing_base_price: 398,
    tier1_min: 1,
    tier1_max: 25,
    tier1_discount: 0, // 0% discount for 1-25 filings → $398.00
    tier2_min: 26,
    tier2_max: 75,
    tier2_discount: 5, // 5% discount for 26-75 filings → $378.10
    tier3_min: 76,
    tier3_max: 150,
    tier3_discount: 10, // 10% discount for 76-150 filings → $358.20
    tier4_min: 151,
    tier4_discount: 0, // Custom pricing
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In production, this would save to database
    console.log("Saving pricing settings:", settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateSetting = (key: keyof PricingSettings, value: number) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-2 border-[#00274E] bg-white">
        <CardContent className="py-6">
          <div>
            <h2 className="text-3xl text-[#00274E] mb-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              Pricing Management
            </h2>
            <p className="text-base text-gray-600">
              Configure volume-based pricing tiers and discounts. Changes will immediately affect new submissions.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Warning Notice */}
      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-base">
              <strong>Important:</strong> Pricing changes take effect immediately for all new submissions. Existing submissions will retain their original pricing.
            </p>
          </div>
        </div>
      </div>

      {/* Base Service Prices */}
      <Card className="border-2 border-[#00274E] bg-blue-50">
        <CardHeader className="bg-[#00274E] text-white border-b-4 border-yellow-400">
          <CardTitle className="text-2xl" style={{ fontFamily: 'Libre Baskerville, serif' }}>
            Base Service Prices
          </CardTitle>
          <CardDescription className="text-gray-200 mt-2">
            Core pricing for each service level (before volume discounts)
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monitoring Price */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
              <Label htmlFor="monitoring-price" className="text-lg mb-3 block font-semibold">
                💙 Compliance Monitoring
              </Label>
              <p className="text-sm text-gray-600 mb-4">
                Data storage & readiness service (flat rate, no volume discounts)
              </p>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500" />
                <Input
                  id="monitoring-price"
                  type="number"
                  step="0.01"
                  value={settings.monitoring_price}
                  onChange={(e) => updateSetting('monitoring_price', parseFloat(e.target.value))}
                  className="text-3xl pl-12 font-bold"
                  style={{ fontFamily: 'Libre Baskerville, serif' }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">per client entity</p>
            </div>

            {/* Filing Base Price */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
              <Label htmlFor="filing-base-price" className="text-lg mb-3 block font-semibold">
                ⭐ Bulk Filing (Base Price)
              </Label>
              <p className="text-sm text-gray-600 mb-4">
                Full NYDOS submission service (volume discounts apply below)
              </p>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500" />
                <Input
                  id="filing-base-price"
                  type="number"
                  step="0.01"
                  value={settings.filing_base_price}
                  onChange={(e) => updateSetting('filing_base_price', parseFloat(e.target.value))}
                  className="text-3xl pl-12 font-bold"
                  style={{ fontFamily: 'Libre Baskerville, serif' }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">per client entity (before volume discounts)</p>
            </div>
          </div>
          
          <div className="mt-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>💡 Upgrade Path:</strong> Monitoring clients can upgrade to Filing by paying only the <strong>${settings.filing_base_price - settings.monitoring_price}</strong> difference per client.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Volume Discount Tiers Header */}
      <Card className="border-2 border-gray-300">
        <CardHeader className="bg-gray-100 border-b-2 border-gray-300">
          <CardTitle className="text-2xl text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
            Volume Discount Tiers (Filing Only)
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Percentage discounts applied to filing service based on batch size. Discounts apply to foreign entity filings only.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tier 1: 1-25 Clients */}
        <Card className="border-2 border-gray-200">
          <CardHeader className="bg-gray-50 border-b-2 border-gray-200">
            <CardTitle className="text-xl text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              Tier 1 - Small Volume
            </CardTitle>
            <CardDescription className="text-base mt-2">
              For smaller filings (1-25 clients)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tier1-min" className="text-base mb-2 block">Minimum Clients</Label>
                <Input
                  id="tier1-min"
                  type="number"
                  value={settings.tier1_min}
                  onChange={(e) => updateSetting('tier1_min', parseInt(e.target.value))}
                  className="text-lg"
                />
              </div>
              <div>
                <Label htmlFor="tier1-max" className="text-base mb-2 block">Maximum Clients</Label>
                <Input
                  id="tier1-max"
                  type="number"
                  value={settings.tier1_max}
                  onChange={(e) => updateSetting('tier1_max', parseInt(e.target.value))}
                  className="text-lg"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="tier1-discount" className="text-base mb-2 block">Volume Discount (%)</Label>
              <Input
                id="tier1-discount"
                type="number"
                step="0.1"
                value={settings.tier1_discount}
                onChange={(e) => updateSetting('tier1_discount', parseFloat(e.target.value))}
                className="text-xl"
                style={{ fontFamily: 'Libre Baskerville, serif' }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tier 2: 26-75 Clients */}
        <Card className="border-2 border-gray-200">
          <CardHeader className="bg-gray-50 border-b-2 border-gray-200">
            <CardTitle className="text-xl text-gray-700" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              Tier 2 - Medium Volume
            </CardTitle>
            <CardDescription className="text-base mt-2">
              For medium filings (26-75 clients)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tier2-min" className="text-base mb-2 block">Minimum Clients</Label>
                <Input
                  id="tier2-min"
                  type="number"
                  value={settings.tier2_min}
                  onChange={(e) => updateSetting('tier2_min', parseInt(e.target.value))}
                  className="text-lg"
                />
              </div>
              <div>
                <Label htmlFor="tier2-max" className="text-base mb-2 block">Maximum Clients</Label>
                <Input
                  id="tier2-max"
                  type="number"
                  value={settings.tier2_max}
                  onChange={(e) => updateSetting('tier2_max', parseInt(e.target.value))}
                  className="text-lg"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="tier2-discount" className="text-base mb-2 block">Volume Discount (%)</Label>
              <Input
                id="tier2-discount"
                type="number"
                step="0.1"
                value={settings.tier2_discount}
                onChange={(e) => updateSetting('tier2_discount', parseFloat(e.target.value))}
                className="text-xl"
                style={{ fontFamily: 'Libre Baskerville, serif' }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tier 3: 76-150 Clients */}
        <Card className="border-2 border-gray-200">
          <CardHeader className="bg-gray-50 border-b-2 border-gray-200">
            <CardTitle className="text-xl text-gray-700" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              Tier 3 - Large Volume
            </CardTitle>
            <CardDescription className="text-base mt-2">
              For large filings (76-150 clients)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tier3-min" className="text-base mb-2 block">Minimum Clients</Label>
                <Input
                  id="tier3-min"
                  type="number"
                  value={settings.tier3_min}
                  onChange={(e) => updateSetting('tier3_min', parseInt(e.target.value))}
                  className="text-lg"
                />
              </div>
              <div>
                <Label htmlFor="tier3-max" className="text-base mb-2 block">Maximum Clients</Label>
                <Input
                  id="tier3-max"
                  type="number"
                  value={settings.tier3_max}
                  onChange={(e) => updateSetting('tier3_max', parseInt(e.target.value))}
                  className="text-lg"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="tier3-discount" className="text-base mb-2 block">Volume Discount (%)</Label>
              <Input
                id="tier3-discount"
                type="number"
                step="0.1"
                value={settings.tier3_discount}
                onChange={(e) => updateSetting('tier3_discount', parseFloat(e.target.value))}
                className="text-xl"
                style={{ fontFamily: 'Libre Baskerville, serif' }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tier 4: 151+ Clients */}
        <Card className="border-2 border-gray-200">
          <CardHeader className="bg-gray-50 border-b-2 border-gray-200">
            <CardTitle className="text-xl text-gray-700" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              Tier 4 - Enterprise Volume
            </CardTitle>
            <CardDescription className="text-base mt-2">
              For enterprise filings (151+ clients)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="tier4-min" className="text-base mb-2 block">Minimum Clients</Label>
              <Input
                id="tier4-min"
                type="number"
                value={settings.tier4_min}
                onChange={(e) => updateSetting('tier4_min', parseInt(e.target.value))}
                className="text-lg"
              />
            </div>
            <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4">
              <p className="text-base text-gray-700">
                <strong>Custom Pricing:</strong> Enterprise clients (151+ filings) receive custom quotes based on volume and specific requirements.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Preview */}
      <Card className="border-2 border-gray-200">
        <CardHeader className="bg-gray-50 border-b-2 border-gray-200">
          <CardTitle className="text-2xl text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
            Pricing Preview Examples
          </CardTitle>
          <CardDescription className="text-base mt-2">
            See how volume discounts apply to different filing volumes
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Example 1: 15 clients (Tier 1) */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-lg font-semibold">15 Clients (Tier 1)</p>
                <p className="text-2xl text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  ${((15 * settings.filing_base_price) * (1 - settings.tier1_discount / 100)).toFixed(2)}
                </p>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Base: ${(15 * settings.filing_base_price).toFixed(2)}</p>
                <p>After {settings.tier1_discount}% volume discount: ${((15 * settings.filing_base_price) * (1 - settings.tier1_discount / 100)).toFixed(2)}</p>
                <p className="font-semibold text-green-700">Total savings: ${((15 * settings.filing_base_price) - ((15 * settings.filing_base_price) * (1 - settings.tier1_discount / 100))).toFixed(2)}</p>
              </div>
            </div>

            {/* Example 2: 50 clients (Tier 2) */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-lg font-semibold">50 Clients (Tier 2)</p>
                <p className="text-2xl text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  ${((50 * settings.filing_base_price) * (1 - settings.tier2_discount / 100)).toFixed(2)}
                </p>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Base: ${(50 * settings.filing_base_price).toFixed(2)}</p>
                <p>After {settings.tier2_discount}% volume discount: ${((50 * settings.filing_base_price) * (1 - settings.tier2_discount / 100)).toFixed(2)}</p>
                <p className="font-semibold text-green-700">Total savings: ${((50 * settings.filing_base_price) - ((50 * settings.filing_base_price) * (1 - settings.tier2_discount / 100))).toFixed(2)}</p>
              </div>
            </div>

            {/* Example 3: 100 clients (Tier 3) */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-lg font-semibold">100 Clients (Tier 3)</p>
                <p className="text-2xl text-[#00274E]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  ${((100 * settings.filing_base_price) * (1 - settings.tier3_discount / 100)).toFixed(2)}
                </p>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Base: ${(100 * settings.filing_base_price).toFixed(2)}</p>
                <p>After {settings.tier3_discount}% volume discount: ${((100 * settings.filing_base_price) * (1 - settings.tier3_discount / 100)).toFixed(2)}</p>
                <p className="font-semibold text-green-700">Total savings: ${((100 * settings.filing_base_price) - ((100 * settings.filing_base_price) * (1 - settings.tier3_discount / 100))).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-between items-center">
        {saved && (
          <div className="flex items-center gap-2 text-[#00274E]">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-base">Pricing settings saved successfully!</span>
          </div>
        )}
        {!saved && <div />}
        <Button 
          size="lg" 
          className="bg-[#00274E] hover:bg-[#003d73] px-8 py-6"
          onClick={handleSave}
        >
          <Save className="mr-2 h-5 w-5" />
          Save Pricing Changes
        </Button>
      </div>
    </div>
  );
}