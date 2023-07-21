import * as Yup from "yup"

export const validationSchema= Yup.object().shape({
    email:Yup.string().email("Invalid Email").required('Email is required')
    .matches(/\.com$/, "Email must end with '.com'"),
    password:Yup.string().required('Password is required').min(8,"Password must be at least 8 character")
    .matches(/^(?=.*[a-z])/, "Must contain one lowercase character")
    .matches(/^(?=.*[A-Z])/, "Must contain one uppercase character")
    .matches(/^(?=.*\d)/, "Must contain one number character")
    .matches(
      /^(?=.*[!@#$%^&*])/,
      "Must contain one special character"
    ),
    confirmPassword:Yup.string().oneOf([Yup.ref("password"),null],"Password must match")
    .required("Please confirm your password")
})