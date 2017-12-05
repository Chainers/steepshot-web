import React from 'react';

const documentTitle = () => {
   return document.title = `Steepshot - ${location.pathname.replace('/', '').toLowerCase()}`;
}

export { documentTitle };
