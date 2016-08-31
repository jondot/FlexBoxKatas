'use strict';

const path = require('path');


function findXcodeProject(files){
  const sortedFiles = files.sort();
  for (let i = sortedFiles.length - 1; i >= 0; i--) {
    const fileName = files[i];
    const ext = path.extname(fileName);

    if (ext === '.xcworkspace') {
      return {
        name: fileName,
        isWorkspace: true,
      };
    }
    if (ext === '.xcodeproj') {
      return {
        name: fileName,
        isWorkspace: false,
      };
    }
  }

  return null;
}

module.exports = findXcodeProject;

