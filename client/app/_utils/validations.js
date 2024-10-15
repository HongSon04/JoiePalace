export const _require = {
  required: {
    value: true,
    message: "không được để trống",
  },
};

export const requireLength = {
  minLength: {
    value: 1,
    message: "phải nhiều hơn 1 ký tự",
  },
  maxLength: {
    value: 35,
    message: "phải ít hơn 35 ký tự",
  },
};

export const emailValidation = {
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
    message: "không hợp lệ",
  },
};

export const passwordValidation = {
  pattern: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d_!@#$%^&*()-+=]{8,}$/,
    message: "phải chứa ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường và 1 số",
  },
};

export const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d_!@#$%^&*()-+=]{8,}$/;
