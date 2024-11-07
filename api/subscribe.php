<?php
require_once '../config/database.php';
require_once '../vendor/autoload.php'; // For PHPMailer

use PHPMailer\PHPMailer\PHPMailer;

header('Content-Type: application/json');

class NewsletterManager {
    private $pdo;
    private $mailer;

    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->setupMailer();
    }

    private function setupMailer() {
        $this->mailer = new PHPMailer(true);
        // Configure your SMTP settings here
        $this->mailer->isSMTP();
        $this->mailer->Host = 'smtp.example.com';
        $this->mailer->SMTPAuth = true;
        $this->mailer->Username = 'your-email@example.com';
        $this->mailer->Password = 'your-password';
        $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $this->mailer->Port = 587;
    }

    public function subscribe($email) {
        try {
            // Check if email exists
            if ($this->emailExists($email)) {
                return [
                    'success' => false,
                    'message' => 'This email is already subscribed.'
                ];
            }

            // Generate confirmation token
            $token = bin2hex(random_bytes(32));
            
            // Add to database
            $stmt = $this->pdo->prepare(
                "INSERT INTO subscribers (email, confirmation_token, status) 
                 VALUES (?, ?, 'pending')"
            );
            $stmt->execute([$email, $token]);

            // Send confirmation email
            $this->sendConfirmationEmail($email, $token);

            return [
                'success' => true,
                'message' => 'Please check your email to confirm subscription.'
            ];

        } catch (Exception $e) {
            error_log($e->getMessage());
            return [
                'success' => false,
                'message' => 'An error occurred. Please try again.'
            ];
        }
    }

    private function emailExists($email) {
        $stmt = $this->pdo->prepare("SELECT id FROM subscribers WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->rowCount() > 0;
    }

    private function sendConfirmationEmail($email, $token) {
        $confirmUrl = "https://yourwebsite.com/confirm.php?token=" . $token;
        
        $this->mailer->setFrom('your@email.com', 'Your Name');
        $this->mailer->addAddress($email);
        $this->mailer->isHTML(true);
        $this->mailer->Subject = 'Confirm Your Subscription';
        $this->mailer->Body = $this->getConfirmationEmailTemplate($confirmUrl);
        
        $this->mailer->send();
    }

    private function getConfirmationEmailTemplate($confirmUrl) {
        return "
            <html>
            <body>
                <h2>Confirm Your Subscription</h2>
                <p>Thank you for subscribing to our newsletter!</p>
                <p>Please click the button below to confirm your subscription:</p>
                <p>
                    <a href='{$confirmUrl}' 
                       style='background: #9333EA; color: white; padding: 10px 20px; 
                              text-decoration: none; border-radius: 5px;'>
                        Confirm Subscription
                    </a>
                </p>
            </body>
            </html>
        ";
    }
}

// Handle the request
try {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email address');
    }

    $newsletter = new NewsletterManager($pdo);
    $result = $newsletter->subscribe($email);
    
    echo json_encode($result);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}