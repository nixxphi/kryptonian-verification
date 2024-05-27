import registrationService from '../services/registration.service.js';

class RegistrationController {
    async register(req, res) {
        const { email, password } = req.body;
        const result = await registrationService.register(email, password);
        res.json(result);
    }

    async confirmEmail(req, res) {
        const { token } = req.params;
        const result = await registrationService.confirmEmail(token);
        res.json(result);
    }
}

export default new RegistrationController();
