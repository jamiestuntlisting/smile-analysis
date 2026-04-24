import { useMemo, useState } from "react";
import { useStore } from "@/store/store";
import { maxPairwiseDelta, countConsensus } from "@/lib/consensus";
import { AreaPill, Button, Card, Eyebrow, Pill, SectionHeader, SmileSlider } from "@/components/ui";
import { SmileGlyph, FrownGlyph } from "@/components/Glyph";
import { GitFork, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Consensus() {
  const variables = useStore((s) => s.variables);
  const states = useStore((s) => s.variableStates);
  const members = useStore((s) => s.rubric.members);
  const compromise = useStore((s) => s.compromise);
  const setStatus = useStore((s) => s.setConsensusStatus);
  const setWeight = useStore((s) => s.setWeight);
  const [toast, setToast] = useState<string | null>(null);

  const counts = countConsensus(states, members);

  const rows = useMemo(() => {
    return variables
      .map((v) => {
        const s = states[v.id];
        if (!s) return null;
        const d = maxPairwiseDelta(s, members);
        return { v, s, d };
      })
      .filter(
        (row): row is NonNullable<typeof row> =>
          row !== null && (row.s.status !== "agreed" || row.s.status === undefined),
      )
      .sort((a, b) => {
        const af = a.s.status === "forked" ? 1 : 0;
        const bf = b.s.status === "forked" ? 1 : 0;
        if (af !== bf) return af - bf;
        return b.d.delta - a.d.delta;
      });
  }, [variables, states, members]);

  const openRows = rows.filter((r) => r.s.status !== "forked");
  const forkedRows = rows.filter((r) => r.s.status === "forked");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }

  return (
    <div className="relative">
      <SectionHeader
        title={
          counts.open === 0 && counts.forked === 0
            ? "Consensus · full agreement"
            : `Consensus · ${counts.open + counts.forked} of ${counts.total} variables need attention`
        }
        subtitle={
          counts.open === 0 && counts.forked === 0
            ? "Every member agrees on every weight. The joint leaderboard uses a single shared rubric."
            : "Sorted by size of disagreement. Suggest a compromise where you're close, fork where you're not, leave things open when you want to talk them through."
        }
      />

      {openRows.length === 0 && forkedRows.length === 0 && (
        <Card className="text-center py-16">
          <p className="text-heading-m font-semibold text-ink-primary mb-2">Nothing to resolve.</p>
          <p className="text-body text-ink-tertiary">
            Every variable is either agreed or hasn't been weighted by everyone yet.
          </p>
        </Card>
      )}

      {openRows.length > 0 && (
        <>
          <Eyebrow className="mb-3">Sorted by size of disagreement</Eyebrow>
          <div className="space-y-3">
            <AnimatePresence>
              {openRows.map(({ v, s, d }) => (
                <motion.div
                  key={v.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="!p-5">
                    <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <AreaPill area={v.area} />
                        <span className="font-semibold text-ink-primary">{v.name}</span>
                      </div>
                      <Pill tone={d.delta > 10 ? "frown" : d.canCompromise ? "smile" : "neutral"}>
                        {d.delta} apart
                      </Pill>
                    </div>
                    {v.definition && (
                      <p className="text-body-s text-ink-tertiary mb-4">{v.definition}</p>
                    )}
                    <div className="space-y-2 mb-5">
                      {members.map((m) => {
                        const w = s.weights[m.userId] ?? 0;
                        return (
                          <div key={m.userId} className="flex items-center gap-3">
                            <div className="w-24 flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ background: m.color }}
                              />
                              <span className="text-body-s text-ink-secondary">{m.displayName}</span>
                            </div>
                            <div className="flex-1">
                              <SmileSlider
                                value={w}
                                onChange={(val) => setWeight(v.id, m.userId, val)}
                              />
                            </div>
                            <div className="w-12 text-right numeric font-medium flex items-center justify-end gap-1">
                              {w > 0 ? <SmileGlyph className="w-3.5 h-3.5" /> : w < 0 ? <FrownGlyph className="w-3.5 h-3.5" /> : null}
                              <span className={w > 0 ? "text-smile-700" : w < 0 ? "text-frown-700" : "text-ink-tertiary"}>
                                {w > 0 ? "+" : ""}{w}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {d.canCompromise && (
                        <Button
                          variant="smile"
                          size="sm"
                          onClick={() => {
                            compromise(v.id);
                            showToast(`Agreed at +${d.avg}. Rubric got more consistent.`);
                          }}
                        >
                          Suggest compromise: {d.avg > 0 ? "+" : ""}{d.avg}
                        </Button>
                      )}
                      {!d.canCompromise && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            compromise(v.id);
                            showToast(`Averaged to +${d.avg}.`);
                          }}
                        >
                          Average to {d.avg > 0 ? "+" : ""}{d.avg}
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => showToast("Left open for a conversation.")}>
                        Discuss this
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setStatus(v.id, "forked");
                          showToast("Your rubric just got more honest.");
                        }}
                        className="!text-frown-700"
                      >
                        <GitFork className="w-4 h-4" />
                        We don't agree
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {forkedRows.length > 0 && (
        <>
          <Eyebrow className="mt-12 mb-3">Forked variables · {forkedRows.length}</Eyebrow>
          <p className="text-body text-ink-tertiary mb-4">
            These live as separate weights per person. Joint rankings show only the overlap.
          </p>
          <div className="space-y-3">
            {forkedRows.map(({ v, s }) => (
              <Card key={v.id} className="!p-4 !bg-bg-inset">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <AreaPill area={v.area} />
                    <span className="font-semibold text-ink-primary">{v.name}</span>
                    <Pill tone="neutral"><GitFork className="w-3 h-3" /> forked</Pill>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setStatus(v.id, "open")}>
                    Unfork
                  </Button>
                </div>
                <div className="flex flex-wrap gap-4 mt-3">
                  {members.map((m) => {
                    const w = s.weights[m.userId] ?? 0;
                    return (
                      <div key={m.userId} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                        <span className="text-body-s text-ink-secondary">{m.displayName}</span>
                        <span className={`numeric font-medium ${w > 0 ? "text-smile-700" : w < 0 ? "text-frown-700" : "text-ink-tertiary"}`}>
                          {w > 0 ? "+" : ""}{w}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 card !py-3 !px-5 shadow-md flex items-center gap-2 z-50"
          >
            <Sparkles className="w-4 h-4 text-smile-500" />
            <span className="text-body">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
