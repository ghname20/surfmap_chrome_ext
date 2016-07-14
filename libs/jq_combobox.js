var main=main||{};
main.combo_widget = function() {
	(function($) {
		// var _combo_debug ;
		$.widget(
						"custom.combobox",
						{
							_create : function() {
								if (_combo_debug) debugger;
								this.wrapper = $("<div>").addClass("custom-combobox")
										.insertAfter(this.element);

								this.element.hide();
								this._createAutocomplete();
								this._createShowAllButton();
							},

							_createAutocomplete : function() {
								if (_combo_debug) debugger;
								var selected = this.element.children(":selected"), value = selected
										.val() ? selected.text() : "";

								this.input = $("<input>")
										.appendTo(this.wrapper)
										.val(value)
										.attr("title", "")
										.addClass(
												"custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left")
										.autocomplete({
											delay : 0,
											minLength : 0,
											source : $.proxy(this, "_source")

										}).tooltip({
											tooltipClass : "ui-state-highlight"
										});

								this._on(this.input, {
									autocompleteselect : function(event, ui) {
										if (_combo_debug) debugger;
										ui.item.option.selected = true;
										this._trigger("select", event, ui && ui.item ? {
											input : ui.item,
											item : ui.item.option,
											value : ui.item.option.value
										}: { value : this.input.val() } );
									},

									//autocompletechange: "_removeIfInvalid"
									autocompletechange: function(event,ui) {
										this._trigger("select", event, ui && ui.item ? {
											input : ui.item,
											item : ui.item.option,
											value : ui.item.option.value
										}: { value : this.input.val() }  );
									}
								})
							},
							_createShowAllButton : function() {
								if (_combo_debug) debugger;
								var input = this.input, wasOpen = false;

								$("<a>").attr("tabIndex", -1).attr("title", "Show All Items")
								.tooltip().appendTo(this.wrapper).button({
									icons : {
										primary : "ui-icon-triangle-1-s"
									},
									text : false
								}).removeClass("ui-corner-all").removeClass("ui-corner-right").addClass(
										"custom-combobox-toggle").mousedown(
										function() {
											wasOpen = input.autocomplete("widget").is(":visible");
										}).click(function() {
									input.focus();

									// Close if already visible
									if (wasOpen) {
										return;
									}

									// Pass empty string as value to search for, displaying all
									// results
									input.autocomplete("search", "");
								});
							},

							_source : function(request, response) {
								var matcher = new RegExp($.ui.autocomplete
										.escapeRegex(request.term), "i");
								response(this.element.children("option").map(function() {
									var text = $(this).text();
									if (this.value && (!request.term || matcher.test(text)))
										return {
											label : text,
											value : text,
											option : this
										};
								}));
							},

							_removeIfInvalid : function(event, ui) {

								// Selected an item, nothing to do
								if (ui.item) {
									return;
								}

								// Search for a match (case-insensitive)
								var value = this.input.val(), valueLowerCase = value
										.toLowerCase(), valid = false;
								this.element.children("option").each(function() {
									if ($(this).text().toLowerCase() === valueLowerCase) {
										this.selected = valid = true;
										return false;
									}
								});

								// Found a match, nothing to do
								if (valid) {
									this._trigger( "change", event, { ui: ui, input: this.input, value : this.input.val() });
									return;
								}

								// Remove invalid value
								this.input.val("")
										.attr("title", value + " didn't match any item").tooltip(
												"open");
								this.element.val("");
								this._delay(function() {
									this.input.tooltip("close").attr("title", "");
								}, 2500);
								this.input.autocomplete("instance").term = "";
							},

							_destroy : function() {
								this.wrapper.remove();
								this.element.show();
							}
						});
	})(jQuery);
};