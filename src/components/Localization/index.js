import LocalizedStrings from 'react-localization';
import { getAllLanguages } from '../../actions/localization';

const Index = (() => {
  let strings = [];
  let languagesKey = getAllLanguages;

  async function createInstance() {
    return getAllLanguages();
  }

  function setNewLanguage(newLang) {
    strings.setLanguage(newLang);
    console.log('dispatch');
  }

  return {
    getInstance: function(callback) {
      if (!strings) {
        // createInstance().then(result => {
        //   strings = result;
        //
        //   if(callback) {
        //     callback();
        //   }
        //
        //   return strings;
        // });
      } else {
        callback();
        return strings;
      }
      callback();
      return strings;
    },
    languages: languagesKey,
    setNewLanguage: setNewLanguage
  };
})();

export default Index;
