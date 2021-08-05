export class FeedbackReport {
  type: string;
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
