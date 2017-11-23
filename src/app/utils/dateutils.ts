const dateRegex = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;

const days: Map<number, number> = new Map();
days.set(1, 31);
days.set(2, 29);
days.set(3, 31);
days.set(4, 30);
days.set(5, 31);
days.set(6, 30);
days.set(7, 31);
days.set(8, 31);
days.set(9, 30);
days.set(10, 31);
days.set(11, 30);
days.set(12, 31);

export function isMinor(birthdate: string, edition: Edition): boolean {
  const data = dateRegex.exec(birthdate);

  if (data === null) {
    return false;
  }

  const day = +data[1];
  const month = +data[2];
  const year = +data[3] + 18;

  const majority = new Date(year, month - 1, day, 0, 0, 0);
  return majority.getTime() > edition.conventionStart;
}

export function isDateValid(date: string): boolean {
  const data = dateRegex.exec(date);

  if (data === null) {
    return false;
  }

  const day = +data[1];
  const month = +data[2];
  const year = +data[3] + 18;


  if (month <= 0 || month > 12) {
    return false;
  } else if (day <= 0 || day > days[month]) {
    return false;
  } else if (month === 2 && day === 29 && !isBissex(year)) {
    return false;
  } else {
    return true;
  }
}

export function isBissex(year: number): boolean {
  return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0);
}
