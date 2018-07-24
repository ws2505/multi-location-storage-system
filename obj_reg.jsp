<%@ page import ="java.sql.*" %>
<%@ page import="java.util.Arrays,java.util.List" %>
<%@ page import="java.util.Collections" %>
<%@ page import="org.json.simple.JSONObject" %>

<%
    String user = request.getParameter("uname");    
    String obj_name = request.getParameter("obj_name");
    String share_num = request.getParameter("share_num");
    String threshold_num = request.getParameter("threshold_num");
    Class.forName("com.mysql.jdbc.Driver");
    Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/TEST",
            "root", "123456");
    Statement st = con.createStatement();
    //ResultSet rs;
    int i = st.executeUpdate("insert into objects(user_name, share_num, threshold_num, obj_name) values ('" + user + "','" + share_num + "','" + threshold_num + "','" + obj_name + "')");

    int n = Integer.parseInt(share_num);
    Integer[] arr = new Integer[n];
    String[] arr2 = new String[n];
    for(int j = 0; j < arr.length; j++){
        arr[j] = j;
    }
    Collections.shuffle(Arrays.asList(arr));
    for(int l = 0; l < arr.length; l++){
        arr2[l] = ""+ obj_name + "" + arr[l]; 
    }
    String share_loc = ""+Arrays.toString(arr);
    String share_name = ""+Arrays.toString(arr2);
    String obj_loc = ""+ 3;
    // out.println("shares are stored in " + share_loc + "and object is stored in " + obj_loc);

    Statement st2 = con.createStatement();
    int k = st2.executeUpdate("insert into location(obj_owner, object_name, obj_location, share_location, share_name) values('"+ user +"', '"+obj_name +"', '"+ obj_loc +"', '"+ share_loc +"', '"+ share_name +"')");
    String obj_bucket_name = "";
    String share_bucket_name = "";
    String[] share_loc_list = share_loc.substring(1, share_loc.length()-1).split(","); 
    ResultSet rs3;
    rs3 = st.executeQuery("select * from members where uname = '"+ user +"'");
    if(rs3.next()){
        obj_bucket_name = rs3.getString("b"+obj_loc.trim());
        for(int l = 0; l < share_loc_list.length; l++)
            share_bucket_name += "," + rs3.getString("b"+share_loc_list[l].trim());
    }
    JSONObject obj = new JSONObject();
    // obj.put("obj_loc", obj_loc);
    // obj.put("shar_loc", share_loc);
    obj.put("share_name", share_name);
    obj.put("share_bucket_name", share_bucket_name);
    obj.put("obj_bucket_name", obj_bucket_name);
    if (i>0 && k >0){
        out.println(obj);
    }else{
        out.print("fails");
    }
    // Statement st2 = con.createStatement();
    // ResultSet rs2;
    // rs2 = st2.executeQuery("select * from objects where user_name = '123'");
    // if (rs2.next()) {
    //     //session.setAttribute("userid", user);
    //     int share_n = Integer.parseInt(rs2.getString("share_num"));
    //     Integer[] arr = new Integer[share_n];
    //     for(int j = 0; j < arr.length; j++){
    //         arr[j] = j;
    //     }
    //     Collections.shuffle(Arrays.asList(arr));
    //     String loc = ""+Arrays.toString(arr);
    //     out.println(loc);
    //    // out.print("Registration Successfull!"+"<a href='index.jsp'>Go to Login</a>");
    // } else {
    //     response.sendRedirect("index.jsp");
    // }
%>