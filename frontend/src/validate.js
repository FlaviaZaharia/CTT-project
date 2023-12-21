export const checkValidity = (value, rules, matchText) => {
  const valid = {
    valid: true,
    error: "",
  };
  if (!rules) {
    return valid;
  }
  if (rules.required) {
    if (value.trim() === "") {
      return {
        valid: false,
        error: rules.required.errorText,
      };
    }
  }
  if (rules.minLength) {
    if (value.length < rules.minLength.length) {
      return {
        valid: false,
        error: rules.minLength.errorText,
      };
    }
  }
  if (rules.alphaNumeric) {
    if (!rules.alphaNumeric.pattern.test(value)) {
      return {
        valid: false,
        error: rules.alphaNumeric.errorText,
      };
    }
  }
  if (rules.noNumbers) {
    if (!rules.noNumbers.pattern.test(value)) {
      return {
        valid: false,
        error: rules.noNumbers.errorText,
      };
    }
  }
  if (rules.emailFormat) {
    if (!rules.emailFormat.pattern.test(value)) {
      return {
        valid: false,
        error: rules.emailFormat.errorText,
      };
    }
  }
  if (rules.emailValid) {
    if (value.trim() !== "" 
    && !rules.emailValid.pattern.test(value)) {
      return {
        valid: false,
        error: rules.emailValid.errorText,
      };
    }
  }
  if (rules.matching) {
    if (value !== matchText) {
      return {
        valid: false,
        error: rules.matching.errorText,
      };
    }
  }
  return valid;
};

export const checkInput = (value1, value2, value3, rules) => {
  const valid = {
    valid: true,
    error: "",
  };
  if (!rules) {
    return valid;
  }
  if (rules.minimumOne) {
    if (value1.trim() === "" && value2.trim() === "" && value3.trim() === "") {
      return {
        valid: false,
        error: rules.minimumOne.errorText,
      };
    }
  }
  return valid;
};
