import { Component, OnInit } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';

//importing My Models here..
import { Event } from '../models/event';
import { Participant } from '../models/participant';






@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {

	eventsCollection:AngularFirestoreCollection<Event>;
	events: Observable<Event[]>;

	participantsCollection:AngularFirestoreCollection<Participant>;
	participants: Observable<Participant[]>;


	ShowEventsClicked:any;

	Event:any;
	EventName:any;
	EventDescription:any;
	EventBy:any;
	StartDate:any;
	EndDate:any;
	EventId?:any;
	Participants:any;

	ViewFullEventClicked:any;
	addParticipantsCLicked:any;

	ParticipantRole:any;
	ParticipantName:any;

	NewEvent:any;
	EditThisEvent:any;

	deleteEventClicked:any;

	addEventManagersClicked: any;

	ManagerName:any;
	ManagerEmail:any;

	NewManagerName:any;
	NewManagerEmail:any;

	//managedEvents:any;
	managerExists:any;

	ViewMyEventsButton: any;

  constructor( private afs: AngularFirestore , private afAuth: AngularFireAuth) { 
  	
    
   }


  idBefore:any;
  eventOrder :any;
  orderBySelection:any;

  errorHandler:Observable<any>;
  totalEvents:any;

  //managed events
  managedEventsClicked:any;
  totalManagedEvents:any;
  managedEventsExist:any;




  ngOnInit() {

  }

  LengthOfMyEvents(totalevents){
  	this.totalEvents = totalevents;
  }

  ShowEvents(){  	
  	this.eventsCollection = this.afs.collection('events', ref =>{
  		return ref.where('EventBy','==',this.afAuth.auth.currentUser.email);
  	})
  	this.events = this.eventsCollection.valueChanges();
  	this.ShowEventsClicked = true;
  	this.eventsCollection.ref.where('EventBy','==',this.afAuth.auth.currentUser.email).onSnapshot(
  		snap =>{
  			this.LengthOfMyEvents(snap.size)
  		})
  }

  HideEvents(){
  	this.ShowEventsClicked = false;
  }

  	getThis(event: Event): void {
		  	this.Event = event;
		  	this.EventName = event.EventName;
		  	this.EventDescription = event.EventDescription;
	    	this.EventId = event.EventId; 
	    	this.StartDate = event.StartDate;
	    	this.EndDate = event.EndDate;
	    	this.Participants = event.Participants;
	    	this.EventBy = event.EventBy;
	    this.eventsCollection = this.afs.collection('events', ref=>{
	      return ref.where('EventName','==',this.EventName);
	    });
	  	this.participantsCollection = this.afs.collection('events').doc(this.EventId).collection("participants", ref=>{
	  		return ref
	  	})
	  	this.participants = this.participantsCollection.valueChanges();
	    //console.log(this.participants);
	    this.ViewFullEventClicked = true;

	}

	closeEvent(){
		this.ViewFullEventClicked = null;
	}
	addParticipants(){
		this.addParticipantsCLicked = true;
	}
	addParticipantsNow(){

  	this.idBefore = this.afs.createId();
		this.afs.collection("events").doc(this.EventId).collection("participants").doc(this.idBefore).set({
	        Participants:
	        {name:this.ParticipantName , role:this.ParticipantRole, id:this.idBefore}

	      });
	     console.log("Participant Added to DB. ") ;

		this.addParticipantsCLicked = null;
	  	

	}
	DontAddParticipantsNow(){
		this.addParticipantsCLicked = null;
	}

	deleteParticipant(participant: Participant){
		
		console.log(participant.Participants.name + " , " + participant.Participants.role+ " , " + participant.Participants.id 
			+ " Deleted ! ");
		this.afs.collection("events").doc(this.EventId).collection("participants").doc(participant.Participants.id).delete();
	}

	

//from event.component.ts
	addEvent(){  	
  	this.NewEvent = true;
  	console.log("add event Clicked.");
  }cancelEvent(){
  	this.NewEvent = null;
  	this.EditThisEvent = null;

  }SaveEvent(){
  	this.idBefore = this.afs.createId();
  	this.EventName = this.EventName.toLowerCase()
  	this.EventDescription = this.EventDescription.toLowerCase()
  	this.afs.collection("events").doc(this.idBefore).set({
        EventName: this.EventName,
        EventDescription: this.EventDescription,
        StartDate:  this.StartDate,
        EndDate: this.EndDate,
        EventBy: this.afAuth.auth.currentUser.email,
        EventId: this.idBefore
         
      }).catch(
     error=> this.handleError(error));
     console.log("Event Added to DB. with id = "+this.idBefore) ;
  	this.NewEvent = null;
  }

  EditEvent(){
  	console.log(this.EditThisEvent);
  	this.EditThisEvent = true;
  	console.log(this.EditThisEvent);
  }
  SaveEditedEvent(){
  	this.afs.collection("events").doc(this.EventId).set({
        EventName: this.EventName,
        EventDescription: this.EventDescription,
        StartDate:  this.StartDate,
        EndDate: this.EndDate,
        EventBy: this.afAuth.auth.currentUser.email,
        EventId: this.EventId
         
      });
  	console.log("event edited");
  	this.EditThisEvent = null;
  }

  deleteEvent(){
  	this.deleteEventClicked = true
  }
  deleteEventConfirm(): void {
  	console.log(this.EventId + " , " + this.EventName + " , " + this.EventBy)
  	this.afs.collection("events").doc(this.EventId).delete();
  	console.log(this.EventId + " , " + this.EventName + " Deleted ")
  	this.ViewFullEventClicked = null
  }
  DontDeleteEvent(){
  	this.deleteEventClicked = null
  }

  //Order Events Queries
  OrderSelection(){
  	this.eventsCollection = this.afs.collection('events', ref =>{
  		return ref.orderBy(this.orderBySelection, this.eventOrder).where(
  			'EventBy','==',this.afAuth.auth.currentUser.email
  			);
  	})
  	this.events = this.eventsCollection.valueChanges();
  }
  AscendingOrder(){
  	this.eventOrder = 'asc'
  }
  DescendingOrder(){
  	this.eventOrder = 'desc'
  }

  EventsNameAscendingOrder(){
  	this.orderBySelection = 'EventName'
  	this.AscendingOrder()
  	this.OrderSelection()
  }
  EventsNameDescendingOrder(){
  	this.orderBySelection = 'EventName'
  	this.DescendingOrder()
  	this.OrderSelection()
  }
  ///.....................

  StartDateAscendingOrder(){
  	this.orderBySelection = 'StartDate'
  	this.AscendingOrder()
  	this.OrderSelection()
  }
  StartDateDescendingOrder(){
  	this.orderBySelection = 'StartDate'
  	this.DescendingOrder()
  	this.OrderSelection()
  }
  EndDateAscendingOrder(){
  	this.orderBySelection = 'EndDate'
  	this.AscendingOrder()
  	this.OrderSelection()
  }
  EndDateDescendingOrder(){
  	this.orderBySelection = 'EndDate'
  	this.DescendingOrder()
  	this.OrderSelection()
  }

    handleError(error){
      this.errorHandler = error
    }

   
    

}
