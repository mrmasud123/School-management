import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, Calendar, GraduationCap, Users } from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-violet-950">
                {/* Animated decorative background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 -left-20 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-violet-300 to-purple-300 opacity-20 blur-3xl dark:from-violet-600 dark:to-purple-600 dark:opacity-10" />
                    <div className="animation-delay-2000 absolute -right-20 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-blue-300 to-cyan-300 opacity-20 blur-3xl dark:from-blue-600 dark:to-cyan-600 dark:opacity-10" />
                    <div className="animation-delay-4000 absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-gradient-to-r from-pink-300 to-rose-300 opacity-10 blur-3xl dark:from-pink-600 dark:to-rose-600 dark:opacity-5" />

                    {/* Floating particles */}
                    <div className="animation-delay-1000 absolute top-1/3 left-1/4 h-2 w-2 animate-bounce rounded-full bg-violet-400 opacity-60" />
                    <div className="animation-delay-2000 absolute top-1/4 right-1/3 h-3 w-3 animate-bounce rounded-full bg-blue-400 opacity-60" />
                    <div className="animation-delay-3000 absolute bottom-1/3 left-1/3 h-2 w-2 animate-bounce rounded-full bg-cyan-400 opacity-60" />
                    <div className="absolute right-1/4 bottom-1/4 h-3 w-3 animate-bounce rounded-full bg-pink-400 opacity-60" />
                </div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40 dark:opacity-20" />

                {/* Navigation */}
                <header className="absolute top-6 right-6 z-10 lg:top-8 lg:right-8">
                    <nav className="flex items-center gap-3">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-medium text-gray-800 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20 hover:shadow-xl dark:text-white"
                            >
                                <span className="relative z-10">Dashboard</span>
                                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-violet-400/20 to-blue-400/20 opacity-0 transition-opacity group-hover:opacity-100" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="group relative overflow-hidden rounded-xl px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:scale-105 dark:text-gray-200"
                                >
                                    <span className="relative z-10">
                                        Log in
                                    </span>
                                    <div className="absolute inset-0 -z-10 rounded-xl bg-white/50 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 dark:bg-white/10" />
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                                    >
                                        <span className="relative z-10">
                                            Register
                                        </span>
                                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-violet-700 via-blue-700 to-cyan-700 opacity-0 transition-opacity group-hover:opacity-100" />
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>

                {/* Main content */}
                <main className="relative z-10 mx-auto max-w-6xl px-6 text-center">
                    {/* Logo/Icon */}
                    <div className="mb-8 flex justify-center">
                        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 shadow-lg">
                            <GraduationCap className="h-12 w-12 text-white" />
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 lg:text-6xl dark:text-white">
                        School Management
                        <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                            Made Simple
                        </span>
                    </h1> 

                    {/* Feature cards */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="group rounded-xl border border-gray-200 bg-white/80 p-6 backdrop-blur-sm transition-all hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/80 dark:hover:border-blue-600">
                            <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                Course Management
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Organize and track courses, curricula, and
                                learning materials
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white/80 p-6 backdrop-blur-sm transition-all hover:border-indigo-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/80 dark:hover:border-indigo-600">
                            <div className="mb-4 inline-flex rounded-lg bg-indigo-100 p-3 dark:bg-indigo-900/30">
                                <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                Student Portal
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Comprehensive student information and progress
                                tracking
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white/80 p-6 backdrop-blur-sm transition-all hover:border-purple-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/80 dark:hover:border-purple-600">
                            <div className="mb-4 inline-flex rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
                                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                Attendance System
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Real-time attendance tracking and reporting
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white/80 p-6 backdrop-blur-sm transition-all hover:border-pink-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/80 dark:hover:border-pink-600">
                            <div className="mb-4 inline-flex rounded-lg bg-pink-100 p-3 dark:bg-pink-900/30">
                                <GraduationCap className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                            </div>
                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                Grade Management
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Efficient grading and academic performance
                                analysis
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
