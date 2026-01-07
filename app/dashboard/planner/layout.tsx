export default function PlannerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full h-full min-h-screen bg-[#FDFDFE] relative overflow-hidden">
            {children}
        </div>
    );
}
