# odooAppscriptApi

## Installation
Copy both main.gs and XMLRPC.gs files into your appscript project and call functions directly

## Usage
Example of usage in apps script:

```javascript
function testOdooApi() {
  var db = "<database name>";
  var url = "<url of odoo installation>";
  var usr = "<admin user name>";
  var pwd = "<admin password>";
  
  var projectName = "Stark Tower";
  var companyName = "Stark Industries";
  var contactName = "Tony Stark";
  var contactEmail = "tony@starkindustries.com";
  var contactPhone = "555-555-555";
  
  // Check connection and print result
  Logger.log(testConnection(db, url));
  
  // Authenticate user and specify database details
  var odooAuth = authenticateOdoo(db, url, usr, pwd);
  var data = [{
    "name": projectName,
    "contact_name": contactName,
    "partner_name": companyName,
    "phone": contactPhone,
    "email_from": contactEmail,
    "user_id": 45,
    "type": "opportunity"
  }]
  
  // create a record in "crm.lead" and log resulting id
  var recordId = createRecord(odooAuth, "crm.lead", data);
  Logger.log(recordId);
  
  // search for record just created and log result
  var searchFilter = [[["name", "=", projectName]]];
  var searchResult = searchRecord(odooAuth, "crm.lead", searchFilter)
  Logger.log(searchResult)
  
  // read details of record or records based on search and log results
  Logger.log(readRecord(odooAuth, "crm.lead", searchResult));
  
  // directly search and read results based on same search criteria, but also filtering results
  var displayFilter = {'fields': ['name', 'country_id', 'comment'], 'limit': 5}
  Logger.log(searchReadRecord(odooAuth, "crm.lead", searchFilter, displayFilter));
  
  // update lead email address details and log result
  var filter = {
    "email_from": "pepper.potts@starkindustries.com"
  }
  Logger.log(updateRecord(odooAuth, "crm.lead", recordId, filter));
  
  // delete all records from search and log result
  Logger.log(deleteRecord(odooAuth, "crm.lead", searchResult));
}
```


