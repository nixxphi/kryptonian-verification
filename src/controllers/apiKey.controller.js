import UserModel from "../models/user.model.js";
import ApiKeyService from "../services/apiKey.service.js";

class ApiKeyController {
  constructor(userModel) {
    this.userModel = UserModel;
    this.apiKeyService= ApiKeyService;
  }

  async generateApiKey(req, res) {
    const { email } = req.body;

    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      await ApiKeyService.generateApiKey();
      user.apiKey = apiKey;
      await user.save();

      return res.status(201).json({ apiKey });
    } catch (error) {
      console.error('Error generating API key:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async invalidateApiKey(req, res) {
    const { email } = req.body;

    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.apiKey = null;
      await user.save();

      return res.status(200).json({ message: 'API key invalidated successfully' });
    } catch (error) {
      console.error('Error invalidating API key:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

export default new ApiKeyController;
