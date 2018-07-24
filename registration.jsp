<%@ page import ="java.sql.*" %>
<%
    String user = request.getParameter("uname");    
    String pass = request.getParameter("pass");
    Class.forName("com.mysql.jdbc.Driver");
    Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/TEST",
            "root", "123456");
    Statement st = con.createStatement();
    //ResultSet rs;
    int i = st.executeUpdate("insert into members(uname, pass) values ('" + user + "','" + pass + "')");
    if (i > 0) {
        //session.setAttribute("userid", user);
        out.println(1);

       // out.print("Registration Successfull!"+"<a href='index.jsp'>Go to Login</a>");
    } else {
        response.sendRedirect("index.jsp");
    }
%>