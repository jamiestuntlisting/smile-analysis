import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Panel } from "@/components/Panel";
import { Button, Input, AreaPill } from "@/components/ui";
import { SOLD_HOMES } from "@/data/soldHomes";
import { useStore } from "@/store/store";
import { fmtUsd } from "@/lib/id";
import { SmileGlyph, FrownGlyph } from "@/components/Glyph";
import { Check, Plus } from "lucide-react";
import type { Area } from "@/lib/types";
import { nextOpenStep } from "@/lib/progress";

type Side = "like" | "dislike";

export function CalibrationPanel() {
  const nav = useNavigate();
  const members = useStore((s) => s.rubric.members);
  const existingVars = useStore((s) => s.variables);
  const addVariable = useStore((s) => s.addVariable);
  const markProgress = useStore((s) => s.markProgress);
  const searchProfile = useStore((s) => s.searchProfile);
  const addresses = useStore((s) => s.addresses);
  const progress = useStore((s) => s.progress);

  const [idx, setIdx] = useState(0);
  const home = SOLD_HOMES[idx]!;

  const [customLike, setCustomLike] = useState("");
  const [customDislike, setCustomDislike] = useState("");
  const [customArea, setCustomArea] = useState<Area>("In");

  const onRubric = useMemo(
    () => new Set(existingVars.map((v) => v.name.toLowerCase())),
    [existingVars],
  );

  function addItem(text: string, area: Area, side: Side) {
    if (onRubric.has(text.toLowerCase())) return;
    const weights: Record<string, number> = {};
    for (const m of members) weights[m.userId] = side === "like" ? 1 : -1;
    addVariable(
      {
        name: text,
        area,
        definition: `Noted from ${home.address}.`,
        scorer: "listing",
        needsHuman: false,
        createdBy: members[0]!.userId,
      },
      weights,
    );
  }

  function addCustomLike() {
    if (!customLike.trim()) return;
    addItem(customLike.trim(), customArea, "like");
    setCustomLike("");
  }
  function addCustomDislike() {
    if (!customDislike.trim()) return;
    addItem(customDislike.trim(), customArea, "dislike");
    setCustomDislike("");
  }

  function advance() {
    if (idx < SOLD_HOMES.length - 1) {
      setIdx(idx + 1);
    } else {
      markProgress("calibrationDone", true);
      const next = nextOpenStep({
        searchProfile,
        addresses,
        variables: existingVars,
        progress: { ...progress, calibrationDone: true },
      });
      nav(next ? next.path : "/app/weights");
    }
  }

  const likeItems = home.features.filter((f) => f.suggestedWeight >= 0);
  const dislikeItems = home.features.filter((f) => f.suggestedWeight < 0);

  return (
    <Panel
      step={`Step 05 · Sold home ${idx + 1} of ${SOLD_HOMES.length}`}
      title="React to a real sold home."
      subtitle="Just make a list — likes on the left, dislikes on the right. Don't worry about weights yet; those come next. What would have made you happy here? What would have bothered you?"
      action={
        <div className="eyebrow text-ink-tertiary tabular">
          {existingVars.length} on rubric
        </div>
      }
      width="full"
      footer={
        <>
          <div className="flex items-center gap-2">
            {idx > 0 && (
              <Button variant="ghost" onClick={() => setIdx(idx - 1)}>
                Previous home
              </Button>
            )}
            <div className="flex items-center gap-1 ml-2">
              {SOLD_HOMES.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === idx ? "bg-ink-primary" : i < idx ? "bg-smile-500" : "bg-border"}`}
                />
              ))}
            </div>
          </div>
          <Button onClick={advance}>
            {idx < SOLD_HOMES.length - 1 ? "Next home →" : "Done — set weights →"}
          </Button>
        </>
      }
    >
      <div className="grid lg:grid-cols-[minmax(0,440px)_1fr] gap-8 items-start">
        <div className="rounded-md border border-border-subtle bg-bg-elevated overflow-hidden sticky top-[140px]">
          <img
            src={home.photoUrl}
            alt={home.address}
            className="w-full aspect-[4/3] object-cover"
          />
          <div className="p-5">
            <h2 className="text-heading-m font-semibold text-ink-primary">{home.address}</h2>
            <p className="text-body-s text-ink-tertiary">{home.neighborhood}</p>
            <div className="flex gap-3 mt-3 text-body-s text-ink-secondary tabular">
              <span>{fmtUsd(home.soldPriceUsd)}</span>
              <span>·</span>
              <span>{home.beds}BR · {home.baths}BA · {home.sqft.toLocaleString()} sqft</span>
            </div>
            <p className="text-body-s text-ink-secondary mt-4 leading-relaxed">{home.blurb}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <SmileGlyph className="w-5 h-5" />
              <h3 className="text-heading-m font-semibold text-ink-primary">What I'd like</h3>
            </div>
            <div className="space-y-2">
              {likeItems.map((f) => (
                <SuggestBtn
                  key={f.text}
                  name={f.text}
                  area={f.area}
                  done={onRubric.has(f.text.toLowerCase())}
                  side="like"
                  onClick={() => addItem(f.text, f.area, "like")}
                />
              ))}
              <CustomRow
                placeholder="Something else I'd like…"
                value={customLike}
                onChange={setCustomLike}
                area={customArea}
                setArea={setCustomArea}
                onAdd={addCustomLike}
                side="like"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <FrownGlyph className="w-5 h-5" />
              <h3 className="text-heading-m font-semibold text-ink-primary">What I don't like</h3>
            </div>
            <div className="space-y-2">
              {dislikeItems.map((f) => (
                <SuggestBtn
                  key={f.text}
                  name={f.text}
                  area={f.area}
                  done={onRubric.has(f.text.toLowerCase())}
                  side="dislike"
                  onClick={() => addItem(f.text, f.area, "dislike")}
                />
              ))}
              <CustomRow
                placeholder="Something that bothered me…"
                value={customDislike}
                onChange={setCustomDislike}
                area={customArea}
                setArea={setCustomArea}
                onAdd={addCustomDislike}
                side="dislike"
              />
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function SuggestBtn({
  name,
  area,
  done,
  side,
  onClick,
}: {
  name: string;
  area: Area;
  done: boolean;
  side: Side;
  onClick: () => void;
}) {
  return (
    <button
      disabled={done}
      onClick={onClick}
      className={`w-full text-left p-3 rounded border transition-colors flex items-center justify-between gap-3 ${
        done
          ? "bg-bg-inset border-border-subtle opacity-70 cursor-default"
          : side === "like"
            ? "bg-bg-elevated border-border-subtle hover:border-smile-500"
            : "bg-bg-elevated border-border-subtle hover:border-frown-500"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <AreaPill area={area} />
        <span className="font-medium text-ink-primary truncate">{name}</span>
      </div>
      <span
        className={`shrink-0 inline-flex items-center justify-center w-6 h-6 rounded ${
          done
            ? "bg-value-100 text-value-500"
            : "border border-border text-ink-tertiary"
        }`}
      >
        {done ? <Check className="w-4 h-4" strokeWidth={3} /> : <Plus className="w-4 h-4" />}
      </span>
    </button>
  );
}

function CustomRow({
  placeholder,
  value,
  onChange,
  area,
  setArea,
  onAdd,
  side,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  area: Area;
  setArea: (a: Area) => void;
  onAdd: () => void;
  side: Side;
}) {
  return (
    <div
      className={`p-3 rounded border border-dashed ${
        side === "like" ? "border-smile-300/60" : "border-frown-300/60"
      }`}
    >
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), onAdd())}
          className="!py-1.5"
        />
        <select
          value={area}
          onChange={(e) => setArea(e.target.value as Area)}
          className="input-text !py-1.5 !w-auto"
          aria-label="Area"
        >
          <option value="In">In the unit</option>
          <option value="Building">Building</option>
          <option value="Around">Around it</option>
          <option value="Commute">Commute</option>
        </select>
        <Button size="sm" variant="ghost" onClick={onAdd} disabled={!value.trim()}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
