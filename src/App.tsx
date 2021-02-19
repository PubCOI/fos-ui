import React from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import {FirebaseAuthProvider} from "@react-firebase/auth";
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

function App() {

  const config = {
    apiKey: "AIzaSyBa1sFm8_wRGIv8y0-iaK5h48bwlJZMqX8",
    authDomain: "pubcoi-fos.firebaseapp.com",
    databaseURL: "https://pubcoi-fos.firebaseio.com",
    projectId: "pubcoi-fos",
    storageBucket: "pubcoi-fos.appspot.com",
    messagingSenderId: "76176716491",
    appId: "1:76176716491:web:b92728b5dbecfc5399e14e"
  };

  return (
      <FirebaseAuthProvider firebase={firebase} {...config}>
        {
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
        }
      </FirebaseAuthProvider>
  );
}

export default withRouter(App);
