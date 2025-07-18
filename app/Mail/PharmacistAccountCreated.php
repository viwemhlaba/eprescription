<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PharmacistAccountCreated extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public string $pharmacistName;
    public string $pharmacistEmail;
    public string $password;
    public string $loginUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(string $pharmacistName, string $pharmacistEmail, string $password, string $loginUrl)
    {
        $this->pharmacistName = $pharmacistName;
        $this->pharmacistEmail = $pharmacistEmail;
        $this->password = $password;
        $this->loginUrl = $loginUrl;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Pharmacist Account Has Been Created',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.pharmacist-account-created',
            with: [
                'name' => $this->pharmacistName,
                'email' => $this->pharmacistEmail,
                'password' => $this->password,
                'loginUrl' => $this->loginUrl,
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