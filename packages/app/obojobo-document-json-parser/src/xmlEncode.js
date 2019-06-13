const xmlEncode = string => {
    string = string + ''

    return string
        .replace(/&/g, "&amp;")
        .replace(/>/g, "&gt;")
        .replace(/</g, "&lt;")
        .replace(/"/g, "&quot;");
}

module.exports = xmlEncode