<?php

namespace App\Notifications;

use App\Models\Teacher;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TeacherRegistered extends Notification
{
    use Queueable;
    protected $teacher;
    
    public function __construct($teacher)
    {
        $this->teacher = $teacher;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Welcome to School Management System')
            ->greeting('Hello ' . $this->teacher->name)
            ->line('Your account has been successfully created.')
            ->line('You can now log in and start managing your classes.')
            ->action('Login Now', url('/login'))
            ->line('Thank you for joining us!');
    }
    
    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Account Created',
            'message' => 'Your teacher account has been successfully created.',
            'teacher_id' => $this->teacher->id,
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
