function mainFunc(){var t=new App;t.init()}var App=function(){this.counter=0,this.init=function(){var t=this;this.storageGetter(),$("#update-button").on("click",function(){t.storageSetter(),t.get()}),$("#create-report-button").on("click",function(){t.storageSetter(),t.post()}),this.clipboard=new Clipboard("#copy-button"),this.clipboard.on("error",function(t){})},this.post=function(){var t=this,e={};try{e=JSON.parse($("#data").val())}catch(t){return void $("#report").text("Can't parse JSON data")}$.ajax({url:"/openshift-linter",type:"POST",data:JSON.stringify(e),dataType:"json",contentType:"application/json; charset=utf-8",success:function(e){return"object"!=typeof e?(console.log("NOTANOBJECT"),void($("#report")[0].innerHTML=JSON.stringify(e))):void($("#report")[0].innerHTML=t.formatReport(e))},error:function(t){$("#report")[0].innerHTML="POST request failed"}})},this.formatReport=function(t){var e="";for(key in t)for(subkey in t[key]){var a=t[key][subkey],r=a.length;if(0!==r){e+="<h3>"+key+": "+subkey+"</h3>",e+="<table class='table table-striped'>",e+="<thead class='thead-default'><tr><th>Namespace</th><th>Name</th><th>Container</th></tr></thead>";for(var o=0;o<r;o++)e+="<tr><td>"+a[o].Namespace+"</td><td>"+a[o].Name+"</td><td>"+a[o].Container+"</td></tr>";e+="</table>"}}return e},this.get=function(){var t=$("#master-input").val(),e=$("#port-input").val(),a=$("#token-input").val(),r=$("#request-input").val(),o=t+":"+e+r;console.log("GET",o),$.ajax({url:o,type:"GET",dataType:"json",contentType:"application/json; charset=utf-8",headers:{Authorization:"Bearer "+a},success:function(t){$("#data").val(JSON.stringify(t)),$("#error")[0].innerHTML=""},error:function(t){var e=t.responseJSON?t.responseJSON.message:t.statusText;$("#error")[0].innerHTML=e}})},this.storageGetter=function(){"undefined"!=typeof localStorage&&($("#master-input").val(localStorage.getItem("master")),$("#port-input").val(localStorage.getItem("port")),$("#token-input").val(localStorage.getItem("token")),$("#request-input").val(localStorage.getItem("request")),$("#data").val(localStorage.getItem("data")))},this.storageSetter=function(){"undefined"!=typeof localStorage&&(localStorage.setItem("master",$("#master-input").val()),localStorage.setItem("port",$("#port-input").val()),localStorage.setItem("token",$("#token-input").val()),localStorage.setItem("request",$("#request-input").val()),localStorage.setItem("data",$("#data").val()))}};window.onload=mainFunc;