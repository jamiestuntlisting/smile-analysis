import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { PublicLayout } from "@/components/Layout";
import { Landing } from "@/pages/Landing";
import { Auth } from "@/pages/Auth";
import { About } from "@/pages/About";
import { KittenExplainer } from "@/pages/KittenExplainer";
import { BudgetPanel } from "@/pages/panels/BudgetPanel";
import { RentOrBuyPanel } from "@/pages/panels/RentOrBuyPanel";
import { PlacesPanel } from "@/pages/panels/PlacesPanel";
import { CategoriesPanel } from "@/pages/panels/CategoriesPanel";
import { CalibrationPanel } from "@/pages/panels/CalibrationPanel";
import { WeightsPanel } from "@/pages/panels/WeightsPanel";
import { AppIndex } from "@/pages/panels/AppIndex";
import { RubricBuilder } from "@/pages/RubricBuilder";
import { AddVariable } from "@/pages/AddVariable";
import { Consensus } from "@/pages/Consensus";
import { PropertyQueue } from "@/pages/PropertyQueue";
import { PropertyDetail } from "@/pages/PropertyDetail";
import { PropertyCompare } from "@/pages/PropertyCompare";
import { PricingAnalysis } from "@/pages/PricingAnalysis";
import { AnalysisPanel } from "@/pages/panels/AnalysisPanel";
import { OpenHouses } from "@/pages/OpenHouses";
import { Worksheet } from "@/pages/Worksheet";
import { Settings } from "@/pages/Settings";
import { HelperDashboard } from "@/pages/HelperDashboard";
import { AdvisorDashboard } from "@/pages/AdvisorDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "login", element: <Auth mode="login" /> },
      { path: "signup", element: <Auth mode="signup" /> },
      { path: "about", element: <About /> },
      { path: "kittens", element: <KittenExplainer /> },
    ],
  },
  {
    path: "/app",
    element: <AppShell />,
    children: [
      { index: true, element: <AppIndex /> },

      // Setup steps (tabs disappear once decided)
      { path: "rent-or-buy", element: <RentOrBuyPanel /> },
      { path: "budget", element: <BudgetPanel /> },
      { path: "places", element: <PlacesPanel /> },
      { path: "categories", element: <CategoriesPanel /> },
      { path: "calibration", element: <CalibrationPanel /> },
      { path: "weights", element: <WeightsPanel /> },

      // Ongoing tools
      { path: "queue", element: <PropertyQueue /> },
      { path: "property/:id", element: <PropertyDetail /> },
      { path: "property/:id/pricing", element: <PricingAnalysis /> },
      { path: "compare", element: <PropertyCompare /> },
      { path: "rubric", element: <RubricBuilder /> },
      { path: "rubric/add", element: <AddVariable /> },
      { path: "consensus", element: <Consensus /> },
      { path: "analysis", element: <AnalysisPanel /> },
      { path: "open-houses", element: <OpenHouses /> },
      { path: "worksheet", element: <Worksheet /> },
      { path: "settings", element: <Settings /> },
      { path: "helper", element: <HelperDashboard /> },
      { path: "advisor", element: <AdvisorDashboard /> },
    ],
  },
  // Back-compat: anything that used to live under /onboarding goes to the app.
  { path: "/onboarding/*", element: <Navigate to="/app" replace /> },
]);
