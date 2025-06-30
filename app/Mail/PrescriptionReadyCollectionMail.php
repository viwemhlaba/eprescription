<?php

namespace App\Mail;

use App\Models\Customer\Prescription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PrescriptionReadyCollectionMail extends Mailable
{
    use Queueable, SerializesModels;

    public $prescription;

    public function __construct(Prescription $prescription)
    {
        $this->prescription = $prescription->load('items');
    }

    public function build()
    {
        return $this->subject('Your Prescription is Ready for Collection')
            ->view('emails.prescription-ready-collection');
    }
}
