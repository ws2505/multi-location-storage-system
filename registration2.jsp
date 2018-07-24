<%@ page import ="java.sql.*" %>
<%
    String user = request.getParameter("uname");    
    String b1 = request.getParameter("b1");
    String b2 = request.getParameter("b2");
    String b3 = request.getParameter("b3");
    String b4 = request.getParameter("b4");
    String b5 = request.getParameter("b5");
    String b6 = request.getParameter("b6");
    String b7 = request.getParameter("b7");
    String b8 = request.getParameter("b8");
    String s3_id = request.getParameter("s3_id");
    Class.forName("com.mysql.jdbc.Driver");
    Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/TEST",
            "root", "123456");
    Statement st = con.createStatement();
    //ResultSet rs;
    int i = st.executeUpdate("update members set b0 = '"+b1+"', b1 = '"+b2+"', b2 = '"+b3+"', b3 = '"+b4+"', b4 = '"+b5+"', b5 = '"+b6+"', b6 = '"+b7+"', b7 = '"+b8+"', s3_id = '"+s3_id+"' where uname='" + user + "'");
    if (i > 0) {
        //session.setAttribute("userid", user);
        out.println("pass");
        response.sendRedirect("welcome.jsp");
       // out.print("Registration Successfull!"+"<a href='index.jsp'>Go to Login</a>");
    } else {
        response.sendRedirect("index.jsp");
    }
%>