import { Component, type ReactNode } from "react";
import { RefreshDouble } from "iconoir-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // No raw stack traces for the user; log for ourselves only.
    if (import.meta.env.DEV) console.error("UI crash:", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-5 bg-background px-6 text-center">
        <h1 className="font-heading text-xl font-semibold">Something went wrong</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          An unexpected error occurred. Reloading usually fixes it.
        </p>
        <Button onClick={() => window.location.reload()}>
          <RefreshDouble className="size-4" /> Reload
        </Button>
      </div>
    );
  }
}