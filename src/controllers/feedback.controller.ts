import { FeedbackReport } from "../models/feedback.model";

const db = require("../db");

export default class FeedbackController {
  static POSITIVE = "positive";
  static NEGATIVE = "negative";

  async savePositiveFeedback(report: FeedbackReport) {
    try {
      const feedback = db.get("feedback");
      await feedback.insert({ data: report });
    } catch (error) {
      console.log("Error", error);
      throw new Error("Failed to save positive feedback");
    }
  }

  async saveNegativeFeedback(report: FeedbackReport) {
    try {
      const feedback = db.get("feedback");
      await feedback.insert({ data: report });
    } catch (error) {
      console.log("Error", error);
      throw new Error("Failed to save negative feedback");
    }
  }
}
