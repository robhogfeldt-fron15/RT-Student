
/* global Firebase, $, window,console, document, alert */

 var rootUrl = 'https://rt-student.firebaseio.com/';
 var dbRef = new Firebase('https://rt-student.firebaseio.com/');
  import { redBtn } from './rtButtons';
  
  
  
  
  

 

 $( "#redBtn" ).click(function() {
  redBtn(this);
});

 $( "#loadCurrentUser" ).click(function() {
  loadCurrentUser();
});

  // Get a reference to the presence data in Firebase.
  var userListRef = new Firebase('https://rt-student.firebaseio.com/presence');
  // Generate a reference to a new location for my user with push.
  var myUserRef = userListRef.push();

  // Get a reference to my own presence status.
  var connectedRef = new Firebase('https://rt-student.firebaseio.com/.info/connected');
  connectedRef.on('value', function(isOnline) {
    if (isOnline.val()) {
      // If we lose our internet connection, we want ourselves removed from the list.
      myUserRef.onDisconnect().remove();
        setUserStatus('★ online');
    } else {
        setUserStatus('★ offline');
    }
  });

  // A helper function to let us set our own state.
  var currentStatus;
  function setUserStatus(status) {
    // Set our status in the list of online users.
    currentStatus = status;
    myUserRef.set({ name: dbRef.getAuth().password.email, status: status });
  }

  // Update our GUI to show someone's online status.
  userListRef.on('child_added', function(snapshot) {
    var user = snapshot.val();
    var userContainer = $('#user-list');

    var e = $('<li>').append(
    $('<span>').attr({class: 'username'}).text(user.name)
   );
   var t = $('<a>').attr({href: '#'}).append(e);
  userContainer.append(t);

  });

  // Update our GUI to remove the status of a user who has left.
  userListRef.on('child_removed', function(snapshot) {

    var user = snapshot.val();
    var userContainer = $('#user-list');

    var e = $('<li>').append(
    $('<span>').attr({class: 'username', fontSize: '30px'}).text(user.name)
   );
   var t = $('<a>').attr({href: '#'}).append(e);
  userContainer.remove(t);

  });

  // Update our GUI to change a user's status.
  // userListRef.on('child_changed', function(snapshot) {
  //   var userContainer = $('#user-list');
  //   var user = snapshot.val();
  //   var e = $('<li>').append(
  //   $('<span>').attr({class: 'username'}).text(user.name)
  //  );
  //  var t = $('<a>').attr({href: '#'}).append(e);
  // userContainer.append(t);
  // });
    //PRESENCE -END

//
  //REGISTER NEW USER
$('#regUser').on('click', function(){

  dbRef.createUser({
  email: $('#email').val(),
  password: $('#pwd').val()
}, function(error, userData) {
  if (error) {
      $('#error').text(error);
      console.log('Error creating user:', error);
  } else {
      console.log('Successfully created user account with uid:', userData.uid);
      var newUser = {
        email: $('#email').val()
      };
    saveUser(userData.uid, newUser);
   }
 });
});

//SAVE/CREATE USER RECORD
var saveUser = function(id, userData){
  dbRef.child('users').child(id).set(userData);
};

//LOGIN USER
$('#loginUser').on('click', function(){
  dbRef.authWithPassword({
  email: $('#email').val(),
  password: $('#pwd').val()
}, function(error, authData) {
    if (error) {
        $('#error').text(error);
        console.log('Login Failed!', error);
    } else {
      console.log('Login Success!:', authData);
      loadCurrentUser();
       window.location.href = 'profile.html';
    }
  });
});

//PROFILE
function loadCurrentUser(){
  var authData = dbRef.getAuth();

  if (authData) {
    var url = rootUrl + 'users/' + authData.uid;
      var ref = new Firebase(url);
      var lessons = 'https://rt-student.firebaseio.com/users/' + authData.uid + '/lessons/';
      var lessonsRef = new Firebase(lessons);

      ref.once('value', function(user){
        var test = user.val();
        console.log(test.email);
          $('#welcome').text('welcome ' + test.email);
      });


    $('#lesson-list').empty();
    lessonsRef.on('child_added', function(lesson){
      let namelesson = lesson.val();
      let title = $('<li>').attr('class', 'list-group-item').append(
        $('<p>').attr({class: 'lesson', id: lesson.key()}).text(namelesson.lesson.name).append(
        )
      ).append(
        $('<span>').attr({class: 'lessonDate'}).text(namelesson.lesson.date)
      );
        $('#lesson-list').append(title);
    });
  }
};
$(document).on('click', '.lesson', function() {
$('.choosenLessonStyle').removeClass('choosenLessonStyle');
$(this.parentElement).addClass('choosenLessonStyle');
setChoosen(this.id);
});


//CHOOSE LESSON
function setChoosen(id){

  var authData = dbRef.getAuth();
  var lessons = 'https://rt-student.firebaseio.com/users/' + authData.uid + '/lessons/' + id;
  var lessonsRef = new Firebase(lessons);

  lessonsRef.once('value', function(lesson){

console.log(lesson.val());
    $('#choosenTitle').empty();
    $('#choosenNote').empty();

    var test = lesson.val();
      $('#choosenTitle').text('Vald föreläsning: ' + test.lesson.name);
      if (test.notes) {
      $('#choosenNote').text(test.notes.note);
      }
  });
// this.getNote(id);
}

