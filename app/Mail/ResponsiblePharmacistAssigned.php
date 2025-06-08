<?php

namespace App\Mail;

use App\Models\Pharmacy;
use App\Models\User; // To type-hint the pharmacist user
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResponsiblePharmacistAssigned extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The pharmacy instance.
     */
    public Pharmacy $pharmacy;

    /**
     * The responsible pharmacist user instance.
     */
    public User $pharmacist;

    /**
     * Create a new message instance.
     */
    public function __construct(Pharmacy $pharmacy, User $pharmacist)
    {
        $this->pharmacy = $pharmacy;
        $this->pharmacist = $pharmacist;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'You have been assigned as a Responsible Pharmacist',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.responsible-pharmacist-assigned', // We'll create this Blade markdown view
            with: [
                'pharmacyName' => $this->pharmacy->name,
                'pharmacistName' => $this->pharmacist->name,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}