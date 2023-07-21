import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link } from "@mui/material";
import { Formik, Form, Field } from "formik";
import { validationSchema } from "../utils/validationSchema";

const Login = () => {
    const [formData,setFormData]=useState({
        email:"",
        password:""
    })
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent:'center',
        alignItems: "center",
        padding: "1rem",
        minHeight:"100vh"
      }}
    >
    <Typography variant="h5" component="h1"  gutterBottom marginBottom={4}>Login to your account</Typography>

      <Formik
      initialValues={formData}
      validationSchema={validationSchema}
      >
        {({errors, touched, resetForm})=>(
        <Form>
          <Field
            as={TextField}
            name="email"
            label="Email Address"
            required
            type="email"
            fullWidth
            sx={{mb:2}}
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
            sx={{mb:2}}
            error={errors.password && touched.password}
            helperText={errors.password && touched.password && errors.password}
          />
          <Button type="submit" variant="contained" fullWidth>
            Login
          </Button>
          <Box sx={{ mt: 2, textAlign: "center" }}>
          <Link href="/register" sx={{textDecoration:"none"}}>Don't have an account? Register</Link>
          </Box>
        </Form>
        )}
      </Formik>
    </Box>
  );
};
export default Login;
