
export function innerLayout(stuff, holdingElement) {
  let safetyScript = stuff.replace(/<script>|<\/script>/g, '');
  let newLine = safetyScript.replace(/\n/g, '<br>');
  let deletedBotsLayout = newLine.replace(/(!)?\[([^\]]+)?\]/g, '');
  let changeBotsLink = deletedBotsLayout.replace(/\((http(s)?:\/\/[\w\W]+?|www\.[\w\W]+?)\)/g, '$1');
  let linkToImg = changeBotsLink.replace(
    /(http(s)?:\/\/[^\s<>]+?(\.png|\.gif|\.jpg|\.jpeg|\.tif|\.tiff)(\?[\w\W]+?)?(?!"))/gi, '<img src="$1"/>');
  let anyLinks = linkToImg.replace(/<a[\w\W]+?>([\w\W]+?)<\/a>/g, '$1');
  let userLink = anyLinks.replace(/([^/]|^)(@[\w-.]+\w)/g, '$1<a href="/$2" target="_blank">$2</a>');
  holdingElement.innerHTML = userLink;
}