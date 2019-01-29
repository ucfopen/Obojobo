// This file gets imported when jest finds a scss import or
// some other weird import (svg, etc).
// A hack to avoid jest from trying to understand included
// files it can't read
// https://github.com/facebook/jest/issues/870#issuecomment-215313957

module.exports = {}
