<?php

namespace App\Mail;

use App\Models\Customer\Prescription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RepeatRejectedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $prescription;
    public $rejectionNote;

    public function __construct(Prescription $prescription, string $rejectionNote)
    {
        $this->prescription = $prescription->load(['user', 'doctor']);
        $this->rejectionNote = $rejectionNote;
    }

    public function build()
    {
        return $this->subject('Repeat Prescription Request Rejected')
            ->view('emails.repeat-rejected');
    }
}
