var _combo_debug=1;
var _combo_debug=0;
var common = common || {};
(function (common) {

	var last_tab;

	function with_active_tab(callback) {
		if (!chrome.tabs) {
			return;
		}
		// //debugger;
		chrome.tabs.query({
			active: true,
			lastFocusedWindow: true
		}, function (tabs) {
			// //debugger;
			// console.assert(tabs.length == 1);
			console.log("have " + tabs.length + " tabs");
			if (tabs[0]) {
				last_tab = tabs[0];
			}
			callback(last_tab);
		});
	}
	common.with_active_tab = with_active_tab;
})(common);

var query_graph_common = query_graph_common|| {} ;
(function(q) {
	q.derive_data = function(data) {
		data=data||{};
//		var url=unescape(data.url);
		var key, host, match;
		var node_type;
		var url=decodeURIComponent(data.url), key, host, match;
		//var result={};

		if (null!=(match = url.match(RegExp("^\\w+://(www\\.google\\.(?:com|ru))/search.*?[?&]q=([^&]*)")))) {
			//#query=~s{%([\da-f]{2})}{chr hex $1}egi;
			//#query=decode('utf8',query);
			host=match[1];
			query=match[2];
			data.key="google:"+query;
			data.node_type="query";
		}
		else {
			data.key = "url:"+url;
			data.node_type="url";
		}

		return data;
	}
})(query_graph_common);


