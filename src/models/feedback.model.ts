import FeedbackController from "../controllers/feedback.controller";

type FeedbackReportTypes =
  | typeof FeedbackController.POSITIVE
  | typeof FeedbackController.NEGATIVE;

export class FeedbackReport {
  type: FeedbackReportTypes;
  image: string;
  classifiedIdentifiers: string;
  correctIdentifiers: string | null;
  date: string;
  deviceId: string;
  observationResult: string;

  constructor(
    type: string,
    image: string,
    classifiedIdentifiers: string,
    correctIdentifiers: string | null,
    date: string,
    deviceId: string,
    observationResult: string
  ) {
    this.type = type;
    this.image = image;
    this.classifiedIdentifiers = classifiedIdentifiers;
    this.correctIdentifiers = correctIdentifiers;
    this.date = date;
    this.deviceId = deviceId;
    this.observationResult = observationResult;
  }
}
