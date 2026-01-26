export default function CustomLoader() {
    return (
        <div className="space-y-6">
            <div className="min-h-screen w-full animate-pulse p-6">
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="h-8 w-1/3 rounded bg-gray-300"></div>
                    <div className="space-y-4 rounded-lg p-6 shadow">
                        <div className="h-6 w-1/4 rounded bg-gray-300"></div>
                        <div className="h-4 w-full rounded bg-gray-200"></div>
                        <div className="h-4 w-5/6 rounded bg-gray-200"></div>
                        <div className="h-4 w-2/3 rounded bg-gray-200"></div>
                    </div>
                    <div className="space-y-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-12 w-full rounded bg-gray-200"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
