type ApiMeasurement = {
  tag: string;
  neck: number;
  shoulder: number;
  chest: number;
  tummy: number;
  hipWidth: number;
  neckToHipLength: number;
  shortSleeveAtBiceps: number;
  midSleeveAtElbow: number;
  longSleeveAtWrist: number;
  waist: number;
  thigh: number;
  knee: number;
  ankle: number;
  trouserLength: number;
  isDefault: boolean;
};

type Measurement = {
  id: string;
  name: string;
  isDefault?: boolean;
  description?: string;
  tag?: string;
  measurements: {
    neck: number;
    chest: number;
    tummy: number;
    hipWidth: number;
    lengthNeckToHip: number;
    shoulder: number;
    bicepWidth: number;
    elbowWidth: number;
    wristWidth: number;
    shortSleeveLength: number;
    elbowLength: number;
    longSleeveLength: number;
    waist: number;
    lowerHipWidth: number;
    thighWidth: number;
    kneeWidth: number;
    ankleWidth: number;
    kneeLength: number;
    ankleLength: number;
  };
};