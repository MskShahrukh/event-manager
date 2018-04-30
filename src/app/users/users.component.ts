import { Component, OnInit } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from "rxjs/Observable";
import "rxjs/add/Observable/throw";




@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  LoginEmail :any;
  LoginPassword: any;
  SignUpClicked:boolean;

  AddedToTheDB:boolean;

  editInfoClicked:any;
  photoURL:any;
  username:any;
  userR:any;

  errorHandler:Observable<any>;

  constructor(public afAuth: AngularFireAuth, public db:AngularFirestore) { }

  ngOnInit() {   
  }

  EmailLogin() {
   this.afAuth.auth.signInWithEmailAndPassword(this.LoginEmail, this.LoginPassword).catch(
     error=> this.handleError(error))	    
	}

	Glogin() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(
     error=> this.handleError(error))  
  }

	logout() {
    this.afAuth.auth.signOut();
  }

  SignUp(){
  	this.SignUpClicked = true;
  }
  SignUpNow(){
  	console.log("SignUpNow clicked");
  	 this.afAuth.auth.createUserWithEmailAndPassword(this.LoginEmail, this.LoginPassword).catch(
     error=> this.handleError(error));
  }

  backClicked(){
  	this.SignUpClicked = null;
  }


 editInfo(){
   this.editInfoClicked =true;
   this.username = this.afAuth.auth.currentUser.displayName
   this.photoURL = this.afAuth.auth.currentUser.photoURL
   console.log("edit info clicked");    
 }
 
 UpdateUserInfo(){
  this.afAuth.auth.currentUser.updateProfile({
    displayName: this.username,
    photoURL: this.photoURL
  }).catch(error=> this.handleError(error))  

  this.db.collection("user").doc(this.afAuth.auth.currentUser.uid).set({
    displayName: this.username,
    email: this.afAuth.auth.currentUser.email,
    photoURL:  this.photoURL,
    uid: this.afAuth.auth.currentUser.uid 
  }).catch(error=> this.handleError(error))

  console.log("User Added to DB.");
  this.AddedToTheDB= true;
  this.editInfoClicked =null;
 }

 cancelProfileUpdate(){
   this.editInfoClicked =null;
 }

handleError(error){
  this.errorHandler = error
}

/*
 ShowUserProfile(){ 
    this.afAuth.auth.currentUser.providerData.forEach(function (profile) {
    console.log("Sign-in provider: " + profile.providerId);
    console.log("  Provider-specific UID: " + profile.uid);
    console.log("  Name: " + profile.displayName);
    console.log("  Email: " + profile.email);
    console.log("  Photo URL: " + profile.photoURL);
  })
 }
*/

}
