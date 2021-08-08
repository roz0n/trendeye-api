import { FeedbackReport } from "../models/feedback.model";

const db = require("../db");

export default class FeedbackController {
  POSITIVE = "positive";
  NEGATIVE = "negative";

  async saveFeedback(report: FeedbackReport) {
    try {
      const feedback = db.get("feedback");
      await feedback.insert({ data: report });
    } catch (error) {
      throw new Error("Failed to save feedback to database");
    }
  }
}
