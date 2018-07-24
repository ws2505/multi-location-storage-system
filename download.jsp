<%@ page import ="java.sql.*" %>
<%@ page import="java.util.Arrays,java.util.List" %>
<%@ page import="java.util.Collections" %>
<%@ page import="org.json.simple.JSONObject" %>
<%@ page import="java.io.*" %>
<%@ page import="java.util.*" %>

<%
    String user = request.getParameter("uname");    
    String friend_name = request.getParameter("friend_name");
    String obj_name = "";
    String obj_location = "";
    String share_location = "";
    String share_name = "";
    Class.forName("com.mysql.jdbc.Driver");
    Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/TEST",
            "root", "123456");
    Statement st = con.createStatement();
    //read obj name
    ResultSet rs;
    rs = st.executeQuery("select * from location where obj_owner = '" + friend_name + "' ");

    while(rs.next()){
        obj_name = obj_name + ":" + rs.getString("object_name"); 
        obj_location = obj_location + ":" + rs.getString("obj_location");
        share_location = share_location + ":" + rs.getString("share_location");
        share_name = share_name + ":" + rs.getString("share_name");
    }

    //obj_list[0] == null
    String[] obj_list = obj_name.split(":");
    String[] obj_location_list = obj_location.split(":");
    String[] share_location_list = share_location.split(":");
    String[] share_name_list = share_name.split(":");
    // out.println(share_location);
    JSONObject obj = new JSONObject();
    ArrayList<JSONObject> list = new ArrayList<JSONObject>();
    for(int i = 1; i < obj_list.length; i++){
        String object_name = obj_list[i];
        String obj_bucket_name = "";
        int threshold = 0;
        ResultSet rs1;
        rs1 = st.executeQuery("select * from objects where obj_name = '"+ obj_list[i] +"'");
        if(rs1.next()){
            threshold = rs1.getInt("threshold_num");
        }
        ResultSet rs2;
        rs2 = st.executeQuery("select * from members where uname = '"+ friend_name +"'");
        if(rs2.next()){
            obj_bucket_name = rs2.getString("b"+obj_location_list[i]);
        }
        
//        JSONObject obj = new JSONObject();

        String share_name_tmp = share_name_list[i];
        String share_location_tmp = share_location_list[i];
        String tmp1 = share_name_tmp.substring(1, share_name_tmp.length()-1);
        String tmp2 = share_location_tmp.substring(1, share_location_tmp.length()-1);
        
        String[] new_share_name_list = tmp1.split(",");
        String[] new_share_location_list = tmp2.split(",");
        String share_bucket_name = "";
        String share_name_final = "";
        for(int j = 0; j < threshold; j++){
            share_name_final += "," + new_share_name_list[j];
            ResultSet rs3;
            rs3 = st.executeQuery("select * from members where uname = '"+ friend_name +"'");
            if(rs3.next()){
                share_bucket_name += "," + rs3.getString("b" + (Integer.parseInt(new_share_location_list[j].trim())));
            }
            
        }
        obj.put("obj_name", obj_list[i]);
        obj.put("threshold", threshold);
        //out.println("bucket_name here :::::::" + share_bucket_name);
        
        obj.put("share_bucket_name", share_bucket_name);
        obj.put("share_name", share_name_final);
        obj.put("obj_bucket_name",obj_bucket_name);

        list.add(obj);

    }
    out.println(list);
    
    // JSONObject obj = new JSONObject();
    // obj.put("all_friend", friend_name);
    // out.println(obj);
%>