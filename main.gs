/**
 * Test Connection to Odoo Database
 *
 * @param {string}  dbName the name of the database we are connecting to 
 * @param {string}  url the url of the odoo database
 * @param {integer} optional port number of database - ignore if using online
 *
 * @return {string} details of odoo version if conenction successful
 */
function testConnection(dbName, url, opt_port) {
  // determine correct port method type or use one set by user
  if (opt_port == null) {
    if (url.substring(0, 5) == "https") {
      opt_port = 443;
    } else {
      opt_port = 80;
    }
  }
  var urlCommon = url + ":" + opt_port + "/xmlrpc/2/common";
  var request = new XMLRPC.XmlRpcRequest(urlCommon, "version");
  return request.send().parseXML();
}
  
/**
 * Authenticates User and return user id.
 *
 * @param {string}  dbName the name of the database we are connecting to 
 * @param {string}  url the url of the odoo database
 * @param {string}  username of user
 * @param {string}  password of user
 * @param {integer} optional port number of database - ignore is using online
 *
 * @return {odooAuth} object with login details
 */
function authenticateOdoo(dbName, url, username, password, opt_port) {
  // determine correct port method type or use one set by user
  if (opt_port == null) {
    if (url.substring(0, 5) == "https") {
      opt_port = 443;
    } else {
      opt_port = 80;
    }
  }
  var urlCommon = url + ":" + opt_port + "/xmlrpc/2/common";
  
  // Connect to odoo common end point for authentication
  var request = new XMLRPC.XmlRpcRequest(urlCommon, "authenticate");
  
  // add required elements to authentication call
  request.addParam(dbName); 
  request.addParam(username);
  request.addParam(password);
  request.addParam({});
  
  // Get user id for future calls and return
  var userId = request.send().parseXML();
  
  // create odoo object so we don't have to enter details every time
  var odooAuth = {
    dbName: dbName,
    userId: userId,
    password: password,
    url: url,
    port: opt_port
  }
  
  return odooAuth
}

/**
 * create record in odoo specified odoo object.
 *
 * @param {object} odooAuth Object
 * @param {string} the name of the object in odoo eg res.partner
 * @param {string} data row of information to be created
 *
 * @return {string} result of create request from odoo
 */
function createRecord(odooAuth, odooObject, data) {
  
  var urlObject = odooAuth.url + ":" + odooAuth.port + "/xmlrpc/2/object";
  
  var request = new XMLRPC.XmlRpcRequest(urlObject, "execute_kw");
  
  request.addParam(odooAuth.dbName);
  request.addParam(odooAuth.userId);
  request.addParam(odooAuth.password);
  
  request.addParam(odooObject);
  request.addParam("create");
  request.addParam(data);
  
  var response = request.send().parseXML();
  return response
}

/* Read record
@param {object} odooAuth Object
@param {string} the name of the object in odoo eg res.partner
@param {string} id of record to read
@param {opt_filter} specific view of the items to return

@return {string} result of create request from odoo 
 */
function readRecord(odooAuth, odooObject, id, opt_filter) {
  var urlObject = odooAuth.url + ":" + odooAuth.port + "/xmlrpc/2/object";
  var request = new XMLRPC.XmlRpcRequest(urlObject, "execute_kw");
  
  request.addParam(odooAuth.dbName);
  request.addParam(odooAuth.userId);
  request.addParam(odooAuth.password);
  
  request.addParam(odooObject);
  request.addParam("read");
  request.addParam([id]);
  if (opt_filter != null) {
    request.addParam(opt_filter);
  }
  var response = request.send().parseXML();
  return response
}

/* Update record
@param {object} odooAuth Object
@param {string} the name of the object in odoo eg res.partner
@param {string} id of record to update
@param {object} dict of records to update

@return {boolean} true if record updates successfully 
 */
function updateRecord(odooAuth, odooObject, id, odooFilter) {
  var urlObject = odooAuth.url + ":" + odooAuth.port + "/xmlrpc/2/object";
  var request = new XMLRPC.XmlRpcRequest(urlObject, "execute_kw");
  
  request.addParam(odooAuth.dbName);
  request.addParam(odooAuth.userId);
  request.addParam(odooAuth.password);
  
  request.addParam(odooObject);
  request.addParam("write");
  request.addParam([id, odooFilter]);
  
  var response = request.send().parseXML();
  return response
}

/* Delete record
@param {object} odooAuth Object
@param {string} the name of the object in odoo eg res.partner
@param {string} id of record to update

@return {integer} id of record deleted
 */
function deleteRecord(odooAuth, odooObject, id) {
  var urlObject = odooAuth.url + ":" + odooAuth.port + "/xmlrpc/2/object";
  var request = new XMLRPC.XmlRpcRequest(urlObject, "execute_kw");
  
  request.addParam(odooAuth.dbName);
  request.addParam(odooAuth.userId);
  request.addParam(odooAuth.password);
  
  request.addParam(odooObject);
  request.addParam("unlink");
  request.addParam([[id]]);
  
  request.send().parseXML();
  return id;
}