var main = main || {};
(function (main) {

	var _debug = 0;
	var _popup_debug = 0;
	var _load_graph = 1;
	var sessions={};


	var init = main.init = function () {
		$(document).ready(function () {
			// ======== interface
			// ********* initialization
			load_session('default');

			main.combo_widget();
			main.add_listeners();
			main.install_handlers();
			main.multi_combo.init('#current_combo', '#selection_combo');
			common.with_active_tab(function (_tab) {
				$('#key_td').find('input').val("url:" + _tab.url);
			});

			query_storage();

		});
	}

	var add_listeners = main.add_listeners = function () {
		// ======== from background
		chrome.extension.onMessage.addListener(function (msg, sender) {
			if (msg.request_source == 'popup') {
				return;
			}
			console.log("got message from: ", msg.request_source || 'unknown', msg);
			//console.log("got message from background: " + Object.keys(msg));
			if (msg.request == "tab_activated") {
				//obj = { request: "tab_activated", request_source: 'background'
				//	, tab_id: tab.tabId, window_id: tab.windowId, url: tab.url};
				$('#edit_current_URL').val(msg.url);

				//var url = decodeURIComponent(escape(msg.url));

				var data = query_graph_common.derive_data({url: msg.url});
				main.cym.activate_node(data);
				//main.cym.mark_current(msg.url, data.key);
				//main.show_node_info()

				//main.cym.mark_current(query_graph_common.derive_key({url: msg.url}));
			}
			else if (msg.response == "spawned") {
				if (msg.result == "success") {
					$('#message').text(msg.result);
					if (msg.data != undefined) {
						$('#data').css('visibility', 'visible');
						$('#data').text(msg.data);
						set_status('ok', 'spawned: success');
					}
				}
				else {
					set_status('error', 'spawned: ' + msg.result + ": " + msg.message);
					//$('#message').text(msg.result + ": " + msg.message);
				}
				$('#loading').css('visibility', 'hidden');
				chrome.tabs.create({
					index: msg.index,
					url: msg.url,
					active: true,
					openerTabId: msg.oid
				});

			}
			else if (msg.response == "query_storage") {
				if (msg.result == "success") {
					if (_debug) {
						debugger
					}
					main.multi_combo.deselect();
					//main.multi_combo.add_elements('none default');
					main.multi_combo.add_elements(msg.storage);
					main.multi_combo.selection(msg.selection);
					main.multi_combo.current(msg.current);
					//$('#edit_session').val(msg.current);
					set_status('ok', msg.response + ": " + msg.result);
				}
				else {
					$('#node_control_status').find('span').text(msg.result + ": " + msg.message);
					set_status('error', msg.response + ": " + msg.result + ": " + msg.message);
				};
			}
			else if (msg.response == "update_node_info" || msg.response == "get_node_info") {
				if (msg.result == "success") {
					if (_debug) {
						debugger
					}
					$('#edit_current_key').val(msg.key);
					$('#edit_rating').val(msg.rating || 0);
					$('#edit_comment').val(msg.comment);
					$('#node_control_status').find('span').text(msg.result);
					set_status('ok', msg.response + ": " + msg.result);
				}
				else {
					$('#node_control_status').find('span').text(msg.result + ": " + msg.message);
					set_status('error', msg.response + ": " + msg.result + ": " + msg.message);
				};
			}
			else if (msg.response == "switch_session" ) {
				if (msg.result == "success") {
					if (_debug) {
						debugger
					}
					console.log("switched session to: " + msg.response.session);
					set_status('ok', msg.response + ": " + msg.result);
				}
				else {
					$('#node_control_status').find('span').text(msg.result + ": " + msg.message);
					set_status('error', msg.response + ": " + msg.result + ": " + msg.message);
				};
			}
			else if (msg.response == "save_new_elements") {
				if (msg.result == "success") {
					if (_debug) {
						debugger
					}
					set_status('ok', msg.response + ": " + msg.result);
					main.get_graph_data();
				}
				else {
					$('#node_control_status').find('span').text(msg.result + ": " + msg.message);
					set_status('error', msg.response + ": " + msg.result + ": " + msg.message);
				};
			}
			else if (msg.response == "get_graph_data_with_stats") {
				if (msg.result == "success") {
					if (_debug) {
						debugger
					}
					//$('#node_control_status').find('span').text(msg.result);
					//console.log("get_graph_data=" + msg.result);
					set_status('ok', msg.response + ": " + msg.result);
					if (_load_graph && cy) {
						if (msg.json != "" && msg.json != undefined) {
							if (_debug) debugger;
							var json = JSON.parse(msg.json);
							if (json && json.cy_elements) {
								var merge_results = $('#cb_merge_results').prop('checked') ? 1 : 0;
								main.cym.cy_reload(json.cy_elements,merge_results);
								var div;
								var colors = main.cym.cy_get_colors();
								var edge_colors = colors['edge_colors'] || {};
								var node_colors = colors['node_colors'] || {};
								if (json.stats && (div = $('#show_stats')).length) {
									var html = "";
									for (var i in json.stats) {
										var match;
										var color = 'inherit';
										if (null != (match = i.match(/^edge type:\s*(.*?)\s*$/))) {
											color = edge_colors[match[1]];
										}
										else if (null != (match = i.match(/^node type:\s*(.*?)\s*$/))) {
											color = node_colors[match[1]];
										}
										html = html + '<span style="background-color: ' + color + '">&nbsp;&nbsp;&nbsp;</span>' + '<span>' + i + ": " + json.stats[i] + "</span><br/>\n";
									}
									div.find('span').html(html);
								}
							}
							else {
								set_status('error', msg.response + ": incorrect object returned");
								console.log('get_graph_data_with_stats: incorrect object returned: ', msg.json);
							}
						}
					}
				}
				else {
					set_status('error', msg.response + ": " + msg.result + ": " + msg.message);
					//$('#node_control_status').find('span').text(msg.result + ": " + msg.message);
				}
			}
			else if (msg.response == "configuration") {;
			}
		});
	};

	var save_session = main.save_session  = function (name) {
		name = name || 'default'
		var session={};
		session.key = $('#edit_current_key').val();
		session.start = $('#edit_range_start').val();
		session.end = $('#edit_range_end').val();
		session.filter_text = $('#edit_filter').val();
		session.expand = $('#cb_expand').prop('checked') ? 1 : 0;
		session.merge_results= $('#cb_merge_results').prop('checked') ? 1 : 0;
		session.compute_relevance= $('#cb_compute_relevance').prop('checked') ? 1 : 0;
		session.single_nodes = $('#cb_single').prop('checked') ? 1 : 0;
		sessions[name]=session;
	}

	var load_session = main.load_session = function(name) {
		name = name || 'default';

		var session = sessions[name];
		if (session==null) {
			session={};
			session.filter_text=''
			var now = new Date();
			var startday = new Date('2016-03-10')
			//	var startday= new Date(wnow-7*86400e3)
			var endday = new Date(now - 0 + 86400e3)
			session.start = aux.get_ts(startday);
			session.end = aux.get_ts(endday);
		}

		$('#edit_current_key').val(session.key);
		$('#edit_range_start').val(session.start);
		$('#edit_range_end').val(session.end);
		$('#edit_filter').val(session.filter_text);
		$('#cb_expand').prop('checked', session.checked );
		$('#cb_single').prop('checked', session.single_nodes );
		$('#cb_merge_results').prop('checked', session.merge_results);
	}

	var init_session_combobox = main.init_session_combobox = function () {
		(function () {
			var switch_session_select = function (e, ui) {
				debugger;
				var t = ui.value;
				console.log("switch_session by select");
				main.switch_session(t);
			};

			var switch_session_change = function (e, ui) {
				debugger;
				var t = ui.value;
				console.log("switch_session by change");
				main.switch_session(t);
			}
			var cbb = $("#session_dropdown_combobox").combobox({
				select: switch_session_select,
				change: switch_session_change
			});

			var cbb= $('#session_dropdown_combobox');
			cbb.children('option').remove();
			var selections = ['today', 'none core', 'none' ];
			for (i = 0; i < selections.length; i++) {
				cbb.append($("<option />").val(selections[i]).text(selections[i]));
			}
			//debugger;
			//var cbbi = $('#session_dropdown_div').find('.custom-combobox-input:first');
			$('#session_dropdown_div').find('.custom-combobox-input:first').attr('tabindex',15);
			//$('#session_dropdown_div').find('.ui-button:first').attr('tabindex',16);

		})();

	}

	var install_handlers = main.install_handlers = function () {
		// ******* query, tab GUI

		$(document).off('keydown').on('keydown', function (e) {
			if (main.cym ) {
				if (main.cym.turn_hints_off()) {
					e.preventDefault();
				}
			}
		});

		$('input.request_type').off('keydown').on('keydown', function (e) {
			if (e.keyCode == $.ui.keyCode.SPACE) {
				toggle_request_type(e);
			}
		});



		$('#edit_google_search_query').off("keydown").on("keydown", function (e) {
			if (e.keyCode == $.ui.keyCode.ENTER) {
				open_google_search(e, $('#edit_google_search_query').val());
			}
		});

		$('#edit_google_search_query').select();


		$('#btn_new_tab').click(function (e) {
			//debugger;
			open_request_tab(e);
		});


		$('#btn_find_key').click(function (e) {
			//debugger;
			find_key(e);
		});

		$('#btn_find_url').click(function (e) {
			//debugger;
			find_url(e);
		});




		// ******* node data GUI
		$('#edit_comment').change(function (e) {
			change_node_data(e);
		});
		$('#edit_node_type').change(function (e) {
			change_node_data(e);
		});
		$('#edit_rating').change(function (e) {
			change_node_data(e);
		});
		$('#edit_priority').change(function (e) {
			change_node_data(e);
		});
		$('#edit_current_URL').change(function (e) {
			change_node_data(e);
		});
		$('#edit_current_key').change(function (e) {
			change_node_data(e);
		});
		$('#edit_edge_type').change(function (e) {
			change_edge_data(e);
		});
		// ****** graph filter GUI
		$('#edit_current_key').off("keydown").on("keydown", function (e) {
			if (e.keyCode == $.ui.keyCode.ENTER) {
				find_key(e);
			}
		});

		$('#cb_expand').off("keydown").on("keydown", function (e) {
			// debugger;
			if (e.keyCode == $.ui.keyCode.ENTER) {
				main.get_graph_data(e);
			}
		});
		$('#cb_single').off("keydown").on("keydown", function (e) {
			// debugger;
			if (e.keyCode == $.ui.keyCode.ENTER) {
				main.get_graph_data(e);
			}
		});
		$('#cb_compute_relevance').off("keydown").on("keydown", function (e) {
			// debugger;
			if (e.keyCode == $.ui.keyCode.ENTER) {
				main.get_graph_data(e);
			}
		});

		$('#edit_range_start').off("keydown").on("keydown", function (e) {
			// debugger;
			if (e.keyCode == $.ui.keyCode.ENTER) {
				main.get_graph_data(e);
			}
		});
		$('#edit_range_end').off("keydown").on("keydown", function (e) {
			// debugger;
			if (e.keyCode == $.ui.keyCode.ENTER) {
				main.get_graph_data(e);
			}
		});

		$('input.edit_request').off("keydown").on("keydown", function (e) {
			// debugger;
			if (e.keyCode == $.ui.keyCode.ENTER) {
				open_request_tab(e)
			}
		});

		// ********* graph data GUI

		$('#btn_request').click(function (e) {
			main.get_graph_data(e);
		});

		$('#btn_get_requests').click(function (e) {
			get_requests(e);
		});

		$('#btn_save_new_elements').click(function (e) {
			save_new_elements(cy);
		});

		$('#btn_show_stats').click(function (e) {
			toggle_visible(e);
		});

		$('#btn_show_meta').click(function (e) {
			toggle_visible(e);
		});

		$('#btn_show_request').click(function (e) {
			toggle_visible(e);
		});




		$('#btn_update_node_info').click(function (e) {
			post_node_info(e);
		});

		$('#edit_rating').off("keydown").on("keydown", function (e) {
			if (e.keyCode == $.ui.keyCode.ENTER) {
				if (e.ctrlKey && !e.shiftKey) {
					post_node_info(e);
				}
			}
		});

		$('#edit_priority').off("keydown").on("keydown", function (e) {
			if (e.keyCode == $.ui.keyCode.ENTER) {
				if (e.ctrlKey && !e.shiftKey) {
					post_node_info(e);
				}
			}
		});

		$('#edit_node_type').off("keydown").on("keydown", function (e) {
			if (e.keyCode == $.ui.keyCode.ENTER) {
				if (e.ctrlKey && !e.shiftKey) {
					post_node_info(e);
				}
			}
		});

		$('#edit_comment').off("keydown").on("keydown", function (e) {
			if (e.keyCode == $.ui.keyCode.ENTER) {
				if (e.ctrlKey && !e.shiftKey) {
					post_node_info(e);
				}
			}
		});

		$('#btn_get_node_info').click(function (e) {
			get_node_info(e);
		});

		$('#edit_filter').off("keydown").on("keydown", function (e) {
			if (e.keyCode == $.ui.keyCode.ENTER) {
				if (_debug) {
					debugger;
				}
				if (e.ctrlKey && !e.shiftKey) {
					main.get_graph_data(e);
				}
				else if (!e.ctrlKey && !e.metaKey) {
					var val = $(e.target).val();
					//console.log ('current value of textarea: ' + val);
					var match = val.match(RegExp("(\r?\n)", "g"));
					//var match = /(\r?\n)/g.exec(val);
					var rows = 1;
					if (match && match.length) {
						rows = match.length + 1;
					}
					console.log('setting filter area rows to: ' + (rows + 1));
					$(e.target).prop('rows', rows + 1);
				}
			}
		});

		$('#btn_new_session').click(function (e) {
			open_current_selection_edit();
		});

		(function(){
			var start = aux.get_tsd(new Date()).replace(/-/g,'');
			$('#current_selection_row input').val(start);
		})();


		$('#current_selection_row input').change(function (e) {
			change_current_selection(e);
			$('#current_selection_row').hide();
		});

		$('#current_selection_row input').off('keydown').on('keydown', function (e) {
			if (e.keyCode == $.ui.keyCode.ESCAPE) {
				e.preventDefault();
				$('#current_selection_row').hide();
			}
		});
	}

	var change_current_selection=function (e) {
		var sel = $(e.target).val();
		if (main.multi_combo.current()!=sel) {
			main.multi_combo.current(sel);
			main.switch_session(main.multi_combo.selection(), main.multi_combo.current())
		}

	}

	var switch_to_url = main.switch_to_url= function(url) {
		$('#node_control_status').find('span').text("posting...");
		// ======= request
		if (_debug) {
			debugger
		}
		set_status('progress', 'sent switch_to_url...');
		chrome.runtime.sendMessage({
			request_source: 'popup',
			request: "switch_to_url",
			url: url,
		});
	}

	// ********** GUI functions
	var toggle_request_type = main.toggle_request_type = function (e) {
		$('input.request_type').toggle();
		var v = $('input.edit_request:visible');
		var h = $('input.edit_request:hidden');
		v.hide();
		h.show();
	}

	var open_request_tab = main.open_request_tab = function (e) {
		if ($('input#query_radio_id').is(':hidden')) {
			open_new_tab(e, $('#edit_new_tab_url').val());
		}
		else {
			open_google_search(e, $('#edit_google_search_query').val());
		}
	}

	var find_key = main.find_key = function (e) {

		var request = build_key_request();
		set_status('progress', 'sent get_graph_data...');
		chrome.runtime.sendMessage(request);
	}

	var find_url = main.find_url = function (e) {
		var request = build_exact_request({
			text: $('#edit_current_URL').val(),
			//start: "",
			//end: ""
		});
		set_status('progress', 'sent get_graph_data...');
		chrome.runtime.sendMessage(request);
	}

	var change_node_data = main.change_node_data = function (e) {
		var input = $(e.target);
		var input_id = input.attr('id');
		var key_input = $('#edit_current_key');
		var cy_id = key_input.data('cy_id');
		if (!input_id) {
			console.log('no input id');
		}
		else if (!cy_id) {
			console.log('no node id');
		}
		else {
			if (input_id == 'edit_comment') {
				main.cym.cy_change_element_data(cy_id, {
					comment: input.val()
				});
			}
			else if (input_id == 'edit_node_type') {
				main.cym.cy_change_element_data(cy_id, {
					node_type: input.val()
				});
			}
			else if (input_id == 'edit_rating') {
				main.cym.cy_change_element_data(cy_id, {
					rating: input.val()
				});
			}
			else if (input_id == 'edit_priority') {
				main.cym.cy_change_element_data(cy_id, {
					priority: input.val()
				});
			}
			else if (input_id == 'edit_current_URL') {
				main.cym.cy_change_element_data(cy_id, {
					url: input.val()
				});
			}
			else if (input_id == 'edit_current_key') {
				main.cym.cy_change_element_data(cy_id, {
					key: input.val()
				});
			}
		}
	}

	var change_edge_data = main.change_edge_data = function (e) {
		var input = $(e.target);
		var input_id = input.attr('id');
		var cy_id = input.data('cy_id');
		if (!input_id) {
			console.log('no input id');
		}
		else if (!cy_id) {
			console.log('no node id');
		}
		else {
			if (input_id == 'edit_edge_type') {
				main.cym.cy_change_element_data(cy_id, {
					edge_type: input.val()
				});
			}
		}
	}

	var set_status = main.set_status = function (_class, msg) {
		var stdiv = $('#status');
		console.log("set_status:" + _class + ', ' + msg);
		stdiv.removeClass('error ok progress');
		stdiv.addClass(_class);
		stdiv.find('span').html(msg);
	}
	var get_filtered_text = main.get_filtered_text = function (text, flt) {
		if (flt && flt != "") {
			var rx = flt.replace(/^\/(.*?)\/?$/, "$1");
			rx = rx != flt ? RegExp(rx) : undefined;
			var a = text.split(/\r?\n/);
			var filtered = [];
			var section = [];

			var m = 0;
			for (var i = 0;; i++) {
				if (i >= a.length || a[i].match(/^\w+:/)) {
					if (m == 1 && section.length > 0) {
						filtered = [].concat(filtered, section);
					}
					m = 0;
					section = [];
				}
				if (i >= a.length) {
					break;
				}
				section[section.length] = a[i];
				if (rx && a[i].match(rx)) {
					m = 1;
				}
				else if (a[i].indexOf(flt) >= 0) {
					m = 1;
				}
			}
			return filtered.join("\r\n");
		}
		return text;
	};
	var filter_stats = main.filter_stats = function (text) {
		if (_debug) debugger;
		if (!text || text == "") {
			text = $('#stats').text();
		}
		var flt = $('#edit_filter').val();
		var filtered = get_filtered_text(text, flt);
		$('#stats_filtered').text(filtered);
	}

	var get_requests = main.get_requests = function () {
		var filter = $('#edit_filter').val();
		if (""==(filter||"")) {
			filter="(?!)"
		}


		// ======= request
		var request = main.build_filter_request({
			filter: filter});
		if (request) {
			set_status('progress', 'sent get_graph_data...');

			request['update'] = 1;

			chrome.runtime.sendMessage(request);
		}
		else {
			console.log("cannot build a request");
		}
	}


	var switch_session  = main.switch_session = function (selection,current) {
		var reset = $('#cb_reset_selection').prop('checked') ? 1 : 0;
		if (reset) {
			selection = "none " +selection;
		}
		console.log("switching session: current:"+current+ " , selection: "+selection);
		set_status('progress', 'sent switch session request ...');
		chrome.runtime.sendMessage({
			request_source: 'popup',
			request: "switch_session",
			selection: selection,
			current: current,
		});
	};

	var query_storage = function () {
		//var key = $('#edit_current_key').val();
		////var url = $('#edit_current_URL').val();
		//var comment = $('#edit_comment').val();
		//var rating = $('#edit_rating').val();
		//var node_type = $('#edit_node_type').val();
		$('#node_control_status').find('span').text("querying storage...");
		// ======= request
		if (_debug) {
			debugger
		}
		set_status('progress', 'sent query_storage...');
		chrome.runtime.sendMessage({
			request_source: 'popup',
			request: "query_storage",
		});
	}


	var get_current_id = function () {
		var id = $('#edit_current_key').data('cy_id');

	}

	var post_node_info = main.post_node_info = function (e) {
		change_node_data(e);
		var key = $('#edit_current_key').val();
		//var url = $('#edit_current_URL').val();
		var comment = $('#edit_comment').val();
		var rating = $('#edit_rating').val();
		var node_type = $('#edit_node_type').val();
		$('#node_control_status').find('span').text("posting...");
		// ======= request
		if (_debug) {
			debugger
		}
		set_status('progress', 'sent update_node_info...');
		chrome.runtime.sendMessage({
			request_source: 'popup',
			request: "update_node_info",
			comment: comment,
			rating: rating,
			key: key,
			node_type: node_type,
			operation: 'merge',
			direction: 'out',
		});
	}


	var get_node_info = main.get_node_info = function (e) {
		if (_debug) {
			debugger
		}
		var key = $('#edit_current_key').val();
		//var url = $('#edit_current_URL').val();
		var start = $('#edit_range_start').val();
		var end = $('#edit_range_end').val();

		if (key == "" || key == undefined) {
			alert("no key or url specified");
			return;
		}

		// ======= request
		set_status('progress', 'sent get_node_info...');
		chrome.runtime.sendMessage({
			request_source: 'popup',
			request: "get_node_info",
			key: key
			//, url : url
			,
			start: start,
			end: end
		});
	}
	var parse_params = main.parse_params = function (flt) {
		var res = {};
		var li = 0;
		var rx = new RegExp("(?:^|,)\\s*(\\w+)\\s*=\\s*\"([^\"]*)\"\\s*(?=,|$)", "g");
		var t;
		var empty = 1;
		if (flt == undefined) {
			return null;
		}
		while ((t = rx.exec(flt))) {
			li = rx.lastIndex;
			res[t[1]] = t[2];
			empty = 0;
			//res.push ([t.slice(1,3)]);
		}
		if (li != flt.length) {
			console.log("failed to parse: " + flt);
			return null;
		}
		if (empty) {
			return null;
		}
		return res;
	}

	var get_graph_data = main.get_graph_data = function (e) {
		var request = main.build_filter_request(e);
		if (request) {
			set_status('progress', 'sent get_graph_data_with_stats...');
			chrome.runtime.sendMessage(request);
		}
		else {
			console.log("cannot build a request");
		}
	}
	var build_key_request = main.build_key_request = function (args) {
		var key = (args && args.key) || $('#edit_current_key').val();
		var start = (args && args.start) || $('#edit_range_start').val();
		var end = (args && args.end) || $('#edit_range_end').val();
		var expand = $('#cb_expand').prop('checked') ? 1 : 0;
		var single_nodes = $('#cb_single').prop('checked') ? 1 : 0;
		var compute_relevance= $('#cb_compute_relevance').prop('checked') ? 1 : 0;

		//var filter = $('#edit_filter').val();
		// ======= request
		var filters;

		filters = [{
				filter_type: "edge",
				from: {
					key: "^\\Q" + key + "\\E$"
				},
				start: start,
				end: end
			}, {
				filter_type: "edge",
				to: {
					key: "^\\Q" + key + "\\E$"
				},
				start: start,
				end: end
			}
		];
		if (single_nodes) {
			filters[2]={
				filter_type: "single_node",
				from: {
					key: "^\\Q" + key + "\\E$"
				},
				start: start,
				end: end
			};
		}

		var request = {
			request_source: 'popup',
			request: "get_graph_data",
			expand: expand,
			compute_relevance: compute_relevance,

			//key : key,
			//start : start,
			//end : end,
			filters: filters,

		};

		$('#show_request').find('input').val(JSON.stringify(request));
		request['filters'] = JSON.stringify(filters);

		return request;
	}

	var build_exact_request = main.build_exact_request = function (args) {
		//var key = (args && args.key) || $('#edit_current_key').val();
		var text = args.text || '(?!)';
		var start = (args && args.start) || $('#edit_range_start').val();
		var end = (args && args.end) || $('#edit_range_end').val();
		var expand = $('#cb_expand').prop('checked') ? 1 : 0;
		var single_nodes = $('#cb_single').prop('checked') ? 1 : 0;
		var compute_relevance= $('#cb_compute_relevance').prop('checked') ? 1 : 0;

		//var filter = $('#edit_filter').val();
		// ======= request
		var filters ;
		filters = [{
				filter_type: "edge",
				from: {
					text: "^\\Q" + text + "\\E$"
				},
				start: start,
				end: end
			}, {
				filter_type: "edge",
				to: {
					text: "^\\Q" + text + "\\E$"
				},
				start: start,
				end: end
			},
		];

		if (single_nodes) {
			filters[2]={
				filter_type: "single_node",
				from: {
					text: "^\\Q" + text + "\\E$"
				},
				start: start,
				end: end
			};
		}

		var request = {
			request_source: 'popup',
			request: "get_graph_data",
			expand: expand,
			compute_relevance: compute_relevance,

			//key : key,
			//start : start,
			//end : end,
			filters: filters,
		};

		$('#show_request').find('input').val(JSON.stringify(request));
		request['filters'] = JSON.stringify(filters);

		return request;
	}


	var build_filter_request = main.build_filter_request = function (args) {
		if (_debug) {
			debugger
		}
		args=args||{};
		var key = $('#edit_current_key').val();
		var start = $('#edit_range_start').val();
		var end = $('#edit_range_end').val();
		var filter_text = args.filter || $('#edit_filter').val();
		var expand = $('#cb_expand').prop('checked') ? 1 : 0;
		var single_nodes = $('#cb_single').prop('checked') ? 1 : 0;
		var compute_relevance= $('#cb_compute_relevance').prop('checked') ? 1 : 0;

		// ======= request
		//((?:\\.|[^\\\[\\]>])*)(?:\\[((?:\\.|[^\\\[\\]>])*)\\])?
		var rx_string = new RegExp("[^\\r\\n]+", "g");
		var rx_edge = new RegExp("^\\s*((?:\\\\.|[^\\\[\\]>])*?)\\s*(?:\\[((?:\\\\.|[^\\\[\\]>])*)\\])?" + "(?:\\s*(>)\\s*((?:\\\\.|[^\\\[\\]>])*?)\\s*(?:\\[((?:\\\\.|[^\\\[\\]>])*)\\])?" + "(?:\\s*>\\s*((?:\\\\.|[^\\\[\\]>])*?)\\s*(?:\\[((?:\\\\.|[^\\\[\\]>])*)\\])?)?)?\\s*$");
		var rx_single = new RegExp("^\\s*<\\s*((?:\\\\.|[^\\\[\\]>])*?)\\s*(?:\\[((?:\\\\.|[^\\\[\\]>])*)\\])?\\s*>\\s*$");

		var all_filters = [];
		var strings = filter_text.match(rx_string);
		//if (strings.length) {
		if (strings && strings.length) {
			for (var i = 0; i < strings.length; i++) {
				if (strings[i].match(/^\s*$/)) {
					continue;
				}

				(function () {
					var filter_string = strings[i];
					var filters_single = [];
					var filters_edge = [];

					var match;
					var match_single = rx_single.exec(filter_string);
					var match_edge= rx_edge.exec(filter_string);
					if (match_single) {
						match_edge=null;
					}
					else if (!match_single && single_nodes
							&& match_edge && (match_edge[3]||"")=="") {
						match_single=match_edge
					}

					if (null != (match_single)) {
						match = match_single;
						var from = match[1];
						var from_att = parse_params(match[2]);
						from = "" != (from || "") ? from : null;
						if (from_att || from) {
							from_att = $.extend(from ? {
								text: from
							} : {}, from_att || {});
						}

						if (from_att) {
							filters_single[0] = {
								filter_type: "single_node",
								from: from_att,
								start: start,
								end: end
							};
						}
					}
					if (null != (match_edge )) {
						match=  match_edge;
						//var match = rx.exec (filter_string);
						var from = match[1];
						var from_att = parse_params(match[2]);
						//var edge_match = (edge !=null || edge_att!=null) || (to!=null || to_att!=null);
						var edge_match = match[3];
						var edge = match[4];
						var edge_att = parse_params(match[5]);

						var to = match[6];
						var to_att = parse_params(match[7]);
						var filter = {};

						from = "" != (from || "") ? from : null;
						to = "" != (to || "") ? to : null;
						edge = "" != (edge || "") ? edge : null;

						if (from_att || from) {
							from_att = $.extend(from ? {
								text: from
							} : {}, from_att || {});
						}
						if (to_att || to) {
							to_att = $.extend(to ? {
								text: to
							} : {}, to_att || {});
						}
						if (edge_att || edge) {
							edge_att = $.extend(edge ? {
								edge_type: edge
							} : {}, edge_att || {});
						}

						if (edge_match != null) {
							filters_edge[0] = $.extend({
								filter_type: "edge",
								start: start,
								end: end
							}, from_att ? {
								from: from_att
							} : {}, to_att ? {
								to: to_att
							} : {}, edge_att ? {
								edge: edge_att
							} : {});
						}
						else if (from_att) {
							filters_edge[0] = {
								filter_type: "edge",
								start: start,
								end: end,
								from: from_att
							};
							filters_edge[1] = {
								filter_type: "edge",
								start: start,
								end: end,
								to: from_att
							};
						}
					}
					if (!filters_single.length && !filters_edge.length) {
						console.log("cannot parse filter: " + filter);
						return;
					}
					all_filters = all_filters.concat(filters_single, filters_edge);
				})();
			}
			var request = {
				request_source: 'popup',
				request: "get_graph_data_with_stats",
				expand: expand,
				compute_relevance: compute_relevance,
				//key : key,
				//start : start,
				//end : end,
				filters: all_filters,

			};
			//$('#edit_request').val(JSON.stringify(request['filters']));
			$('#show_request').find('input').val(JSON.stringify(request));
			request['filters'] = JSON.stringify(all_filters);
			return request;
		}
		return null;

	}

	var relevance_html=main.relevance_html = function (relevance) {
			var html="";
			var rx  = new RegExp("(.*):\\s+([\\.\\d]+)", "g");
			var t ;
			while ((t = rx.exec(relevance))) {
				var word = t[1], rel = parseFloat(t[2]) ;
				html = html + "<progress value=" + (rel*100).toFixed(0) +  " max='100'></progress>"+"<span>"+rel.toFixed(2)+":" +word+ "</span><br>\n";
				//html = html + "<span>"+word+": " + rel.toFixed(2) +  "</span><br><progress value=" + (rel*100).toFixed(0) +  " max='100'></progress><br>\n";
			}
			html = "<div style='max-height: 250px; overflow-x: auto; overflow-y: auto; width: 100%;>" + html + "</html>"
			return html
		}

	var show_node_info = main.show_node_info = function (node_data, edge, peer, meta) {
		$('#edit_current_key').data('cy_id', null);
		$('#edit_edge_type').data('cy_id', null);
		$('#edit_peer_key').data('cy_id', null);

		$('#edit_edge_type').val("");
		$('#edit_peer_key').val("");

		var id = node_data.id;
		if (!id) {
			return;
		}
		if ("" == (node_data.key || "")) {
			node_data.key = node_data.node_type + ":"
		}


		$('#edit_current_key').data('cy_id', id);
		$('#edit_current_key').val(node_data.key);
		$('#edit_current_URL').val(node_data.url);
		$('#edit_node_type').val(node_data.node_type);
		$('#edit_rating').val(node_data.rating || 0);
		$('#edit_priority').val(node_data.priority|| 0);
		$('#edit_comment').val(node_data.comment) || "";
		$('#edit_current_key').focus();

		if (edge) {
			$('#edit_edge_type').data('cy_id', id);
			$('#edit_edge_type').val(edge.edge_type);
		}
		if (peer) {
			$('#edit_peer_key').data('cy_id', id);
			$('#edit_peer_key').val(peer.key);
		}

		if (meta) {
			var meta_html = "<span > degree: " + meta.degree + "</span><br>\n" + "<span> node classes: " + meta.node_classes + "</span><br>\n" + "<span> edge classes: " + meta.edge_classes + "</span><br>\n" ;
			$('#show_meta').find('span').html(meta_html);
		}
	}

	var load_node_info_by_key = main.load_node_info_by_key = function (node_type, key) {
		//var url = $('#edit_current_URL').val();
		var start = $('#edit_range_start').val();
		var end = $('#edit_range_end').val();

		// ======= request
		set_status('progress', 'sent get_node_info...');
		chrome.runtime.sendMessage({
			request_source: 'popup',

			request: "get_node_info",
			key: key,
			start: start,
			end: end
		});
	}

	var delete_node = main.delete_node = function (key, node_type) {
		if (_debug) {
			debugger
		}
		set_status('progress', 'sent update_node_info...');
		chrome.runtime.sendMessage({
			request_source: 'popup',
			request: "update_node_info",
			key: key,
			node_type: node_type,
			operation: 'delete',
		});
	}

	var delete_edge = main.delete_edge = function (id) {
		if (_debug) {
			debugger
		}
		set_status('progress', 'sent update_node_info...');
		chrome.runtime.sendMessage({
			request_source: 'popup',
			request: "update_node_info",
			//key: key,
			//node_type: node_type,
			operation: 'delete_edge',
			edge_id : id,
		});
	}

	var open_current_selection_edit = function() {
		var div = $('#current_selection_row');
		var input = div.find('input');
		div.show();
		input.focus();
	}

	var toggle_visible = main.toggle_visible = function (e) {
		$(e.target).toggleClass('visible');
		var id = $(e.target).attr('id');
		if (id == 'btn_show_stats') {
			$('#show_stats').toggleClass('visible');
		}
		else if (id == 'btn_show_meta') {
			$('#show_meta').toggleClass('visible');
		}
		else if (id == 'btn_show_request') {
			$('#show_request').toggleClass('visible');
		}
	}
	var toggle_stats = main.toggle_stats = function (e) {
		$('#show_stats').toggleClass('visible');
	}
	var toggle_request = main.toggle_request = function (e) {
		main.build_filter_request(e);
		$('#show_request').toggleClass('visible');
	}
	var save_new_elements = main.save_new_elements = function (cy) {
		if (!cy) {
			console.log("no cytoscape containter in current document");
			return;
		}
		var elements = main.cym.get_new_elements();
		if (elements == null) {
			console.log("there are no new elements");
			return;
		}
		set_status('progress', 'sent save_new_elements...');
		chrome.runtime.sendMessage({
			request_source: 'popup',
			request: "save_new_elements",
			elements: JSON.stringify(elements),
		});

	}
	var open_new_tab = main.open_new_tab = function (e, url) {
		if (_debug) debugger;
		if (url.match("^new\\s+tab$|^\\s*$")) {
			url = "browser://startpage/";
		}
		common.with_active_tab(function (_tab) {
			var index = _tab.index == undefined ? undefined : _tab.index + 1;
			var oid = _tab.id;
			if (oid === undefined || oid === null) {
				console.log("*** current page has no id: " + _tab.url);
			}

/*
		chrome.tabs.create({
			index: index,
			url: url,
			active: false,
			openerTabId: oid
		});
*/
			console.log("=== " + _tab.url + " spawning new tab: " + url);

			// ======= request
			set_status('progress', 'sent spawned...');
			chrome.runtime.sendMessage({
				request_source: 'popup',
				request: "spawned",
				parent: _tab.url,
				url: url,
				type: 'new_tab',
				oid: oid,
				index: index

			});

		});
	}
	var open_google_search = main.open_google_search = function (e, query) {

		common.with_active_tab(function (_tab) {
			var index = _tab.index == undefined ? undefined : _tab.index + 1;
			var oid = _tab.id;
			if (oid === undefined || oid === null) {
				console.log("*** current page has no id: " + _tab.url);
			}
			query = query.replace(/ /g, "+");
			var url = query.match("^google\\s+search\\s+query$|^\\s*$") ? "https://www.google.com" : ("https://www.google.com/search?client=opera&q=" + query + "&sourceid=opera&ie=UTF-8&oe=UTF-8");

			///*
			//*/
			console.log("=== " + _tab.url + " spawning google query: " + url);

			// ======= request
			set_status('progress', 'sent spawned...');
			chrome.runtime.sendMessage({
				request_source: 'popup',
				request: "spawned",
				parent: _tab.url,
				url: url,
				query: query,
				type: 'query',
				oid: oid,
				index: index
			});


		});

	}
})(main);

main.cym=main.cym||{}
main.init();
main.cym.init();
