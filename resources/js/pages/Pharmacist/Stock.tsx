import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { AlertTriangle, Package, TrendingDown, TrendingUp } from 'lucide-react';

interface StockData {
    total_medications: number;
    low_stock_count: number;
    out_of_stock_count: number;
    total_stock_value: number;
    dispensed_today: number;
    pending_prescriptions: number;
    dispensed_value_month: number;
    critical_stock_count: number;
    expired_medications_count: number;
    top_dispensed_medications: Array<{
        medication: {
            id: number;
            name: string;
        };
        total_dispensed: number;
    }>;
}

interface StockProps {
    stockData: StockData;
}

const Stock = ({ stockData }: StockProps) => {
    return (
        <AppLayout>
            <Head title="Stock Management" />
            <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Stock Management</h1>
                        <p className="text-sm text-white">Monitor and manage your pharmacy inventory</p>
                    </div>
                </div>

                {/* Stock Overview Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <Card>
                        <CardHeader className="text-center">
                            <Package className="mx-auto mb-2 h-7 w-7 text-white" />
                            <CardTitle className="text-base font-semibold text-white">Total Medications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center text-3xl font-semibold text-white">{stockData.total_medications.toLocaleString()}</div>
                            <p className="mt-1 text-center text-sm text-white">Different medications in stock</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="text-center">
                            <AlertTriangle className="mx-auto mb-2 h-7 w-7 text-white" />
                            <CardTitle className="text-base font-semibold text-white">Low Stock Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center text-3xl font-semibold text-white">{stockData.low_stock_count}</div>
                            <p className="mt-1 text-center text-sm text-white">Items below reorder level</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="text-center">
                            <TrendingDown className="mx-auto mb-2 h-7 w-7 text-white" />
                            <CardTitle className="text-base font-semibold text-white">Out of Stock</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center text-3xl font-semibold text-white">{stockData.out_of_stock_count}</div>
                            <p className="mt-1 text-center text-sm text-white">Items need restocking</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="text-center">
                            <TrendingUp className="mx-auto mb-2 h-7 w-7 text-white" />
                            <CardTitle className="text-base font-semibold text-white">Total Stock Value</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center text-3xl font-semibold text-white">R {stockData.total_stock_value.toLocaleString()}</div>
                            <p className="mt-1 text-center text-sm text-white">Total inventory value</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="text-center">
                            <Package className="mx-auto mb-2 h-7 w-7 text-white" />
                            <CardTitle className="text-base font-semibold text-white">Dispensed Today</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center text-3xl font-semibold text-white">{stockData.dispensed_today}</div>
                            <p className="mt-1 text-center text-sm text-white">Items dispensed today</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="text-center">
                            <AlertTriangle className="mx-auto mb-2 h-7 w-7 text-white" />
                            <CardTitle className="text-base font-semibold text-white">Pending Prescriptions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center text-3xl font-semibold text-white">{stockData.pending_prescriptions}</div>
                            <p className="mt-1 text-center text-sm text-white">Awaiting approval</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="text-center">
                            <TrendingUp className="mx-auto mb-2 h-7 w-7 text-white" />
                            <CardTitle className="text-base font-semibold text-white">Month Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center text-3xl font-semibold text-white">R {stockData.dispensed_value_month.toLocaleString()}</div>
                            <p className="mt-1 text-center text-sm text-white">This month's sales</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="text-center">
                            <AlertTriangle className="mx-auto mb-2 h-7 w-7 text-white" />
                            <CardTitle className="text-base font-semibold text-white">Critical Stock</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center text-3xl font-semibold text-white">{stockData.critical_stock_count}</div>
                            <p className="mt-1 text-center text-sm text-white">Less than 5 units</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default Stock;
