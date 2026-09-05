import { createFileRoute } from "@tanstack/react-router";
import { PlannerApp } from "@/components/planner/planner-app";
import { PlannerProvider } from "@/lib/planner/context";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <PlannerProvider>
      <PlannerApp />
    </PlannerProvider>
  );
}
