<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Pharmacist; // We still need this model
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\PharmacistAccountCreated;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class PharmacistController extends Controller
{
    /**
     * Display a listing of pharmacist users.
     */
    public function index()
    {
        // Load users with their associated pharmacist details
        $pharmacists = User::where('role', 'pharmacist')->with('pharmacist')->get();

        return Inertia::render('Manager/Pharmacists/Index', [
            'pharmacists' => $pharmacists,
        ]);
    }

    /**
     * Show the form for creating a new pharmacist.
     */
    public function create()
    {
        return Inertia::render('Manager/Pharmacists/Create');
    }

    /**
     * Store a newly created pharmacist in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            // These fields go into the new 'pharmacists' table
            'id_number' => 'required|string|max:20|unique:pharmacists,id_number',
            'cellphone_number' => 'required|string|max:20',
            'health_council_registration_number' => 'required|string|max:255|unique:pharmacists,health_council_registration_number',
        ]);

        DB::transaction(function () use ($validatedData) {
            $rawPassword = Str::random(12);

            // Create the User record (name, email, role, password)
            $user = User::create([
                'name' => $validatedData['name'],
                'surname' => $validatedData['surname'],
                'email' => $validatedData['email'],
                'password' => Hash::make($rawPassword),
                'role' => 'pharmacist',
                //'password_changed_at' => null,
            ]);

            // Create the Pharmacist record with specific details and link to user
            Pharmacist::create([
                'user_id' => $user->id,
                'id_number' => $validatedData['id_number'],
                'cellphone_number' => $validatedData['cellphone_number'],
                'health_council_registration_number' => $validatedData['health_council_registration_number'],
            ]);

            Mail::to($user->email)->send(
                new PharmacistAccountCreated(
                    $user->name,
                    $user->email,
                    $rawPassword,
                    route('login')
                )
            );
        });

        return redirect()->route('manager.pharmacists.index')->with('success', 'Pharmacist added successfully and email sent!');
    }

    /**
     * Show the form for editing the specified pharmacist.
     */
    public function edit(User $pharmacistUser)
    {
        if ($pharmacistUser->role !== 'pharmacist') {
            abort(404, 'User is not a pharmacist.');
        }

        // Eager load the associated pharmacist details
        $pharmacistUser->load('pharmacist');

        return Inertia::render('Manager/Pharmacists/Edit', [
            'pharmacist' => $pharmacistUser, // Pass the User model with its nested pharmacist details
        ]);
    }

    /**
     * Update the specified pharmacist in storage.
     */
    public function update(Request $request, User $pharmacistUser)
    {
        if ($pharmacistUser->role !== 'pharmacist') {
            abort(404, 'User is not a pharmacist.');
        }

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($pharmacistUser->id)],
            // Validation rules now target the 'pharmacists' table directly
            'id_number' => ['required', 'string', 'max:20', Rule::unique('pharmacists', 'id_number')->ignore($pharmacistUser->pharmacist->id)],
            'cellphone_number' => 'required|string|max:20',
            'health_council_registration_number' => ['required', 'string', 'max:255', Rule::unique('pharmacists', 'health_council_registration_number')->ignore($pharmacistUser->pharmacist->id)],
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        DB::transaction(function () use ($validatedData, $pharmacistUser) {
            // Update User details
            $userData = [
                'name' => $validatedData['name'],
                'surname' => $validatedData['surname'],
                'email' => $validatedData['email'],
            ];

            if (!empty($validatedData['password'])) {
                $userData['password'] = Hash::make($validatedData['password']);
                $userData['password_changed_at'] = now();
            }

            $pharmacistUser->update($userData);

            // Update Pharmacist details
            $pharmacistData = [
                'id_number' => $validatedData['id_number'],
                'cellphone_number' => $validatedData['cellphone_number'],
                'health_council_registration_number' => $validatedData['health_council_registration_number'],
            ];

            $pharmacistUser->pharmacist->update($pharmacistData);
        });

        return redirect()->route('manager.pharmacists.index')->with('success', 'Pharmacist details updated successfully!');
    }

    /**
     * Remove the specified pharmacist from storage.
     */
    public function destroy(User $pharmacistUser)
    {
        if ($pharmacistUser->role !== 'pharmacist') {
            abort(404, 'User is not a pharmacist.');
        }

        DB::transaction(function () use ($pharmacistUser) {
            // Explicitly soft delete the associated pharmacist record first
            if ($pharmacistUser->pharmacist) {
                $pharmacistUser->pharmacist->delete();
            }
            // Then soft delete the user record
            $pharmacistUser->delete();
        });

        return redirect()->route('manager.pharmacists.index')->with('success', 'Pharmacist deleted successfully!');
    }
}