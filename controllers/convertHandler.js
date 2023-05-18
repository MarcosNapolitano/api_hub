class ConvertHandler {
  constructor() {

    this.getNum = function (input) {

      //check for number or default 1
      const re = /\d*.*\d/;
      let number = 0;

      //if no numeric value is provided match is null instead of an array
      try {
        number = input.match(re)[0];
      } catch {
        number = '1';
      }
      let result = 0;

      //checks and divides fractional numbers
      if (number.split('/').length >= 3) {
        result = null;
      } else if (number.split('/').length == 2) {
        number = number.split('/')[0] / number.split('/')[1];
        result = parseFloat(number);
      } else {
        result = parseFloat(number);
      }
      
      return result;
    };

    this.getUnit = function (input) {

      const re = /\D*$/;
      let result = input.match(re)[0].toLowerCase().trim();
      const units = ['l', 'kg', 'km', 'gal', 'lbs', 'mi'];

      if (!(units.includes(result))) {
        result = null;
      }
      if (result == 'l') {
        result = result.toUpperCase();
      }
      return result;
    };

    this.getReturnUnit = function (initUnit) {
      let result = '';

      switch (initUnit) {
        case 'L':
          result = 'gal';
          break;
        case 'kg':
          result = 'lbs';
          break;
        case 'km':
          result = 'mi';
          break;
        case 'gal':
          result = 'L';
          break;
        case 'lbs':
          result = 'kg';
          break;
        case 'mi':
          result = 'km';
          break;
        default:
          result = 'none provided';
      }

      return result;
    };

    this.spellOutUnit = function (unit) {

      const dictionary = {
        L: "liters",
        kg: "kilograms",
        km: "kilometers",
        gal: "gallons",
        mi: "miles",
        lbs: "pounds"
      };
      let result = dictionary[unit];

      return result;
    };

    this.convert = function (initNum, initUnit) {

      let result = 0;

      switch (initUnit) {
        case 'L':
          result = initNum / 3.78541;
          break;
        case 'kg':
          result = initNum / 0.453592;
          break;
        case 'km':
          result = initNum / 1.60934;
          break;
        case 'gal':
          result = initNum * 3.78541;
          break;
        case 'lbs':
          result = initNum * 0.453592;
          break;
        case 'mi':
          result = initNum * 1.60934;
          break;
        default:
          result = 'none provided';
      }

      result = parseFloat(result.toFixed(5));

      return result;
    };

    this.getString = function (initNum, initUnit, returnNum, returnUnit) {
      let result = `${initNum} ${initUnit} converts to ${returnNum} ${returnUnit}`;

      return result;
    };

  }
}

export default ConvertHandler;
