import { isNumber } from "class-validator";


export var convertFDY = (dt: Date) => {
  var options: any = { month: 'long', day: 'numeric', year: 'numeric' };
  return dt.toLocaleDateString('en-US', options);
}

export var processString = (str: string) => {
  if (str == '' || str === 'undefined' || str == null) return '';
  return str;
}

export var isValidNumber = (str: string) => {
  if (str == '' || str === 'undefined' || str == null || str == '0') return false;
  return isNumber(str)
  // return str;
}