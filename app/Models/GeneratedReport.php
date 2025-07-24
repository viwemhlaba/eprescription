<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class GeneratedReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'report_type',
        'title',
        'parameters',
        'file_path',
        'original_filename',
        'file_size',
        'generated_at',
        'expires_at',
        'download_count',
    ];

    protected $casts = [
        'parameters' => 'array',
        'generated_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function incrementDownloadCount(): void
    {
        $this->increment('download_count');
    }

    public function getFileExists(): bool
    {
        // Check local disk first (for stock reports), then public disk (for pharmacist reports)
        return Storage::disk('local')->exists($this->file_path) || Storage::disk('public')->exists($this->file_path);
    }

    public function getFormattedFileSize(): string
    {
        if (!$this->file_size) {
            return 'Unknown size';
        }

        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at < now();
    }
}
