debugger;
var options={};
(
 function (options) {
    var backend = document.getElementById("backend");
    var verbose_logging = document.getElementById("verbose_logging");
    var relevance_count = document.getElementById("relevance_count");
    restore();
    backend.onchange = save;
    verbose_logging.onchange = save;
    relevance_count.onchange = save;

    function restore() {
        if (localStorage["backend_site_address"] !== undefined) {
            backend.value = localStorage["backend_site_address"] ;
        }
        if (localStorage["verbose_logging"] !== undefined) {
            verbose_logging.checked = localStorage["verbose_logging"] ? true: false;
        }
        if (localStorage["relevance_count"] !== undefined) {
            relevance_count.value = localStorage["relevance_count"] ;
        }
    }

    function save() {
      var options = {};
      options.backend_site_address = localStorage["backend_site_address"]  = backend.value;
      options.verbose_logging= localStorage["verbose_logging"]  = verbose_logging.checked ? true : false;
      options.relevance_count = localStorage["relevance_count"]  = relevance_count.value;
      var status = document.getElementById("status");
      status.innerHTML = "options saved.";
      console.log("saved");
      setTimeout(function () {
          status.innerHTML = "";
      }, 2000);
      chrome.runtime.sendMessage({source : 'options', request: 'options_changed' , options: options} );
    }
})(options);
