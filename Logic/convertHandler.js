class ConvertHandler {
  constructor(query,res) {
    this.query = query
    this.res = res
    this.num = 0
    this.unit = ""
    this.result = 0
    this.returnUnit = ""
  }

  get Num() {

    //check for number or default 1
    const re = /\d*.*\d/;
    let number = 0;

    //if no numeric value is provided match is null instead of an array
    try {
      number = this.query.match(re)[0];
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
    this.num = result
    return result;
  };

  get Unit() {

    const re = /\D*$/;
    let result = this.query.match(re)[0].toLowerCase().trim();
    const units = ['l', 'kg', 'km', 'gal', 'lbs', 'mi'];

    if (!(units.includes(result))) {
      result = null;
    }
    if (result == 'l') {
      result = result.toUpperCase();
    }

    this.unit = result
    return result;
  };

  checkInput(){

    if(!this.Num && !this.Unit){
      return this.res.json({error:'invalid number and unit'})
    }else if(!this.Unit){
      return this.res.json({error : 'invalid unit'})
    }else if(!this.Num){
      return this.res.json({error: 'invalid number'})
    }

  };

  setReturnUnit() {
    let result = '';

    switch (this.unit) {
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

    this.returnUnit = result

    return result;
  };

  spellOutUnit(input) {

    const dictionary = {
      L: "liters",
      kg: "kilograms",
      km: "kilometers",
      gal: "gallons",
      mi: "miles",
      lbs: "pounds"
    };
    let result = dictionary[input];

    return result;
  };

  convert = function () {

    let result = 0;

    switch (this.unit) {
      case 'L':
        result = this.num / 3.78541;
        break;
      case 'kg':
        result = this.num / 0.453592;
        break;
      case 'km':
        result = this.num / 1.60934;
        break;
      case 'gal':
        result = this.num * 3.78541;
        break;
      case 'lbs':
        result = this.num * 0.453592;
        break;
      case 'mi':
        result = this.num * 1.60934;
        break;
      default:
        return false
    }

    result = parseFloat(result.toFixed(5));
    this.result = result

    return result;
  };

  getString() {

    return `${this.num} ${this.spellOutUnit(this.unit)} converts to ${this.result} ${this.spellOutUnit(this.returnUnit)}`
  };
}

export default ConvertHandler;
