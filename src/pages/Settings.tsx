import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Eyebrow, Input, Pill, SectionHeader } from "@/components/ui";
import { useStore, currentUser } from "@/store/store";
import type { Tier } from "@/lib/types";
import { Plus, X } from "lucide-react";

export function Settings() {
  const nav = useNavigate();
  const user = currentUser();
  const members = useStore((s) => s.rubric.members);
  const addMember = useStore((s) => s.addMember);
  const removeMember = useStore((s) => s.removeMember);
  const setUser = useStore((s) => s.setUser);
  const setTier = useStore((s) => s.setTier);
  const viewMode = useStore((s) => s.viewMode);
  const setViewMode = useStore((s) => s.setViewMode);
  const addresses = useStore((s) => s.addresses);
  const removeAddress = useStore((s) => s.removeAddress);
  const addAddress = useStore((s) => s.addAddress);
  const searchProfile = useStore((s) => s.searchProfile);
  const setSearchProfile = useStore((s) => s.setSearchProfile);
  const reset = useStore((s) => s.reset);

  const [newMember, setNewMember] = useState("");
  const [newAddressLabel, setNewAddressLabel] = useState("");
  const [newAddress, setNewAddress] = useState("");

  return (
    <div>
      <SectionHeader
        eyebrow="Settings"
        title="Your setup."
        subtitle="Who's on the rubric, where the important places are, and how you want the app to behave."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Partners */}
        <Card>
          <Eyebrow className="mb-3">Rubric members · {members.length}</Eyebrow>
          <div className="space-y-2 mb-5">
            {members.map((m) => (
              <div key={m.userId} className="flex items-center gap-3 p-3 rounded border border-border-subtle">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: m.color }} />
                <div className="flex-1">
                  <p className="font-medium text-ink-primary">{m.displayName}</p>
                  {m.userId === user.id && <Pill tone="smile">You</Pill>}
                </div>
                {m.userId !== user.id && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => setUser(m.userId)}>
                      Sign in as {m.displayName}
                    </Button>
                    {members.length > 1 && (
                      <button
                        onClick={() => removeMember(m.userId)}
                        className="text-ink-tertiary hover:text-frown-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Partner's name"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
            />
            <Button
              variant="ghost"
              onClick={() => {
                if (!newMember) return;
                addMember(newMember);
                setNewMember("");
              }}
            >
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
          <p className="text-body-s text-ink-tertiary mt-4">
            Supports 2+ members (couple, married-with-kids, polycule). Adding a member gives every existing variable a weight of 0 for them to set themselves.
          </p>
        </Card>

        {/* Addresses */}
        <Card>
          <Eyebrow className="mb-3">Saved addresses · {addresses.length}</Eyebrow>
          <div className="space-y-2 mb-5">
            {addresses.map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded border border-border-subtle">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink-primary">{a.label}</p>
                  <p className="text-body-s text-ink-tertiary truncate">{a.address}</p>
                </div>
                <button onClick={() => removeAddress(a.id)} className="text-ink-tertiary hover:text-frown-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {addresses.length === 0 && (
              <p className="text-body-s text-ink-tertiary">No addresses yet.</p>
            )}
          </div>
          <div className="grid grid-cols-[1fr_2fr_auto] gap-2">
            <Input
              placeholder="Label"
              value={newAddressLabel}
              onChange={(e) => setNewAddressLabel(e.target.value)}
            />
            <Input
              placeholder="Street, City, ZIP"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
            <Button
              variant="ghost"
              onClick={() => {
                if (!newAddress || !newAddressLabel) return;
                addAddress({
                  label: newAddressLabel,
                  address: newAddress,
                  ownerId: null,
                  importance: "med",
                });
                setNewAddress("");
                setNewAddressLabel("");
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Tier */}
        <Card>
          <Eyebrow className="mb-3">Tier · {user.tier}</Eyebrow>
          <div className="grid grid-cols-3 gap-2">
            {(["free", "paid1", "paid2"] as Tier[]).map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`p-4 rounded border transition-colors text-left ${
                  user.tier === t
                    ? "border-ink-primary bg-smile-50"
                    : "border-border-subtle hover:bg-bg-muted"
                }`}
              >
                <p className="font-semibold text-ink-primary capitalize">{t}</p>
                <p className="text-body-s text-ink-tertiary mt-1">
                  {t === "free" ? "Rubric + worksheet" : t === "paid1" ? "Live queue, daily email" : "+ Human helper"}
                </p>
              </button>
            ))}
          </div>
          <p className="text-body-s text-ink-tertiary mt-4">
            Tier switching is instant in this demo. In production this routes through Stripe.
          </p>
        </Card>

        {/* Preferences */}
        <Card>
          <Eyebrow className="mb-3">Preferences</Eyebrow>
          <div className="space-y-4">
            <div>
              <label className="block eyebrow mb-2">Default view</label>
              <div className="inline-flex rounded bg-bg-inset p-1">
                {(["simple", "power"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setViewMode(m)}
                    className={`px-4 py-2 rounded text-body font-medium capitalize ${viewMode === m ? "bg-bg-elevated text-ink-primary shadow-xs" : "text-ink-tertiary"}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block eyebrow mb-2">Timeline</label>
              <select
                className="input-text !w-auto"
                value={searchProfile.timeline}
                onChange={(e) => setSearchProfile({ timeline: e.target.value })}
              >
                <option>Just looking</option>
                <option>3-6 months</option>
                <option>6-12 months</option>
                <option>1+ year</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Link to="/app/helper" className="btn-link">Helper dashboard →</Link>
            <Link to="/app/advisor" className="btn-link">Advisor dashboard →</Link>
          </div>
        </Card>
      </div>

      <Card className="mt-6 !border-frown-300/60">
        <Eyebrow className="!text-frown-700 mb-3">Danger zone</Eyebrow>
        <p className="text-body text-ink-secondary mb-4">
          Reset everything — rubric, properties, partners — and start over. Can't be undone.
        </p>
        <Button
          variant="ghost"
          className="!text-frown-700"
          onClick={() => {
            if (confirm("Reset all data? This clears your rubric, partners, and properties.")) {
              reset();
              nav("/");
            }
          }}
        >
          Reset all data
        </Button>
      </Card>
    </div>
  );
}
