import loginService from '../services/login.service.js';

class LoginController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await loginService.login(email, password);
            console.log("success")
            return res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async verifyOtp(req, res) {
        try {
            const { email, otp } = req.body;
            const result = await loginService.verifyOtp(email, otp);
            return res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new LoginController();
