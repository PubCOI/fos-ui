import React, {useEffect, useState} from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import {Route, Switch, withRouter} from 'react-router-dom';
import "bootswatch/dist/cosmo/bootstrap.min.css";
import {Header} from "./components/Header";
import {Login} from "./pages/Login";
import {Awards} from "./pages/Awards";
import {Container} from "react-bootstrap";
import {About} from "./pages/About";
import {Tasks} from "./pages/Tasks";
import {Home} from "./pages/Home";
import {Footer} from "./components/Footer";
import axios from "axios";
import {useToasts} from "react-toast-notifications";

function App() {

  interface UserInfo {
    displayName: string,
  }

  const {addToast} = useToasts();
  const [userInfo, setUserInfo] = useState<UserInfo>({displayName: ""});
  const [globalIsSignedIn, setGlobalIsSignedIn] = useState(false);

  useEffect(() => {
    if (globalIsSignedIn) {
      firebase.auth().currentUser?.getIdToken(/* forceRefresh */ true).then(function (idToken) {
        axios.post<UserInfo>("/api/ui/user", {authToken: idToken})
            .then(r => {
              setUserInfo(r.data);
            })
            .catch(reason => {
              addToast(reason.toString(), {
                appearance: "error",
                autoDismiss: true,
              });
            })
      }).catch(function (error) {
        addToast(
            error.toString(),
            {
              appearance: "error",
              autoDismiss: true,
            }
        )
      });

    }
  }, []);

  firebase.auth().onAuthStateChanged(function (user) {
    setGlobalIsSignedIn(null !== user);
  });

  return (
      <>
        <Header/>
        <Container fluid className={"mb-5"}>
          <main role={"main"}>
            <Switch>
              <Route exact path={"/"} component={Home}/>
              <Route exact path={"/login"} component={Login}/>
              <Route exact path={"/data/awards"} component={Awards}/>
              <Route exact path={"/about"} component={About}/>
              <Route exact path={"/tasks"} component={Tasks}/>
            </Switch>
          </main>
        </Container>
        <Footer/>
      </>
  );
}

export default withRouter(App);
