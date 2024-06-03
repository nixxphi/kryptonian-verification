import registrationService from '../services/registration.service.js';
import { sendResponse } from '../utils/response.util.js';
class RegistrationController {
    async register(req, res) {
        const { email, password } = req.body;

        try {
            const result = await registrationService.register(email, password);
            return sendResponse(res, 201, true, result.message)
        } catch (e) {
            return sendResponse(res, 500, false, e.message)
        }
    }

    async confirmEmail(req, res) {
        const { token } = req.params;

        try {
            const result = await registrationService.confirmEmail(token);
            return sendResponse(res, 200, true, result.message)
        } catch (error) {
            return sendResponse(res, 500, false, e.message)
        }
    }
}

export default new RegistrationController();
