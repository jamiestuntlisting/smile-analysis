import { useState } from "react";
import { useStore } from "@/store/store";
import { Button, Card, Eyebrow, Input, Textarea } from "./ui";
import { X } from "lucide-react";

export function AddPropertyModal({ onClose }: { onClose: () => void }) {
  const addProperty = useStore((s) => s.addProperty);
  const variables = useStore((s) => s.variables);
  const setScore = useStore((s) => s.setScore);
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [price, setPrice] = useState("");
  const [sqft, setSqft] = useState("");
  const [hoa, setHoa] = useState("");
  const [taxes, setTaxes] = useState("");
  const [desc, setDesc] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = addProperty({
      address,
      neighborhood,
      priceUsd: Number(price) || 0,
      sqft: sqft ? Number(sqft) : null,
      hoaUsd: Number(hoa) * 12 || 0,
      taxesUsd: Number(taxes) || 0,
      insuranceUsd: 1500,
      listingDescription: desc,
      dayAdded: 1,
      openHouse: null,
    });
    // rough auto-score pass
    const hay = `${address} ${neighborhood} ${desc}`.toLowerCase();
    for (const v of variables) {
      const needle = v.name.toLowerCase().split(/\s+/).filter((t) => t.length > 3);
      if (needle.length === 0) {
        setScore({ propertyId: id, variableId: v.id, match: "unknown", confidence: "low", scoredBy: "claude" });
        continue;
      }
      const hits = needle.filter((t) => hay.includes(t)).length;
      const match = hits >= Math.ceil(needle.length / 2) ? "yes" : v.scorer === "user" || v.scorer === "helper" ? "unknown" : "no";
      setScore({ propertyId: id, variableId: v.id, match, confidence: match === "unknown" ? "low" : "med", scoredBy: "claude" });
    }
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-ink-primary/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-xl !p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <Eyebrow>Add property</Eyebrow>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-ink-tertiary" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block eyebrow mb-2">Address</label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block eyebrow mb-2">Neighborhood</label>
              <Input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
            </div>
            <div>
              <label className="block eyebrow mb-2">Price</label>
              <Input value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" required />
            </div>
            <div>
              <label className="block eyebrow mb-2">Sqft</label>
              <Input value={sqft} onChange={(e) => setSqft(e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" />
            </div>
            <div>
              <label className="block eyebrow mb-2">HOA / mo</label>
              <Input value={hoa} onChange={(e) => setHoa(e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" />
            </div>
            <div className="col-span-2">
              <label className="block eyebrow mb-2">Taxes / yr</label>
              <Input value={taxes} onChange={(e) => setTaxes(e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" />
            </div>
          </div>
          <div>
            <label className="block eyebrow mb-2">Paste the listing description</label>
            <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">Add & auto-score</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
