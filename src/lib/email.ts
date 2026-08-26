import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export async function sendVerificationEmail(email: string, token: string) {
    const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify?token=${token}`;

    if (process.env.EMAIL_MODE === 'stub') {
        console.log(`[STUB EMAIL] Verification link for ${email}: ${confirmLink}`);
        return { success: true, stub: true };
    }

    try {
        const data = await resend.emails.send({
            from: 'CodeQuest <noreply@cyber-univ.ac.id>',
            to: email,
            subject: 'Verify your CodeQuest account',
            html: `
                <div>
                    <h2>Welcome to CodeQuest!</h2>
                    <p>Please click the link below to verify your email address:</p>
                    <a href="${confirmLink}">Verify Email</a>
                </div>
            `
        });
        return { success: true, data };
    } catch (error) {
        console.error('Failed to send verification email', error);
        return { success: false, error };
    }
}
