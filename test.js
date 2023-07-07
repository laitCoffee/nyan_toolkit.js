
// we asume the page is running with <meta charset="utf-8">
var inputString = "Hello, 世界!";

/* 
    utf-8 encode-decode test
*/
var utf8Bytes = toolkit.utf8_encode( inputString );

console.log(utf8Bytes);

var decodedString = toolkit.utf8_decode(utf8Bytes);

console.log(decodedString);


/* 
    utf-8 encode-decode prototype test
*/

utf8Bytes = inputString.utf8_encode();

console.log( utf8Bytes )

decodedString = utf8Bytes.utf8_decode();

console.log( decodedString );

/* 
    base64 encode-decode prototype test 
*/

base64 = inputString.base64_encode();

console.log( base64 );

decodedString = base64.base64_decode();

console.log( decodedString );
