import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Eyebrow } from "@/components/ui";
import { useStore } from "@/store/store";
import { motion, AnimatePresence } from "framer-motion";

export function KittenExplainer() {
  const [step, setStep] = useState(0);
  const [pref, setPref] = useState<"cats" | "dogs" | null>(null);
  const [choice, setChoice] = useState<"expensive" | "cheap" | null>(null);
  const nav = useNavigate();
  const setKittenSeen = useStore((s) => s.setKittenSeen);

  function finish() {
    setKittenSeen();
    nav("/app");
  }

  const steps = [
    (
      <StepCard key="p" eyebrow="1 of 5" title="Do you prefer dogs or cats?">
        <div className="grid grid-cols-2 gap-4 mt-6">
          <ChoiceBig emoji="🐕" label="Dogs" selected={pref === "dogs"} onClick={() => setPref("dogs")} />
          <ChoiceBig emoji="🐈" label="Cats" selected={pref === "cats"} onClick={() => setPref("cats")} />
        </div>
        <div className="mt-8 flex justify-end">
          <Button disabled={!pref} onClick={() => setStep(1)}>
            Continue
          </Button>
        </div>
      </StepCard>
    ),
    (
      <StepCard key="k" eyebrow="2 of 5" title="Great. Here are two kittens.">
        <p className="text-body-l text-ink-tertiary mt-2">
          (We're using kittens whether you picked dogs or cats. This is the demo.)
        </p>
        <div className="grid grid-cols-2 gap-5 mt-7">
          <Card className="text-center !p-7">
            <div className="text-[90px] leading-none">🐈</div>
            <p className="text-body text-ink-secondary mt-3">A fluffy kitten.</p>
          </Card>
          <Card className="text-center !p-7">
            <div className="text-[90px] leading-none">🐈‍⬛</div>
            <p className="text-body text-ink-secondary mt-3">Another fluffy kitten.</p>
          </Card>
        </div>
        <div className="mt-8 flex justify-between">
          <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
          <Button onClick={() => setStep(2)}>Continue</Button>
        </div>
      </StepCard>
    ),
    (
      <StepCard key="price" eyebrow="3 of 5" title="This one costs $10,000. This one costs $1.">
        <div className="grid grid-cols-2 gap-5 mt-7">
          <Card className="text-center !p-7">
            <div className="text-[90px] leading-none">🐈</div>
            <p className="serif text-display-m text-ink-primary mt-3">$10,000</p>
          </Card>
          <Card className="text-center !p-7">
            <div className="text-[90px] leading-none">🐈‍⬛</div>
            <p className="serif text-display-m text-ink-primary mt-3">$1</p>
          </Card>
        </div>
        <div className="mt-8 flex justify-between">
          <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
          <Button onClick={() => setStep(3)}>Which do you want?</Button>
        </div>
      </StepCard>
    ),
    (
      <StepCard key="choice" eyebrow="4 of 5" title="Which do you want?">
        <div className="grid grid-cols-2 gap-5 mt-7">
          <ChoiceBig
            emoji="🐈"
            label="$10,000"
            sub="The expensive one"
            selected={choice === "expensive"}
            onClick={() => setChoice("expensive")}
          />
          <ChoiceBig
            emoji="🐈‍⬛"
            label="$1"
            sub="The cheap one"
            selected={choice === "cheap"}
            onClick={() => setChoice("cheap")}
          />
        </div>
        <div className="mt-8 flex justify-between">
          <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
          <Button disabled={!choice} onClick={() => setStep(4)}>Continue</Button>
        </div>
      </StepCard>
    ),
    (
      <StepCard key="reveal" eyebrow="5 of 5" title="That's Smile Analysis.">
        <p className="text-body-l text-ink-secondary mt-3 leading-[1.5]">
          You probably picked the $1 kitten — not because you don't like the other one,
          but because the other one isn't <em className="serif">ten thousand times</em> cuter.
        </p>
        <p className="text-body-l text-ink-secondary mt-5 leading-[1.5]">
          We help you find the home — or the kitten — that gives you the most <span className="text-smile-700 font-semibold">smiles per dollar</span>.
          One number. Ranked. For the biggest decision of your life.
        </p>
        <div className="mt-10 flex justify-end">
          <Button variant="smile" onClick={finish}>I'm ready</Button>
        </div>
      </StepCard>
    ),
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 pt-16 pb-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {steps[step]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function StepCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
      <h1 className="serif text-display-l text-ink-primary leading-[1.02]">{title}</h1>
      {children}
    </div>
  );
}

function ChoiceBig({
  emoji,
  label,
  sub,
  selected,
  onClick,
}: {
  emoji: string;
  label: string;
  sub?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`card p-8 text-center transition-all ${
        selected
          ? "!border-ink-primary ring-4 ring-smile-100"
          : "hover:bg-bg-muted"
      }`}
    >
      <div className="text-[72px] leading-none">{emoji}</div>
      <p className="serif text-heading-l text-ink-primary mt-4">{label}</p>
      {sub && <p className="text-body-s text-ink-tertiary mt-1">{sub}</p>}
    </button>
  );
}
