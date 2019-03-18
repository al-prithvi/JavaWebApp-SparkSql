//Global variables
// probably removable x_opt and y_opt (check once) 
var x_opt = '';
//y_opt removable 
var y_opt = '';

l = [];
lab = [];
var data; 

//which of the main tables is selected (lorenz or flow/pressure)
var tab_opt = '';
//which of the month-year combinations displayed is selected (lorenz) 
var col_opt = '';
// MAP , also dm_no is going to be used when calling pop up code
var dm_no = ''

//from and to date in flow_meter readings
var fromdt = '', todt = '';

var myChart; //echart js canvas

var obj_month = JSON.parse('\
	[{"column":"oct16"},\
	 {"column":"nov16"},\
	 {"column":"dec16"},\
	 {"column":"jan17"},\
	 {"column":"feb17"},\
	 {"column":"mar17"},\
	 {"column":"apr17"},\
	 {"column":"may17"},\
	 {"column":"jun17"},\
	 {"column":"jul17"},\
	 {"column":"aug17"},\
	 {"column":"sep17"},\
	 {"column":"oct17"},\
	 {"column":"nov17"},\
	 {"column":"dec17"},\
	 {"column":"jan18"},\
	 {"column":"feb18"},\
	 {"column":"mar18"}\
	]');


 $(function(){

    $(".menu1 a").click(function(){

      $("#dropdownMenuButton:first-child").text($(this).text());
      $("#dropdownMenuButton:first-child").val($(this).text());
      x_opt = $(this).text();
      console.log(x_opt);

   });
    
    $(".menu2 a").click(function(){

      $("#dropdownMenuButton2:first-child").text($(this).text());
      $("#dropdownMenuButton2:first-child").val($(this).text());
      y_opt = $(this).text();
      console.log(y_opt);

   });

   //code for after MAP is clicked 
   dm_no = window.localStorage.getItem("dm_no");
   console.log("dm is ", dm_no)
   //********************11th march 2019 DISABLED, if no dm_no is selected, it goes from previous selection **********
   //enabled
   window.localStorage.setItem("dm_no", "");
   //for debug 
   dm_no = 'SW2DM0204'
   //test whether dm_no is "", if yes, then it doesn't come from maps section with dm_no
   if (dm_no != "") {
	   //code for changing button color, and display message (to add)
	   //$("#lorenz").removeClass('btn-primary').addClass('btn-success');
	   //tab_opt variable filled so that it's as if flow_pressure has been selected.
	   //tab_opt = 'flow_pressure';
	   //$("#flow_pressure").removeClass('btn-success').addClass('btn-primary');
	   
	   
	   track_click_element('flow_pressure');
	   
	   //display dm_no
	   var h = document.getElementById('dm_no_display');
	   h.innerHTML += ' of DM_NO: <br>'+dm_no;
	   
   }
   console.log("dm is ", dm_no)

});


function removeHash () { 
    history.pushState("", document.title, window.location.pathname
                                                       + window.location.search);
}			
//function for submit button

