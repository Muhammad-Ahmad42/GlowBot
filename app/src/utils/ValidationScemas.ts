import * as Yup from 'yup';

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
});

export const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
});
