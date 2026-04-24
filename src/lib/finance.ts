import type { FinancialAssumptions } from "./types";

/**
 * Very rough affordability ceiling. NYC-flavored: assume property tax ≈ 1%,
 * insurance ≈ 0.3%, HOA $400/mo default. We back into max home price where
 * (PITI + HOA) ≤ 31% of gross income, given a down payment equal to a third
 * of savings (buffer for closing costs + moving).
 */
export function affordabilityCeiling({
  savings,
  income,
  currentRent,
  interestRate = 0.065,
}: {
  savings: number;
  income: number;
  currentRent: number;
  interestRate?: number;
}): number {
  const downPayment = Math.max(savings / 3, 0);
  const monthlyBudget = Math.max(
    income / 12 * 0.31,
    currentRent * 1.2, // at minimum, willing to pay 20% more than current rent
  );
  const hoa = 400;
  const housingBudget = monthlyBudget - hoa;
  if (housingBudget <= 0) return 0;

  // PITI = principal+interest + taxes (~1%/yr) + insurance (~0.3%/yr)
  const r = interestRate / 12;
  const n = 360;
  // let P = price. Loan = P - downPayment. Monthly P&I = loan * r/(1-(1+r)^-n)
  // Tax+insurance monthly = price * (0.01+0.003)/12 = price * 0.001083
  const monthlyPIFactor = r / (1 - Math.pow(1 + r, -n));
  const priceFactorForPI = (1 - 0) * monthlyPIFactor; // on (P - dp)
  const tiPerDollar = 0.0013 / 12;

  // solve for P: (P - dp) * pi + P * ti = budget
  // P*(pi + ti) - dp*pi = budget
  // P = (budget + dp*pi) / (pi + ti)
  const ceiling =
    (housingBudget + downPayment * priceFactorForPI) /
    (priceFactorForPI + tiPerDollar);
  return Math.max(0, Math.round(ceiling));
}

/**
 * 30-year rent-vs-buy net worth projection.
 * buy: equity grows as home appreciates + loan paid down; costs = PITI+HOA.
 * rent: invest down payment + (buy monthly cost - rent) difference each month
 * at investmentReturn. Rent rises with inflation/appreciation proxy.
 */
export function rentVsBuyProjection({
  priceUsd,
  monthlyRent,
  fin,
  hoaUsd = 400 * 12,
  taxesPctOfPrice = 0.01,
  insurancePctOfPrice = 0.003,
  rentGrowth = 0.03,
}: {
  priceUsd: number;
  monthlyRent: number;
  fin: FinancialAssumptions;
  hoaUsd?: number;
  taxesPctOfPrice?: number;
  insurancePctOfPrice?: number;
  rentGrowth?: number;
}): {
  years: number[];
  buyNetWorth: number[];
  rentNetWorth: number[];
  verdict: "buy" | "rent" | "close";
  crossoverYear: number | null;
} {
  const years = Array.from({ length: fin.horizonYears + 1 }, (_, i) => i);
  const downPayment = priceUsd * fin.downPaymentPct;
  const loanStart = priceUsd - downPayment;
  const monthlyRate = fin.interestRate / 12;
  const nMonths = fin.horizonYears * 12;
  const monthlyPI =
    (loanStart * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -nMonths));

  const buyNetWorth: number[] = [];
  const rentNetWorth: number[] = [];
  let loanBalance = loanStart;
  let homeValue = priceUsd;
  let rentInvest = downPayment; // invest the would-be-down payment
  let currentMonthlyRent = monthlyRent;

  // Year 0 baseline
  buyNetWorth.push(priceUsd - loanBalance);
  rentNetWorth.push(rentInvest);

  let crossoverYear: number | null = null;

  for (let y = 1; y <= fin.horizonYears; y++) {
    // 12 months of amortization + appreciation
    for (let m = 0; m < 12; m++) {
      const interest = loanBalance * monthlyRate;
      const principal = monthlyPI - interest;
      loanBalance = Math.max(0, loanBalance - principal);
    }
    homeValue *= 1 + fin.homeApprecation;

    const yearTaxes = homeValue * taxesPctOfPrice;
    const yearInsurance = homeValue * insurancePctOfPrice;
    const buyAnnualOutlay = monthlyPI * 12 + hoaUsd + yearTaxes + yearInsurance;
    const rentAnnual = currentMonthlyRent * 12;

    // Invested difference (rent scenario): if owning is more expensive this
    // year, rent scenario gets to invest that difference. If renting is more
    // expensive, draw from invest pool (but we assume neutral contribution).
    const diff = buyAnnualOutlay - rentAnnual;
    rentInvest = rentInvest * (1 + fin.investmentReturn) + Math.max(0, diff);
    currentMonthlyRent *= 1 + rentGrowth;

    const buyNW = homeValue - loanBalance;
    buyNetWorth.push(buyNW);
    rentNetWorth.push(rentInvest);

    if (crossoverYear === null) {
      const prevBuy = buyNetWorth[y - 1]!;
      const prevRent = rentNetWorth[y - 1]!;
      if (
        (prevBuy < prevRent && buyNW >= rentInvest) ||
        (prevBuy > prevRent && buyNW <= rentInvest)
      ) {
        crossoverYear = y;
      }
    }
  }

  const finalBuy = buyNetWorth[buyNetWorth.length - 1]!;
  const finalRent = rentNetWorth[rentNetWorth.length - 1]!;
  const gap = Math.abs(finalBuy - finalRent);
  const verdict: "buy" | "rent" | "close" =
    gap / Math.max(finalBuy, finalRent) < 0.05
      ? "close"
      : finalBuy > finalRent
        ? "buy"
        : "rent";

  return { years, buyNetWorth, rentNetWorth, verdict, crossoverYear };
}

export function pricingAnalysis({
  subjectPrice,
  subjectSqft,
  comps,
}: {
  subjectPrice: number;
  subjectSqft: number;
  comps: { price: number; sqft: number }[];
}) {
  if (comps.length === 0 || subjectSqft <= 0) return null;
  const subjectPpsf = subjectPrice / subjectSqft;
  const compPpsfs = comps
    .filter((c) => c.sqft > 0)
    .map((c) => c.price / c.sqft);
  const avgCompPpsf =
    compPpsfs.reduce((a, b) => a + b, 0) / compPpsfs.length;
  const deltaPpsf = subjectPpsf - avgCompPpsf;
  const pct = deltaPpsf / avgCompPpsf;
  const fairValue = avgCompPpsf * subjectSqft;
  return {
    subjectPpsf,
    avgCompPpsf,
    deltaPpsf,
    pct,
    fairValue,
    verdict:
      pct > 0.05
        ? ("over" as const)
        : pct < -0.05
          ? ("under" as const)
          : ("fair" as const),
  };
}
