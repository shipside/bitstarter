#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var HTMLURL_DEFAULT="abc";
var CHECKSFILE_DEFAULT = "checks.json";

var rest = require('restler');
var tmpfile="tmp.html";
var util = require('util');


var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var assertURLExists = function(inURL) {
    var instr = inURL.toString();
    return instr;
}
var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

var buildfn = function(tmpfile,checks) {
 var response2console = function(result, response) {
        if (result instanceof Error) {
            console.error('Error: ' + util.format(response.message));
        } else {
            console.error("Wrote %s", tmpfile);
            fs.writeFileSync(tmpfile, result);
            //csv2console(csvfile, headers);
	  parseFile(checkfile, checks) ; 
        }
    };
return response2console;
};

var parseFile = function(htmlfile, checks){

    var checkJson = checkHtmlFile(htmlfile, checks)
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
};



if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <html_url>', 'URL to index.html', clone(assertURLExists), HTMLURL_DEFAULT)
        .parse(process.argv);
/*
    rest.get(program.url).on('complete', function(data) {
  console.log(data[0].message); // auto convert to object
   console.log ("hello");
});
*/


    //process.exit();
    var checkfile;
    if (program.url != HTMLURL_DEFAULT){
	checkfile=tmpfile;
	console.log("DEBUG: checks=%s, url=%s", program.checks, program.url);
    	var response2console = buildfn(tmpfile, program.checks);
   	rest.get(program.url).on('complete',response2console);	
	//setTimeout(parseFile(checkfile, program.checks), 5000); 	
    }
    else{
	checkfile=program.file;
	parseFile(checkfile, program.checks);
    }

} else {
    exports.checkHtmlFile = checkHtmlFile;
}

