export function addAndStringToLastItem(itemsArr) {
  let newArr = [];
  for (let i = 0; i < itemsArr.length; i ++) {
    if (!itemsArr[i]) {
      itemsArr.splice(i, 1);
      i--;
      continue;
    }
    if (itemsArr.length >= 2 && (i + 1) === itemsArr.length && itemsArr.length !== 1) {
      itemsArr[i] = ' and ' + itemsArr[i];
    }
    if (itemsArr.length >= 2 && i !== 0 && (i + 1) !== itemsArr.length) {
      itemsArr[i] = ', ' + itemsArr[i];
    }
    newArr.push(itemsArr[i]);
  }
  return newArr;
}