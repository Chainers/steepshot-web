import React from 'react';

export function UserLinkFunc(bool, fromState) {
	let state = null;
	if (bool !== undefined) {
		if (bool) {
			state = fromState;
		} else {
			let descriptionStart = fromState.replace(/(<[/\w]+>)+/g, '');
			let detectBot = descriptionStart.replace(/(\[)?(!)?\[[\w\W]+/g, '');
			state = detectBot;
		}
	} else {
		state = fromState;
	}
	if (state.match(/@[\w-.]+/g)) {
		let arr = state.split(' ').map((item, index) => {
			if (/@\w+\S/.test(item)) {
				let lowItem = item.toLowerCase();
				let replace1 = lowItem.replace(/(@[\w-.]+\w)/g, ' $1 ');
				let replace2 = replace1.match(/\s(@[\w-.]+)\s/g);
				let replace3 = replace1.match(/([\w\W]+)\s@/g);
				let replace4 = replace1.match(/\w\s([^@]+)/g);
				let replace5 = lowItem.match(/@[\w.]+[\W]/);
				let repl = replace2 ? replace2[0] : '';
				let replaceDot = repl.match(/@\w+\.\s/);
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
											 repl.replace(/\s(@\w+)\.\s+/g, '$1')
											 :
											 repl.replace(/\s+/g, '')}`
									 } target="_blank">
                     {
											 replaceDot
												 ?
												 repl.replace(/\.\s+/g, '')
												 :
												 replace5
													 ?
													 repl.replace(/\s+/g, '')
													 :
													 repl.replace(/\s+/g, '') + ' '
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
