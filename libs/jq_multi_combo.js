var main=main||{};
main.multi_combo=main.multi_combo||{};
(function (combo) {
		var selection_combo;
		var current_combo;
		var _selection;
		var _current;

		var get_w_values = combo.get_values = function (selector,j) {
			j=j||selection_combo;
			var elements = j.multiselect("widget").find(selector || 'checked');
			return $.map(elements, function(c) {
				return $(c).val();
				} );
		}

		var get_w_texts = combo.get_texts = function (selector,j) {
			j=j||selection_combo;
			var elements = j.multiselect("widget").find(selector || 'checked');
			return $.map(elements, function(c) { return $(c).next().text(); } );
		}

		var get_w_elements = combo.get_elements = function (selector,j) {
			j=j||selection_combo;
			var elements = j.multiselect("widget").find(selector || 'checked');
			return $.map(elements, function(c) { return { 'el': c,
										'value': $(c).val(),
										'text': $(c).next().text()
									 }} );
		}


		var get_elements = combo.get_elements = function (selector,j) {
			j=j||selection_combo;
			var elements = j.multiselect().find(selector );
			return $.map(elements, function(c) { return { 'el': c,
										'value': $(c).val(),
										'text': $(c).text()
									 }} );
		}

		var get_values = combo.get_values = function (selector,j) {
			return $.map(get_elements(selector,j), function(){return $(this).value});
		}

		var get_texts = combo.get_texts = function (selector,j) {
			return $.map(get_elements(selector,j), function(){return $(this).text});
		}

		var select_option = function (op, j) {
			j=j||selection_combo;
			var multiple = (j==selection_combo);
			var changed;
			if (multiple) {
				var t =get_elements('option',j);
				var changed;
				$.each(t,function(){
						if (this.text==op) {
							changed=changed||0;
							if (!$(this.el).prop('selected')) {
								$(this.el).prop('selected',true);
								changed=1;
							}
						}
				});
			}
			else {
				var t =get_elements('option',j);
				var found,selected;
				$.each(t,function() {
					if (this.text==op) {
						found=this.el;
					}
					if ($(this.el).prop('selected')) {
						selected= this.el;
					}
				});
				if (found) {
					changed=changed||0;
					if (found!=selected) {
						if (selected) {
							$(selected).prop('selected',false);
						}
						$(found).prop('selected', true);
						changed=1;
					}
				}
			}
			return changed;
		}

		var deselect = combo.deselect = function () {
			var elements = get_elements('option', selection_combo);
			$.each (elements, function() {
				$(this.el).prop('selected',false);
			})
		}

		var add_element = function (elt,selected,to) {
			var opt = $('<option />', {
				value: elt,
				text: elt
			});
			if(selected){
				opt.attr('selected','selected');
			}
			opt.appendTo( to );
		};

		var add_elements = combo.add_elements = function (elements_str) {
			var a = (""+elements_str).split(' ');
			var existing = get_elements('option', selection_combo);
			$.map(a, function(el) {
				var found = find_element_by_text(existing, el);
				if (!found) {
					add_element(el,false,selection_combo);
					add_element(el,false,current_combo);
				}
			});
		}

		var find_element_by_text = function (elements, text) {
			var found;
			$.each(elements,function () {
				if (this.text==text) {
					found=this;
					return false;
				}
				return true;
			});
			return found;
		}

		var selection = combo.selection = function (new_selection,do_not_clear) {
			if (!do_not_clear) {
				deselect();
			}
			if (new_selection!=null) {
				var a = (""+new_selection).split(' ');
				//var elements = get_elements('option');
				var added;
				$.map(a, function(el) {
					var result = select_option(el, selection_combo);
					if ( result==null) {
						add_element(el,true,selection_combo);
						add_element(el,false,current_combo);
						added=1;
					}
				} );
				selection_combo.multiselect('refresh');
				update_selection();
				if (added) {
					current_combo.multiselect('refresh');
					//update_current();
				}
				return _selection;
			}
			else {
				return _selection;
			}
		}

		var current = combo.current = function (new_current) {
			if (arguments.length>0) {
				var result = select_option(new_current, selection_combo);
				if ( result==null) {
					add_element(new_current,true,selection_combo);
					add_element(new_current,false,current_combo);
					selection_combo.multiselect('refresh');
				}

				//var elements = get_elements('option',selection_combo);
				//var found = find_element_by_text(elements,new_current);
				//if (found) {
				//	var result = select_option(el, selection_combo);
				//	if (!$(found.el).prop('selected')) {
				//		$(found.el).prop('checked',1);
				//		selection_combo.multiselect('refresh');
				//	}
				//}
				//else {
				//	add_element(new_current,1);
				//	current_combo.multiselect('refresh');
				//	selection_combo.multiselect('refresh');
				//}

				result = select_option(new_current, current_combo);
				if (result==null) {
					console.log('current_combo not synchronized with selection_combo:' + new_current);
				}
				current_combo.multiselect('refresh');
				update_current();
				//var current_elements= get_elements('input', current_combo);
				//var found= find_element_by_text(current_elements,new_current);
				//if (!found) {
				//	console.log('selection_combo not synchronized with current_combo:' + new_current);
				//}
				//else {
				//	if (!$(found.el).prop('checked')) {
				//		$(found.el).prop('checked',1);
				//		current_combo.multiselect('refresh');
				//	}
				//	update_current();
				//}
				return _current;
			}
			else {
				return _current;
			}
		}

		var update_selection = function () {
			//var $checked = selection_combo.multiselect("widget").find('input:checked');
			_selection= get_w_texts('input:checked').join(' ');
			var t = get_texts('option:selected').join(' ');
			if (t!=_selection) {
				console.log("selection_combo gui unsynchronized");
			}
		}

		var update_current = function () {
			//var $checked = selection_combo.multiselect("widget").find('input:checked');
			_current= get_w_texts('input:checked',current_combo).join(' ');
			var t = get_texts('option:selected',current_combo).join(' ');
			if (t!=_current) {
				console.log("current_combo gui unsynchronized");
			}
		}

		var sync_current=function() {
			var elements = get_elements('option');
			var found = find_element_by_text(elements, _current);
			var selected ;
			if (found) {
				selected = $(found.el).prop('selected');
			}
			if (!selected) {
				if (elements && elements.length) {
					current(elements[elements.length-1].text);
				}
				else {
					current(undefined);
				}
			}
		}

		/*
		var sync_selection=function() {
			var elements = get_elements('input');
			var found = find_element_by_text(_current);
			var checked ;
			if (found) {
				checked = found.el.prop('checked');
			}
			if (!checked) {
				selection(_current, 1, 1);
			}
		}*/

		combo.init= function(current_selector,selection_selector) {
			//var $callback = $("#callback");
			selection_combo= $(selection_selector);
			current_combo= $(current_selector);
			selection_combo.multiselect({
				minWidth: 200,
				//selectedList: 10,
				close: function(){
					var t = _selection;
					update_selection();
					if (t!=_selection) {
						sync_current();
						main.switch_session(_selection,_current);
					}
				},
			});
			current_combo= $(current_combo);
			current_combo.multiselect({
				minWidth: 100,
				selectedList: 1,
				multiple:false,
				close: function(){
					var t = _current;
					update_current();
					if (t!=_current) {
						selection(_current,1,1);
						main.switch_session(_selection,_current);
					}
				},
			});
	};
})(main.multi_combo);
