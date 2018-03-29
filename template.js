export default ({template, html, error}) => {

    const errorHtml = error
        ? `<div id="server-error"><h1>Server Error</h1><pre>${error.stack || error}</pre></div>`
        : '';

    return template
        .replace(
            `<div id="root"></div>`,
            `${errorHtml}<div id="root">${html}</div>`
        )
};