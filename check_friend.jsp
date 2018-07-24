<%@ page import ="java.sql.*" %>
<%@ page import="java.util.Arrays,java.util.List" %>
<%@ page import="java.util.Collections" %>
<%@ page import="org.json.simple.JSONObject" %>

<%
    String user = request.getParameter("uname");    
    String friend_name = "";
    Class.forName("com.mysql.jdbc.Driver");
    Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/TEST",
            "root", "123456");
    Statement st = con.createStatement();
    //add friends
    ResultSet rs0;
    rs0 = st.executeQuery("select * from members where uname = '" + user + "' ");
    //好友不在用户中
    if(rs0.next()){
        friend_name = rs0.getString("friends");
    }

    JSONObject obj = new JSONObject();
    obj.put("all_friend", friend_name);
    out.println(obj);
%>