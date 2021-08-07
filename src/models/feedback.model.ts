export class FeedbackReport {
  type: string;
  image: string;
  classificationResult: string;
  classificationIdentifiers: string;
  correctIdentifiers: string | null;
  date: string;
  deviceId: string;

  constructor(
    type: string,
    image: string,
    classificationResult: string,
    classificationIdentifiers: string,
    correctIdentifiers: string | null,
    date: string,
    deviceId: string
  ) {
    this.type = type;
    this.image = image;
    this.classificationResult = classificationResult;
    this.classificationIdentifiers = classificationIdentifiers;
    this.correctIdentifiers = correctIdentifiers;
    this.date = date;
    this.deviceId = deviceId;
  }
}