// function getNote(argument) {
//   // body...
//   // alert(argument);
//   var authData = dbRef.getAuth();
//   var notes = 'https://shining-fire-7520.firebaseio.com/users/' + authData.uid + '/lessons/' + argument;
//   var notesRef = new Firebase(notes);
//   notesRef.once('value', function(notes){
//       var test = notes.val();
//       var note = test.notes;
//         if (note) {
//         $('#note').text(note.note.content);
//         console.log(note.note.content);
//     } else {
//         $('#note').text('');
//     }
//   });
// }
//
//
//GET LESSONS -START-
function getSynchronizedArray(firebaseRef) {
  var list = [];
  syncChanges(list, firebaseRef);
  return list;
}
function syncChanges(list, ref) {
  ref.on('child_added', function _add(snap, prevChild) {
    var data = snap.val();
    data.$id = snap.key();
    var pos = positionAfter(list, prevChild);
    list.splice(pos, 0, data);
  });
}

function positionFor(list, key) {
  for(var i = 0, len = list.length; i < len; i++) {
    if( list[i].$id === key ) {
      return i;
    }
  }
  return -1;
}
//FRÅN FB-API
// using the Firebase API's prevChild behavior, we
// place each element in the list after it's prev
// sibling or, if prevChild is null, at the beginning
function positionAfter(list, prevChild) {
  if( prevChild === null ) {
    return 0;
  }
  else {
    var i = positionFor(list, prevChild);
    if( i === -1 ) {
      return list.length;
    }
    else {
      return i + 1;
    }
  }
}
// //GET LESSONS -END-
//
var createLesson = function(){
  var authData = dbRef.getAuth();
  var ref = new Firebase('https://rt-student.firebaseio.com/' + 'users/' + authData.uid);


 var lessonRef = ref.child('lessons');
 lessonRef.push({
   lesson: {
     name: $('#lessonTitle').val(),
     date: $('#lessonDate').val()
   }
 });

 loadCurrentUser();
  };
//
//
// //SAVE/CREATE USER RECORD
// var saveLesson = function(id, lessonData){
//   dbRef.child('users').child(id).set(userData);
// };
//
//
//
var createNote = function(){

var id = $('.choosenLessonStyle').find('p').attr('id');
console.log(id);
  // alert(id)
  var authData = dbRef.getAuth();

  var ref = new Firebase('https://rt-student.firebaseio.com/' + 'users/' + authData.uid + '/lessons/' + id);


 var noteRef = ref.child('notes');
 noteRef.set({
  note: $('#choosenNote').val()
  });
};

//CHAT ---START
var chatRef = dbRef.child('chat');
$('#submit-btn').bind('click', function() {
           var comment = $('#comments');
           var commentValue = $.trim(comment.val());
           console.log(commentValue.length);
           if (commentValue.length < 1) {
                 console.log('Kommentar måste vara längre');
           } else {
              var authData = dbRef.getAuth();
               chatRef.push({comment: {
                 user: authData.password.email,
                 content: commentValue
               }}, function(error) {
                   if (error !== null) {
                         console.log('Error');
                   }
               });
               comment.val('');
           }
           return false;
       });

       //TODO: GET USERNAME
       chatRef.on('child_added', function(snapshot) {
           var caontainer = $('#card-success');
           var comment = snapshot.val().comment;
           var commentsContainer = $('.message-list');
           console.log(comment);

            var e = $('<li>').append(
            $('<img>').attr({src: 'https://d2ln1xbi067hum.cloudfront.net/assets/default_user-0ee609e3907f2aa89a7e2584074f33a3.png', class: 'profile-img pull-left', width: '75px'})
           ).append(
             $('<div>').attr('class', 'message-block').append(
                 $('<span>').attr('class', 'username').text(comment.user)
               ).append(
                  $('<p>').text(comment.content).append(
                 )
             )
           );
           var t = $('<a>').attr({href: '#'}).append(e);
          commentsContainer.append(t);
          caontainer.scrollTop(caontainer.prop('scrollHeight'));
       });



       //TODO: CLEAR CHAT
       $('#reset-btn').bind('click', function() {
              chatRef.remove();
              });
//CHAT ---END


//USERS ONLINE

// window.onload = function(){
//     var authData = dbRef.getAuth();
//     var list = document.getElementById('usersOnline');
//     var listItem = document.createElement('li');
//     listItem.innerHTML = authData.password.email;
//     listItem.style.color = 'green';
//     list.appendChild(listItem);
//
//     var amOnline = new Firebase('https://shining-fire-7520.firebaseio.com/presence/' + authData.uid);
//     console.log(amOnline);
//     var userRef = new Firebase('https://shining-fire-7520.firebaseio.com/.info/connected');
//
//     //dbRef.child('.info/connected').child(id).set(userData);
//
//     // Add ourselves to presence list when online.
//
//     amOnline.on('value', function(snapshot) {
//       if (snapshot.val()) {
//         var sessionRef = userRef.push();
//         sessionRef.child('ended').onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
//         sessionRef.child('began').set(Firebase.ServerValue.TIMESTAMP);
//   }
// });
// };

