import * as React from 'react';
import cookie from 'react-cookies';

export const getloginfo = () => {
  return cookie.load('userInfo');
};

export const login = (uid, mode) => {
  cookie.save('userInfo', { uid, mode }, { path: '/', maxAge: 3600 });
};

export const logout = () => {
  cookie.remove('userInfo');
};

function Login() {
    return (<div>login</div>);
}

export default Login;