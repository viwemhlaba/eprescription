import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface RepeatRequest {
    id: number;
    prescription_name: string;
    customer_name: string;
    customer_surname: string;
    patient_id_number: string;
    doctor_name: string;
    request_date: string;
    repeats_used: number;
    repeats_total: number;
    next_repeat_date: string | null;
    delivery_method: string;
}

export default function Repeats() {
    const [repeats, setRepeats] = useState<RepeatRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedRepeat, setSelectedRepeat] = useState<RepeatRequest | null>(null);
    const [rejectionNote, setRejectionNote] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchRepeats = async () => {
            try {
                const response = await fetch('/api/pharmacist/requested-repeats', {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'same-origin',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                // Handle the API response structure: { success: true, data: [...] }
                if (result.success && result.data) {
                    setRepeats(result.data);
                } else {
                    setRepeats([]);
                }
            } catch (err) {
                console.error('Error fetching repeats:', err);
                setError(err instanceof Error ? err.message : 'Failed to load repeats');
            } finally {
                setLoading(false);
            }
        };

        fetchRepeats();
    }, []);

    const handleAction = async (repeatId: number, action: 'dispense' | 'reject') => {
        if (action === 'reject') {
            const repeat = repeats.find((r) => r.id === repeatId);
            if (repeat) {
                setSelectedRepeat(repeat);
                setRejectModalOpen(true);
            }
            return;
        }

        setProcessing(true);
        try {
            // Get CSRF token from meta tag
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch(`/api/pharmacist/repeats/${repeatId}/dispense`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                if (result.redirect_url) {
                    // Redirect to dispense page
                    window.location.href = result.redirect_url;
                } else {
                    // Remove from list and show success message
                    setRepeats((prev) => prev.filter((r) => r.id !== repeatId));
                    toast.success(result.message);
                }
            } else {
                toast.error(result.message || 'Action failed');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Network error occurred. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const handleRejectConfirm = async () => {
        if (!selectedRepeat || !rejectionNote.trim()) {
            toast.error('Please provide a rejection note');
            return;
        }

        setProcessing(true);
        try {
            // Get CSRF token from meta tag
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch(`/api/pharmacist/repeats/${selectedRepeat.id}/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    note: rejectionNote,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setRepeats((prev) => prev.filter((r) => r.id !== selectedRepeat.id));
                toast.success(result.message || 'Repeat request rejected successfully');
                setRejectModalOpen(false);
                setSelectedRepeat(null);
                setRejectionNote('');
            } else {
                toast.error(result.message || 'Rejection failed');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Network error occurred. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AppLayout>
            <Head title="Requested Repeats" />

            <div className="mx-auto max-w-6xl p-4">
                <div className="mb-6">
                    <Heading title="Requested Repeats" description="Review, approve, or reject repeat medication requests from customers." />
                </div>

                {loading ? (
                    <Card>
                        <CardContent className="flex items-center justify-center py-8">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 animate-spin" />
                                Loading repeat requests...
                            </div>
                        </CardContent>
                    </Card>
                ) : error ? (
                    <Card>
                        <CardContent className="flex items-center justify-center py-8">
                            <div className="flex items-center gap-2 text-red-600">
                                <XCircle className="h-4 w-4" />
                                {error}
                            </div>
                        </CardContent>
                    </Card>
                ) : repeats.length === 0 ? (
                    <Card>
                        <CardContent className="flex items-center justify-center py-8">
                            <div className="text-muted-foreground flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                No repeat requests at this time.
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Repeat Requests</CardTitle>
                            <CardDescription>Review each request carefully before approving or rejecting.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Prescription</TableHead>
                                            <TableHead>Doctor</TableHead>
                                            <TableHead>Requested On</TableHead>
                                            <TableHead>Repeats</TableHead>
                                            <TableHead>Next Due</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {repeats.map((repeat) => (
                                            <TableRow key={repeat.id}>
                                                <TableCell>
                                                    <div className="font-medium">
                                                        {repeat.customer_name} {repeat.customer_surname}
                                                    </div>
                                                    <div className="text-muted-foreground text-sm">ID: {repeat.patient_id_number}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{repeat.prescription_name}</div>
                                                    <div className="text-muted-foreground text-sm">
                                                        {repeat.delivery_method === 'pickup' ? 'Pick up' : 'Dispense'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{repeat.doctor_name}</TableCell>
                                                <TableCell>{new Date(repeat.request_date).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {repeat.repeats_used}/{repeat.repeats_total}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {repeat.next_repeat_date ? (
                                                        <span className="text-sm">{new Date(repeat.next_repeat_date).toLocaleDateString()}</span>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">N/A</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleAction(repeat.id, 'dispense')}
                                                            disabled={processing}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            <CheckCircle className="mr-1 h-4 w-4" />
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleAction(repeat.id, 'reject')}
                                                            disabled={processing}
                                                        >
                                                            <XCircle className="mr-1 h-4 w-4" />
                                                            Reject
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="mt-6">
                    <CardContent className="pt-6">
                        <div className="text-muted-foreground text-sm">
                            <strong>Guidelines:</strong> Reject requests if the customer is requesting too soon after their last dispense, if there
                            are medical concerns, or if documentation is incomplete. Always provide a clear reason for rejection.
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Rejection Modal */}
            <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Repeat Request</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this repeat request. This will be communicated to the customer.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedRepeat && (
                        <div className="bg-muted my-4 rounded-lg p-4">
                            <div className="text-sm">
                                <strong>Customer:</strong> {selectedRepeat.customer_name} {selectedRepeat.customer_surname}
                                <br />
                                <strong>Prescription:</strong> {selectedRepeat.prescription_name}
                                <br />
                                <strong>Requested:</strong> {new Date(selectedRepeat.request_date).toLocaleDateString()}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="rejection-note">Rejection Reason *</Label>
                        <Textarea
                            id="rejection-note"
                            placeholder="Please explain why this repeat request is being rejected..."
                            value={rejectionNote}
                            onChange={(e) => setRejectionNote(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setRejectModalOpen(false);
                                setSelectedRepeat(null);
                                setRejectionNote('');
                            }}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleRejectConfirm} disabled={processing || !rejectionNote.trim()}>
                            {processing ? 'Rejecting...' : 'Confirm Rejection'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
