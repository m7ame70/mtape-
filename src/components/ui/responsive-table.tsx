import { ReactNode } from "react";

export function ResponsiveTable({ children }: { children: ReactNode }) {
    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-[640px]">
                {children}
            </div>
        </div>
    );
}
