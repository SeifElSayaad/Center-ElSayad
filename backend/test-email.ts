import { sendOtpEmail } from './src/utils/email';
import dotenv from 'dotenv';
dotenv.config();

async function testEmail() {
  try {
    console.log('Using API Key:', process.env.EMAIL_API_KEY ? 'Set' : 'Not Set');
    await sendOtpEmail('seif199093@gmail.com', '123456');
    console.log('Success!');
  } catch (err: any) {
    console.error('Test Failed:', err.message);
  }
}

testEmail();
