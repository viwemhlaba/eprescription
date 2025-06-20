import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import React from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

interface AddSupplierModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddSupplierModal({ open, onClose, onSuccess }: AddSupplierModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        contact_person: '',
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('manager.suppliers.store'), {
            onSuccess: () => {
                toast.success('Supplier added!');
                reset();
                onSuccess();
                onClose();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Supplier</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Supplier Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required autoFocus />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                        <Label htmlFor="contact_person">Contact Person</Label>
                        <Input id="contact_person" value={data.contact_person} onChange={(e) => setData('contact_person', e.target.value)} required />
                        {errors.contact_person && <p className="text-sm text-red-500">{errors.contact_person}</p>}
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Adding...' : 'Add Supplier'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
