//GLOBAL VARIABLES 
//click option tracker

//which cell is clicked in the major table, to be recorded for the query
var tab_opt = '';
var col_opt = '';
var agg_opt = '';
var key_opt = '';

var myChart; // echart js canvas

// ***************** test objects for display checking
//removed add later 
//{"column":"amount (Rs)"},\

var obj2 = JSON.parse('\
	[{"column":"consumption (million litres)"},\
	 {"column":"previous reading (million litres)"},\
	 {"column":"present_reading (million litres)"}\
	]');

var obj3 = JSON.parse('\
	[{"column":"Net inflow (million litres)"},\
	 {"column":"consumption(million litres)"},\
	 {"column":"ufw (million litres)"}\
	]');

//mapping from column selected to api
var col_to_api = {
		  "previous reading (million litres)": "prev",
		  "amount (Rs)": "amt",
		  "present_reading (million litres)": "pres",
		  "consumption (million litres)":"con",
		  "consumption(million litres)":"conmon",
		  "Net inflow (million litres)":"net",
		  "ufw (million litres)":"ufw"
};


var agg_str = ["min","max","avg","count", "sum"]

var rr_billing_key = ["dma_code"];
var dma_month_key = ["dma_code", "month"];

// ****************end of test objects
// -----global variables
var employee_data = '';
var agg_data = '';
var key_data = '';

lab = [];
l= [];

var data;
var clickedId;
// ******** functions



function track_click_element(clicked_id){
	tab_opt = clicked_id;
	console.log("button pressed : "+tab_opt);
	var col_opt = '';
	var agg_opt = '';
	var key_opt = '';
	
	//change color of clicked button (table)
	if (tab_opt == 'dma_monthly'){
		$("#rr_billing").removeClass('btn-primary').addClass('btn-success');
	}
	else {
		$("#dma_monthly").removeClass('btn-primary').addClass('btn-success');
	}
	$("#"+tab_opt).removeClass('btn-success').addClass('btn-primary');

	if(myChart){
		lab=[];
		l = [];
		createChart();
	}
	document.getElementById('graph').style.display = "none";
	document.getElementById('dwn').style.display = "none";
	document.getElementById('zoomop').style.display = "none";
	//$("#"+tab_opt).removeClass('alert-danger').addClass('alert-success');

}

function plotGraph(){


	var table = document.getElementById("employee_table");
	table.innerHTML = '<tr></tr>';

	employee_data = '';
	col_opt = '';
	agg_opt = '';
	key_opt = '';
	agg_data = '';
	key_data = '';
    employee_data +='<tr>';
    //employee_data +='<th>Name</th>';
    //employee_data +='<th>Address</th>';
    employee_data +='</tr>';

	//obj.forEach(process_fill)
	test_json(obj2);
	$('#employee_table').append(employee_data)

    //var table = document.getElementById("employee_table");
    //called function for this
    record_clicks_for_cells(table);

    //append to 'agg table ' function
	var aggtable = document.getElementById("agg_table");
	aggtable.innerHTML = '<tr></tr>';    
    agg_data = '';
    agg_table_fill()
    $('#agg_table').append(agg_data)

    record_clicks_for_cells(aggtable);

	var keytable = document.getElementById("key_table");
	keytable.innerHTML = '<tr></tr>'; 

    key_table_fill(rr_billing_key);
    $('#key_table').append(key_data);
    record_clicks_for_cells(keytable);

    //clear both data for next click
    employee_data = '';
    agg_data = '';
    key_data = '';

    //test_json();
}

function plotMonth(){


	var table = document.getElementById("employee_table");
	table.innerHTML = '<tr></tr>';

	employee_data = '';
	
	agg_data = '';
	key_data = '';
	col_opt = '';
	agg_opt = '';
	key_opt = '';
    employee_data +='<tr>';
    //employee_data +='<th>Name</th>';
    //employee_data +='<th>Address</th>';
    employee_data +='</tr>';

	//obj.forEach(process_fill)
	test_json(obj3);
	$('#employee_table').append(employee_data)

    //var table = document.getElementById("employee_table");
    //called function for this
    record_clicks_for_cells(table);

    //append to 'agg table ' function
	var aggtable = document.getElementById("agg_table");
	aggtable.innerHTML = '<tr></tr>';    
    agg_data = '';
    //agg_str.forEach(agg_table_fill)
    agg_table_fill();
    $('#agg_table').append(agg_data)

    record_clicks_for_cells(aggtable);

	var keytable = document.getElementById("key_table");
	keytable.innerHTML = '<tr></tr>'; 

    key_table_fill(dma_month_key);
    $('#key_table').append(key_data);
    record_clicks_for_cells(keytable);


    //clear both data for next click
    employee_data = '';
    agg_data = '';
    key_data = '';

    //test_json();
}


