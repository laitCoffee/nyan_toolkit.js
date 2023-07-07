/*
  Name: Nyan-station toolkit.js
  Description: collection of stuff i have found usefull
  Author: @laitCoffee
  Author URI: https://nyan-station.com/toolkit/
  Version: 1.0
  License: GNU GPLv3
*/

nyan_toolkit = 
{
    utf8_decode : function ( bytes )
    {
        // extension case ( when is called from the String.prototype )
        if ( !bytes && this instanceof Array )
        {
            // replace the input with the current instance
            bytes = this; 
        }

        var result = "",
        i = 0,
        length = bytes.length,
        
        // 4 bites and tmp codepoint
        b1, b2, b3, b4, codepoint;

        while (i < length)
        {
            b1 = bytes[i++];

            if (b1 < 0x80)
            {
                result += String.fromCharCode(b1);
            }
            else if (b1 >= 0xC0 && b1 < 0xE0)
            {
                b2 = bytes[i++];
                result += String.fromCharCode(((b1 & 0x1F) << 6) | (b2 & 0x3F));
            } 
            else if (b1 >= 0xE0 && b1 < 0xF0) 
            {
                b2 = bytes[i++];
                b3 = bytes[i++];
                result += String.fromCharCode(((b1 & 0x0F) << 12) | ((b2 & 0x3F) << 6) | (b3 & 0x3F));
            }
            else 
            {
                b2 = bytes[i++];
                b3 = bytes[i++];
                b4 = bytes[i++];
                codepoint =
                    ((b1 & 0x07) << 18) |
                    ((b2 & 0x3F) << 12) |
                    ((b3 & 0x3F) << 6) |
                    (b4 & 0x3F);

                result += String.fromCharCode( 0xD800 + (codepoint >> 10), 0xDC00 + (codepoint & 0x3FF));
            }
        }

        // returns a string
        return result;
    },

    utf8_encode : function( inputString )
    {
        // extension case ( when is called from the String.prototype )
        if ( !inputString && this instanceof String )
        {
            // replace the input with the current instance
            inputString = this; 
        }

        var buffer = [],
        charCode;

        for(var i = 0; i < inputString.length; i++)
        {
            charCode = inputString.charCodeAt(i);
            
            if (charCode < 0x80)
            {
                buffer.push(charCode);
            }
            else if (charCode < 0x800) 
            {
                buffer.push(0xc0 | (charCode >> 6));
                buffer.push(0x80 | (charCode & 0x3f));
            }
            else
            {
                buffer.push(0xe0 | (charCode >> 12));
                buffer.push(0x80 | ((charCode >> 6) & 0x3f));
                buffer.push(0x80 | (charCode & 0x3f));
            }
        }

        // return new Uint8Array(buffer);
        // returns array
        return buffer;
    },

    base64_decode : function ( inputString )
    {
        // extension case ( when is called from the String.prototype )
        if ( !inputString && this instanceof String )
        {
            // replace the input with the current instance
            inputString = this; 
        }

        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
        o1, o2, o3,             // 3 octets
        h1, h2, h3, h4,         // 4 hexets
        bits,                   // tmp shift var
        i = 0, p = 0,           // pointers
        buffer = [];            // buffer

        do
        {
            // unpack four hexets into three octets using index points in b64
            h1 = b64.indexOf(inputString.charAt(i++))
            h2 = b64.indexOf(inputString.charAt(i++))
            h3 = b64.indexOf(inputString.charAt(i++))
            h4 = b64.indexOf(inputString.charAt(i++))
        
            // shift bytes
            bits = h1 << 18 | h2 << 12 | h3 << 6 | h4
        
            // back to octets
            o1 = bits >> 16 & 0xff
            o2 = bits >> 8 & 0xff
            o3 = bits & 0xff
        
            if (h3 === 64)
            {
                buffer[p++] = o1
            } 
            else if (h4 === 64) 
            {
                buffer[p++] = o1
                buffer[p++] = o2
            } 
            else
            {
                buffer[p++] = o1
                buffer[p++] = o2
                buffer[p++] = o3
            }
        }
        while ( i < inputString.length )

        //return a utf-8 string
        return buffer.utf8_decode()
    },

    base64_encode : function ( inputString )
    { 
        // extension case ( when is called from the {object}.prototype )
        if( !inputString )
        {
            // String.prototype
            if( this instanceof String )
            {
                // replace with the current instance
                inputString = this;
            }

            // Array.prototype
            else if(this instanceof Array )
            {
                // replace with the current instance
                inputString = this; 
            }
        }

        // if the input is an string
        if( inputString instanceof String )
        {
            // convert to byteArray
            inputString = this.utf8_encode( inputString )
        }

        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
        o1, o2, o3,             // 3 octets
        h1, h2, h3, h4,         // 4 hexets
        bits,                   // tmp shift var
        i = 0, p = 0,           // pointers
        enc = '', buffer = [];  // buffers

        do
        {
            // pack three octets into four hexets
            o1 = inputString[i++]
            o2 = inputString[i++]
            o3 = inputString[i++]
        
            // shift bytes
            bits = o1 << 16 | o2 << 8 | o3
        
            // back to hexets
            h1 = bits >> 18 & 0x3f
            h2 = bits >> 12 & 0x3f
            h3 = bits >> 6 & 0x3f
            h4 = bits & 0x3f
        
            // use hexets to index into b64, and append result to encoded string
            buffer[p++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4)
        }
        while (i < inputString.length)
        
        //convert to string
        enc = buffer.join('')
        
        // calculate the padding size
        const r = inputString.length % 3
        
        // return the result + padding
        return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3)
    }
}

// setup prototypes
String.prototype.base64_decode  = nyan_toolkit.base64_decode;
String.prototype.base64_encode  = nyan_toolkit.base64_encode;
String.prototype.utf8_encode    = nyan_toolkit.utf8_encode;
Array.prototype.utf8_decode     = nyan_toolkit.utf8_decode;
