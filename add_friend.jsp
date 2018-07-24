<%@ page import ="java.sql.*" %>
<%@ page import="java.util.Arrays,java.util.List" %>
<%@ page import="java.util.Collections" %>
<%@ page import="org.json.simple.JSONObject" %>

<%
    String user = request.getParameter("uname");    
    String friend_name = request.getParameter("friend_name");
    String friendlist = "";
    String friend_s3_id = "";
    String all_bucket_name = "";
    int flag = 0; //flag = 0 initial; flag = 1, succuss; flag = 2, exist; flag = 3 friend is not a user;
    Class.forName("com.mysql.jdbc.Driver");
    Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/TEST",
            "root", "123456");
    Statement st = con.createStatement();
    //add friends
    ResultSet rs0;
    rs0 = st.executeQuery("select * from members where uname = '" + friend_name + "' ");
    //好友不在用户中
    if(!rs0.next()){
        flag = 3;
    }
    else{
        ResultSet rs;
        rs = st.executeQuery("select * from members where uname='" + user + "' ");
        if(rs.next()){
            friendlist = rs.getString("friends");
            if(friendlist == null){
                friendlist =","+friend_name;
                int i = st.executeUpdate("update members set friends = '"+friendlist+"' where uname='" + user + "'");
                if(i > 0){
                    flag = 1;
                }
            }
            else{
                if(friendlist.contains(friend_name))
                    flag = 2;
                else{
                    friendlist = friendlist+","+friend_name;
                    int i = st.executeUpdate("update members set friends = '"+friendlist+"' where uname='" + user + "'");
                    if(i > 0){
                        flag = 1;
                    }
                }
            }
        } 
    }
    
    

    //read all friends s3 id
    String[] list = friendlist.split(",");
    for(int j = 1; j < list.length ; j++){
        ResultSet rs2;
        rs2 = st.executeQuery("select * from members where uname='"+ list[j] +"' ");
        String curr_s3 = "";
        if(rs2.next()){
            curr_s3 = rs2.getString("s3_id");
        }
        friend_s3_id += ",id=" + curr_s3;
        
    }

    //read current user's bucket name
    ResultSet rs3;
    rs3 = st.executeQuery("select * from members where uname = '"+ user +"'");
    if(rs3.next()){
        for(int k = 0; k < 8; k++){
            all_bucket_name += "," + rs3.getString("b"+k);
        }
    }
    JSONObject obj = new JSONObject();
    obj.put("all_bucket_name", all_bucket_name);
    obj.put("all_friends_s3_id", friend_s3_id);
    obj.put("flag",flag);


    out.println(obj);
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