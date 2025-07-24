import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, MoreHorizontal, Package, Plus } from 'lucide-react';
import { route } from 'ziggy-js';

interface StockOrder {
    id: number;
    order_number: string;
    supplier_name: string;
    status: 'pending' | 'completed' | 'Pending' | 'Received';
    total_items: number;
    created_at: string;
    received_at?: string;
}

const columns: ColumnDef<StockOrder>[] = [
    {
        accessorKey: 'order_number',
        header: 'Order Number',
        cell: ({ row }) => (
            <Link href={route('manager.orders.show', row.original.id)} className="text-primary font-medium hover:underline">
                {row.getValue('order_number')}
            </Link>
        ),
    },
    {
        accessorKey: 'supplier_name',
        header: 'Supplier',
    },
    {
        accessorKey: 'total_items',
        header: 'Total Items',
        cell: ({ row }) => <span className="font-medium">{row.getValue('total_items')}</span>,
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const normalizedStatus = status.toLowerCase();

            return (
                <Badge variant={normalizedStatus === 'received' || normalizedStatus === 'completed' ? 'default' : 'secondary'}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Order Date',
        cell: ({ row }) => new Date(row.getValue('created_at')).toLocaleDateString(),
    },
    {
        accessorKey: 'received_at',
        header: 'Received Date',
        cell: ({ row }) => {
            const receivedAt = row.getValue('received_at') as string;
            return receivedAt ? new Date(receivedAt).toLocaleDateString() : '-';
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const order = row.original;
            const isPending = order.status.toLowerCase() === 'pending';

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={route('manager.orders.show', order.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </Link>
                        </DropdownMenuItem>
                        {isPending && (
                            <DropdownMenuItem asChild>
                                <Link href={route('manager.orders.receive', order.id)} method="patch" as="button" className="w-full">
                                    <Package className="mr-2 h-4 w-4" />
                                    Mark as Received
                                </Link>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export default function Index({ orders }: PageProps<{ orders: { data: StockOrder[]; links: PaginationLink[] } }>) {
    return (
        <AppLayout>
            <Head title="Stock Orders" />

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Heading title="Stock Orders" description="Manage medication stock orders from suppliers" />
                        <Link href={route('manager.orders.create')}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Order
                            </Button>
                        </Link>
                    </div>
                    <Separator />

                    <DataTable columns={columns} data={orders.data} links={orders.links} />
                </div>
            </div>
        </AppLayout>
    );
}
