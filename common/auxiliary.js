//@ sourceURL=auxiliary.js
var auxiliary_fn = function (source, trace) {
	var clone = function (obj) {
		var target = {};
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				target[i] = obj[i];
			}
		}
	};

	var domshow = function (o, flt) {
		try {
			var str = "";
			var re = new RegExp(flt, "i");

			for (var i in o)
			try {
				if (flt == undefined || re.test(i.toString())) {
					str = str + i.toString() + " = " + o[i].toString() + "\n";
				}
			}
			catch (e) {}
		}
		catch (e) {
			alert(e);
		}
		return str;
	}

	var seconds2date = function (s) {
		var ts = new Date(1970, 0, 1);
		ts.setSeconds(s);
		return ts;
	}



	var get_ts = function (now) {
		if (!now) now = new Date();
		var  t = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + (now.getDate()) + 'T' +now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
		return (t.replace(/(T|\b|:)(\d)(?=T|\b|:)/g, "$10$2"));
	}

	var get_tsd = function (now) {
		if (!now) now = new Date();
		return ((now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + (now.getDate())).replace(/(T|\b)(\d)(?=T|\b)/g, "$10$2"));
	}

	var ts_to_date = function (ts) {
		var date;
		if (typeof ts == "string") {
			var a = ts.match(/^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)$/);
			if (a && a.length == 7) {
				date = Date(a[1], a[2], a[3], a[4], a[5], a[6], a[7]);
			}
		}
		return date;
	}

	var correct_date = function (date) {
		if (date && ts_to_date(date)) {
			return date;
		}
		return undefined;
	}


	var get_caller_info = function (stack_str, level) {
		var res, i=-1, rx = new RegExp("\\s*at ([.\\w]+) \\(((?:.*?/)?([^/:]*)):(\\d+):(\\d+)\\)","mg");
		var caller_fn, file, filename, line, col;
		while((res=rx.exec(stack_str))) {
			if (i++ >=level) {
        break;
      }
			caller_fn= res[1], file =res[2], filename =res[3], line=res[4], col=res[5];
		}
		return caller_fn+"["+filename+":"+line+"]"
	}

	var log_error = function (str, trace, obj) {
		log.apply(this, arguments);
	}
