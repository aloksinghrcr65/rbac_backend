const Role = require('../models/Role');
const generateEmailTemplate = async (name, email, password, role) => {
    const { roleName } = await Role.findOne({ value: role });
    
    return `
    <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px;">
        <div style="text-align: center; background: #007bff; color: white; padding: 10px; border-radius: 10px 10px 0 0;">
            <h2>Welcome to Makeup-Pro! 🎉</h2>
        </div>

        <div style="padding: 20px;">
            <p>Dear <strong>${name}</strong>,</p>
            <p>We’re excited to have you on board! Below are your login credentials:</p>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
                <p><strong>Role:</strong> ${roleName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Temporary Password:</strong> <span style="color: #d9534f;">${password}</span></p>
            </div>

            <p>Please log in and change your password immediately for security reasons.</p>

            <p style="text-align: center; margin-top: 20px;">
                <a href="https://makeup-pro.com/login" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a>
            </p>

            <p>If you didn’t request this, please ignore this email or contact support.</p>

            <p>Best Regards,<br> <strong>Makeup-Pro Team</strong></p>
        </div>
    </div>`;
};


module.exports = generateEmailTemplate;