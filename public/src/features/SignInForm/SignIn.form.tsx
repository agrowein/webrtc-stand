import {useFormik} from "formik";
import {Button, TextField} from "@mui/material";

export const SignInForm = () => {
  const { values, handleChange, submitForm } = useFormik({
    initialValues: {
      login: '',
      password: '',
    },
    onSubmit: values => {},
  });

  return (
    <div className='sign-in-form'>
      <TextField
        id="login-field"
        label="Login"
        placeholder='Login'
        variant="standard"
        onChange={handleChange}
        value={values.login}
      />
      <TextField
        id="password-field"
        label="Password"
        placeholder='Password'
        variant="standard"
        type="password"
        onChange={handleChange}
        value={values.password}
      />
      <Button onClick={submitForm}>
        Войти
      </Button>
    </div>
  );
};