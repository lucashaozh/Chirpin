import cookie from 'react-cookies';
import * as React from 'react';
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox
}
  from 'mdb-react-ui-kit';
import { Navigate } from 'react-router-dom';
import { BACK_END } from './App';

// { "username": username, "mode": mode }
// not logged in: undefined
export const getLoginInfo = () => {
  return cookie.load('userInfo');
};

export const login = (username, mode) => {
  console.log("Save Login Cookie");
  cookie.save('userInfo', { username, mode }, { path: '/', maxAge: 3600 });
};

export const logout = () => {
  console.log("Remove Login Cookie");
  cookie.remove('userInfo');
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { login: false, username: undefined, mode: 'user', justifyActive: 'login' };
  }

  handleJustifyClick = (value) => {
    if (value === this.state.justifyActive) {
      return;
    }
    this.setState({ justifyActive: value });
  };

  handleUserSignup = (event) => {
    const username = document.getElementById("newusername").value;
    const newpwd = document.getElementById("newpwd").value;
    const userInfo = {
      newusername: username,
      newpwd: newpwd
    };
    if (username === '') {
      window.alert("Please enter a valid username.");
    } else if (newpwd === '') {
      window.alert("Please enter a password");
    } else if (newpwd !== '' && (newpwd.length <= 4 || newpwd.length >= 20)) {
      window.alert("The length of the password should be >4 and <20.");
    } else {
    fetch(BACK_END + "createuser", {
      method: "POST",
      body: JSON.stringify(userInfo),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(res => {
        if (res.status === 201) {

        }
        return res.text();
      })
      .then(data => { alert(data); })
      .catch(err => {
        console.log(err);
      });
    event.preventDefault();
    }
  }

  handleUserSubmit = (event) => {
    const username = document.getElementById("username").value;
    const pwd = document.getElementById("pwd").value;
    const userInfo = {
      username: username,
      pwd: pwd
    };
    
    fetch(BACK_END + "login/user", {
      method: "POST",
      body: JSON.stringify(userInfo),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(res => {
        if (res.status === 201) {
          this.setState({ login: true, username: username, mode: 'user' });
          login(username, 'user');
          this.props.onChangeLogin();
        }
        return res.text();
      })
      .then(data => {
        if (data == 'Login As Amin Successfully!\n') {
          this.setState({ login: true, username: username, mode: 'admin' });
          login(username, 'admin');
          this.props.onChangeLogin();
        } alert(data)
      })
      .catch(err => {
        console.log(err);
      });
    event.preventDefault();
  
  };
  render() {
    return (this.state.login === false ? 
      (<MDBContainer className="p-3 my-5 d-flex flex-column w-50">

        <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
          <MDBTabsItem>
            <MDBTabsLink onClick={() => this.handleJustifyClick('login')} active={this.state.justifyActive === 'login'}>
              Login
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink onClick={() => this.handleJustifyClick('signup')} active={this.state.justifyActive === 'signup'}>
              Register
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>

        <MDBTabsContent>

          <MDBTabsPane show={this.state.justifyActive === 'login'}>

            <div className="text-center mb-3">
              <p>Sign in</p>
            </div>

            <MDBInput wrapperClass='mb-4' label='Username' id='username' type='text' />
            <MDBInput wrapperClass='mb-4' label='Password' id='pwd' type='password' />

            <div className="d-flex justify-content-between mx-4 mb-4">
              <a href="/login" onClick={() => alert("Please contact the administrator")}>Forgot password?</a>
            </div>
            <button type='submit' className="mb-4 w-100" style={{ backgroundColor: "#007bff", color: "white", fontSize: "17px", borderRadius: "4px", border: "white" }} onClick={this.handleUserSubmit}>Sign in</button>
          </MDBTabsPane>

          <MDBTabsPane show={this.state.justifyActive === 'signup'}>

            <div className="text-center mb-3">
              <p>Sign up</p>
            </div>

            <MDBInput wrapperClass='mb-4' label='Username' id='newusername' type='text' />
            <MDBInput wrapperClass='mb-4' label='Password' id='newpwd' type='password' />

            <button className="mb-4 w-100" style={{ backgroundColor: "#007bff", color: "white", fontSize: "17px", borderRadius: "4px", border: "white" }} onClick={this.handleUserSignup}>Sign up</button>

          </MDBTabsPane>

        </MDBTabsContent>

      </MDBContainer>) :(this.state.mode === 'user' ? <Navigate to='/'/> : <Navigate to='/admin'/>)
    );
  }
}
export default Login;

