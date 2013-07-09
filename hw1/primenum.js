#!/usr/bin/env node
var n=2
var cur=2;
var result;
var a=new Array()
a.push(n)
while(a.length<=100){
	cur++;
	for(i=0;i<a.length;i++){
	
	  result=cur/a[i]
	  if (Math.floor(result)==result)
		break;
	  else
		continue;
	}
	
  if (Math.floor(result)!=result)
{//	console.log(cur);
	    a.push(cur);
}
}
var out=a[0];
for(i=1;i<a.length;i++){
               out=out+","+a[i];
}
var fs = require('fs');
var outfile = "hello2.txt";
fs.writeFileSync(outfile, out);  
console.log("Script: " + __filename + "\nWrote: " + out + "To: " + outfile);




