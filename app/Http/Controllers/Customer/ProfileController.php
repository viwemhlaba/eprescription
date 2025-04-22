<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer;
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
        $existingProfile = Customer::where('user_id', Auth::id())->first();

        if ($existingProfile) {
            return Redirect::route('customer.profile.show')->with('info', 'You already have a profile.');
        }

        return Inertia::render('Customer/ProfileCreate');
    }

    /**
     * Store a newly created profile.
     */
    public function store(StoreCustomerRequest $request)
    {
        $existingProfile = Customer::where('user_id', Auth::id())->first();

        if ($existingProfile) {
            return Redirect::route('customer.profile.show')->with('error', 'Profile already exists.');
        }

        Customer::create([
            'user_id' => Auth::id(),
            ...$request->only([
                'id_number',
                'cellphone_number',
                'allergies',
                'state',
                'city',
                'street',
                'house_number',
                'postal_code',
            ])
        ]);

        return Redirect::route('customer.profile.show')->with('success', 'Profile created successfully.');
    }

    /**
     * Display the current profile.
     */
    public function show()
    {
        $customer = Customer::where('user_id', Auth::id())->first();

        if (!$customer) {
            return Redirect::route('customer.profile.create')->with('info', 'Please complete your profile.');
        }

        return Inertia::render('Customer/ProfileShow', ['customer' => $customer]);
    }

    /**
     * Show the form for editing the profile.
     */
    public function edit()
    {
        $customer = Customer::where('user_id', Auth::id())->first();

        if (!$customer) {
            return Redirect::route('customer.profile.create')->with('info', 'Please complete your profile first.');
        }

        return Inertia::render('Customer/ProfileEdit', ['customer' => $customer]);
    }

    /**
     * Update the profile.
     */
    public function update(UpdateCustomerRequest $request)
    {
        $customer = Customer::where('user_id', Auth::id())->firstOrFail();

        $customer->update($request->only([
            'id_number',
            'cellphone_number',
            'allergies',
            'state',
            'city',
            'street',
            'house_number',
            'postal_code',
        ]));

        return Redirect::route('customer.profile.show')->with('success', 'Profile updated successfully.');
    }

    /**
     * Soft delete the profile.
     */
    public function destroy()
    {
        $customer = Customer::where('user_id', Auth::id())->firstOrFail();
        $customer->delete();

        return Redirect::route('dashboard')->with('success', 'Profile deleted successfully.');
    }
}
