var AdmZip = require('adm-zip');

/**
 *
 * @param {string} fileName
 * @param {string} data - in string only
 * @param {string} encoding - Default UTF8
 * @param {string} comment - entry comment
 * @returns zip Buffer
 */
exports.zip = function (fileName, data, encoding = 'UTF8', comment) {
  let zip = new AdmZip();
  zip.addFile(fileName, Buffer.from(data, encoding), comment);
  return zip.toBuffer();
};
