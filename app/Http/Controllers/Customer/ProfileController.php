<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Medication\ActiveIngredient; // Import the ActiveIngredient model
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use App\Http\Requests\Customer\StoreCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;

class ProfileController extends Controller
{
    /**
     * Show the profile creation form.
     */
    public function create()
    {
        // Check if a profile already exists for the authenticated user
        $existingProfile = Customer::where('user_id', Auth::id())->first();

        // If a profile exists, redirect to the show page with an info message
        if ($existingProfile) {
            return Redirect::route('customer.profile.show')->with('info', 'You already have a profile.');
        }

        // Fetch all active ingredients to pass to the frontend for allergy selection
        $activeIngredients = ActiveIngredient::select('id', 'name')->get();

        // Render the ProfileCreate Inertia component, passing the active ingredients
        return Inertia::render('Customer/ProfileCreate', [
            'activeIngredients' => $activeIngredients,
        ]);
    }

    /**
     * Store a newly created profile.
     */
    public function store(StoreCustomerRequest $request)
    {
        // Check again to prevent double creation in case of concurrent requests
        $existingProfile = Customer::where('user_id', Auth::id())->first();

        if ($existingProfile) {
            return Redirect::route('customer.profile.show')->with('error', 'Profile already exists.');
        }

        // Create a new customer profile record in the database
        Customer::create([
            'user_id' => Auth::id(), // Link the profile to the authenticated user
            // Use only the validated data from the request
            ...$request->only([
                'id_number',
                'cellphone_number',
                'allergies', // This field will store the selected allergy name or ID
                'state',
                'city',
                'street',
                'house_number',
                'postal_code',
            ])
        ]);

        // Redirect to the profile show page upon successful creation
        return Redirect::route('customer.profile.show')->with('success', 'Profile created successfully.');
    }

    /**
     * Display the current profile.
     */
    public function show()
    {
        // Find the customer profile associated with the authenticated user
        // Eager load related data like allergies if they are linked via a relationship
        $customer = Customer::where('user_id', Auth::id())->first(); // ->with('allergies')->first(); if you have a proper relationship

        // If no profile exists, redirect to the creation page
        if (!$customer) {
            return Redirect::route('customer.profile.create')->with('info', 'Please complete your profile.');
        }

        // Render the ProfileShow Inertia component, passing the customer profile data
        return Inertia::render('Customer/ProfileShow', ['customer' => $customer]);
    }

    /**
     * Show the form for editing the profile.
     */
    public function edit()
    {
        // Find the customer profile associated with the authenticated user
        // Fetch current active ingredients and potentially existing allergies of the customer
        $customer = Customer::where('user_id', Auth::id())->first(); // ->with('allergies')->first();

        // If no profile exists, redirect to the creation page
        if (!$customer) {
            return Redirect::route('customer.profile.create')->with('info', 'Please complete your profile first.');
        }

        // Fetch all active ingredients for the allergy selection dropdown
        $activeIngredients = ActiveIngredient::select('id', 'name')->get();

        // Render the ProfileEdit Inertia component, passing both customer data and active ingredients
        return Inertia::render('Customer/ProfileEdit', [
            'customer' => $customer,
            'activeIngredients' => $activeIngredients, // Pass active ingredients for edit form as well
        ]);
    }

    /**
     * Update the profile.
     */
    public function update(UpdateCustomerRequest $request)
    {
        // Find the customer profile or fail if not found (should exist here)
        $customer = Customer::where('user_id', Auth::id())->firstOrFail();

        // Update the customer profile with the validated data
        $customer->update($request->only([
            'id_number',
            'cellphone_number',
            'allergies', // This field will be updated
            'state',
            'city',
            'street',
            'house_number',
            'postal_code',
        ]));

        // Redirect to the profile show page upon successful update
        return Redirect::route('customer.profile.show')->with('success', 'Profile updated successfully.');
    }

    /**
     * Soft delete the profile.
     */
    public function destroy()
    {
        // Find the customer profile or fail if not found
        $customer = Customer::where('user_id', Auth::id())->firstOrFail();
        // Perform soft deletion
        $customer->delete();

        // Redirect to the general dashboard or a suitable page after deletion
        return Redirect::route('dashboard')->with('success', 'Profile deleted successfully.');
    }
}