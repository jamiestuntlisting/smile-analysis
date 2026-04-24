import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Panel } from "@/components/Panel";
import { Button, Input, Pill } from "@/components/ui";
import { useStore } from "@/store/store";
import { nextOpenStep } from "@/lib/progress";
import { Plus, X } from "lucide-react";

export function PlacesPanel() {
  const nav = useNavigate();
  const addresses = useStore((s) => s.addresses);
  const addAddress = useStore((s) => s.addAddress);
  const removeAddress = useStore((s) => s.removeAddress);
  const members = useStore((s) => s.rubric.members);
  const searchProfile = useStore((s) => s.searchProfile);
  const variables = useStore((s) => s.variables);
  const progress = useStore((s) => s.progress);

  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");
  const [owner, setOwner] = useState<string | null>(null);

  function addOne() {
    if (!label.trim() || !address.trim()) return;
    addAddress({ label: label.trim(), address: address.trim(), ownerId: owner, importance: "med" });
    setLabel("");
    setAddress("");
    setOwner(null);
  }

  function lockIn() {
    const next = nextOpenStep({ searchProfile, addresses, variables, progress });
    nav(next ? next.path : "/app/queue");
  }

  return (
    <Panel
      step="Step 03"
      title="Where do you need to be?"
      subtitle="Work addresses for each partner. School. Parents. Gym. Anywhere you go often enough that commute matters. Commute times become auto-scoring variables later."
      width="wide"
    >
      <div className="rounded-md border border-border-subtle bg-bg-elevated overflow-hidden">
        <div className="p-4 border-b border-border-subtle bg-bg-inset/60">
          <div className="grid sm:grid-cols-[220px_1fr_auto] gap-3 items-end">
            <div>
              <label className="block eyebrow mb-2">Label</label>
              <Input
                placeholder="Jack's work"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addOne()}
              />
            </div>
            <div>
              <label className="block eyebrow mb-2">Address</label>
              <Input
                placeholder="350 Park Ave, New York, NY 10022"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addOne()}
              />
            </div>
            <Button variant="ghost" onClick={addOne} disabled={!label.trim() || !address.trim()}>
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
          {members.length > 1 && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="eyebrow">Belongs to:</span>
              <button
                onClick={() => setOwner(null)}
                className={`pill text-body-s ${owner === null ? "bg-ink-primary text-white" : "bg-bg-elevated border border-border-subtle"}`}
              >
                Shared
              </button>
              {members.map((m) => (
                <button
                  key={m.userId}
                  onClick={() => setOwner(m.userId)}
                  className={`pill text-body-s ${owner === m.userId ? "bg-ink-primary text-white" : "bg-bg-elevated border border-border-subtle"}`}
                >
                  {m.displayName}
                </button>
              ))}
            </div>
          )}
        </div>

        {addresses.length > 0 ? (
          <table className="w-full text-body">
            <thead>
              <tr className="border-b border-border-subtle text-left">
                <th className="eyebrow py-2.5 px-4">Label</th>
                <th className="eyebrow py-2.5 px-4">Address</th>
                <th className="eyebrow py-2.5 px-4">Owner</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {addresses.map((a) => (
                <tr key={a.id} className="border-b border-border-subtle last:border-0 hover:bg-bg-muted/40">
                  <td className="px-4 py-3 font-medium text-ink-primary">{a.label}</td>
                  <td className="px-4 py-3 text-ink-secondary">{a.address}</td>
                  <td className="px-4 py-3">
                    {a.ownerId ? (
                      <Pill tone="neutral">
                        {members.find((m) => m.userId === a.ownerId)?.displayName ?? "—"}
                      </Pill>
                    ) : (
                      <span className="text-body-s text-ink-tertiary">shared</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => removeAddress(a.id)}
                      className="text-ink-tertiary hover:text-frown-500"
                      aria-label="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-body-s text-ink-tertiary">
            No addresses yet.
          </div>
        )}
      </div>

      <div className="mt-10 pt-6 border-t border-border-subtle flex items-center justify-end gap-3">
        <Button onClick={lockIn} disabled={addresses.length === 0}>
          Continue with {addresses.length} {addresses.length === 1 ? "address" : "addresses"} →
        </Button>
      </div>
    </Panel>
  );
}
