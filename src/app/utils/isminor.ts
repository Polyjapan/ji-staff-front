

export function isMinor(birthdate: string, edition: Edition): boolean {
  const regex = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
  const data = regex.exec(birthdate);

  if (data === null) {
    return false;
  }

  const day = +data[1];
  const month = +data[2];
  const year = +data[3] + 18;

  const majority = new Date(year, month - 1, day, 0, 0, 0);
  return majority.getTime() > edition.conventionStart;
}
