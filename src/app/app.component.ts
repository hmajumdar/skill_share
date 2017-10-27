import { Component } from '@angular/core';
import { initializeApp, database} from 'firebase';
import { firebaseConfig } from "../environments/firebase.config";
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  constructor(db: AngularFireDatabase) {
    const users$: FirebaseListObservable<any> = db.list('users');
    users$.subscribe(
      val => console.log(val)
    );

    const user$: FirebaseObjectObservable<any> = db.object('users/user0');
    user$.subscribe(
      val => console.log(val)
    );
  }
}
