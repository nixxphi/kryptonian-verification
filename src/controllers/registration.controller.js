import registrationService from '../services/registration.service.js';

class RegistrationController {
    async register(req, res) {
        try {
            const { email, password } = req.body;
            const result = await registrationService.register(email, password);
            console.log("success");
            return res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async confirmEmail(req, res) {
        try {
            const { token } = req.params;
            const result = await registrationService.confirmEmail(token);
            return res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new RegistrationController();
