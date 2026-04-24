import { Navigate } from "react-router-dom";
import { useStore } from "@/store/store";
import { nextOpenStep } from "@/lib/progress";

/**
 * /app lands here and routes to wherever the user should be next:
 * - The first open setup step if any remain, or
 * - The Queue once all setup is done.
 */
export function AppIndex() {
  const searchProfile = useStore((s) => s.searchProfile);
  const addresses = useStore((s) => s.addresses);
  const variables = useStore((s) => s.variables);
  const progress = useStore((s) => s.progress);

  const next = nextOpenStep({ searchProfile, addresses, variables, progress });
  return <Navigate to={next ? next.path : "/app/queue"} replace />;
}
