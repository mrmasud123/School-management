import AppLayout from '@/layouts/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    DollarSign,
    FileText,
    Wallet,
    AlertCircle,
    Plus
} from "lucide-react"

export default function Accountants() {
    return (
        <AppLayout breadcrumbs={[{ title: "Accountants", href: "/accountants" }]}>
            <div className="p-8 space-y-8">

                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Accountant Dashboard</h1>
                    <div className="flex gap-2">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Collect Fee
                        </Button>
                        <Button variant="outline">
                            Add Expense
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Today's Collection"
                        amount="₹12,500"
                        icon={<DollarSign className="h-5 w-5" />}
                    />
                    <StatCard
                        title="This Month Income"
                        amount="₹1,25,000"
                        icon={<Wallet className="h-5 w-5" />}
                    />
                    <StatCard
                        title="Pending Invoices"
                        amount="18"
                        icon={<AlertCircle className="h-5 w-5" />}
                    />
                    <StatCard
                        title="Total Expenses"
                        amount="₹45,000"
                        icon={<FileText className="h-5 w-5" />}
                    />
                </div>

                {/* Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Recent Payments */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Payments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 text-left">Student</th>
                                        <th className="text-left">Amount</th>
                                        <th className="text-left">Method</th>
                                        <th className="text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <TableRow
                                        name="John Doe"
                                        amount="₹2,000"
                                        method="Cash"
                                        date="Today"
                                    />
                                    <TableRow
                                        name="Jane Smith"
                                        amount="₹3,500"
                                        method="Bank"
                                        date="Yesterday"
                                    />
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                    {/* Recent Expenses */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Expenses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 text-left">Category</th>
                                        <th className="text-left">Amount</th>
                                        <th className="text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <TableRow
                                        name="Electricity"
                                        amount="₹5,000"
                                        date="Today"
                                    />
                                    <TableRow
                                        name="Maintenance"
                                        amount="₹2,000"
                                        date="Yesterday"
                                    />
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                </div>

            </div>
        </AppLayout>
    )
}

/* 🔹 Reusable Components */

function StatCard({ title, amount, icon }) {
    return (
        <Card>
            <CardContent className="flex items-center justify-between p-6">
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold mt-1">{amount}</p>
                </div>
                <div className="p-3 bg-muted rounded-full">
                    {icon}
                </div>
            </CardContent>
        </Card>
    )
}

function TableRow({ name, amount, method, date }) {
    return (
        <tr className="border-b last:border-0">
            <td className="py-2">{name}</td>
            <td>{amount}</td>
            {method && <td>{method}</td>}
            <td className="text-right text-muted-foreground">{date}</td>
        </tr>
    )
}
