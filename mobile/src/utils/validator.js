const Validate = (val, rules, prevPassword) => {
  let isValid = true;
  for (const rule in rules) {
    switch (rule) {
      case 'isEmail':
        isValid = isValid && emailValidator(val);
        break;
      case 'minLength':
        isValid = isValid && minLengthValidator(val, rules[rule]);
        break;
      case 'equalTo':
        isValid = isValid && confirmPasswordValidator(val, prevPassword);
        break;
      case 'isPassword':
        isValid = isValid && passwordValidator(val);
        break;
      default:
        isValid = true;
    }
  }
  return isValid;
};

const emailValidator = val => {
  const re = /^([\w-.]+@([\w-]+\.)+[\w-]+)?$/;
  return re.test(String(val).toLowerCase());
};

const minLengthValidator = (val, minLength) => {
  return val?.length >= minLength;
};

const passwordValidator = (val) => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  return re.test(String(val))
}

const confirmPasswordValidator = (val, prevPassword) => {
  return val === prevPassword;
};
export { Validate };
