import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

interface Doctor {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    practice_number: string;
    created_at: string;
}

interface Props {
    doctors: Doctor[];
}

export default function DoctorsIndex({ doctors }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDoctors = doctors.filter(
        (doctor) =>
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.practice_number.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleDelete = (doctorId: number) => {
        if (confirm('Are you sure you want to delete this doctor?')) {
            router.delete(route('manager.doctors.destroy', doctorId));
        }
    };

    return (
        <AppLayout>
            <Head title="Manage Doctors" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading title="Manage Doctors" description="Manage doctor records and information." />
                    <Link href={route('manager.doctors.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Doctor
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Doctors</CardTitle>
                        <div className="flex items-center space-x-2">
                            <div className="relative max-w-sm flex-1">
                                <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                                <Input
                                    placeholder="Search doctors..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Surname</TableHead>
                                        <TableHead>Practice Number</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDoctors.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-muted-foreground py-8 text-center">
                                                {searchTerm ? 'No doctors found matching your search.' : 'No doctors found.'}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredDoctors.map((doctor) => (
                                            <TableRow key={doctor.id}>
                                                <TableCell className="font-medium">{doctor.name}</TableCell>
                                                <TableCell>{doctor.surname}</TableCell>
                                                <TableCell>{doctor.practice_number}</TableCell>
                                                <TableCell>{doctor.email}</TableCell>
                                                <TableCell>{doctor.phone}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Link href={route('manager.doctors.edit', doctor.id)}>
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(doctor.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
