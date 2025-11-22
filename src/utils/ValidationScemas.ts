import * as Yup from "yup";

export const LogInValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Username is required *"),

  password: Yup.string()
    .required("Password is required *")
    .min(6, "Password must be at least 6 characters"),
});

export const SignUpValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required *")
    .min(3, "Name must be at least 3 characters"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required *"),

  password: Yup.string()
    .required("Password is required *")
    .min(6, "Password must be at least 6 characters"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Please confirm your password *"),

  gender: Yup.string().required("Gender is required"),
  age: Yup.number()
    .typeError("Age must be a number")
    .positive("Age must be positive")
    .integer("Age must be an integer")
    .min(15, "You must be at least 15 years old")
    .max(120, "Enter a valid age")
    .required("Age is required *"),
  dob: Yup.date().required("Date of Birth is required").nullable(),
});

export const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
});
