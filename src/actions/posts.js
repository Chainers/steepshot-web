import LocalizedStrings from 'react-localization';

export function getPosts() {
  return fetch('https://steepshot.org/api/v1/posts/new', {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  }).then((response) => {
    if (response.ok) {
      return response.json().then((json) => {
        return json.results;
      });
    } else {
      return response.json().then(() => {
        return [];
      });
    }
  });
}

export function getLanguage() {
    return fetch('https://dev.sport365d.com/ga1/api/v1/service/text/lang')
        .then((response) => {
            if (response.ok) {
                return response.json().then((json) => {
                    return json;
                });
            } else {
                return [];
            }
        });
}

export function getAllLanguages() {
    return fetch('https://dev.sport365d.com/ga1/api/v1/service/text/lang?mode=service&service=page.filter_trainer&language=all')
        .then((response) => {
            if (response.ok) {
                return response.json().then((result) => {
                    let LocalizatoinStrings = {};
                    const dictionary = result['page.filter_trainer'];
                    let languages = Object.keys(dictionary.apply);

                    languages.map(language => {
                        let object = {};

                        LocalizatoinStrings[language] = {};
                        for(let item in dictionary) {
                            object[item] = dictionary[item][language];
                        }
                        LocalizatoinStrings[language] = object;
                    });
                    return new LocalizedStrings(LocalizatoinStrings);
                });
            } else {
                return [];
            }
        });
}
