var checkRequestData = {
    "first_name": "Ramyatha",
    "last_name": "Yugendernath",
    "amount": 20,
    "recipient": "ramyathaby@gmail.com"
};

var invoiceRequestData = {
	"first_name": "Ramyatha",
  	"last_name": "Yugendernath",
  	"amount": 20,
  	"email": "ramyathaby@gmail.com",
  	"description": "Pay for work"
}

var key = process.env.CHECKBOOK_KEY;
var secret = process.env.CHECKBOOK_SECRET;

var checkbook = require('./lib/checkbook')(key, secret);

// checkbook.check.sendDigital(checkRequestData, function(err, response){
// 	console.log(response);
// });

checkbook.check.getById('5add272bb5bb4baba7460e7b5fe0d033', function(err, res){
  console.log(err);
	console.log(res);
});

// checkbook.check.cancel('5add272bb5bb4baba7460e7b5fe0d033', function(err, res){
// 	console.log(res);
// });

// checkbook.invoice.get(function(err, res){
// 	console.log(res);
// });

// checkbook.invoice.create(invoiceRequestData, function(err, res){
// 	console.log(res);
// });

// // 8d9b1ca3825f4b60bf987304f618a021
// checkbook.invoice.getById('8d9b1ca3825f4b60bf987304f618a021', function(err, res){
// 	console.log(res);
// });

// checkbook.invoice.cancel('8d9b1ca3825f4b60bf987304f618a021', function(err, res){
// 	console.log(res);
// });


