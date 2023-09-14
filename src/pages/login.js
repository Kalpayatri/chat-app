import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link } from "@mui/material";
import { Formik, Form, Field } from "formik";
import { useHistory } from "react-router-dom"; 
import axios from "axios";
import { loginSchema } from "../utils/validationSchema";

const Login = () => {
  const history = useHistory(); 
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      console.log(values)
      const response = await axios.post("http://localhost:8000/users/login", values);
      const data = response.data;
  
      if (response.status === 200) {
        const token = data.token;
        localStorage.setItem("token", token);
        resetForm();
        history.push("/ChatApp");
      } else {
        console.log("Login failed:", data.message);
      }
    } catch (error) {
      console.log("Error logging in:", error);
    }
  };
  

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
        Login to your account
      </Typography>

      <Formik
        initialValues={formData}
        validationSchema={loginSchema}
        onSubmit={handleSubmit} 
      >
        {({ errors, touched, resetForm }) => (
          <Form>
            <Field
              as={TextField}
              name="email"
              label="Email Address"
              required
              type="email"
              fullWidth
              sx={{ mb: 2 }}
              error={errors.email && touched.email}
              helperText={errors.email && touched.email && errors.email}
            />
            <Field
              as={TextField}
              name="password"
              label="Password"
              type="password"
              required
              fullWidth
              sx={{ mb: 2 }}
              error={errors.password && touched.password}
              helperText={errors.password && touched.password && errors.password}
            />
            <Button type="submit" variant="contained" fullWidth>
              Login
            </Button>
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Link href="/register" sx={{ textDecoration: "none" }}>
                Don't have an account? Register
              </Link>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Login;
