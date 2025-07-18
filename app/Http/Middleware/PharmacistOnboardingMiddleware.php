<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\PharmacistProfile;

class PharmacistOnboardingMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        
        // Only apply to authenticated pharmacists
        if ($user && $user->role === 'pharmacist') {
            $profile = PharmacistProfile::where('user_id', $user->id)->first();
            
            // If profile doesn't exist or is not completed, redirect to profile edit
            if (!$profile || !$profile->profile_completed) {
                // Allow access to profile edit routes and logout
                $allowedRoutes = [
                    'pharmacist.profile.edit',
                    'pharmacist.profile.update',
                    'pharmacist.profile.update.post',
                    'logout'
                ];
                
                if (!in_array($request->route()->getName(), $allowedRoutes)) {
                    return redirect()->route('pharmacist.profile.edit')
                        ->with('warning', 'Please complete your profile to continue.');
                }
            }
        }
        
        return $next($request);
    }
}
