import Constants from '../common/constants';

const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

class utils {

    capitalize = str => str.charAt(0).toUpperCase() + str.substring(1);

    guid = () => s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

    currencyChecker = str => str.charAt(0) === Constants.CURRENCY ? str : Constants.CURRENCY + str;

    tagPrettify = str => str.charAt(0) !== '#' ? '#' + str : str;

    isNotEmptyString = str => str !== undefined && str.trim().length > 0;

    isEmptyString = str => !this.isNotEmptyString(str);

    getLess = (first, second) => first < second ? first : second;

    getMore = (first, second) => first > second ? first : second;

    equalsObject = (first, second) => JSON.stringify(first) === JSON.stringify(second);

    cloneObject = (object) => JSON.parse(JSON.stringify( object ));

    getFirstObjectField = (obj) => obj[Object.keys(obj)[0]];
}

export default new utils();