function submitquery(){
	//check whether all the url values are filled
	console.log("values of variables:")
	
	if(myChart){
		lab=[];
		l = [];
		//createChart();
	}
	//for debug
	
	plotLine();
	document.getElementById('graph').style.display = "block";
	document.getElementById('dwn').style.display = "block";	
	
	
	
	//for debug here
	/*
	document.getElementById('graph').style.display = "none";
	document.getElementById('dwn').style.display = "none";	
	
	
	console.log("dma is ----",dm_no)
	//dm_no = "some" 
	//date extract code
	if (tab_opt == 'flow_pressure') {
		date = new Date($('#from_date').val());
		day = date.getDate();
        day = day.toString();
        if (day.length == 1)
        	day = '0'+day 
		
		month = date.getMonth() + 1;
		year = date.getFullYear();
		fromdt = ([year, month, day].join('-'))
		var fdate = date;
		
		//to date
		date = new Date($('#to_date').val());
		day = date.getDate();
        day = day.toString();
        if (day.length == 1)
        	day = '0'+day 
		
		month = date.getMonth() + 1;
		year = date.getFullYear();
		todt = ([year, month, day].join('-'))
		var tdate = date;
		
		console.log("----------from date----------------",fromdt);
		console.log("----------to date----------------",todt);
		if (fromdt == 'NaN-NaN-NaN' || todt == 'NaN-NaN-NaN') {
			console.log("improper----------------------")
			$("#subQ").removeClass('btn-primary').addClass('btn-danger');
			//$("#subQ").addClass('btn-danger');
			$("#subQmsg").removeClass('alert-success').addClass('alert-danger');
			$("#subQmsg").html("<strong>Error</strong> : Please make the from and till date for flow meter readings")			
			return;
		}


		//check for date validity wrt each other and available values (HARDCODED)
		// month is from 0, therefore it's from 0 to 11, december being 11.
		
		oct16 = new Date(2016,9,1); // november
		mar18 = new Date(2018,2,31); //march
		
		if ( fdate > tdate ) {
			$("#subQ").removeClass('btn-primary').addClass('btn-danger');
			//$("#subQ").addClass('btn-danger');
			$("#subQmsg").removeClass('alert-success').addClass('alert-danger');
			$("#subQmsg").html("<strong>Error</strong> : From date is greater than till date ")			
			return 
		}
		// next check if within oct16 and mar18 HARDCODED
		else if ( fdate<oct16 || tdate>mar18 ) {
			$("#subQ").removeClass('btn-primary').addClass('btn-danger');
			//$("#subQ").addClass('btn-danger');
			$("#subQmsg").removeClass('alert-success').addClass('alert-danger');
			//HARDCODED
			$("#subQmsg").html("<strong>Error</strong> : Only records from oct16 to mar18 available")			
			return 
		}
		
	}

	//-------------------------------temporary --------------------------
	//following choice for lorenz 
	if ((x_opt == '' || col_opt == '') && tab_opt == 'lorenz') {
		$("#subQ").removeClass('btn-primary').addClass('btn-danger');
		//$("#subQ").addClass('btn-danger');

		$("#subQmsg").removeClass('alert-success').addClass('alert-danger');
		$("#subQmsg").html("<strong>Error</strong> : Please make the 2 selections")
	}
	
	// if dm_no is empty which can happen if we didn't come from map selection ***** later I can add an option here in spec.html
	// to select dm_no from drop_down 
	else if ( tab_opt == 'flow_pressure' && dm_no == "") {
		$("#subQ").removeClass('btn-primary').addClass('btn-danger');
		//$("#subQ").addClass('btn-danger');
		$("#subQmsg").removeClass('alert-success').addClass('alert-danger');
		$("#subQmsg").html("<strong>Error</strong> : Please make the dm_no selection from map.html window")			
	}
	else if ( tab_opt == 'flow_pressure' && (fromdt == "" || todt == "") ) {
		$("#subQ").removeClass('btn-primary').addClass('btn-danger');
		//$("#subQ").addClass('btn-danger');
		$("#subQmsg").removeClass('alert-success').addClass('alert-danger');
		$("#subQmsg").html("<strong>Error</strong> : Please make the from and till date for flow meter readings")			
	}	
	else {
		$("#subQ").removeClass('btn-danger').addClass('btn-primary');
		$("#subQmsg").removeClass('alert-danger').addClass('alert-success');
		$("#subQmsg").html("<strong>Success</strong> : Query submitted")
		console.log("s: "+x_opt+" "+col_opt);

		//make query:
		var request = new XMLHttpRequest();
		// MAP
		//val = col_opt which is the month year selected
		//label = table selected
		
		var requestUrl = 'spark?val='+col_opt+'&label='+x_opt+'&dm_no='+dm_no+'&fdate='+fromdt+'&tdate='+todt;
		request.open('GET', requestUrl, true);
		console.log(request.responseText)
		console.log("Testing console log")

		request.onload = function () {
			// begin accessing JSON data here
			console.log(request.responseText)
			data = JSON.parse(this.response);
			//var data = this.response;
			console.log(data)
			//l = data;
			l = [];
			var i;
			
			if (tab_opt == 'lorenz') {
				
				for (i=0; i<data.length-2; i++) { //Gini and Theil index last two
					l.push(data[i]);
				}
				//data[i] has the gini index now
				console.log(data[i]);
				
			}
			// for line chart 
			else {
				//pass for now
				//l and label fill be filled in plotline
				
			}

			lab = [];
			/*for (var i = 0; i < data.length; i++) {
				console.log(data[i].dma_code + ' is a ' + data[i].count + '.'); //-------
				l.push(data[i].count);
				lab.push(data[i].dma_code);
			}*/
			
			// for debug
			/*
			console.log(data);
			console.log('again try');
			console.log(l);
			
			//myChart.update();
			document.getElementById('graph').style.display = "block";
			document.getElementById('dwn').style.display = "block";
			
			console.log(tab_opt,"option for table")
			//check which to display (MAP)
			if (tab_opt == 'lorenz') {
				createChart();	
				
				var div = document.getElementById('ixMsg');
				div.innerHTML = '<strong>Gini Index : </strong>'+data[i].y.toPrecision(3)+'<br><strong>Theil Index : </strong>'+data[i+1].y.toPrecision(3);
				
				//theil index 
				console.log('Theil index display: ',data[i+1].y.toPrecision(3));
				
				window.localStorage.setItem("gini", data[i].y.toPrecision(3)  );
				window.localStorage.setItem("theil", data[i+1].y.toPrecision(3)  );
			}
			else {
				//for flow meter readings
				console.log("inside plotline")
				console.log(data)
				plotLine(data);
			}
			

			window.location.hash = '#myChart';
			removeHash();
		}
		
		//****
		request.send();
		console.log("outside");
		console.log(lab);


	}//end of else block
	*/
	
}




