module.exports = input => {
  input = input.replace(/[^\d]/g, "");
  if (input.length !== 11 || /^(.)\1*$/.test(input)) {
    return false;
  }
  let rest;
  let sum = 0;
  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(input[i - 1]) * (11 - i);
  }
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) {
    rest = 0;
  }
  if (rest !== parseInt(input[9])) {
    return false;
  }
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(input[i - 1]) * (12 - i);
  }
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) {
    rest = 0;
  }
  if (rest !== parseInt(input[10])) {
    return false;
  }
  return true;
};
