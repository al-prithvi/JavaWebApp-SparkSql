

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

import java.sql.*;
import java.sql.Statement;
import javax.servlet.annotation.WebServlet;
import javax.servlet.ServletException;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;

import java.util.HashMap;
import java.util.Map;

import java.util.*;
import java.lang.*;
import java.io.*;
import java.util.Collections;

import java.util.Comparator;

import java.util.HashMap;

import java.util.LinkedHashMap;

import java.util.Map;
import static java.util.stream.Collectors.*;

import static java.util.Map.Entry.*;
@WebServlet("/MyServletDemo")

// Extend HttpServlet class to create Http Servlet
public class MyServletDemo extends HttpServlet {

   /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
private String mymsg;

   public void init() throws ServletException {
      mymsg = "Hello World!";
   }

   public void doGet(HttpServletRequest request, 
      HttpServletResponse response)
      throws ServletException, IOException 
   {

      // Setting up the content type of webpage
      response.setContentType("application/json");

      // Writing message to the web page
      PrintWriter out = response.getWriter();
      
      //------------
      
      JSONArray list = new JSONArray();
      String url = "jdbc:hive2://localhost:10000/";
      String dbName = "default";  //-----------
      String driver = "org.apache.hive.jdbc.HiveDriver";
      String user = "";
      String password = "";
      Statement pstmt;
      String val,label,table,column,aggregate,key;
	  val = request.getParameter("val");
	  label = request.getParameter("label");
	  table = request.getParameter("table");
	  column = request.getParameter("column");
	  aggregate = request.getParameter("agg");
	  key = request.getParameter("key");
	  
	  //adding mapping from url to string for sql query
	  Map<String, String> table_map = new HashMap<>();
	  table_map.put("rr_billing", "rr2_billing");
	  table_map.put("dma_monthly", "monthly_dma_data");
	  
	  Map<String, String> column_map = new HashMap<>();
	  column_map.put("pres", "present_reading_num");
	  column_map.put("prev", "previous_reading_num");
	  column_map.put("con", "consumption_val");
	  column_map.put("amt", "amount");
	  column_map.put("conmon", "consumption");
	  column_map.put("net", "net_inflow");
	  column_map.put("ufw", "ufw_ml");
	  
	  
	  System.out.println("The value would be:" + table_map.get(table));	  
	  System.out.println("key is : "+key);
	  System.out.println("table is : "+ table);
	  
	  //****************************code for general queries***************************
	  
	  //CODE FOR SPARK CONNECTION
      try {
    	  Class.forName(driver).newInstance();
    	  Connection conn = DriverManager.getConnection(url+dbName, user, password);
    	  
    	  //-------------
    	  String sql="";
    	  if (val==null || label==null) { // code for general query
    		  String groupBy = "";
    		  
    		  // code to check if key_opt is null, so only one set of values
    		  if (key=="") {
    			  System.out.println("the key is null ---------------******************");
    			  
    			  groupBy = "";
    			  sql = "SELECT " +aggregate+"("+column_map.get(column)+")" +
	      					" from "+table_map.get(table)+" where not "+column_map.get(column)+"='NaN'";
    		  }
    		  else {
    			  if (table.equals("rr_billing")) {
    				  groupBy = " group by i.dma_code";
    				  sql = "SELECT i.dma_code, "+aggregate+"(b."+column_map.get(column)+")" +
    	    					" from "+table_map.get(table)+" b inner join rr2_information i on i.rr_number=b.rr_number where not " + 
    	    					column_map.get(column) + " = 'NaN'" + groupBy;
    				  System.out.println("column values is "+column_map.get(column));
    				  
    			  }
    			  else {
    				  groupBy = " group by " + key;
    				  sql = "SELECT " + key + ", "+aggregate+"("+column_map.get(column)+")" +
    	      					" from "+table_map.get(table)+ groupBy;
    			  }
    		  }

    		  
    	  } // end of general query
    	  
    	  else { // LORENZ CURVE -------------------------------------------------------------------------------------------------
    		  
    		  //query moved to below block
    	  }
    	  System.out.println(sql);
    	  System.out.println("val is : "+val);
    	  System.out.println("label is : "+label);    	  
    	  
    	  //-------------
    	  //String sql = "SELECT " + val +","+ label +" FROM testdb"; //-------------
    	  //String sql = "SELECT dma_code, count(1) from rr2_information where sdid = 'SW4' group by dma_code";
    	  
    	  if (val!=null || label!=null) {
    		  Map<String,Integer> population = new HashMap<>();
    		  Map<String,Double> consumption = new HashMap<>();
    		  Map<String,Double> lpcd = new HashMap<>();
    		  Map<String,Double> pop_per = new HashMap<>();
    		  Map<String,Double> con_orig = new HashMap<>();
    		  Map<String,Integer> pop_orig = new HashMap<>();
    		  
    		  //sql = "SELECT dma_code, sum(consumption) from monthly_dma_data group by dma_code";
    		  sql = "SELECT dma_code, net_inflow from monthly_dma_data where month='" + val + "'";
    		  
    		  //1st Query
    		  pstmt = conn.createStatement();
    		  ResultSet rs = pstmt.executeQuery(sql);
    		  
    		  System.out.println("spark sql connection successful");
			  String f1; //-------------
			  Double f2, p1;
			  Integer f3;
			  
			  while(rs.next()) // parsing result
	    	  { 		  
				  f1 = rs.getString(1); // dma_code
				  f2 = rs.getDouble(2); //sum(consumption)
	    		  System.out.println(f1+" "+f2);    		  
	    		  consumption.put(f1,f2); 
	    	  } // END OF WHILE
			  
			  //2nd Query
			  sql = "SELECT dma_code, population from dma_info";
			  rs = pstmt.executeQuery(sql);
			  System.out.println("spark sql 2nd connection successful");
			  while(rs.next()) // parsing result
	    	  { 		  
				  f1 = rs.getString(1); // dma_code
				  f3 = rs.getInt(2); //sum(consumption)
	    		  System.out.println(f1+" "+f3);    		  
	    		  population.put(f1,f3); 
	    	  } // END OF WHILE
			  
			  //calculate lpcd for every key
			  for (String k: population.keySet() )
			  {
				  if(consumption.containsKey(k)) {
					  f2 = consumption.get(k)/population.get(k);
					  lpcd.put(k, f2);
				  }
				  else {
					  System.out.println("no consumption data for dma "+k);
				  }
				  
			  }//for
			  
			  //Sort
			  Map<String, Double> sorted = lpcd
						.entrySet()
						.stream()
						.sorted(comparingByValue())
						.collect(
								toMap(e->e.getKey(), e->e.getValue(), (e1,e2) -> e2,
								LinkedHashMap::new));
			  //parse through sorted
			  Double cSum = 0.0;
			  Integer pSum = 0;
			  
			  con_orig = consumption;
			  pop_orig = population;
			  
			  //SORT ACCORDING TO LPCD
			  for (String k: sorted.keySet() ) {
				  cSum = consumption.get(k) + cSum;
				  consumption.put(k, cSum);
				  
				  pSum = population.get(k) + pSum;
				  population.put(k, pSum);
				  		  
			  }//for
			  
			  //cumulative percentile
			  
			  Double gini_score = 0.0;
			  
			  for (String k: sorted.keySet() ) {
				  JSONObject obj = new JSONObject();
				  
				  f2 = consumption.get(k)/cSum * 100;
				  consumption.put(k, f2);
				  
				  f2 = (double)population.get(k)/pSum * 100;
				  pop_per.put(k, f2);
				  
				  obj.put("x", f2); // x axis
				  obj.put("y", consumption.get(k)); //y axis
				  
				  System.out.println(obj.toString());
	        	  list.add(obj);
	        	  
	        	  //---------calculate gini index -------------
	        	  f2 = con_orig.get(k)/cSum;
	        	  p1 = (double)pop_orig.get(k)/pSum;   //
	        	  gini_score += f2 * ( p1 + 2 * (1 - (pop_per.get(k)/100) ) );
	        	  System.out.println("gini index = "+gini_score);
				  
			  }//for
			  
			  gini_score = 1 - gini_score;
			  
			  JSONObject obj = new JSONObject(); // for gini index
			  obj.put("x", "gini");
			  obj.put("y", gini_score);
			  list.add(obj);
			  
			  System.out.println(list.toString());
	    	  out.println(list.toString());
			  
    	  } // --------------end of if (val!=null or label!=null)
    	  
    	  
    	  else { // IF GENERAL QUERY (14)    
	    	  pstmt = conn.createStatement();
	    	  
	    	  
			  ResultSet rs = pstmt.executeQuery(sql);
			  
			  System.out.println("spark sql connection successful");
			  String f1; //-------------
			  Integer f2;
			  int invalid = 0, invalid2 = 0;// remove
	    	  
	    	  //making json object
	    	  while(rs.next())
	    	  {
	    		  JSONObject obj = new JSONObject();
	    		  
	    		  if (key == "") {
	    			  f1 = "dma_code";
	    			  f2 = rs.getInt(1);
	    		  }
	    		  else {
	    			  f1 = rs.getString(1); //----------------------
	    		  
	    			  f2 = rs.getInt(2);
	    		  }
	    		  
	    		  System.out.println(f1+" "+f2);
	    		  
	    		  if(f1.equals("SW4DMA06")) {
	    			  if (invalid == 0) {
	    				  invalid++;
	    			  }
	    			  else {
	    				  continue;
	    			  }
	    		  }
	    		  if (f2.equals("SE3DMA08")) {
	    			  if (invalid2 == 0) {
	    				  invalid2++;
	    			  }
	    			  else {
	    				  continue;
	    			  }	  
	    		  }
	    		  
	    		  
	    		  
	    		  obj.put("dma_code", f1); //----------------
	        	  obj.put("count", f2);
	        	  System.out.println(obj.toString());
	        	  list.add(obj);
	    	  } // END OF WHILE
	    	  
	    	  System.out.println(list.toString());
	    	  out.println(list.toString());
	    	  
    	  }//end of if (val == null)
    	  
    	  out.close();
    	  
      } catch (Exception e) {
    	  System.out.println("Error"+e);
    	  out.close();
      }
      
      
 out.println(list.toString());                                                             //------------------------******************--------------------***************
   }

   public void destroy() {
      /* leaving empty for now this can be
       * used when we want to do something at the end
       * of Servlet life cycle
       */
   }
}