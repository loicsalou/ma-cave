export class MediaConstraintsBuilder {
  private constraints: MediaStreamConstraints;
  private videoConstraints: MediaTrackConstraints;

  constructor() {
    this.videoConstraints = {};

    this.constraints = {
      audio: false,
      video: {
        advanced: [ this.videoConstraints ]
      }
    };
  }

  withAspectRatio(ideal: number, exact?: number):MediaConstraintsBuilder {
    this.videoConstraints.aspectRatio = this.buildNumberConstraint(ideal, exact);
    return this;
  }

  withFrameRate(ideal: number, exact?: number):MediaConstraintsBuilder {
    this.videoConstraints.frameRate = this.buildNumberConstraint(ideal, exact);
    return this;
  }

  withHeight(ideal: number, exact?: number):MediaConstraintsBuilder {
    this.videoConstraints.height = this.buildNumberConstraint(ideal, exact);
    return this;
  }

  withWidth(ideal: number, exact?: number):MediaConstraintsBuilder {
    this.videoConstraints.width = this.buildNumberConstraint(ideal, exact);
    return this;
  }

  withFacingMode(ideal: FacingMode | FacingMode[], exact?: FacingMode | FacingMode[]):MediaConstraintsBuilder {
    this.videoConstraints.facingMode = this.buildDomStringConstraint(ideal, exact);
    return this;
  }

  build(): MediaStreamConstraints {
    return this.constraints;
  }

  private buildNumberConstraint(ideal: number, exact?: number): ConstrainDoubleRange {
    if (exact) {
      return {ideal: ideal, exact: exact}
    } else {
      return {ideal: ideal}
    }
  }

  private buildDomStringConstraint(ideal: string | string[], exact?: string | string[]): ConstrainDOMStringParameters {
    if (exact) {
      return {ideal: ideal, exact: exact}
    } else {
      return {ideal: ideal}
    }
  }

}

export enum FacingMode {
  USER='user', // face à l'utilisateur sur un smartphone
  ENVIRONMENT='environment', // au dos du smartphone
  LEFT='left', // si plusieurs caméras celle de gauche (gopro ?)
  RIGHT='right' // si plusieurs caméras celle de droite (gopro ?)
}
