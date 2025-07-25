<?php

namespace App\Database\Connectors;

use Illuminate\Database\Connectors\SqlServerConnector as BaseSqlServerConnector;
use PDO;

class CustomSqlServerConnector extends BaseSqlServerConnector
{
    /**
     * The PDO connection options.
     * Removed PDO::ATTR_STRINGIFY_FETCHES as it's not supported in SQL Server PDO driver 5.11.0-beta1
     *
     * @var array
     */
    protected $options = [
        PDO::ATTR_CASE => PDO::CASE_NATURAL,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_ORACLE_NULLS => PDO::NULL_NATURAL,
    ];
}
