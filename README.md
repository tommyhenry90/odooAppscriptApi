# odooAppscriptApi

Usage

```javascript
// authenticate user and specify database
var odooAuthObject = odooApi.authenticateOdoo(dbName, url, username, password, opt_port)

// create odoo entry
odooApi.create(odooAuthObject, odooObject, data);
```
