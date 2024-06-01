import registrationService from '../services/registration.service.js';

class RegistrationController {
    async register(req, res) {
        const { email, password } = req.body;

        try {
            const result = await registrationService.register(email, password);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async confirmEmail(req, res) {
        const { token } = req.params;

        try {
            const result = await registrationService.confirmEmail(token);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new RegistrationController();
