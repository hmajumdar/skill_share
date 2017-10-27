import {database, initializeApp} from 'firebase';
import {firebaseConfig} from './src/environments/firebase.config';
import {skillData} from './skill-data';

initializeApp(firebaseConfig);

const usersRef = database().ref('users');
const skillsRef = database().ref('skills');

skillData.users.forEach( user => {

  console.log('adding user', user.username);
  const userRef = usersRef.push({
    username: user.username,
    email: user.email,
    location: user.location,
    occupation: user.occupation,
    photo: user.photo
  });

  let skillKeysPerUser = [];
  user.skills.forEach((skill: any) =>  {

  console.log('adding skill ', skill.skill_name);
    skillKeysPerUser.push(skillsRef.push({
      description: skill.description,
      skill_name: skill.skill_name,
      userId: userRef.key
    }).key);

  });

  const association = database().ref('skillsPerUser');
  const skillsPerUser = association.child(userRef.key);
  skillKeysPerUser.forEach(skillKey => {
    console.log('adding skill to user ');
    const skillUserAssociation = skillsPerUser.child(skillKey);
    skillUserAssociation.set(true);
  });
});








