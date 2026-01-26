interface ErrorProps {
    title: string;
    description: string;
    icon: React.ReactNode;
}
export default function CustomError({ title, description, icon }: ErrorProps) {
    return (
        <div className="flex h-full w-full items-center justify-center py-20">
            <div className="relative max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
                {/* Decorative glow */}
                <div className="absolute -top-6 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-red-200/40 blur-2xl"></div>

                {/* Icon */}
                <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-200 text-4xl shadow-inner">
                    {icon}
                </div>

                {/* Title */}
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                    {title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-red-500">
                    {description}
                </p>

                {/* Tip box */}
                <div className="mt-6 rounded-lg bg-gray-50 px-4 py-3 text-xs text-gray-600">
                    💡 Tip: Admission IDs usually start with{' '}
                    <strong>ADM</strong>
                    followed by numbers.
                </div>
            </div>
        </div>
    );
}
