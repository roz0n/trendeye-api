const db = require("../db");

export default class FeedbackController {
  async savePositiveFeedback() {
    try {
      const feedback = db.get("feedback");
      await feedback.insert({ data: { test: true } });
    } catch (error) {
      console.log("Error", error);
      throw new Error("Failed to save positive feedback");
    }
  }

  async saveNegativeFeedback() {
    try {
    } catch (error) {}
  }
}
