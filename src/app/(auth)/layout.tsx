import { marketingFont } from "@/lib/fonts/marketing";
import { cn } from "@/lib/utils";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn("auth-layout flex min-h-svh flex-1 flex-col", marketingFont.variable)}>
      {children}
    </div>
  );
}
