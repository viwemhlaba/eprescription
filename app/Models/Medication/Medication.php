<?php

namespace App\Models\Medication;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Customer\PrescriptionItem;
use App\Models\User;
use Database\Factories\MedicationFactory;

class Medication extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'medications';

    protected $fillable = [
        'name',
        'active_ingredient_id',
        'dosage_form_id',
        'schedule',
        'current_sale_price',
        'supplier_id',
        'reorder_level',
        'quantity_on_hand',
    ];


    protected static function newFactory()
    {
        return MedicationFactory::new();
    }

    public function dosageForm()
    {
        return $this->belongsTo(DosageForm::class );
    }

    public function activeIngredient()
    {
        return $this->belongsTo(ActiveIngredient::class);
    }

    public function prescriptionItems()
    {
        return $this->hasMany(PrescriptionItem::class);
    }

    public function activeIngredients()
    {
        return $this->belongsToMany(ActiveIngredient::class, 'active_ingredient_medication')
            ->withPivot('strength');
    }

    public function supplier()
    {
        return $this->belongsTo(\App\Models\MedicationSupplier::class, 'supplier_id');
    }

    public function stockOrderItems()
    {
        return $this->hasMany(\App\Models\StockOrderItem::class);
    }

    public function pendingOrderItems()
    {
        return $this->hasMany(\App\Models\StockOrderItem::class)
            ->whereHas('stockOrder', function ($query) {
                $query->where('status', 'Pending');
            });
    }

    public function addStock(int $amount)
    {
        $this->increment('quantity_on_hand', $amount);
    }

    public function setStock(int $amount)
    {
        $this->update(['quantity_on_hand' => $amount]);
    }

    /**
     * Check if this medication conflicts with a customer's allergies
     */
    public function hasAllergyConflictsWith(User $customer)
    {
        $medicationIngredients = $this->activeIngredients()->pluck('active_ingredients.id');
        
        return $customer->allergies()
            ->whereIn('active_ingredient_id', $medicationIngredients)
            ->exists();
    }

    /**
     * Get specific allergy conflicts for a customer
     */
    public function getAllergyConflictsWith(User $customer)
    {
        $medicationIngredients = $this->activeIngredients;
        $customerAllergies = $customer->getAllergicActiveIngredients;
        
        return $medicationIngredients->intersect($customerAllergies);
    }
}
