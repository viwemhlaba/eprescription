import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface AddStockModalProps {
    medicationId: number;
}

const AddStockModal: React.FC<AddStockModalProps> = ({ medicationId }) => {
    const [quantity, setQuantity] = useState(0);
    const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = () => {
        if (quantity <= 0) {
            setError('Quantity must be a positive number.');
            return;
        }
        router.patch(
            `/manager/medications/${medicationId}/add-stock`,
            { quantity },
            {
                onSuccess: () => {
                    setIsOpen(false);
                    setQuantity(0);
                    setError('');
                    toast.success('Stock quantity added successfully.');
                },
                onError: (errors) => {
                    if (errors.quantity) {
                        setError(errors.quantity);
                    } else {
                        toast.error('Failed to add stock.');
                    }
                },
            },
        );
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setQuantity(0);
            setError('');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>Add Quantity</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Stock Quantity</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quantity" className="text-right">
                            Quantity to Add
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
                    <Button onClick={handleSubmit}>Add</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddStockModal;