function record_clicks_for_cells(table_name){

    var rows = table_name.getElementsByTagName("tr");
    console.log(table_name.id)

    //get which element is clicked from 'selected table'
    for (i = 1; i < rows.length; i++) {
        row = table_name.rows[i];
        for (j = 0; j < row.cells.length; j++){
        	cell = row.cells[j];
        	// *****ONCLICK FUNCTION FOR each cell
        	cell.onclick = function(){
                          var cell2 = this;//.getElementsByTagName("td");
                          var id = cell2.innerHTML;
                          var tabid = '#'+ table_name.id +' tr td';
                          
                          if ($(this).hasClass('highlight')) {
							  console.log("trying to remove ");
							  
							  if(this.id == 'colcell') {
								  col_opt = '';
							  }
							  else if(this.id == 'aggcell') {
								  agg_opt = '';
							  }
							  else if(this.id == 'keycell') {
								  key_opt = '';
							  }
							  
							  
							  
							  $(this).removeClass('highlight');
							  return;
						  }

                          $(tabid).removeClass('highlight');
                          $(this).addClass('highlight')
                          if(this.id == 'colcell'){
                          	col_opt = col_to_api[id];
                          	clickedId = id;
                          }
                          else if (this.id == 'aggcell'){
                          	agg_opt = id;
                          }
                          else if (this.id == 'keycell'){
                          	key_opt = id;
                          }

                          console.log(id);
            };
        }

    }
}

function test_json(objd){
	console.log(objd.length);
	var i = 0;
	employee_data += '<tr>';
	objd.forEach(function(r){
		if (i<2){ i++; 		
				employee_data += '<td id="colcell">'+r.column+'</td>';
		}
		else { i=1; 
				employee_data += '</tr>';
				employee_data += '<tr>';
				employee_data += '<td id="colcell">'+r.column+'</td>';
		}
		console.log(i);
		console.log(r.column);
	});
	employee_data += '</tr>';

	
}


function process_fill(data){
				employee_data += '<tr>';
				employee_data += '<td id="colcell">'+data.name+'</td>';
				employee_data += '<td id="colcell">'+data.address+'</td>';
				employee_data += '</tr>'
				
}

function key_table_fill(data){
	var i = 0 ;
 	key_data += '<tr>';

 	for (i=0;i<data.length;i++){
 		if(i%2 == 0){
				key_data += '</tr>';
				key_data += '<tr>';
				key_data += '<td id="keycell">'+data[i]+'</td>'; 
				console.log("how many times");			
 		}
 		else{
 			key_data += '<td id="keycell">'+data[i]+'</td>';
 			console.log("how --many---times");

 		}
 	}

	key_data += '</tr>';	
}

function agg_table_fill(){
 	var i = 0 ;
 	agg_data += '<tr>';

 	for (i=0;i<agg_str.length;i++){
 		if(i%2 == 0){
				agg_data += '</tr>';
				agg_data += '<tr>';
				agg_data += '<td id="aggcell">'+agg_str[i]+'</td>'; 
				console.log("how many times");			
 		}
 		else{
 			agg_data += '<td id="aggcell">'+agg_str[i]+'</td>';
 			console.log("how --many---times");

 		}
 	}

	agg_data += '</tr>';	
}

function removeHash () { 
    history.pushState("", document.title, window.location.pathname
                                                       + window.location.search);
}

function submitquery(){
	//check whether all the url values are filled
	console.log("values of variables:")
	if(myChart){
		lab=[];
		l = [];
		createChart();
	}
	
	if (tab_opt == '' || col_opt == '' || agg_opt == '') {
		$("#subQ").removeClass('btn-primary').addClass('btn-danger');
		//$("#subQ").addClass('btn-danger');

		$("#subQmsg").removeClass('alert-success').addClass('alert-danger');
		$("#subQmsg").html("<strong>Error</strong> : Please make the required 3 selections")
	}
	else {
		$("#subQ").removeClass('btn-danger').addClass('btn-primary');
		$("#subQmsg").removeClass('alert-danger').addClass('alert-success');
		$("#subQmsg").html("<strong>Success</strong> : Query submitted")
		console.log("s: "+tab_opt+" "+col_opt+" "+agg_opt+" "+key_opt);



		//make query:

		//call plot function
		//plotChart();
		
		
		var request = new XMLHttpRequest();
		//rr_billing id of the button 
		//col_opt is from mapping dictionary and inner element from json object
		//agg_opt is from array object
		
		var requestUrl = 'spark?table='+tab_opt+'&column='+col_opt+'&agg='+agg_opt+'&key='+key_opt;
		console.log(requestUrl);
		request.open('GET', requestUrl, true);
		console.log(request.responseText)
		console.log("Testing console log")
		request.onload = function () {
			// begin accessing JSON data here
			console.log(request.responseText)
			data = JSON.parse(this.response);
			console.log(data)
			l=[];
			lab = [];
			for (var i = 0; i < data.length; i++) {
				console.log(data[i].dma_code + ' is a ' + data[i].count + '.'); //-------
				if (data[i].dma_code == "dma_code"){
					lab.push("Table: "+tab_opt);
				}
				else {
					lab.push(data[i].dma_code);
				}
				l.push(data[i].count);
				
			}
			console.log(data);
			console.log('again try');
			console.log(l);
			
			//myChart.update();
			document.getElementById('graph').style.display = "block";
			document.getElementById('dwn').style.display = "block";
			document.getElementById('zoomop').style.display = "block";
			
			createChart();
			
			window.location.hash = '#myChart';
			removeHash();
		}
		
		//****
		request.send();
		console.log("outside");
		console.log(lab);


		//createChart();
		//**************************************
		
	} //  end of else
}


