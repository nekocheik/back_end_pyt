module.exports = function () {
  module.cleanVariables = (varibles) => {
    const newObject = {};
    for (const key in varibles) {
      if (varibles[key] !== undefined) {
        newObject[key] = varibles[key];
      }
    }
    return newObject;
  };
  module.getSecretKey = () => 'fsafkddoffgdgned@gmaifddsal';
  return module;
};
