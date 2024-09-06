export const _require = {
  required: {
    value: true,
    message: "required",
  },
};

export const requireLength = {
  minLength: {
    value: 1,
    message: "required",
  },
  maxLength: {
    value: 100,
    message: "max length is 100",
  },
};

export const email = {
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
    message: "invalid email address",
  },
};

export const password = {
  minLength: {
    value: 6,
    message: "password must be at least 6 characters",
  },
  maxLength: {
    value: 20,
    message: "password must not exceed 20 characters",
  },
};
