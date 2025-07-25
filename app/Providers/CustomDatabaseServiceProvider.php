<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\SqlServerConnection;
use App\Database\Connectors\CustomSqlServerConnector;

class CustomDatabaseServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Replace the default sqlsrv connector with our custom one
        $this->app->bind('db.connector.sqlsrv', function () {
            return new CustomSqlServerConnector();
        });
    }
}
