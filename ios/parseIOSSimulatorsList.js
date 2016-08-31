function parseIOSSimulatorsList(text){
  const devices = [];
  var currentOS = null;

  text.split('\n').forEach((line) => {
    var section = line.match(/^-- (.+) --$/);
    if (section) {
      var header = section[1].match(/^iOS (.+)$/);
      if (header) {
        currentOS = header[1];
      } else {
        currentOS = null;
      }
      return;
    }

    const device = line.match(/^[ ]*([^()]+) \(([^()]+)\)/);
    if (device && currentOS) {
      var name = device[1];
      var udid = device[2];
      devices.push({udid, name, version: currentOS});
    }
  });

  return devices;
}

module.exports = parseIOSSimulatorsList;
