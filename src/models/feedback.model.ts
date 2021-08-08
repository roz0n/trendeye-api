export class FeedbackReport {
  type: string;
  image: string | null;
  classificationResults: string;
  incorrectIdentifiers: string | null;
  correctIdentifiers: string | null;
  date: string;
  deviceInfo: string;

  constructor(
    type: string,
    image: string | null,
    classificationResults: string,
    incorrectIdentifiers: string | null,
    correctIdentifiers: string | null,
    date: string,
    deviceInfo: string
  ) {
    this.type = type;
    this.image = image;
    this.classificationResults = classificationResults;
    this.incorrectIdentifiers = incorrectIdentifiers;
    this.correctIdentifiers = correctIdentifiers;
    this.date = date;
    this.deviceInfo = deviceInfo;
  }
}
