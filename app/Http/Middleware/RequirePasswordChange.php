<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RequirePasswordChange
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Skip for password change routes to avoid infinite redirect
        if ($request->routeIs('password.*') || $request->routeIs('settings.password')) {
            return $next($request);
        }

        // Check if user needs to change password (password_changed_at is null)
        if ($user && is_null($user->password_changed_at)) {
            // For customers who need to change their password on first login
            if ($user->role === 'customer') {
                return redirect()->route('settings.password')
                    ->with('warning', 'You must change your password before continuing.');
            }
        }

        return $next($request);
    }
}
