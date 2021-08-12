export class FeedbackReport {
  type: string;
  image: string | null;
  classificationResults: string;
  invalidIdentifiers: string | null;
  validIdentifiers: string | null;
  date: string;
  deviceInfo: string;

  constructor(
    type: string,
    image: string | null,
    classificationResults: string,
    invalidIdentifiers: string | null,
    validIdentifiers: string | null,
    date: string,
    deviceInfo: string
  ) {
    this.type = type;
    this.image = image;
    this.classificationResults = classificationResults;
    this.invalidIdentifiers = invalidIdentifiers;
    this.validIdentifiers = validIdentifiers;
    this.date = date;
    this.deviceInfo = deviceInfo;
  }
}
