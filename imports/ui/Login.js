import React from 'react';
import {Link} from 'react-router-dom';
import {Meteor} from 'meteor/meteor';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ''
    };
  }
  onSubmit(e) {
    e.preventDefault();
    let email = this.refs.email.value.trim();
    let password = this.refs.password.value.trim();

    Meteor.loginWithPassword({email}, password, (err) => {
      if (err) {
        console.log('Signup callback', err);
        this.setState({error: err.reason});
      } else {
        this.setState({error: ''});
      }
    }); // login makes email its own object and password as different arguemnt, different from account creation
  }
  render() {
    // return <p>hi</p>
    return (
      <div className='boxed-view'>
        <div className='boxed-view__box'>
          <h1>Short Lnk - Login</h1>

          {this.state.error ? <p>{this.state.error}</p> : undefined}

          <form onSubmit={this.onSubmit.bind(this)} noValidate className='boxed-view__form'>
            <input type='email' ref='email' name='email' placeholder='Email'/>
            <input type='password' ref='password' name='Password'/>
            <button className='button'>Login</button>
          </form>

          <Link to={'/signup'}>Don't have an account?</Link>
        </div>
      </div>
    );
  }
}

