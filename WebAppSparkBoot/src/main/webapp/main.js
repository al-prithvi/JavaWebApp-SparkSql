//GLOBAL VARIABLES 
//click option tracker

//which cell is clicked in the major table, to be recorded for the query
var tab_opt = '';
var col_opt = '';
var agg_opt = '';

// ***************** test objects for display checking
var obj = JSON.parse('\
	[{\
		"id":"1",\
		"name":"consumption (million litres)",\
		"address":"amount (Rs)"\
	},\
	{\
		"id":"3",\
		"name":"previous reading",\
		"address":"present reading"\
	}]');

var obj2 = JSON.parse('\
	[{"column":"consumption (million litres)"},\
	 {"column":"amount (Rs)"},\
	 {"column":"previous reading (million litres)"},\
	 {"column":"present_reading (million litres)"}\
	]');


var agg_str = ["min","max","avg","count"]

// ****************end of test objects
// -----global variables
var employee_data = '';
var agg_data = '';



// ******** functions



function track_click_element(clicked_id){
	tab_opt = clicked_id;
	console.log("button pressed : "+tab_opt);
}

function plotGraph(){


	var table = document.getElementById("employee_table");
	table.innerHTML = '<tr></tr>';

	employee_data = '';
	
	agg_data = '';
    employee_data +='<tr>';
    //employee_data +='<th>Name</th>';
    //employee_data +='<th>Address</th>';
    employee_data +='</tr>';

	//obj.forEach(process_fill)
	test_json();
	$('#employee_table').append(employee_data)

    //var table = document.getElementById("employee_table");
    //called function for this
    record_clicks_for_cells(table);

    //append to 'agg table ' function
	var aggtable = document.getElementById("agg_table");
	aggtable.innerHTML = '<tr></tr>';    
    agg_data = '';
    agg_str.forEach(agg_table_fill)
    $('#agg_table').append(agg_data)

    record_clicks_for_cells(aggtable);

    //clear both data for next click
    employee_data = '';
    agg_data = '';

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
                          $(tabid).removeClass('highlight');
                          $(this).addClass('highlight')
                          if(this.id == 'colcell'){
                          	col_opt = id;
                          }
                          else if (this.id == 'aggcell'){
                          	agg_opt = id;
                          }
                          console.log(id);
            };
        }

    }
}

function test_json(){
	console.log(obj2.length);
	var i = 0;
	employee_data += '<tr>';
	obj2.forEach(function(r){
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

function agg_table_fill(data){
	agg_data += '<tr><td id="aggcell">';
	agg_data +=  data;
	agg_data += '</td></tr>';	
}

function submitquery(){
	//check whether all the url values are filled
	console.log("values of variables:")
	
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
		console.log("s: "+tab_opt+" "+col_opt+" "+agg_opt);

		//make query:

		//call plot function
		plotChart();
	}
}



//chart code
function plotChart(){
	var ctx = document.getElementById("myChart");
	lab = ['DMA','some','thing'];
	l= [5,3,12];
	var myChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels: lab,
	        datasets: [{
	            label: 'DMA-codes',
	            data: l,
	            backgroundColor: [
	                'rgba(255, 99, 132, 0.2)',
	                'rgba(54, 162, 235, 0.2)',
	                'rgba(255, 206, 86, 0.2)',
	                'rgba(75, 192, 192, 0.2)',
	                'rgba(153, 102, 255, 0.2)',
	                'rgba(255, 159, 64, 0.2)'
	            ],
	            borderColor: [
	                'rgba(255,99,132,1)',
	                'rgba(54, 162, 235, 1)',
	                'rgba(255, 206, 86, 1)',
	                'rgba(75, 192, 192, 1)',
	                'rgba(153, 102, 255, 1)',
	                'rgba(255, 159, 64, 1)'
	            ],
	            borderWidth: 1
	        }]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true
	                }
	            }]
	        }
	    }
	});

}