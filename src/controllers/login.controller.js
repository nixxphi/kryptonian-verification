import loginService from '../services/login.service.js';

class LoginController {
    async login(req, res) {
        try {
            const { email } = req.body;
            const result = await loginService.login(email);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async verifyOtp(req, res) {
        try {
            const { email, otp } = req.body;
            const result = await loginService.verifyOtp(email, otp);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new LoginController();
