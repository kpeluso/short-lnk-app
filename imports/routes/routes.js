import {Meteor} from 'meteor/meteor';
import React from 'react';
import {Router, Route, Switch, Redirect} from 'react-router';
import createHistory from 'history/createBrowserHistory';

import Login from '../ui/Login';
import Signup from '../ui/Signup';
import Link from '../ui/Link';
import NotFound from '../ui/NotFound';

const browserHistory = createHistory();
// window.browserHistory = browserHistory;

const unauthenticatedPages = ['/','/signup']; // all pages users shouldn't visit if they are authenticated
const authenticatedPages = ['/links'];
// const onEnterPublicPage = () => {
//   if (Meteor.userId()) {
//     browserHistory.push('/links');
//   }
// };

export const onAuthChange = (isAuthenticated) => {
  const pathName = browserHistory.location.pathname;
  const isUnAuthenticatedPage = unauthenticatedPages.includes(pathName);
  const isAuthenticatedPage = authenticatedPages.includes(pathName);
  if (isUnAuthenticatedPage && isAuthenticated) { // user logged in but not given content => user should move to website content
    browserHistory.replace('/links');
  } else if (isAuthenticatedPage && !isAuthenticated) { // user is logged out => needs to be taken out of website content
    browserHistory.replace('/');
  }
}

export const routes = (
 <Router history={browserHistory}>
   <Switch>
     <Route exact path="/" render={() => {
       return Meteor.userId() ? <Redirect to="/links" /> : <Login />
     }} />
     <Route path="/signup" render={() => {
       return Meteor.userId() ? <Redirect to="/links" /> : <Signup />
     }} />
     <Route path="/links" render={() => {
       return !Meteor.userId() ? <Redirect to="/" /> : <Link />
     }} />
     <Route path="*" component={NotFound} />
   </Switch>
 </Router>
);
// const routes = (
//   <Router history={browserHistory}>
//     <Switch>
//       <Route exact path="/" component={Login} onEnter={onEnterPublicPage}/>
//       <Route path="/signup" component={Signup} onEnter={onEnterPublicPage}/>
//       <Route path="/links" component={Link}/>
//       <Route component={NotFound}/>
//     </Switch>
//   </Router>
// );

