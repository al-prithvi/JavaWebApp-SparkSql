//GLOBAL VARIABLES 
//click option tracker

//which cell is clicked in the major table, to be recorded for the query
var tab_opt = '';
var col_opt = '';
var agg_opt = '';
var key_opt = '';

var date_month_opt = '';
var date_year_opt = '';
var mon_year_opt = '';
var myChart; // echart js canvas
var std_dev;

// according to date() in javascript: start with 0
// same names as front end, can use this for generating code in html as well
var month_map = {'Jan':0, 'Feb':1, 'Mar':2, 'Apr':3, 'May':4, 'Jun':5, 'Jul':6, 'Aug':7, 'Sep':8, 'Oct':9, 'Nov':10, 'Dec':11};
//HARDCODED
var dStart = new Date(2016,9,01);
var dFinal = new Date(2018,02,31); // limit of the data pushed in oct16 to mar18

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

// for borewell vs population
var obj4 = JSON.parse('\
	[{"column":"Borewell V RR units"}]');	
	
//mapping from column selected to api
var col_to_api = {
		  "previous reading (million litres)": "prev",
		  "amount (Rs)": "amt",
		  "present_reading (million litres)": "pres",
		  "consumption (million litres)":"con",
		  "consumption(million litres)":"conmon",
		  "Net inflow (million litres)":"net",
		  "ufw (million litres)":"ufw",
		  "Borewell V RR units":"bore"
};


var agg_str = ["min","max","avg","count", "sum"]
//****REFACTOR  could add option for which are valid options for above data struct
var agg_str_bore = ["count"]


var rr_billing_key = ["dma_code"];
var dma_month_key = ["dma_code", "month"];

// ****************end of test objects
// -----global variables
var employee_data = '';
var agg_data = '';
var key_data = '';

lab = [];
l= [];
l2 = [];

var data;
var clickedId;
// ******** functions