var ctx;
var l2 = [{
                "x": 0,
                "y": 0
            }, {
                "x": 100,
                "y": 100
            }];
function createChart(){
	
	//**** chart code
	ctx = document.getElementById("myChart");
	ctx.style.backgroundColor = 'white';
	
	if(myChart){
		myChart.destroy();
	}
	
	myChart = new Chart(ctx, {
	    type: 'scatter',
	    data: {
	        datasets: [{
	            label: 'consumption inequity',
	            data: l,
				borderColor: "blue",
	            borderWidth: 3,
				showLine: true,
				fill:false
	        },{
	            label: 'ideal',
	            data: l2,
				borderColor: "#3cba9f",
	            borderWidth: 3,
				showLine: true,
				fill:false
	        }]
	    },
	    options: {
			title : {
				display: true,
				text: 'Lorenz Curve (consumption)'
			},
	        scales: {
				yAxes: [{
					scaleLabel: {
	                	display:true,
	                	labelString: "cumulative consumption percentile"
					}
				}],
	            xAxes: [{
					scaleLabel: {
						display:true,
						labelString: "cumulative population percentile"
					},
	                type: 'linear',
					position: 'bottom'
	            }]
	        },
			responsive: true
	    }
	});
}

//Debug: for plotting line 
dataLine = [["2000-06-05",116],["2000-06-06",129],["2000-06-07",135],["2000-06-08",86],["2000-06-09",73],["2000-06-10",85],["2000-06-11",73],["2000-06-12",68],["2000-06-13",92],["2000-06-14",130],["2000-06-15",245],["2000-06-16",139],["2000-06-17",115],["2000-06-18",111],["2000-06-19",309],["2000-06-20",206],["2000-06-21",137],["2000-06-22",128],["2000-06-23",85],["2000-06-24",94],["2000-06-25",71],["2000-06-26",106],["2000-06-27",84],["2000-06-28",93],["2000-06-29",85],["2000-06-30",73],["2000-07-01",83],["2000-07-02",125],["2000-07-03",107],["2000-07-04",82],["2000-07-05",44],["2000-07-06",72],["2000-07-07",106],["2000-07-08",107],["2000-07-09",66],["2000-07-10",91],["2000-07-11",92],["2000-07-12",113],["2000-07-13",107],["2000-07-14",131],["2000-07-15",111],["2000-07-16",64],["2000-07-17",69],["2000-07-18",88],["2000-07-19",77],["2000-07-20",83],["2000-07-21",111],["2000-07-22",57],["2000-07-23",55],["2000-07-24",60]];

var dateList = dataLine.map(function (item) {
    return item[0];
});
var valueList = dataLine.map(function (item) {
    return item[1];
});


