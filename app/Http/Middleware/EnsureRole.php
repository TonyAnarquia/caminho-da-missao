<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * Handle an incoming request.
     *
     * @param  array<int, string>  $roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user || !$user->is_active) {
            abort(403);
        }

        if (!empty($roles) && !in_array($user->role, $roles, true)) {
            abort(403);
        }

        return $next($request);
    }
}
