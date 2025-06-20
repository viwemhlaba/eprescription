import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

export default function MedicationCreate({ dosageForms = [], suppliers = [], activeIngredients = [] }) {
    const { data, setData, post, processing, recentlySuccessful, errors } = useForm({
        name: '',
        dosage_form_id: '',
        schedule: '',
        current_sale_price: '',
        supplier_id: '',
        reorder_level: '',
        quantity_on_hand: '',
        active_ingredients: [{ id: '', strength: '' }],
    });

    useEffect(() => {
        if (recentlySuccessful) {
            toast.success('Medication added successfully!');
        }
    }, [recentlySuccessful]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData(e.target.name, e.target.value);
    };

    const handleIngredientChange = (idx: number, field: string, value: string) => {
        const updated = [...data.active_ingredients];
        updated[idx][field] = value;
        setData('active_ingredients', updated);
    };

    const addIngredient = () => {
        setData('active_ingredients', [...data.active_ingredients, { id: '', strength: '' }]);
    };

    const removeIngredient = (idx: number) => {
        setData(
            'active_ingredients',
            data.active_ingredients.filter((_: any, i: number) => i !== idx),
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('manager.medications.store'));
    };

    return (
        <AppLayout>
            <Head title="Add Medication" />
            <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
                <Heading title="Add New Medication" description="Enter details for a new medication." />
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Medication Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" value={data.name} onChange={handleChange} required />
                                {errors.name && <div className="mt-1 text-xs text-red-500">{errors.name}</div>}
                            </div>
                            <div>
                                <Label htmlFor="dosage_form_id">Dosage Form</Label>
                                <select
                                    id="dosage_form_id"
                                    name="dosage_form_id"
                                    value={data.dosage_form_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded border px-2 py-1"
                                >
                                    <option value="">Select Dosage Form</option>
                                    {dosageForms.map((df: any) => (
                                        <option key={df.id} value={df.id}>
                                            {df.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.dosage_form_id && <div className="mt-1 text-xs text-red-500">{errors.dosage_form_id}</div>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="schedule">Schedule</Label>
                                    <Input
                                        id="schedule"
                                        name="schedule"
                                        type="number"
                                        min="0"
                                        max="6"
                                        value={data.schedule}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.schedule && <div className="mt-1 text-xs text-red-500">{errors.schedule}</div>}
                                </div>
                                <div>
                                    <Label htmlFor="current_sale_price">Sale Price</Label>
                                    <Input
                                        id="current_sale_price"
                                        name="current_sale_price"
                                        type="number"
                                        step="0.01"
                                        value={data.current_sale_price}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.current_sale_price && <div className="mt-1 text-xs text-red-500">{errors.current_sale_price}</div>}
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="supplier_id">Supplier</Label>
                                <select
                                    id="supplier_id"
                                    name="supplier_id"
                                    value={data.supplier_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded border px-2 py-1"
                                >
                                    <option value="">Select Supplier</option>
                                    {suppliers.map((s: any) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.supplier_id && <div className="mt-1 text-xs text-red-500">{errors.supplier_id}</div>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="reorder_level">Reorder Level</Label>
                                    <Input
                                        id="reorder_level"
                                        name="reorder_level"
                                        type="number"
                                        value={data.reorder_level}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.reorder_level && <div className="mt-1 text-xs text-red-500">{errors.reorder_level}</div>}
                                </div>
                                <div>
                                    <Label htmlFor="quantity_on_hand">Quantity On Hand</Label>
                                    <Input
                                        id="quantity_on_hand"
                                        name="quantity_on_hand"
                                        type="number"
                                        value={data.quantity_on_hand}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.quantity_on_hand && <div className="mt-1 text-xs text-red-500">{errors.quantity_on_hand}</div>}
                                </div>
                            </div>
                            <div>
                                <Label>Ingredients</Label>
                                {data.active_ingredients.map((ingredient: any, idx: number) => (
                                    <div key={idx} className="mb-2 flex items-center space-x-2">
                                        <select
                                            value={ingredient.id}
                                            onChange={(e) => handleIngredientChange(idx, 'id', e.target.value)}
                                            required
                                            className="rounded border px-2 py-1"
                                        >
                                            <option value="">Select Ingredient</option>
                                            {activeIngredients.map((ai: any) => (
                                                <option key={ai.id} value={ai.id}>
                                                    {ai.name}
                                                </option>
                                            ))}
                                        </select>
                                        <Input
                                            value={ingredient.strength}
                                            onChange={(e) => handleIngredientChange(idx, 'strength', e.target.value)}
                                            placeholder="Strength (e.g. 500mg)"
                                            required
                                        />
                                        {data.active_ingredients.length > 1 && (
                                            <Button type="button" variant="destructive" onClick={() => removeIngredient(idx)} size="icon">
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button type="button" onClick={addIngredient} variant="secondary">
                                    Add Ingredient
                                </Button>
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Save
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