retData = [{"dma_code":"2017-10-01 00:00:00.0","count":334.48},{"dma_code":"2017-10-01 00:00:00.0","count":320.64},{"dma_code":"2017-10-01 00:00:00.0","count":349.12},{"dma_code":"2017-10-01 00:00:00.0","count":341.34},{"dma_code":"2017-10-01 00:00:00.0","count":341.09},{"dma_code":"2017-10-01 00:00:00.0","count":319.38},{"dma_code":"2017-10-01 00:00:00.0","count":85.28},{"dma_code":"2017-10-01 00:00:00.0","count":0.59},{"dma_code":"2017-10-01 00:00:00.0","count":0.7},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.44},{"dma_code":"2017-10-01 00:00:00.0","count":0.39},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":3.73},{"dma_code":"2017-10-01 00:00:00.0","count":0.12},{"dma_code":"2017-10-01 00:00:00.0","count":1.78},{"dma_code":"2017-10-01 00:00:00.0","count":1.45},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.35},{"dma_code":"2017-10-01 00:00:00.0","count":0.28},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.06},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.98},{"dma_code":"2017-10-01 00:00:00.0","count":6.94},{"dma_code":"2017-10-01 00:00:00.0","count":6.79},{"dma_code":"2017-10-01 00:00:00.0","count":8.53},{"dma_code":"2017-10-01 00:00:00.0","count":8.69},{"dma_code":"2017-10-01 00:00:00.0","count":7.79},{"dma_code":"2017-10-01 00:00:00.0","count":8.91},{"dma_code":"2017-10-01 00:00:00.0","count":9.82},{"dma_code":"2017-10-01 00:00:00.0","count":7.95},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.95},{"dma_code":"2017-10-01 00:00:00.0","count":0.45},{"dma_code":"2017-10-01 00:00:00.0","count":0.22},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":0.0},{"dma_code":"2017-10-01 00:00:00.0","count":53.09},{"dma_code":"2017-10-01 00:00:00.0","count":274.67},{"dma_code":"2017-10-01 00:00:00.0","count":287.97},{"dma_code":"2017-10-01 00:00:00.0","count":279.08},{"dma_code":"2017-10-01 00:00:00.0","count":271.68},{"dma_code":"2017-10-01 00:00:00.0","count":260.15},{"dma_code":"2017-10-01 00:00:00.0","count":249.92},{"dma_code":"2017-10-01 00:00:00.0","count":249.32},{"dma_code":"2017-10-01 00:00:00.0","count":275.2},{"dma_code":"2017-10-01 00:00:00.0","count":64.41}];


function retDateToBar (date, jData) {
	//console.log("inside the function")
	//console.log(jData.count)
	return {
		t: date.valueOf(),
		y: jData.count
	};
	
	
}

function plotLine(data) {
		//returned json object 
		//for debug
		/*
		if (data.length == 0) {
			console.log("data struct empty")
			$("#subQ").removeClass('btn-primary').addClass('btn-danger');
			$("#subQmsg").removeClass('alert-success').addClass('alert-danger');
			$("#subQmsg").html("<strong>Records not found </strong> : for this dm_no date combination")
			
			//hide the graph and other option, it will show again if submit is successful. DEBUG: put in submit code(it'll work for lorenz and others as well
			//also make a function for this, easier to call (show/hide)
			document.getElementById('graph').style.display = "none";
			document.getElementById('dwn').style.display = "none";
			
			
			return;
		}
	
		retData = data 		
		console.log(data)
		//end of debug
		*/
		
		console.log(retData)
		var dateFormat = 'YYYY-MM-DD HH:mm:ss.f' 
		var date = moment(retData[0].dma_code, dateFormat);
		
		console.log(date)
		console.log(date.isoWeekday())
		var data_g = [retDateToBar(date, retData[0])];//30
		console.log(data_g)
		
		/*
LTS  : 'h:mm:ss A',
 LT   : 'h:mm A',
 L    : 'MM/DD/YYYY',
 LL   : 'MMMM D, YYYY',
 LLL  : 'MMMM D, YYYY h:mm A',
 LLLL : 'dddd, MMMM D, YYYY h:mm A'
		 */
		
		var labels = [date.format('L') + " " + date.format('LT')];
		var i = 1;
		while (i < retData.length) { //60------------------------------------number of values in the graph 
			date = moment(retData[i].dma_code, dateFormat);
			data_g.push(retDateToBar(date, retData[i]));
			//labels.push(date.toString()[15:]);
			labels.push(date.format('L') + " " + date.format('LT'))
			console.log('came here')
			
			i+=1;
		}

		
		console.log(labels)
		console.log(data_g)

	ctx = document.getElementById("myChart");
	ctx.style.backgroundColor = 'white';
	
	if(myChart){
		myChart.destroy();
	}

		var cfg = {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [{
					label: 'Line Chart flow-meter readings of DM : '+dm_no,
					backgroundColor: "rgba(14,72,100,1)",
					//backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
					borderColor: "red",
					strokeColor: "brown",
					data: data_g,
					type: 'line',
					pointRadius: 0,
					fill: false,
					lineTension: 0,
					borderWidth: 2
				}]
			},
			options: {

			pan: {
						enabled: false,
						mode: 'xy' //,
						//speed: 2,
						//threshold: 2
			},
			zoom: {
						enabled: false,
						mode: 'x' /*,
						limits: {
							max: 10,
							min: 0.5
						}*/
			},
			
				scales: {
					xAxes: [{
					scaleLabel: {
						type: 'time',
						distribution: 'series',
						display:true,
						//x axis label
						labelString: "date-time"
					}
				}/*,
				{
						type: 'time',
						distribution: 'series',
						ticks: {
							source: 'labels'
						}
					}*/],
					yAxes: [{
						scaleLabel: {
							display: true,
							//y axis label
							labelString: 'flow rate (m3/hr)'
						}
					}]
				}
			}

		};	
	
	myChart = new Chart(ctx, cfg);
	//myChart.options.zoom.enabled = true;
}




