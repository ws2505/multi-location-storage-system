<%@ page import ="java.sql.*" %>
<%
    String uname = request.getParameter("uname");    
    String pwd = request.getParameter("pass");

    Class.forName("com.mysql.jdbc.Driver");
    Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/TEST",
            "root", "123456");
    Statement st = con.createStatement();
    ResultSet rs;
    rs = st.executeQuery("select * from members where uname='" + uname + "' and pass='" + pwd + "'");
    if (rs.next()) {
        session.setAttribute("uname", uname);
        //out.println("welcome " + userid);
        //out.println("<a href='logout.jsp'>Log out</a>");
        out.print(1);

    } else {
        out.println("Invalid password <a href='index.jsp'>try again</a>");
    }
%>