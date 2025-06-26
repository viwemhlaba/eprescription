import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface SetStockModalProps {
    medicationId: number;
    currentQuantity: number;
}

const SetStockModal: React.FC<SetStockModalProps> = ({ medicationId, currentQuantity }) => {
    const [quantity, setQuantity] = useState(currentQuantity);
    const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setQuantity(currentQuantity);
    }, [currentQuantity]);

    const handleSubmit = () => {
        if (quantity < 0) {
            setError('Quantity cannot be negative.');
            return;
        }
        router.patch(
            `/manager/medications/${medicationId}/set-stock`,
            { quantity },
            {
                onSuccess: () => {
                    setIsOpen(false);
                    setError('');
                    toast.success('Stock quantity set successfully.');
                },
                onError: (errors) => {
                    if (errors.quantity) {
                        setError(errors.quantity);
                    } else {
                        toast.error('Failed to set stock.');
                    }
                },
            },
        );
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setQuantity(currentQuantity);
            setError('');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>Set Quantity</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set Stock Quantity</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quantity" className="text-right">
                            Quantity
                        </Label>
                        <Input
                            id="quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
                            className="col-span-3"
                        />
                    </div>
                    {error && <p className="col-span-4 text-right text-sm text-red-500">{error}</p>}
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleSubmit}>Set</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SetStockModal;
