import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface RepeatRequest {
    id: number;
    customer_name: string;
    medication_name: string;
    last_dispensed_date: string;
    requested_at: string;
    reason?: string;
}

export default function Repeats() {
    const [repeats, setRepeats] = useState<RepeatRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/pharmacist/requested-repeats')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to load repeats');
                return res.json();
            })
            .then((data) => {
                setRepeats(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleAction = (repeatId: number, action: 'dispense' | 'reject') => {
        router.post(
            `/pharmacist/repeats/${repeatId}/${action}`,
            {},
            {
                onSuccess: () => {
                    setRepeats((prev) => prev.filter((r) => r.id !== repeatId));
                },
            },
        );
    };

    return (
        <AppLayout>
            <div className="flex flex-col gap-6 p-4">
                <Heading title="Requested Repeats" description="Review, approve, or reject repeat medication requests from customers." />
                {loading ? (
                    <div className="text-white">Loading...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : repeats.length === 0 ? (
                    <div className="text-white">No repeat requests at this time.</div>
                ) : (
                    <div className="overflow-x-auto rounded-xl bg-zinc-900 p-4">
                        <table className="min-w-full text-white">
                            <thead>
                                <tr className="border-b border-zinc-700">
                                    <th className="px-4 py-2 text-left">Customer</th>
                                    <th className="px-4 py-2 text-left">Medication</th>
                                    <th className="px-4 py-2 text-left">Last Dispensed</th>
                                    <th className="px-4 py-2 text-left">Requested On</th>
                                    <th className="px-4 py-2 text-left">Reason</th>
                                    <th className="px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {repeats.map((repeat) => (
                                    <tr key={repeat.id} className="border-b border-zinc-800">
                                        <td className="px-4 py-2">{repeat.customer_name}</td>
                                        <td className="px-4 py-2">{repeat.medication_name}</td>
                                        <td className="px-4 py-2">{repeat.last_dispensed_date}</td>
                                        <td className="px-4 py-2">{repeat.requested_at}</td>
                                        <td className="px-4 py-2">{repeat.reason || '-'}</td>
                                        <td className="flex gap-2 px-4 py-2">
                                            <button
                                                className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
                                                onClick={() => handleAction(repeat.id, 'dispense')}
                                            >
                                                Dispense
                                            </button>
                                            <button
                                                className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                                                onClick={() => handleAction(repeat.id, 'reject')}
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="mt-4 max-w-2xl text-sm text-zinc-400">
                    <b>Why reject?</b> For example, if the customer is requesting a repeat too soon after their last dispense, or if there are medical
                    precautions. Always check the dates and prescription details before dispensing.
                </div>
            </div>
        </AppLayout>
    );
}
