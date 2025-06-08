import React from 'react';
// Assuming you have Shadcn UI installed and configured for these components
import { Badge } from '@/components/ui/badge'; // Used for displaying allergy names nicely
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Define the type for a single customer allergy object received from the backend
interface CustomerAllergy {
    id: number;
    active_ingredient_id: number;
    active_ingredient_name: string; // The name of the active ingredient
}

// Define the props for the CustomerAllergyModal component
interface CustomerAllergyModalProps {
    isOpen: boolean; // Controls the visibility of the modal
    onClose: () => void; // Function to call when the modal should close
    allergies: CustomerAllergy[]; // Array of allergy objects to display
    customerName: string; // The name of the customer for display in the modal title
}

const CustomerAllergyModal: React.FC<CustomerAllergyModalProps> = ({ isOpen, onClose, allergies, customerName }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Allergies for {customerName}</DialogTitle>
                    <DialogDescription>Review the active ingredients this customer is known to be allergic to.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-4">
                    {allergies.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {allergies.map((allergy) => (
                                <Badge key={allergy.id} variant="destructive" className="text-md px-3 py-1">
                                    {allergy.active_ingredient_name}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No known allergies for this customer.</p>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CustomerAllergyModal;
