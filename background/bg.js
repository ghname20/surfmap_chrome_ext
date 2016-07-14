var BG=BG||{};
(function(BG) {
//	var backend_key = "backend_site_address";
//	var verbose_logging_key = "verbose_logging";

	var backend;
	var verbose_logging;
	var relevance_count;
	var prev_clean=new Date();


	var _debug = 0;
	var _nav_debug =0;
	var aux = auxiliary_fn('kmg_bg');
	var tabs={};
	var tab_data={};
	var state = { };
	var last_active_window = { } ;
	var config_data = {startup_delay : 1000};
	var ajax_timeout = 30000;
	var runtime_errors;

	// ====== functions
	// === aux
	var encodeXML = function (s) {
		return $('<div/>').text(s).html()
	};

	function utf8_to_b64(str) {
		return window.btoa(unescape(encodeURIComponent(str)));
	}

	function b64_to_utf8(str) {
		return decodeURIComponent(escape(window.atob(str)));
	}

	function common_processSuccess(data, status, req, cb) {
		if (_debug) debugger;
		if (status == "success") {
			aux.log("results from the service", 0, req);
			var results = {result: "success"};
			$(req.responseXML).find("struct > member").map(function () {
				var name = $(this).children("name:first");
				if (name) name = name.text();
				var value = $(this).children("value:first");
				var b64 = $(value).children("base64:first");
				if (b64 && b64.length > 0) {
					value = b64_to_utf8(b64.text())
				}
				else {
					value = value.text();
				}
				if (name && !name.match(/^\s*$/)) {
					results[name] = value;
				}
			});

			aux.log('processSuccess: callback: ', 0, results);
			if (results['result'] === undefined) {
				cb({
					result: "failure",
					message: "no results"
				});
			}
			else if ((results['faultCode']||"")!="") {
				cb({
					result: "failure",
					message: results['faultString'] || results['faultCode'],
				});
			}
			else {
				cb(results);
			}
		}
	}

	function common_processError(data, status, req, cb) {
		aux.log("processError", 0);
		cb({
			result: "failure",
			message: "general error: " + req.responseText + " " + status
		});
	}

	// === XML interaction
	var store_spawn_info = function (info, callback, timeout) {
		var cb = (typeof callback == 'function') ? callback : function (obj) {
			aux.log("result: " + obj.result, 0);
			return;
		};

		if (!backend) {
			aux.log("backend address not specified");
		}

			var wsUrl = "http://"+backend+ "/graph_service.asmx?op=nop";

			var soapRequest = '<?xml version="1.0" encoding="UTF-8"?>\
	<methodCall>\
	<methodName>query_graph_soap.spawned</methodName>\
	<params><param><value><struct>\
	<member>\
	<name>parent</name>\
	<value>' + encodeXML(info.parent) + '</value>\
	</member>\
	<member>\
	<name>query</name>\
	<value>' + encodeXML(info.query) + '</value>\
	</member>\
	<member>\
	<name>url</name>\
	<value>' + encodeXML(info.url) + '</value>\
	</member>\
	<member>\
	<name>type</name>\
	<value>' + encodeXML(info.type) + '</value>\
	</member>\
	</struct></value></param></params>\
	</methodCall>';


			$.ajax({
				timeout: timeout|| ajax_timeout,
				type: "POST",
				url: wsUrl,
				contentType: "text/xml",
				dataType: "xml",
				data: soapRequest,
				success: processSuccess,
				error: processError
			});

			function processSuccess(data, status, req) {
					return common_processSuccess(data, status, req, cb);
			}

			function processError(data, status, req) {
					return common_processError(data, status, req, cb);
			}
	};

	var get_stats = function (params, callback,timeout) {
		var cb = (typeof callback == 'function') ? callback : function (obj) {
			aux.log("get_stats: result: " + obj.result, 0);
		};
		if (!backend) {
			aux.log("backend address not specified");
			return;
		}

		var wsUrl = "http://"+backend+ "/graph_service.asmx?op=nop";
		var soapRequest = '<?xml version="1.0" encoding="UTF-8"?>\
	<methodCall>\
		<methodName>query_graph_soap.stats</methodName>\
			<params><param><value><struct /></value></param></params>\
		</methodCall>';

		var soapRequest = '<?xml version="1.0" encoding="UTF-8"?>\
	<methodCall>\
	<methodName>query_graph_soap.stats</methodName>\
	<params><param><value><struct>\
	<member>\
	<name>update</name>\
	<value>' + encodeXML(params.request == "update_stats" ? 1 : 0) + '</value>\
	</member>\
	<member>\
	<name>start</name>\
	<value>' + encodeXML(params.start) + '</value>\
	</member>\
	<member>\
	<name>end</name>\
	<value>' + encodeXML(params.end) + '</value>\
	</member>\
	</struct></value></param></params>\
	</methodCall>';



		$.ajax({
			timeout: timeout|| ajax_timeout,
			type: "POST",
			url: wsUrl,
			contentType: "text/xml",
			dataType: "xml",
			data: soapRequest,
			success: processSuccess,
			error: processError
		});

		function processSuccess(data, status, req) {
			if (_debug) debugger;
			if (status == "success") {
				aux.log("results from the service", 0, req);
				var results = {};
				$(req.responseXML).find("struct > member").map(function () {
					var name = $(this).children("name:first");
					if (name) name = name.text();
					var value = $(this).children("value:first");
					var b64 = $(value).children("base64:first");
					if (b64 && b64.length > 0) {
						value = b64_to_utf8(b64.text())
					}
					else {
						value = value.text();
					}
					if (name && !name.match(/^\s*$/)) {
						results[name] = value;
					}
				});
	/*
						if (!v || !v.length) {
							return ({
								result: "success",
								data: undefined,
								message: "no results"
							});

						}
						var c = v.children("base64");
						if ( !! c && c.length > 0) {
							return ({
								result: "success",
								data: atob(c.text())
							});

						}
					}
					else if ($name == {
						//code
					}
					return undefined;
				}).filter(function() { return this!=undefined })
				;
				*/

				aux.log('processSuccess: callback: ', 0, results);
				if (results['result'] === undefined) {
					cb({
						result: "failure",
						message: "no results"
					});
				}
				else {
					aux.log('processSuccess: callback: ', 0, results);
					cb(results);
				}
	/*
				if (t && t.length > 0) {
					cb(t[0]);
				}
				else {
					cb({
						result: "failure",
						message: "no results"
					});
				}
				*/
			}
		}

		function processError(data, status, req) {
			aux.log("processError", 0);
			cb({
				result: "failure",
				message: "general error: " + req.responseText + " " + status
			});
		}
	}

	var navigated = function (params, callback, timeout) {
		var cb = (typeof callback == 'function') ? callback : function (obj) {
			aux.log("tab_clicked: result: " + obj.result, 1, obj);
		};
		if (!backend) {
			aux.log("backend address not specified");
			return;
		}

		var wsUrl = "http://"+backend+ "/graph_service.asmx?op=nop";
		var soapRequest = '<?xml version="1.0" encoding="UTF-8"?>\
	<methodCall>\
		<methodName>query_graph_soap.navigated</methodName>\
		<params><param><value><struct>\
			<member>\
				<name>parent</name>\
				<value><base64>' + encodeXML(utf8_to_b64(params.parent)) + '</base64></value>\
			</member>\
			<member>\
				<name>url</name>\
				<value><base64>' + encodeXML(utf8_to_b64(params.url)) + '</base64></value>\
			</member>\
			<member>\
				<name>type</name>\
				<value><base64>' + encodeXML(utf8_to_b64(params.type)) + '</base64></value>\
			</member>\
		</struct></value></param></params>\
	</methodCall>';

		$.ajax({
			timeout: timeout|| ajax_timeout,
			type: "POST",
			url: wsUrl,
			contentType: "text/xml",
			dataType: "xml",
			data: soapRequest,
			success: processSuccess,
			error: processError
		});

		function processSuccess(data, status, req) {
				return common_processSuccess(data, status, req, cb);
		}

		function processError(data, status, req) {
				return common_processError(data, status, req, cb);
		}
	}

	var clean_tab_data = function () {
		try {
			if (!tab_data) {
				return;
			}
			for (var id in tab_data) {
				var td  =  tab_data[id];
				var tab  =  tabs[id];
				if (!tab && td) {
					console.log("*** cleaning tab_data: ", td );
					delete tab_data[id];
				}
			}
		}
		catch(e) {
			console.log("*** clean_tab_data exception:", e)
		}
	}

	var graph_svc_call = function (params, callback, timeout) {
		var cb = (typeof callback == 'function') ? callback : function (obj) {
			aux.log("graph_svc_call: result: " + obj.result, 0, obj);
		};

		var last30sec = new Date(new Date() -30*1000)
		if (prev_clean < last30sec) {
			prev_clean = new Date();
			clean_tab_data();
		}


		if (!backend) {
			aux.log("backend address not specified");
			return;
		}

		var wsUrl = "http://"+backend+ "/graph_service.asmx?op=nop";
		var a = [];
		for (var key in (params)) {
			a.push(
	'<member>\
		<name>'+key+'</name>\
		<value><base64>' + encodeXML(utf8_to_b64(params[key])) + '</base64></value>\
	</member>\
	'
				)
		}
		var req_body="";
		for (var i=0;i<a.length;i++) {
			req_body = req_body + a[i];
		}
		var soapRequest = '<?xml version="1.0" encoding="UTF-8"?>\
	<methodCall>\
		<methodName>query_graph_soap.' + params.method + '</methodName>\
		<params><param><value><struct>' + req_body + '</struct></value></param></params>\
	</methodCall>';

		$.ajax({
			timeout: timeout|| ajax_timeout,
			type: "POST",
			url: wsUrl,
			contentType: "text/xml",
			dataType: "xml",
			data: soapRequest,
			success: processSuccess,
			error: processError
		});

		function processSuccess(data, status, req) {
				return common_processSuccess(data, status, req, cb);
		}

		function processError(data, status, req) {
				return common_processError(data, status, req, cb);
		}
	}

	var update_tab_action = function(tabId, changeInfo, tab) {
		aux.log("update_tab_action: changeInfo", "", changeInfo);
		if (changeInfo.status=="complete") {
			return;
		}
		if (_debug)
			debugger;
	/*	if (tab.openerTabId!=undefined) {
			chrome.tabs.get(tab.openerTabId, function (ptab) {
				var clicked = {
						request: "clicked",
						parent: ptab.url,
						url: tab.url,
						type: 'click'
						//oid : oid,
						//index: index
				};
				aux.log("update_tab(oid): [" + tab.id+"] "+ tab.url + " moving to the new tab: [" + ptab.id+"] "+  ptab.url, 0, clicked);
		// ======= request
				tab_clicked(clicked);

			});
		}
		else
		*/
		if (changeInfo.url != undefined && changeInfo.url!=tab.url) {
				var clicked = {
						request: "clicked",
						parent: tab.url,
						url: changeInfo.url,
						type: 'click',
						oid : tab.oid
						//index: index
				};
				aux.log("update_tab(url): [" + tab.id+"] "+ tab.url + " moving to the new location "+  changeInfo.url, 0, clicked);
				navigated(clicked);
		}
		else {
			aux.log("update_tab: nothing changed", 0);
		}
	};

	var create_tab_action = function(tab) {
		aux.log("create_tab_action: tab", "", tab);
		//if (_debug)
		//	debugger;

		if (tab.openerTabId!=undefined) {
			chrome.tabs.get(tab.openerTabId, function (ptab) {
				if (chrome.runtime.lastError) {
					runtime_errors++;
					return;
				}
				//r index = _tab.index == undefined ? undefined : _tab.index + 1;
				//var oid = _tab.id;
				//if (oid === undefined || oid === null) {
				//	aux.log("*** current page has no id: " + _tab.url, 0);
				//}

				var navigation = {
						request: "clicked",
						parent: ptab.url,
						url: tab.url,
						type: 'click',
						oid : tab.oid
						//index: index
				};
				aux.log("create_tab: [" + tab.id+"] "+ tab.url + " spawning a new tab: [" + ptab.id+"] "+  ptab.url, 0, clicked);
		// ======= request
				navigated(clicked);

			});
		};
	};


	/*
	details ( object )
	sourceTabId ( integer ) The ID of the tab in which the navigation is triggered.
	sourceProcessId ( integer ) The ID of the process runs the renderer for the source tab.
	sourceFrameId ( integer ) The ID of the frame with sourceTabId in which the navigation is triggered. 0 indicates the main frame.
	url ( string ) The URL to be opened in the new window.
	tabId ( integer ) The ID of the tab in which the url is opened
	timeStamp ( double )
	*/

	var create_nav_target = function(details) {
		if (_nav_debug) debugger;
		aux.log("create_nav_target", 0, details);
		// not ignoring frame navigation because it's a new tab
		//if (details.rameId!=0) {
		//	aux.log("create_nav_target: ignoring frame navigation", 0, details);
		//	return;
		//}
		var tab = tabs[details.sourceTabId];
		if (tab) {
			tab_data[details.tabId] = jQuery.extend((tab_data[details.tabId]||{}),
							{ navtgt: { details: details, source_url: tab.url}, next_url : details.url });
			aux.log("stored data for tabid:" + details.tabId+", source url:" + tab.url);
		}
		else {
			aux.log("no tab found");
		}
		//else {
		//	chrome.tabs.get(details.sourceTabId, function (ptab) {
		//		tab_data[details.tabId] = { navtgt: details, source_url: ptab.url};
		//	});
		//}
	}

/*
 details ( object )
tabId ( integer ) The ID of the tab in which the navigation is about to occur.
url ( string ) processId ( integer ) The ID of the process runs the renderer for this tab.
frameId ( integer ) 0 indicates the navigation happens in the tab content window;
	a positive value indicates navigation in a subframe. Frame IDs are unique for a given tab and process.
parentFrameId ( integer ) ID of frame that wraps the frame. Set to -1 of no parent frame exists.
timeStamp ( double ) The time when the browser was about to start the navigation, in milliseconds since the epoch.
 */


	var before_nav = function(details) {
		if (_nav_debug) debugger;
		if (verbose_logging) {
			aux.log("before_nav", 0, details);
		}
		if (details.frameId!=0) {
			if (verbose_logging) {
				aux.log("before_nav: ignoring frame navigation", 0, details);
			}
			return;
		}
		var tab = tabs[details.tabId];
		if (tab) {
			var prev_data = tab_data[details.tabId]||{};
			var data = jQuery.extend(prev_data, { b4comm: { details: details}});

			if (prev_data.next_url && prev_data.next_url!=tab.url) {
				console.log("unexpected source url: next_url=" + prev_data.next_url +", tab.url=" + tab.url)
			}
			else {
				console.log("before_nav: tab.url="+tab.url);
			}
			data.b4comm.source_url=data.b4comm.source_url||tab.url;
			data.next_url = details.url;
			tab_data[details.tabId] = data;

			//if (data.next_url != tab.url ){ // TODO: might be wrong
			//	data.b4comm.source_url=tab.url;
			//	if (data.next_url!=null) {
			//		aux.log("unexpected next url: " + data.next_url +", source url:" + data.b4comm.source_url)
			//	}
			//}
			//else {
			//	aux.log("looks like a continuation: "+data.next_url)
			//}
			//data.next_url = details.url;
			//tab_data[details.tabId] = data;
			//, source_url: tab.url
			//tab_data[details.tabId] = jQuery.extend((tab_data[details.tabId]||{}),
			//					{ b4comm: { details: details, source_url: tab.url}, next_url: details.url }) ;
		}
		else {
			aux.log("no tab found: "+details.tabId);
		}
	}


/* https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=12&cad=rja&uact=8&ved=0ahUKEwjSufzartPLAhWsDZoKHUUsB2gQFghqMAs&url=http%3A%2F%2Fhealthland.time.com%2F2011%2F11%2F23%2Fstudy-taking-just-a-little-too-much-tylenol-each-time-can-be-deadly%2F&usg=AFQjCNEWewAkUYxcpsiTx417BMXVLX4gcw&sig2=Hi8cNoUHqaT2jd5HPRpYWw
 * */

	var transitive_url = function (url) {
		var match = url.match(RegExp("^(https?://[^/]*\\.google.(?:com|ru)/url\\?).*?(&url=(.{0,20}))"));
		if (match) {
			return match[1]+"..."+match[2];
		}
		if (url.match ( RegExp("^browser://"))) {
			return url;
		}

		return null;
	}

/*
	details ( object )
	tabId ( integer ) The ID of the tab in which the navigation occurs.
	url ( string ) processId ( integer ) The ID of the process runs the renderer for this tab.
	frameId ( integer ) 0 indicates the navigation happens in the tab content window; a positive value indicates navigation in a subframe. Frame IDs are unique within a tab.
	transitionType ( enum of "link", "typed", "auto_bookmark", "auto_subframe", "manual_subframe", "generated", "start_page", "form_submit", "reload", "keyword", or "keyword_generated" )
		Cause of the navigation. The same transition types as defined in the history API are used.
	transitionQualifiers ( array of enum of "client_redirect", "server_redirect", "forward_back", or "from_address_bar" ) A list of transition qualifiers.
	timeStamp ( double )
	*/


	var link_committed = function(details) {
		if (verbose_logging) {
			aux.log("enter", 0, details);
		}
		if (details.frameId!=0) {
			//aux.log("link_committed: ignoring frame navigation", 0, details);
		}
		var source_url	,target_url	,source_id 	,target_id ,final_url;
		var tgt = tab_data[details.tabId];
		var type ;

		var tran = transitive_url(details.url);
		if (tran) {
			aux.log("skipping transitive url: "+tran);
			return;
		}
		else {
			//aux.log("not a transitive url: "+tran);
		}

		if (tgt) {
			tgt.next_url=tgt.next_url||details.url;
			target_url = tgt.next_url;
			if (tgt.next_url!=details.url) {
				final_url = details.url;
			}
		}

		if (tgt && tgt.navtgt) {

			//if (details.transitionType!=tgt.transitionType) {
			//	aux.log("transitionType mismatch: " + details.transitionType + " <> " + tgt.transitionType, 0, details);
			//	return;
			//}
			if (details.url!=tgt.next_url) {
				aux.log("navtgt url mismatch: " + details.url+ " <> " + tgt.navtgt.details.url, 0, details);
				//return;
			}

			if (details.timeStamp<tgt.navtgt.details.timeStamp) {
				aux.log("timestamp mismatch: comm at:"+details.timeStamp + ", cr at: " + tgt.navtgt.details.timeStamp);
				return;
			}
			source_url = tgt.navtgt.source_url;
			source_id = tgt.navtgt.details.sourceTabId;
			target_id = details.tabId;
			type = "tab_"+details.transitionType;
			aux.log("navigation to a new tab");
		}
		else if (tgt && tgt.b4comm) {
			//var tab = tabs[details.tabId];
			if (details.url!=tgt.next_url) {
				aux.log("b4comm url mismatch: " + details.url+ " <> " + tgt.b4comm.details.url, 0, details);
				//return;
			}

			source_url= tgt.b4comm.source_url;
			//target_url = tgt.next_url;
			//final_url = details.url;
			source_id = target_id= details.tabId;
			if (source_url=="" && source_url==undefined) {
				aux.log("source url empty");
				return;
			}
			aux.log("navigation in the same tab");
			type = "nav_"+details.transitionType;
		}
		else {
			aux.log("no tab matching the event");
			return;
		}

		//delete tab_data[details.tabId];

		tab_data[details.tabId]['committed_url']=target_url;

		if (source_url == target_url) {
			aux.log("same url, ignoring");
			return;
		}

		var nav_info = {
						//request: "navigation",
						peer: source_url ,
						url: target_url,
						type: type,
						method: 'navigated',
						peer_optional: 1,
						//oid : tab.oid
						//index: index
				};
		if (final_url) {
			nav_info.final_url = final_url;
		}
		aux.log("link_committed: from [" + source_id+"] "+ source_url  + " to [" + target_id +"] "+  target_url, 0, nav_info);
		var stats = get_tab_state();
		console.log("tab statistics:", stats);
		// ======= request


		//var params = $.extend({}, {method : 'query_storage'} );
		graph_svc_call(nav_info, function (response) {
						aux.log("navigated: result: " + response.result, 0);

		});


		//navigated(nav_info);
	}
	var on_tab_updated = function(tabId, changeInfo, tab) {
		if (1 || verbose_logging) {
			aux.log("tab updated: "+tabId,0,changeInfo)
		}
		tabs[tabId] = tab;

		if (changeInfo.status == 'complete' )  {
			var tran = transitive_url(tab.url);
			if (tran) {
				aux.log("skipping transitive url: "+tran);
				return;
			}
			var data = tab_data[tabId];
			if (data) {
				if (data.committed_url && data.committed_url!=tab.url) {
					console.log('landed at different url: tab='+ tab.id+ ', next_url='+data.committed_url+ ', tab.url='+tab.url);
					var update_info = {
						committed_url: data.committed_url,
						final_url: tab.url,
						method: 'update_node_info',
						operation: 'update_final_url',
					};

					//var params = $.extend({}, {method : 'query_storage'} );
					graph_svc_call(update_info, function (response) {
						aux.log("completed_loading: result: " + response.result, 0);
					});
				}
				console.log('removing tab data: '+tabId);
				delete tab_data[tabId];
			}
		}
	}

	var on_tab_deleted = function(tabId,removeInfo) {
		aux.log("tab deleted: "+tabId,0, {tabId: tabId,removeInfo : removeInfo } )
		delete tabs[tabId];
		delete tab_data[tabId];
	}

	var on_tab_created = function(tab) {
								console.log("tab created: ", {id: tab.id, url: tab.url})
								//aux.log("tab created: ",0, {id: tab.id, url: tab.url, tab: tab})
								tabs[tab.id] = { url: tab.url };
								tab_data[tab.id]=null;
						}
	var on_tab_moved = function(id, move_info) {
								console.log("tab moved: ",{ tabid: id, move_info: move_info} )
								//aux.log("tab moved: ",0, { tabid: id, move_info: move_info} )
								//tabs[tab.id] = tab;
						}

	var on_window_focus_changed = function (windowId) {
		if (windowId==null || windowId<=0) {
			return;
		}
		try {
			chrome.windows.get(windowId, {}, function(wnd) {
				if (chrome.runtime.lastError) {
					runtime_errors++;
					return;
				}
				if (wnd) {
					if (wnd.type == 'normal' && wnd.id!=null) {
						last_active_window.id = wnd.id;
						last_active_window.state = wnd.state;
						console.log("remembered window", last_active_window)
					}
				}
			});
		}
		catch(e) {
			if (!e.message.match('No window with id')) {
				console.log('on_window_focus_changed error: ' + e);
			}
		}
	}

	var get_tab_state = function () {
		//var keys= Object.keys(tab_data);
		var stats={tab_cnt:0, tab_data_cnt:0};
		if (!tabs)
			return stats;
		stats.tab_cnt= Object.keys(tabs).length;
		if (!tab_data)
			return stats;
		stats.tab_data_cnt= Object.keys(tab_data).length ;

		for (var id in tab_data) {
			var td  =  tab_data[id];
			var tab  =  tabs[id];
			if (!tab) {
				stats['orphaned_data'] = (stats['orphaned_data']||0)+1;
				continue;
			}
			stats['status_'+tab.status] = (stats['status_'+tab.status]||0)+1;
			if (tab.status=='complete' && td) {
				stats['not_cleaned_data'] = (stats['not_cleaned_data']||0)+1;
			}
		}
		return stats;
	}


	var switch_to_url = function(url) {
		var found=[];
		var activate;
		var s0 = (function() {
			var df = $.Deferred();
			chrome.tabs.query({
					windowType: 'normal',
				}, function (tab_array) {
						try {
							if (tab_array && tab_array.length) {
								for (var i=0; i<tab_array.length; i++) {
									var tab=tab_array[i];
									if (tab.url == url) {
										found[found.length]=[tab.id, tab.windowId];
									}
									//chrome.windows.update(tab.windowId, {focused:true, state:'normal'}, function (wnd) {
									//	df.resolve();
									//});
								}
								if (found.length) {
									df.resolve();
								}
							}
						}
						catch(e) {
							console.log('got exception:', e);
							//df.reject();
						}
						df.reject();
				});
			return df;
		})();

		var s1 = s0.pipe(function() {
			var df = $.Deferred();
			var last;
			for (var i =0;i<found.length;i++) {
				last=found[i];
				if (found[i][1]==last_active_window.id) {
					console.log("found last window",0,last_active_window)
					break;
				}
			}
			if (last) {
				console.log("switching to window:"+last[1]);
				var tab_update = function () {
					console.log("switching to tab:" + last[0])
					chrome.tabs.update(last[0], {selected: true}, df.resolve);
				};
				if (last[1]==last_active_window.id) {
					chrome.windows.update(last[1], {focused:true, state:last_active_window.state}, tab_update);
				}
				else {
					chrome.windows.update(last[1], {focused:true}, tab_update);
				}
			}
			else {
				console.log("did not find a tab with url:"+url);
				df.reject;
			}
			return df;
		}, function () {
			console.log("tab switching rejected:" +url)
		});

		return s1;
	}

	var open_window = function () {
		var url = chrome.extension.getURL('main/main.html');
		var exwnd = function() {
			var df = $.Deferred();
			chrome.tabs.query({
					url: url,
					windowType: 'popup',
				}, function (tab_array) {
						try {
							var resolve = 0;
							if (tab_array && tab_array.length) {
								for (var i=0; i<tab_array.length; i++) {
									var tab=tab_array[i];
									resolve =1;
									chrome.windows.update(tab.windowId, {focused:true, state:'normal'}, function (wnd) {
										df.resolve();
									});
									break;
								}
							}
							if (!resolve) {
								df.reject();
							}
						}
						catch(e) {
							console.log('got exception:', e);
							df.reject();
						}

				});
			return df;
		};

		var newwnd = function() {
			var df = $.Deferred();
			var details = {
				url: url,
				focused: true,
				type: 'popup'
			};
			chrome.windows.create(details, df.resolve);
			return df;
		};

		var s0 = exwnd();
		var s1 = s0.pipe(null, newwnd);
		return s1;
	}

// to refresh url information in popup page
	var on_tab_activated=  function (active_info) {
		chrome.tabs.get(active_info.tabId, function (tab) {
			if (chrome.runtime.lastError) {
					runtime_errors++;
					return;
				}
			if (tab.url == chrome.extension.getURL('main/main.html')) {
				return;
			}
			if (tab.url.match (/^browser::/)) {
				return;
			}
			//var url = decodeURIComponent(tab.url);
			var url = tab.url;
			state['last_active_tab'] = { tab_id: active_info.tabId, window_id: tab.windowId, url: url} ;
			obj = { request: "tab_activated", request_source: 'background'
						, tab_id: active_info.tabId, window_id: tab.windowId, url: url};
			aux.log("sending data to popup:", obj);
			chrome.runtime.sendMessage(obj);
		});
	}

	var add_message_listeners = function() {
		chrome.runtime.onMessage.addListener(function (msg, sender) {
				aux.log("got message from popup: ", 0, msg);

				// ======== requests
				if (msg.request == "spawned") {
					if (_debug) debugger;
					store_spawn_info(msg, function (response) {
						aux.log("store_spawn_info: result: " + response.result, 0);
						//======= response
						obj = $.extend(response, { response: "spawned", request: undefined, request_source: 'background', url: msg.url, oid: msg.oid, index: msg.index });
						//obj['response'] = 'spawned';
						if (sender.tab && sender.tab.id) {
							aux.log("sending data to " + (sender.tab.id, 0), obj);
							chrome.tabs.sendMessage(sender.tab.id, obj);
						}
						else if (sender.id) {
							aux.log("sending data to " + (sender.id, 0), obj);
							chrome.runtime.sendMessage(sender.id, obj);
						}
					});
				}
				/*
				else if (msg.request == "get_stats" || msg.request == "update_stats" ) {
					if (_debug) debugger;
					var obj = $.extend(obj, {method : 'get_stats'} );
					graph_svc_call(obj, function (obj) {
						aux.log("get_stats: result: " + obj.result, 0);

						//======= response
						obj['request'] = undefined;
						obj['response'] = 'stats';
						if (sender.tab && sender.tab.id) {
							aux.log("sending data to " + (sender.tab.id, 0), obj);
							chrome.tabs.sendMessage(sender.tab.id, obj);
						}
						else if (sender.id) {
							aux.log("sending data to " + (sender.id, 0), obj);
							chrome.runtime.sendMessage(sender.id, obj);
						}
					});

				}
				//*/
				else if (msg.request=="save_new_elements") {
					if (_debug) debugger;
					var params = $.extend(msg, {method : 'save_new_elements'} );
					graph_svc_call(params, function (response) {
						aux.log("save_new_elements: result: " + response.result, 0);

						//======= response
						response['request'] = undefined;
						response['response'] = 'save_new_elements';
						if (sender.tab && sender.tab.id) {
							aux.log("sending data to " + (sender.tab.id, 0), response);
							response['request_source']='background';
							chrome.tabs.sendMessage(sender.tab.id, response);
						}
						else if (sender.id) {
							aux.log("save_new_elements: sending data to " + (sender.id, 0), response);
							response['request_source']='background';
							chrome.runtime.sendMessage(sender.id, response);
						}
					});

				}
				else if (msg.request == "query_storage" ) {
					if (_debug) debugger;
					var params = $.extend(msg, {method : 'query_storage'} );
					graph_svc_call(params, function (response) {
						aux.log("query_storage: result: " + response.result, 0);

						//======= response
						response['response'] = 'query_storage';
						if (sender.tab && sender.tab.id) {
							aux.log("sending data to " + (sender.tab.id, 0), response);
							response['request_source']='background';
							chrome.tabs.sendMessage(sender.tab.id, response);
						}
						else if (sender.id) {
							aux.log("sending data to " + (sender.id, 0), response);
							response['request_source']='background';
							chrome.runtime.sendMessage(sender.id, response);
						}
					});
				}
				else if (msg.request == "update_node_info" ) {
					if (_debug) debugger;
					var params = $.extend(msg, {method : 'update_node_info'} );
					graph_svc_call(params, function (response) {
						aux.log("update_node_info: result: " + response.result, 0);

						//======= response
						response['response'] = 'update_node_info';
						if (sender.tab && sender.tab.id) {
							aux.log("sending data to " + (sender.tab.id, 0), response);
							response['request_source']='background';
							chrome.tabs.sendMessage(sender.tab.id, response);
						}
						else if (sender.id) {
							aux.log("sending data to " + (sender.id, 0), response);
							response['request_source']='background';
							chrome.runtime.sendMessage(sender.id, response);
						}
					});
				}
				else if (msg.request == "switch_session" ) {
					if (_debug) debugger;
					var params = $.extend(msg, {method : 'switch_session'} );
					graph_svc_call(params, function (response) {
						aux.log("switch_session: result: " + response.result, 0);

						//======= response
						response['response'] = 'switch_session';
						if (sender.tab && sender.tab.id) {
							aux.log("sending data to " + (sender.tab.id, 0), response);
							response['request_source']='background';
							chrome.tabs.sendMessage(sender.tab.id, response);
						}
						else if (sender.id) {
							aux.log("sending data to " + (sender.id, 0), response);
							response['request_source']='background';
							chrome.runtime.sendMessage(sender.id, response);
						}
					});
				}
				else if (msg.request == "get_node_info" ) {
					if (_debug) debugger;
					aux.log("get_node_info: request: " , 0, msg);
					var params = $.extend(msg, {method : 'get_node_info'} );
					graph_svc_call(params, function (response) {
						aux.log("get_node_info: result: " + response.result, 0);

						//======= response
						response['response'] = 'get_node_info';
						if (sender.tab && sender.tab.id) {
							aux.log("sending data to " + (sender.tab.id, 0), response);
							response['request_source']='background';
							chrome.tabs.sendMessage(sender.tab.id, response);
						}
						else if (sender.id) {
							aux.log("sending data to " + (sender.id, 0), response);
							response['request_source']='background';
							chrome.runtime.sendMessage(sender.id, response);
						}
					});
				}
				else if (msg.request == "get_graph_data" || msg.request == "get_graph_data_with_stats" ) {
					if (_debug) debugger;
					aux.log("get_graph_data_with_stats: request: " , 0, msg);
					var params = $.extend(msg, {method : 'get_graph_data_with_stats'} );
					if (relevance_count){
						params.relevance_count=params.relevance_count||relevance_count;
					}

					graph_svc_call(params, function (response) {
						aux.log("get_graph_data_with_stats: result: " + response.result, 0);

						//======= response
						response['response'] = 'get_graph_data_with_stats';
						if (sender.tab && sender.tab.id) {
							aux.log("sending data to " + (sender.tab.id, 0), response);
							response['request_source']='background';
							chrome.tabs.sendMessage(sender.tab.id, response);
						}
						else if (sender.id) {
							aux.log("sending data to " + (sender.id, 0), response);
							response['request_source']='background';
							chrome.runtime.sendMessage(sender.id, response);
						}
					});
				}
				else if (msg.request == "switch_to_url") {
					if (_debug) debugger;
					aux.log("switch_to_url: request: " , 0, msg);
					if (""!=(msg.url||"")) {
						switch_to_url(msg.url)
					}
				}
				else if (msg.request == "options_changed")  {
					if (msg.options.backend_site_address)  {
						backend = msg.options.backend_site_address;
					}
					if (msg.options.verbose_logging)  {
						verbose_logging = msg.options.verbose_logging;
					}
					if (msg.options.relevance_count)  {
						relevance_count = msg.options.relevance_count;
					}
				}
			});

		}


	var add_command_listeners = function () {
		chrome.commands.onCommand.addListener(function (command) {
			aux.log_error("command=" + command, false, command);
			if (command == "test_mark") {
				chrome.tabs.query({
					currentWindow: true,
					active: true
				}, function (tab) {
					chrome.tabs.sendMessage(tab[0].id, {
						request: 'mark_hrefs'
					});
				});
			}
		});
	};


	var add_nav_listeners =function () {
		chrome.browserAction.onClicked.addListener(function() {
			open_window();
		});

		setTimeout(function () { // TODO: clean
				//_createWindowStates(_updateActiveTabs);

				//chrome.windows.onCreated.addListener(_onWindowCreated);
				//chrome.windows.onRemoved.addListener(_onWindowRemoved);

				//chrome.tabs.onCreated.addListener(_onTabCreated);
				//chrome.tabs.onMoved.addListener(_onTabMoved);
				//chrome.tabs.onRemoved.addListener(_onTabRemoved);

				chrome.windows.onFocusChanged.addListener(on_window_focus_changed);

				chrome.tabs.onActivated.addListener(on_tab_activated);

				//chrome.tabs.onDetached.addListener(_onTabDetached);
				//chrome.tabs.onAttached.addListener(_onTabAttached);

				chrome.tabs.query({}, function(results) {
						results.forEach(function(tab) {
								tabs[tab.id] = { url: tab.url} ;
						});

						//chrome.tabs.onCreated.addListener(create_tab_action);
						//chrome.tabs.onUpdated.addListener(update_tab_action);
						//integer tabId, object changeInfo, Tab tab
						chrome.tabs.onUpdated.addListener(on_tab_updated);
						// integer tabId, object removeInfo
						chrome.tabs.onRemoved.addListener(on_tab_deleted);
						// Tab tab
						chrome.tabs.onCreated.addListener(on_tab_created);
						// integer tabId, object moveInfo
						chrome.tabs.onMoved.addListener(on_tab_moved);



						// onBeforeNavigate -> onCommitted -> onDOMContentLoaded -> onCompleted
	// create_nav_target ->  before_nav ->  link_committed
						debugger;
						chrome.webNavigation.onCreatedNavigationTarget.addListener(create_nav_target);
						chrome.webNavigation.onCommitted.addListener( link_committed);
						chrome.webNavigation.onBeforeNavigate.addListener(before_nav);

						;
				});
		}, config_data.startup_delay);
	}

	var init  = BG.init = function() {
		backend = localStorage["backend_site_address"] || 'graph_svc:12345';
		verbose_logging = localStorage["verbose_logging"] ? true : false;
		relevance_count = localStorage["relevance_count"] || 15;
		console.log("startup: verbose_logging="+verbose_logging + ", backend_site_address="+backend);
		add_message_listeners();
		add_nav_listeners();
		add_command_listeners();
	}
})(BG);
BG.init();