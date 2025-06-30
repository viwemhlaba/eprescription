import { useState } from 'react';

export default function Edit({ medication, dosageForms = [], suppliers = [], activeIngredients = [] }) {
    const [form, setForm] = useState({
        ...medication,
        active_ingredients: medication.active_ingredients || [{ id: '', strength: '' }],
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleIngredientChange = (idx, field, value) => {
        const updated = [...form.active_ingredients];
        updated[idx][field] = value;
        setForm({ ...form, active_ingredients: updated });
    };

    const addIngredient = () => {
        setForm({ ...form, active_ingredients: [...form.active_ingredients, { id: '', strength: '' }] });
    };

    const removeIngredient = (idx) => {
        setForm({ ...form, active_ingredients: form.active_ingredients.filter((_, i) => i !== idx) });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.put(route('medications.update', medication.id), form);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Edit Medication</h1>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
            <select name="dosage_form_id" value={form.dosage_form_id} onChange={handleChange} required>
                <option value="">Select Dosage Form</option>
                {dosageForms.map((df) => (
                    <option key={df.id} value={df.id}>
                        {df.name}
                    </option>
                ))}
            </select>
            <input name="schedule" type="number" min="0" max="6" value={form.schedule} onChange={handleChange} placeholder="Schedule" required />
            <input
                name="current_sale_price"
                type="number"
                step="0.01"
                value={form.current_sale_price}
                onChange={handleChange}
                placeholder="Sale Price"
                required
            />
            <select name="supplier_id" value={form.supplier_id} onChange={handleChange} required>
                <option value="">Select Supplier</option>
                {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                        {s.name}
                    </option>
                ))}
            </select>
            <input name="reorder_level" type="number" value={form.reorder_level} onChange={handleChange} placeholder="Reorder Level" required />
            <input
                name="quantity_on_hand"
                type="number"
                value={form.quantity_on_hand}
                onChange={handleChange}
                placeholder="Quantity On Hand"
                required
            />
            <h3>Ingredients</h3>
            {form.active_ingredients.map((ingredient, idx) => (
                <div key={idx}>
                    <select value={ingredient.id} onChange={(e) => handleIngredientChange(idx, 'id', e.target.value)} required>
                        <option value="">Select Ingredient</option>
                        {activeIngredients.map((ai) => (
                            <option key={ai.id} value={ai.id}>
                                {ai.name}
                            </option>
                        ))}
                    </select>
                    <input
                        value={ingredient.strength}
                        onChange={(e) => handleIngredientChange(idx, 'strength', e.target.value)}
                        placeholder="Strength (e.g. 500mg)"
                        required
                    />
                    {form.active_ingredients.length > 1 && (
                        <button type="button" onClick={() => removeIngredient(idx)}>
                            Remove
                        </button>
                    )}
                </div>
            ))}
            <button type="button" onClick={addIngredient}>
                Add Ingredient
            </button>
            <button type="submit">Update</button>
        </form>
    );
}
