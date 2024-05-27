import loginService from '../services/loginService';

class LoginController {
    async login(req, res) {
        const { email } = req.body;
        const result = await loginService.login(email);
        res.json(result);
    }

    async verifyOtp(req, res) {
        const { email, otp } = req.body;
        const result = await loginService.verifyOtp(email, otp);
        res.json(result);
    }
}

export default new LoginController();
