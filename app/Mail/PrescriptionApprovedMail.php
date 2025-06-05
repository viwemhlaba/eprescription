<?php

namespace App\Mail;

use App\Models\Customer\Prescription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PrescriptionApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $prescription;

    public function __construct(Prescription $prescription)
    {
        $this->prescription = $prescription;
    }

    public function build()
    {
        return $this->subject('Your Prescription Has Been Approved')
            ->view('emails.prescription-approved');
    }
}

