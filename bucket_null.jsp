<%@ page import ="java.sql.*" %>
<%
    String uname = request.getParameter("uname");    

    Class.forName("com.mysql.jdbc.Driver");
    Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/TEST",
            "root", "123456");
    Statement st = con.createStatement();
    ResultSet rs;
    rs = st.executeQuery("select * from members where uname='" + uname + "'");
    if(rs.next() && rs.getString("b1") == null){
        out.println(0);
    }else{
        out.println(1);
    }
%>