//chart code
//create chart

function createChart(){
	
	//**** chart code
	var ctx = document.getElementById("myChart");
	ctx.style.backgroundColor = 'white';
	if(myChart){
		myChart.destroy();
	}
	
	myChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels: lab,
	        datasets: [{
	            label: agg_opt+'('+clickedId+')',
	            data: l,
	            backgroundColor: "rgba(14,72,100,1)",
				strokeColor: "brown",
	            borderWidth: 1
	        }]
	    },
	    options: {
			title : {
				display: true,
				text: agg_opt+'('+clickedId+') for each '+key_opt
			},
			pan: {
						enabled: true,
						mode: 'xy',
						speed: 2,
						threshold: 2
			},
			zoom: {
						enabled: true,
						mode: 'y',
						limits: {
							max: 10,
							min: 0.5
						}
			},
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true
	                },
	                scaleLabel: {
	                	display:true,
	                	labelString: agg_opt+'('+clickedId+')'
	                }
	            }],
				xAxes: [{
					scaleLabel: {
						display:true,
						labelString: key_opt
					}
				}
				]
	        }
	    }
	});
	myChart.options.zoom.enabled = false;
}


var popCounter = 0;
function popUp(){
	console.log(typeof lab);
	console.log(typeof l);
	console.log(typeof key_opt);
	console.log(agg_opt);
	console.log(col_opt);
	window.localStorage.setItem("lab",lab);
	window.localStorage.setItem("key_opt",key_opt);
	window.localStorage.setItem("l",l);
	window.localStorage.setItem("agg_opt",agg_opt);
	window.localStorage.setItem("clickedId",clickedId);
	window.localStorage.setItem("data", JSON.stringify(data));
	var winName = 'myPopup'+(++popCounter);
	
	 window.open('popupTest.html', winName,'width=800,height=800,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,copyhistory=no,resizable=yes');
	 return false;
}


function downloadCsv(){
	console.log('something');
	//var json_pre = '[{"Id":1,"UserName":"Sam Smith"},{"Id":2,"UserName":"Fred Frankly"},{"Id":1,"UserName":"Zachary Zupers"}]';
    //var json = $.parseJSON(json_pre);
	
    var csv = JSON2CSV(data);
    var downloadLink = document.createElement("a");
    var blob = new Blob(["\ufeff", csv]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "data.csv";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);	
}


function JSON2CSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var line = '';

    if ($("#labels").is(':checked')) {
        var head = array[0];
        if ($("#quote").is(':checked')) {
            for (var index in array[0]) {
                var value = index + "";
                line += '"' + value.replace(/"/g, '""') + '",';
            }
        } else {
            for (var index in array[0]) {
                line += index + ',';
            }
        }

        line = line.slice(0, -1);
        str += line + '\r\n';
    }

    for (var i = 0; i < array.length; i++) {
        var line = '';

        if ($("#quote").is(':checked')) {
            for (var index in array[i]) {
                var value = array[i][index] + "";
                line += '"' + value.replace(/"/g, '""') + '",';
            }
        } else {
            for (var index in array[i]) {
                line += array[i][index] + ',';
            }
        }

        line = line.slice(0, -1);
        str += line + '\r\n';
    }
    return str;
}

function zoom_en() {
	myChart.ctx.canvas.addEventListener('wheel', myChart._wheelHandler);
	myChart.options.zoom.enabled = true;
	console.log("enabled");
	console.log(myChart);
}

function zoom_dis() {
	
	myChart.ctx.canvas.removeEventListener('wheel', myChart._wheelHandler);
	//ctx.removeEventListener('wheel', myChart._wheelHandler);
	myChart.options.zoom.enabled = false;
}

function zoom_res() {
	myChart.resetZoom();
}

function srtAsc(a, b){
    return a.count - b.count;
}

function srtDesc(a, b){
    return b.count - a.count;
}

function sortFn(){
	if (data[i].dma_code == "dma_code") {
		console.log("can't sort 1 element");
		return;
	}
	console.log(data[1].dma_code + ' is a ' + data[1].count + '.');
	data.sort(srtAsc);
	console.log(data[1].dma_code + ' is a ' + data[1].count + '.');
	jsonToList(data);
	createChart();
		//ctx.focus();
		//$('.graphcanvas').focus()
		//document.getElementById('myChart').focus({preventScroll:false});
	window.location.hash = '#myChart';
	//console.log(l);
	removeHash();
}

function jsonToList(objj) {
	l = [];
	lab = [];
	console.log('pushing sorted');
	for (var i = 0; i < objj.length; i++) {	
		console.log(objj[i].dma_code + ' is a ' + objj[i].count + '.');
		lab.push(objj[i].dma_code);
		l.push(objj[i].count);
	}
}

