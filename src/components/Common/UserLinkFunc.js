import React from 'react';

export function UserLinkFunc(bool, fromState) {
  let state = null;
  if (bool != undefined) {
    if (bool) {
      state = fromState;
    } else {
      let descriptionStart = fromState.replace(/(<[\/\w]+>)+/g, '');
      let detectBot = descriptionStart.replace(/(\[)?(!)?\[[\w\W]+/g, '');
      state = detectBot;
    }
  } else {
    state = fromState;
  }
  if (state.match(/@[\w-.]+/g)) {
    let arr = state.split(' ').map( (item, index) => {
      if (/@\w+\S/.test(item)) {
        let lowItem = item.toLowerCase();
        let replace1 = lowItem.replace(/(@[\w-.]+\w)/g, ' $1 ');
        let replace2 = replace1.match(/\s(@[\w-.]+)\s/g);
        let replace3 = replace1.match(/([\w\W]+)\s@/g);
        let replace4 = replace1.match(/\w\s([^@]+)/g);
        let replace5 = lowItem.match(/@[\w.]+[\W]/);
        let replaceDot = replace2[0].match(/@\w+\.\s/);
        return <span className="user-links_post" key={index}>
                   <span>
                     {
                       replace3
                       ?
                       replace3[0].replace(/\s@/g, '')
                       :
                       null
                     }
                   </span>
                   <a href={`/${
                     replaceDot
                     ?
                     replace2[0].replace(/\s(@\w+)\.\s+/g, '$1')
                     :
                     replace2[0].replace(/\s+/g, '')}`
                   } target="_blank">
                     {
                       replaceDot
                       ?
                       replace2[0].replace(/\.\s+/g, '')
                       :
                       replace5
                       ?
                       replace2[0].replace(/\s+/g, '')
                       :
                       replace2[0].replace(/\s+/g, '') + ' '
                     }
                   </a>
                   <span>
                     {
                       replace4
                       ?
                       replace4[0].replace(/\w\s/, '') + ' '
                       :
                       replaceDot
                       ?
                       '. '
                       :
                       ' '
                     }
                   </span>
                 </span>
      } else {
        return item + ' '
      }
    });
    return (
      <span className="user-links_post">
        {arr}
      </span>
    )
  } else {
    return (
      <span className="user-links_post">
        {state + ' '}
      </span>
    )
  }
}
