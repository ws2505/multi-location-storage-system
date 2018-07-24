<%@ page import="java.sql.*"%>
<html>
<head>
<title>JDBC Connection example</title>
</head>

<body>
<h1>JDBC Connection example</h1>

<h1>Using GET Method to Read Form Data</h1>
      <ul>
         <li><p><b>First Name:</b>
            <%= request.getParameter("username")%>
         </p></li>
         <li><p><b>Last  Name:</b>
            <%= request.getParameter("password")%>
         </p></li>
      </ul>


<%
  String db = "TEST";
  String user = "root"; // assumes database name is the same as username
  try {
    java.sql.Connection conn;
    Statement stat = null;
    ResultSet res = null;
    Class.forName("org.gjt.mm.mysql.Driver");
    conn = DriverManager.getConnection("jdbc:mysql://localhost/"+db, user, "123456");



    PreparedStatement pst2 = conn.prepareStatement("INSERT INTO Employees(username, password) VALUES (?, ?)");
    String username = request.getParameter("username");
    String password = request.getParameter("password");
    pst2.setString(1, username);
    pst2.setString(2, password);
    int i = pst2.executeUpdate();
    out.println("Success"+i);
    
  }
  catch(SQLException e) {
    out.println("SQLException caught: " +e.getMessage());
  }
%>



</body>
</html>
<!-- 

    String first = "Zara";

    PreparedStatement pst = conn.prepareStatement("Select * from Employees where first=?");
    pst.setString(1, first);
    res = pst.executeQuery();
    if(res.next()){
      out.println (""+res.getString("first"));
    } -->