function track_click_element(clicked_id){
	tab_opt = clicked_id;
	console.log("button pressed : "+tab_opt);

	//change color of clicked button (table)
	/*
	
	if (tab_opt == 'lorenz'){
		$("#thiel").removeClass('btn-primary').addClass('btn-success');
	}
	else {
		$("#lorenz").removeClass('btn-primary').addClass('btn-success');
	}
	*/

	document.getElementById('graph').style.display = "none";
	document.getElementById('dwn').style.display = "none";

	
	//change color of clicked button (table)
	if (tab_opt == 'lorenz'){
		$("#flow_pressure").removeClass('btn-primary').addClass('btn-success');	
		document.getElementById('table_attrib').style.display = "block";
		//the other table's option has to go
		document.getElementById('flowmeter_dates').style.display = "none";
		/*
		if(myChart){
			lab=[];
			l = [];
			createChart();
		}
		*/
	}
	else {
		$("#lorenz").removeClass('btn-primary').addClass('btn-success');
		document.getElementById('flowmeter_dates').style.display = "block";
		// the other table has got to go
		document.getElementById('table_attrib').style.display = "none";
	}	
	
	$("#"+tab_opt).removeClass('btn-success').addClass('btn-primary');


	
	// x_opt is sent as label to servlet
	x_opt = tab_opt;
	// y_opt can mostly be removed, check once, old code
	y_opt = '';
	//$("#"+tab_opt).removeClass('alert-danger').addClass('alert-success');
	fromdt = ''
	todt = ''
}


function plotLorenz(){

	var table = document.getElementById("month_table");
	table.innerHTML = '<tr></tr>';

	employee_data = '';
	//refresh selected options
	
    employee_data +='<tr>';
    //employee_data +='<th>Name</th>';
    //employee_data +='<th>Address</th>';
    employee_data +='</tr>';

	//obj.forEach(process_fill)
	generate_cells(obj_month);
	$('#month_table').append(employee_data)

    //var table = document.getElementById("employee_table");
    //called function for this
    record_clicks_for_cells(table);
    //clear both data for next click
    employee_data = '';
   	
	//add code to toggle b/w buttons
	
	
	
}






//generate cells after table is clicked
function generate_cells(objd){
	console.log(objd.length);
	var i = 0;
	employee_data += '<tr>';
	objd.forEach(function(r){
		if (i<8){ i++; 		
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
							  console.log("trying t oremove ");
							  col_opt = '';
							  agg_opt = '';
							  key_opt = '';
							  $(this).removeClass('highlight');
							  return;
						  }
						  
                          $(tabid).removeClass('highlight');
                          $(this).addClass('highlight')
                          if(this.id == 'colcell'){
                          	col_opt = id;
                          }
                          console.log(id);
            };
        }

    }
}


var popCounter = 0;
function popUp(){

	if (tab_opt == 'lorenz') {
		window.localStorage.setItem("l2", JSON.stringify(l2));
	
		window.localStorage.setItem("l", JSON.stringify(l));
	}
	else { // to be completed 
		window.localStorage.setItem("dm_no", dm_no);
		window.localStorage.setItem("data", JSON.stringify(retData)); // for Debug:  change data to retData 
	}
	
	var winName = 'myPopupSpec'+(++popCounter);
	
	 window.open('popupSpec.html', winName,'width=800,height=800,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,copyhistory=no,resizable=yes');
	 return false;
}