export const isInValidIntakeTime = (intakeTime: unknown) =>
!(
  typeof intakeTime === 'number' &&
  Number.isInteger(intakeTime) &&
  intakeTime >= 0 &&
  intakeTime < 1440
);