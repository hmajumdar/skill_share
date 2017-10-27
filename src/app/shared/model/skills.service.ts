import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { User} from './user';
import { Skill } from './skill';
import { Subject } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { FirebaseApp } from 'angularfire2';
import { firebaseConfig } from '../../../environments/firebase.config';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable()
export class SkillsService {

  sdkDb: any;
  currentUser: any;

  constructor(private db: AngularFireDatabase, @Inject(FirebaseApp) fb, private http: Http) {
    this.sdkDb = fb.database().ref();
  }

  findAllSkills(): Observable<Skill[]> {
    return this.db.list('skills')
      .do(console.log)
      .map(skillsAsJson => Skill.fromJsonList(skillsAsJson));
  }

  createNewSkill(skillData: any, userId: String): Observable<any> {
        const skillToSave = Object.assign({}, skillData, { userId: userId });
        const newSkillKey = this.sdkDb.child('skills').push().key;
        let dataToSave = {};
        dataToSave['skills/' + newSkillKey] = skillToSave;
        dataToSave['skillsPerUser/' + userId + '/' + newSkillKey] = true;
        // save into both tables at once. we will need this to edit lessons too, so separate function.
        return this.firebaseUpdate(dataToSave);
  }

  saveEditedSkill(skillId, skill): Observable<any> {
    // put the skill data into a blank object
    const skillToSave = Object.assign({}, skill);
    delete(skillToSave.$key);
    let dataToSave = {};
    // then we save the skill data inside of an object with key at skills/skillId
    dataToSave['skills/' + skillId] = skillToSave;
    // this time we don't need to update the skillsPerCourse because the association is already there.
    return this.firebaseUpdate(dataToSave);
  }

  firebaseUpdate(dataToSave) {
    const subject = new Subject();
    this.sdkDb.update(dataToSave)
      .then(
          val => {
            subject.next(val);
            subject.complete();
          },
          err => {
            subject.error(err);
            subject.complete();
          }
        );
    return subject.asObservable();
  }
  findSkillByKey(key) {
    return this.db.object('skills/' + key);
  }
  deleteSkill(key) {
    const url = firebaseConfig.databaseURL + '/lessons/' + key + '.json';
    return this.http.delete(url);
  }
  deleteSkillPerUser(key, userId) {
    console.log(key, userId);
    const urlSkillPerUser = firebaseConfig.databaseURL + '/skillsPerUser/' + userId + '/' + key + '.json';
    return this.http.delete(urlSkillPerUser);
  }
}