/*
	at Object.log (auxiliary.js:78:17)
    at cb (chrome-extension://jhfpbldkagcaijkjcklbdccomadpedae/background/bg.js:333:7)
    at common_processSuccess (chrome-extension://jhfpbldkagcaijkjcklbdccomadpedae/background/bg.js:48:4)
    at Object.processSuccess [as success] (chrome-extension://jhfpbldkagcaijkjcklbdccomadpedae/background/bg.js:367:11)
    at fire (chrome-extension://jhfpbldkagcaijkjcklbdccomadpedae/libs/jquery-2.1.3.js:3094:30)
    at Object.self.fireWith [as resolveWith] (chrome-extension://jhfpbldkagcaijkjcklbdccomadpedae/libs/jquery-2.1.3.js:3206:7)
    at done (chrome-extension://jhfpbldkagcaijkjcklbdccomadpedae/libs/jquery-2.1.3.js:8261:14)
    at XMLHttpRequest.<anonymous> (chrome-extension://jhfpbldkagcaijkjcklbdccomadpedae/libs/jquery-2.1.3.js:8602:9)
																	 */



	var log = function (str, trace, obj) {
		var source = "undefined";

		try {
			source = this.source || source;
		}
		catch (e) {};

		var stack;
		try {
			stack = get_stack_trace();
		}
		catch (e) {
			console.log('cannot get stack trace');
		}

		var caller_info = get_caller_info(stack.toString(), 1);

		if (arguments.length >= 3)  {
			console.log("[" + get_ts(null) + "] " + source + ": " + caller_info + ": " + str, obj);
		}
		else {
			console.log("[" + get_ts(null) + "] " + source + ": " +caller_info + ": " + str);
		}
		if (trace && trace!="" || this.trace) {
				console.log(stack);
		}
//		if (obj) {
//			console.log(obj);
//		}
	}

	var get_origin = function () {
		with(window.location) {
			return protocol + "//" + hostname + port;
		}
	}

	var test_origin = function (url) {
		this.log_error('checking ' + url);
		var loc = window.location,
			a = document.createElement('a');
		a.href = url;
		return a.hostname == loc.hostname && a.port == loc.port && a.protocol == loc.protocol;
	}

	var ujreload = function (url) {
		if (background) {
			this.log_error("ujreload: posting userjs_reload") // + "\n"+domshow(background));
			background.postMessage({
				"action": "userjs_reload",
				"script_url": script_url
			});
		}
		else {
			this.log_error("ujreload: no background page");
		}
	}

	var my_dispatch_hotkey = function (hk) {
		if (hk.toLocaleLowerCase() == 'j ctrl') {
			if (google_jul) google_jul();
		}
		if (hk.toLocaleLowerCase() == 'r ctrl shift') {
			ujreload(script_url);
		}
		if (hk.toLocaleLowerCase() == 'r shift ctrl') {
			ujreload(script_url);
		}
	}

	var show_trace = function (_trace) {
		this.trace = _trace;
	}

	var get_stack_trace = function () {
		var obj = {};
		Error.captureStackTrace(obj, get_stack_trace);
		var stack = obj.stack.replace(/^\s*Error\s*\r?\n/, "");
		return stack;
	};

	var parse_url = function (url) {
		var pattern = RegExp("^(?:([^:/?#]+):)?(?://([^/?#:]+)(?::(\d+))?|///(\\w+:))?([^?#]*)(?:\\?([^#]*))?(?:#(.*))?");
		var matches = url.match(pattern);
		return {
			scheme: matches[1],
			host: matches[2] || matches[4],
			port: matches[3],
			path: matches[5],
			query: matches[6],
			fragment: matches[7]
		};
	}

	var fs_error = function (e) {
		log_error('fs_error:' + e, undefined, e);
	};


	var readfile = function (name, callback) {
		window.webkitRequestFileSystem(PERSISTENT, 10 * 1024 * 1024, function (fs) {
			fs.root.getFile(name, {}, function (e) {
				e.file(function (file) {
					var reader = new FileReader();
					reader.readAsText(file);
					reader.onload = function () {
						if (!callback) {
							log_error('specify a callback!');
						}
						callback(reader.result);
					};
					reader.onerror = fs_error;
				}, fs_error);
			}, fs_error);
		}, fs_error);
	}

	var writefile = function (name, contents, offset, callback) {
		// Get a FileWriter from a FileEntry from the root DirectoryEntry
		window.webkitRequestFileSystem(PERSISTENT, 10 * 1024 * 1024, function (fs) {
			fs.root.getFile(name, {
				create: true
			}, function (e) {
				e.createWriter(function (writer) {
					if (offset == -1) {
						writer.seek(writer.length); // Start at the end of the file
					}
					else if (typeof offset == "number") {
						writer.seek(offset);
					} //var writer = filesystem.root.getFile(name, {create:true}).createWriter();
					var b = new Blob([contents], {
						type: "text/plain;charset=UTF-8"
					});
					if (callback) writer.onwrite = callback;
					writer.write(b); // Now write the blob to the file
				}, fs_error);
			}, fs_error);
		}, fs_error);
	};

	function f() {};
	f.prototype = {
		domshow: domshow,
		seconds2date: seconds2date,
		get_ts: get_ts,
		get_tsd: get_tsd,
		log_error: log_error,
		log: log,
		get_origin: get_origin,
		test_origin: test_origin,
		ujreload: ujreload,
		my_dispatch_hotkey: my_dispatch_hotkey,
		show_trace: show_trace,
		correct_date: correct_date,
		parse_url: parse_url,
		readfile: readfile,
		writefile: writefile,
	};
	var r = new f();
	r.source = source;
	r.trace = trace != undefined ? trace : false;
	return r;
};
var aux = auxiliary_fn();
$.fn.notnull=function(selector) {
  var selection = selector ? $(selector) : this;
  return selection.length ? selection : null;
}
