<%@ page import ="java.sql.*" %>
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
    int i = st.executeUpdate("insert into objects(user_name, share_num, threshold_num, username) values ('" + user + "','" + share_num + "','" + threshold_num + "','" + user + "', CURDATE())");
    if (i > 0) {
        //session.setAttribute("userid", user);
        response.sendRedirect("welcome.jsp");
       // out.print("Registration Successfull!"+"<a href='index.jsp'>Go to Login</a>");
    } else {
        response.sendRedirect("index.jsp");
    }
%>