type FeedbackReportTypes = "positive" | "negative";

export class FeedbackReport {
  type: FeedbackReportTypes;
  image: string;
  classifiedIdentifiers: string;
  correctIdentifiers: string | null;
  date: string;
  deviceId: string;
  observationResult: string;

  constructor(
    type: FeedbackReportTypes,
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
