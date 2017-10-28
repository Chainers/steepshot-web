class utils {
    capitalize = str => str.charAt(0).toUpperCase() + str.substring(1);
    guid = () => {
        let s4 = () => {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
    };
}

export default new utils();