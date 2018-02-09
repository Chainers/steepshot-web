import React from 'react';

export function documentTitle() {
   let title = location.pathname.replace('/', '');
   if (title == 'signin') {
     title = 'sign in';
   }
   if (title == '*') {
     title = '404 error';
   }
   let titleArr = title.split('');

   let capitalLetter = title.search(/[A-Z]/g);
   if (capitalLetter != -1) {
     titleArr[capitalLetter] = titleArr[capitalLetter].toLowerCase();
   }
   titleArr[0] = titleArr[0].toUpperCase();
   if (title.match(/[A-Z]/g) != undefined) {
     titleArr.splice(title.search(/[A-Z]/g), 0, ' ');
     return document.title = `${titleArr.join('')} | Steepshot`
   } else {
     return document.title = `${titleArr.join('')} | Steepshot`
   }
}

