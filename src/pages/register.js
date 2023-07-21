import React, { useState } from "react";
import { Typography, Box, Button, TextField } from "@mui/material";
import { Formik, Form, Field } from "formik";
import { validationSchema } from "../utils/validationSchema";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom marginBottom={4}>
        Register your account
      </Typography>
      <Formik initialValues={formData} validationSchema={validationSchema}>
        {({ errors, touched, resetForm }) => (
          <Form>
            <Field
              as={TextField}
              name="email"
              label="Enter your email address"
              type="email"
              required
              fullWidth
              sx={{ mb: 2 }}
              error={errors.email && touched.email}
              helperText={errors.email && touched.email && errors.email}
            />
            <Field
              as={TextField}
              name="password"
              label="Enter your password"
              type="password"
              required
              fullWidth
              sx={{ mb: 2 }}
              error={errors.password && touched.password}
              helperText={
                errors.password && touched.password && errors.password
              }
            />
            <Field
              as={TextField}
              name="confirmPassword"
              label="Confirm your password"
              type="password"
              required
              fullWidth
              sx={{ mb: 2 }}
              error={errors.confirmPassword && touched.confirmPassword}
              helperText={
                errors.confirmPassword &&
                touched.confirmPassword &&
                errors.confirmPassword
              }
            />
            <Button type="submit" variant="contained" fullWidth>
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
export default Register;
