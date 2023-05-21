import {useFormik} from "formik";
import {Button, TextField} from "@mui/material";
import {AuthService} from "../../services/auth.service";
import {LoginDto} from "../../dtos/Login.dto";
import cookie from 'cookiejs';
import {useNavigate} from "react-router";

export const SignInForm = () => {
  const authService: AuthService = new AuthService();
  const navigate = useNavigate();

  const submitHandler = (values: LoginDto) => {
    authService.login(values)
      .then(res => {
        const token = res.data.accessToken;
        cookie.set({
          accessToken: token,
        });
        navigate('/');
      })
      .catch(err => console.log(err))
  };

  const { values, handleChange, submitForm } = useFormik({
    initialValues: {
      login: '',
      password: '',
    },
    onSubmit: submitHandler,
  });

  return (
    <div className='sign-in-form'>
      <TextField
        id="login"
        label="Login"
        placeholder='Login'
        variant="standard"
        onChange={handleChange}
        value={values.login}
      />
      <TextField
        id="password"
        label="Password"
        placeholder='Password'
        variant="standard"
        type="password"
        onChange={handleChange}
        value={values.password}
      />
      <Button type='submit' onClick={() => submitForm()}>
        Войти
      </Button>
    </div>
  );
};