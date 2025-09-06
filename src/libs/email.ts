import nodemailer from 'nodemailer';

// Create a transporter for sending emails
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail', // You can change this to your preferred email service
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS, // Your email password or app password
        },
    });
};

// Generate a 6-digit OTP
export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Email - Roamio',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Roamio!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your travel adventure starts here</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Email Verification</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Thank you for signing up! To complete your registration, please verify your email address using the OTP below:
            </p>
            
            <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
              <h3 style="color: #667eea; margin: 0; font-size: 32px; letter-spacing: 5px; font-weight: bold;">${otp}</h3>
            </div>
            
            <p style="color: #666; font-size: 14px; margin: 20px 0;">
              <strong>Important:</strong> This OTP will expire in 10 minutes. If you didn't request this verification, please ignore this email.
            </p>
            
            <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="color: #1976d2; margin: 0; font-size: 14px;">
                <strong>Security Tip:</strong> Never share this OTP with anyone. Roamio will never ask for your verification code.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>© 2024 Roamio. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
};

// Send welcome email after successful verification
export const sendWelcomeEmail = async (email: string, fullname: string): Promise<boolean> => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Roamio - Your Account is Verified!',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Roamio, ${fullname}!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your email has been successfully verified</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin: 0 0 20px 0;">🎉 Account Verified Successfully!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Great news! Your email address has been verified and your Roamio account is now fully active. 
              You can now enjoy all the features of our travel platform.
            </p>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e0e0e0;">
              <h3 style="color: #333; margin: 0 0 15px 0;">What's Next?</h3>
              <ul style="color: #666; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Complete your profile to get personalized recommendations</li>
                <li>Explore amazing destinations around the world</li>
                <li>Create and share your travel experiences</li>
                <li>Connect with fellow travelers in our community</li>
                <li>Book your next adventure with ease</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold;
                        display: inline-block;">
                Start Exploring
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>© 2024 Roamio. All rights reserved.</p>
            <p>Happy travels! 🌍✈️</p>
          </div>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return false;
    }
};
