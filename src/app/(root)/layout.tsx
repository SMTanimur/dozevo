import { Setting } from "@/components";


export default function HoomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return (
        <div className="relative">
            <Setting/>
            {children}
        </div>
    )
}