function track_click_element(clicked_id){
	tab_opt = clicked_id;
	console.log("button pressed : "+tab_opt);
	var col_opt = '';
	var agg_opt = '';
	var key_opt = '';
	
	//refresh the date selection
	date_month_opt = '';
	date_year_opt = '';
	
	//change color of clicked button (table)
	if (tab_opt == 'dma_monthly'){
		$("#rr_billing").removeClass('btn-primary').addClass('btn-success');
		$("#rr_info").removeClass('btn-primary').addClass('btn-success');
	}
	else if (tab_opt == 'rr_billing') {
		$("#dma_monthly").removeClass('btn-primary').addClass('btn-success');
		$("#rr_info").removeClass('btn-primary').addClass('btn-success');
	}
	else {
		$("#dma_monthly").removeClass('btn-primary').addClass('btn-success');
		$("#rr_billing").removeClass('btn-primary').addClass('btn-success');
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
	document.getElementById('dwnStd').style.display = "none";
	document.getElementById('violinBox').style.display = "none";
	
	document.getElementById('opt_mon_btn').style.display = "none";
	document.getElementById('opt_year_btn').style.display = "none";		
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

    //date_option buttons make visible 
	document.getElementById('opt_mon_btn').style.display = "block";
	document.getElementById('opt_year_btn').style.display = "block";	
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

function plotRRInfo() {
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
	test_json(obj4);
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

    key_table_fill(rr_billing_key);
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

	if (tab_opt == 'rr_info') {

		for (i=0;i<agg_str_bore.length;i++){
			if(i%2 == 0){
					agg_data += '</tr>';
					agg_data += '<tr>';
					agg_data += '<td id="aggcell">'+agg_str_bore[i]+'</td>'; 
					console.log("how many times");			
			}
			else{
				agg_data += '<td id="aggcell">'+agg_str_bore[i]+'</td>';
				console.log("how --many---times");

			}
		}
	
	}
	else {
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
		l2 = [];
		//createChart();
	}
	//for the case of date (added later to support rr_billing empty mon_year_opt for all other options, HARDCODED(can be added in other location
	mon_year_opt = '';
	
	//FOR DEBUG
	/*
	data = '[{"dma_code":"SE3DMA12","count":[825,424]},{"dma_code":"SE3DMA13","count":[264,0]},{"dma_code":"SW2DMA17","count":[792,467]},{"dma_code":"C1DMA01","count":[3299,240]},{"dma_code":"SW1DMA09","count":[4560,928]},{"dma_code":"SE3DMA10","count":[3353,1982]},{"dma_code":"SW1DMA06","count":[5521,1736]},{"dma_code":"SW1DMA05","count":[1586,427]},{"dma_code":"SE3DMA11","count":[1511,40]},{"dma_code":"S3DMA06","count":[4122,2270]},{"dma_code":"SW1DMA04","count":[1635,650]},{"dma_code":"S3DMA04","count":[639,164]},{"dma_code":"SW1DMA02","count":[2240,498]},{"dma_code":"SW1DMA01","count":[1018,429]},{"dma_code":"S3DMA05","count":[4053,1875]},{"dma_code":"S3DMA02","count":[3300,1787]},{"dma_code":"S3DMA03","count":[2581,1330]},{"dma_code":"S3DMA01","count":[549,355]},{"dma_code":"SW2DMA13","count":[639,279]},{"dma_code":"SW2DMA14","count":[3246,1885]},{"dma_code":"SW2DMA15","count":[4069,1944]},{"dma_code":"SW2DMA16","count":[1390,742]},{"dma_code":"SW2DMA10","count":[8375,1628]},{"dma_code":"SW2DMA11","count":[974,513]},{"dma_code":"SW2DMA12","count":[3459,1008]},{"dma_code":"SE3DMA01","count":[634,154]},{"dma_code":"SW3DMA10","count":[1485,705]},{"dma_code":"SE3DMA02","count":[1462,625]},{"dma_code":"SE3DMA03","count":[2382,905]},{"dma_code":"S2DMA02","count":[1948,1351]},{"dma_code":"SW3DMA13","count":[7266,3067]},{"dma_code":"S2DMA01","count":[673,313]},{"dma_code":"SE3DMA04","count":[1457,443]},{"dma_code":"SE3DMA05","count":[1348,604]},{"dma_code":"SW2DMA06","count":[2527,1022]},{"dma_code":"SW2DMA07","count":[1307,576]},{"dma_code":"SE3DMA06","count":[713,272]},{"dma_code":"S2DMA03","count":[2371,1563]},{"dma_code":"SE3DMA07","count":[2812,1418]},{"dma_code":"SE3DMA08","count":[911,64]},{"dma_code":"S3DMA08","count":[3962,1642]},{"dma_code":"S3DMA09","count":[1700,657]},{"dma_code":"SW2DMA02","count":[2773,1572]},{"dma_code":"SW2DMA03","count":[2687,1871]},{"dma_code":"SW2DMA04","count":[3607,1931]},{"dma_code":"SW2DMA05","count":[1027,600]},{"dma_code":"SW2DMA01","count":[1038,675]},{"dma_code":"SW3DMA02","count":[1540,650]},{"dma_code":"SW3DMA01","count":[900,399]},{"dma_code":"SW3DMA04","count":[1187,493]},{"dma_code":"S1DMA06","count":[2757,496]},{"dma_code":"S1DMA07","count":[1904,781]},{"dma_code":"SW3DMA03","count":[2503,1017]},{"dma_code":"S1DMA08","count":[2043,716]},{"dma_code":"SW3DMA06","count":[2162,942]},{"dma_code":"S1DMA09","count":[2393,514]},{"dma_code":"SW3DMA05","count":[3947,1477]},{"dma_code":"SW4DMA09","count":[973,227]},{"dma_code":"SW4DMA08","count":[907,353]},{"dma_code":"SW4DMA05","count":[1746,488]},{"dma_code":"SW4DMA04","count":[3638,1316]},{"dma_code":"SW4DMA07","count":[1239,278]},{"dma_code":"SW4DMA06","count":[2371,602]},{"dma_code":"SW4DMA01","count":[2351,771]},{"dma_code":"SW4DMA03","count":[2335,907]},{"dma_code":"SW4DMA02","count":[2473,1035]},{"dma_code":"SW3DMA07","count":[1362,645]},{"dma_code":"SW3DMA09","count":[1737,729]},{"dma_code":"W1DMA03","count":[4078,1894]},{"dma_code":"W1DMA02","count":[1806,363]},{"dma_code":"S1DMA10","count":[1415,180]},{"dma_code":"W1DMA01","count":[847,268]},{"dma_code":"SW1DMA13","count":[2027,382]},{"dma_code":"SW1DMA12","count":[2368,643]},{"dma_code":"SW4DMA12","count":[1834,380]},{"dma_code":"SW1DMA10","count":[4313,1656]},{"dma_code":"SW4DMA11","count":[3274,772]},{"dma_code":"SW4DMA13","count":[228,72]},{"dma_code":"S1DMA02","count":[1406,757]},{"dma_code":"S1DMA03","count":[3816,1322]},{"dma_code":"SW4DMA10","count":[1171,359]},{"dma_code":"S1DMA04","count":[1313,609]},{"dma_code":"S1DMA05","count":[257,146]},{"dma_code":"S1DMA01","count":[603,409]}]'
	data = JSON.parse(data);
	console.log(data)
	l=[];
	lab=[];
	l2=[];
	for (var i = 0; i < data.length; i++) {
		console.log(data[i].dma_code + ' is a ' + data[i].count + '.'); //-------
		//for only 1 bar
		if (data[i].dma_code == "dma_code"){
			lab.push("Table: "+tab_opt);
		}
		//multiple bars
		else {
			lab.push(data[i].dma_code);
		}
		l.push(data[i].count[0]);
		l2.push(data[i].count[1]);
	
	}
	console.log(l)
	console.log(l2)

	plotStackedGraph();
			document.getElementById('graph').style.display = "block";
			document.getElementById('dwn').style.display = "block";
			document.getElementById('zoomop').style.display = "block";	
	*/		
	
	//FOR PRODUCTION
	
	
	
	//-------------case for box plot--------------
	if (key_opt != '' && tab_opt!='' && col_opt !='' && agg_opt =='' && tab_opt!='rr_info') {
		$("#subQ").removeClass('btn-danger').addClass('btn-primary');
		$("#subQmsg").removeClass('alert-danger').addClass('alert-success');
		$("#subQmsg").html("<strong>Success</strong> : Query submitted")
		console.log("box plot : "+tab_opt+" "+col_opt+" "+agg_opt+" "+key_opt);
		vioBoxTog='violin';
	}
	
	//----------gen case 
	if (tab_opt == '' || col_opt == '' || (agg_opt == '' && key_opt == '') || (agg_opt == '' && tab_opt == 'rr_info') ) {
		console.log('error case '+tab_opt+' '+col_opt+' '+key_opt);
		$("#subQ").removeClass('btn-primary').addClass('btn-danger');
		//$("#subQ").addClass('btn-danger');

		$("#subQmsg").removeClass('alert-success').addClass('alert-danger');
		$("#subQmsg").html("<strong>Error</strong> : Please make the required 3 selections")
	}
	else {
		
		// add extra case for RR_BILLING as it requires date as well
		if (tab_opt == 'rr_billing' ) {
			if (date_month_opt == '' || date_year_opt == '') {
				console.log('error case date not selected '+date_month_opt+' '+date_year_opt);
				$("#subQ").removeClass('btn-primary').addClass('btn-danger');
				//$("#subQ").addClass('btn-danger');

				$("#subQmsg").removeClass('alert-success').addClass('alert-danger');
				$("#subQmsg").html("<strong>Error</strong> : Please pick the month / year")		
				return;
			} 
			
			//HARDCODED, can send query to check
			dt_opt = new Date(date_year_opt, month_map[date_month_opt],01);
			
			if (dt_opt<dStart || dt_opt>dFinal) { 
				console.log('error case no records for this '+date_month_opt+' '+date_year_opt);
				$("#subQ").removeClass('btn-primary').addClass('btn-danger');
				//$("#subQ").addClass('btn-danger');

				$("#subQmsg").removeClass('alert-success').addClass('alert-danger');
				$("#subQmsg").html("<strong>Error</strong> : Please pick another month/year")				
				return;
			}
			
			//if no issue, then fill the variable 
			mon_year_opt = ((month_map[date_month_opt]+1)+date_year_opt.substring(2));
		
		}		
		//make rr_billing date to send to servlet
		
		
		
		$("#subQ").removeClass('btn-danger').addClass('btn-primary');
		$("#subQmsg").removeClass('alert-danger').addClass('alert-success');
		$("#subQmsg").html("<strong>Success</strong> : Query submitted")
		console.log("s: "+tab_opt+" "+col_opt+" "+agg_opt+" "+key_opt+" "+mon_year_opt);



		//make query:

		//call plot function
		//plotChart();
		
		
		var request = new XMLHttpRequest();
		//rr_billing id of the button 
		//col_opt is from mapping dictionary and inner element from json object
		//agg_opt is from array object
		
		var requestUrl = 'spark?table='+tab_opt+'&column='+col_opt+'&agg='+agg_opt+'&key='+key_opt+'&monYear='+mon_year_opt;
		console.log(requestUrl);
		request.open('GET', requestUrl, true);
		console.log(request.responseText)
		console.log("Testing console log")
		request.onload = function () {
			// begin accessing JSON data here
			console.log(request.responseText)
			data = JSON.parse(this.response);
			console.log(data)

			
			console.log(data);
			console.log('again try');
			console.log(l);
			console.log(l2);
			
			//myChart.update();
			document.getElementById('graph').style.display = "block";
			document.getElementById('dwn').style.display = "block";
			document.getElementById('zoomop').style.display = "block";
			
			// check for whether violin/box or bar 
			if (agg_opt == '') {
				plotBox();
				document.getElementById('violinBox').style.display = "block";
			}
			else if (tab_opt == 'rr_info') {
				plotStackedGraph();
				document.getElementById('violinBox').style.display = "none";
				//document.getElementById('dwnStd').style.display = "block";
			}
			else {
				createChart();
				document.getElementById('violinBox').style.display = "none";
				document.getElementById('dwnStd').style.display = "block";
				var div = document.getElementById('stdMsg');
				calcStandardDeviation();
				
				div.innerHTML = '<strong>Standard deviation : </strong>'+std_dev;
			}
			

			
			
			window.location.hash = '#myChart';
			removeHash();
		}
		
		//****
		request.send();
		console.log("outside");
		console.log(lab);


		//createChart();
		//**************************************
		//**************************************
		
	} //  end of else
	

}


//chart code
//create chart

function createChart(){
	vioBoxTog='';
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
	window.localStorage.setItem("lab",JSON.stringify(lab));
	window.localStorage.setItem("key_opt",key_opt);
	window.localStorage.setItem("l",JSON.stringify(l));
	window.localStorage.setItem("agg_opt",agg_opt);
	window.localStorage.setItem("clickedId",clickedId);
	window.localStorage.setItem("data", JSON.stringify(data));
	//this variable is used for checking in popUp page
	console.log("before popUp "+vioBoxTog);
	window.localStorage.setItem("vioBoxTog", vioBoxTog);
	
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

function srtAscStacked(a, b){
    return a.count[0] - b.count[0];
}

function srtDesc(a, b){
    return b.count - a.count;
}

//sort according to dma code (x axis)
function srtXaxisAsc(a, b){
    if (a.dma_code < b.dma_code)
		return -1
	else
		return 1
}

//variable to keep track of toggle (binary)
var toggleSort = 1;

function sortFn(){
	if (data[0].dma_code == "dma_code") {
		console.log("can't sort 1 element");
		return;
	}
	//not a box/violin plot
	if (toggleSort == 1 && agg_opt != '') {
		toggleSort = 0;
		if (tab_opt == 'rr_info') {
			data.sort(srtAscStacked);
		}
		else {
			data.sort(srtAsc);
		}
	}
	//violin and boxplot has only this sort
	else {
		toggleSort = 1;
		data.sort(srtXaxisAsc);
		
	}
	
	console.log(data[1].dma_code + ' is a ' + data[1].count + '.');
	//data.sort(srtAsc);
	console.log(data[1].dma_code + ' is a ' + data[1].count + '.');
	jsonToList(data);
	
	
	if (agg_opt == '') {
		plotBox();
	}
	else if (tab_opt == 'rr_info') {
		plotStackedGraph();
	}
	else {
		createChart();
	}
	
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

// Box plot code



function plotBox() {
	
	
  document.getElementById('graph').style.display = "block";
  var ctx = document.getElementById("myChart");
  ctx.style.backgroundColor = 'white';
	if(myChart){
		myChart.destroy();
	}  
  
boxplotData = {
  // define label tree
  labels: lab,
  datasets: [{
    label: '('+clickedId+')',
    backgroundColor: 'rgba(255,0,0,0.5)',
    borderColor: 'red',
    borderWidth: 1,
    outlierColor: '#999999',
    padding: 10,
    itemRadius: 0,
    outlierColor: '#999999',
    data: l
  }]
};
  
  
  myChart = new Chart(ctx, {
    type: vioBoxTog,
    data: boxplotData,
    options: {
      responsive: true,
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '('+clickedId+') for each '+key_opt
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
    }//options end	
	
  });	
  //myChart.options.zoom.enabled = false;
}

function plotStackedGraph() {
	l=[];
	lab = [];
	// l2 is for number of borewell in the stack chart
	l2=[];
	if (tab_opt != 'rr_info') {
		for (var i = 0; i < data.length; i++) {
			console.log(data[i].dma_code + ' is a ' + data[i].count + '.'); //-------
			//for only 1 bar
			if (data[i].dma_code == "dma_code"){
				lab.push("Table: "+tab_opt);
			}
			//multiple bars
			else {
				lab.push(data[i].dma_code);
			}
			l.push(data[i].count);
			
		}
	}
	else {   // if it is rr_information
		for (var i = 0; i < data.length; i++) {
			console.log(data[i].dma_code + ' is a ' + data[i].count + '.'); //-------
			//for only 1 bar
			if (data[i].dma_code == "dma_code"){
				lab.push("Table: "+tab_opt);
			}
			//multiple bars
			else {
				lab.push(data[i].dma_code);
			}
			l.push(data[i].count[0]);
			l2.push(data[i].count[1]);
			
		}				
	}	
	
	var dispData = {
		labels: lab,
		datasets: [
			{
				label: "Number of RR Units",
				backgroundColor: 'rgba(255, 99, 132, 0.5)',   
				borderWidth: 1,
				data: l,
			}  ,
					{
				label: "Borewell",
				backgroundColor: 'rgba(255, 206, 86, 1)',
				borderWidth: 1,
				data: l2,
			}

		]
	};

	var options= {
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
		  xAxes: [{
		    stacked: true,
			scaleLabel: {
				display:true,
				labelString: key_opt
			}
		  }],
		  yAxes: [{
			stacked: false,
			ticks: {
			  beginAtZero: true
			},
			scaleLabel: {
				display:true,
				labelString: agg_opt+'('+clickedId+')'
			}			
		  }]

		}
	};

	var ctx = document.getElementById("myChart");
	ctx.style.backgroundColor = 'white';
	if(myChart){
		myChart.destroy();
	}
	
	
	myChart = new Chart(ctx, {
		type: 'bar',
		data: dispData,
		options: options
	});	
	
	myChart.options.zoom.enabled = false;
	
}



function calcStandardDeviation(){
	console.log("list is :"+l)

	var sum = 0;
	for (var i=0;i<l.length;i++){
		sum += l[i]
	}
	mean = sum/l.length;
	console.log("mean is "+mean)
	sum = 0;
	for (var i=0;i<l.length;i++){
		sum += Math.pow((l[i]-mean),2)
		
	}
	sum = sum/l.length;
	std_dev = (Math.sqrt(sum)).toFixed(2);
	console.log("median is "+std_dev);
	
}

//function for toggle boxplot and violin plot
var vioBoxTog='';
function violinBoxToggle() {
	if (vioBoxTog=='violin'){
		vioBoxTog='boxplot'
	}
	else {
		vioBoxTog='violin'
	}
	plotBox()
} 

//change dropdown button text and record the options clicked
$(function(){
  
  $("#opt_month a").click(function(){
    
     $("#opt_mon_btn:first-child").text($(this).text());
     $("#opt_mon_btn:first-child").val($(this).text());
	 
	 date_month_opt = ($(this).text());
	 console.log('date month selected '+date_month_opt);
	 
  });

  $("#opt_year a").click(function(){
    
     $("#opt_year_btn:first-child").text($(this).text());
     $("#opt_year_btn:first-child").val($(this).text());
	 
	 date_year_opt = ($(this).text());
	 console.log('date year selected'+date_year_opt);
  });  
  
});
