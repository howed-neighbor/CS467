# CS467: Website Security Research Project

This project will explore the web vulnerabilities outlined in the article <a href="https://www.vpnmentor.com/blog/top-10-common-web-attacks/">Top 10 Common Web Attacks: The First Steps to Protect Your Website</a>. These vulnerabilities are categorized as follows:

* [Injection](#1-injection)
* [Broken Authentication](#2-broken-authentication)
* [Sensitive Data Exposure](#3-sensitive-data-exposure)
* [XML External Entities](#4-xml-external-entities)
* [Broken Access Control](#5-broken-access-control)
* [Security Misconfiguration](#6-security-misconfiguration)
* [Cross-Site Scripting](#7-cross-site-scripting)
* [Insecure Deserialization](#8-insecure-deserialization)
* [Using Components with Known Vulnerabilities](#9-using-components-with-known-vulnerabilities)
* [Insufficient Logging & Monitoring](#10-insufficient-logging--monitoring)

These vulnerabilities will be explored through a demonstration app, datapotato:
<img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/datapotato_black.svg#gh-light-mode-only" width=50% height=50%>
<img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/datapotato_white.svg#gh-dark-mode-only" width=50% height=50%>

# 1. Injection 
<details>
  <summary>
    Details (Article in progress)
  </summary>
  
### Description

  |Source|Definition|
  |---|---|
  |Wikipedia|**Code injection** is the exploitation of a computer bug that is caused by processing invalid data|
  |OWASP|**Injection** is an attacker’s attempt to send data to an application in a way that will change the meaning of commands being sent to an interpreter|
  |IBM|This type of attack allows an attacker to **inject code** into a program or query or inject malware onto a computer in order to execute remote commands that can read or modify a database, or change data on a web site|
  
  These definitions are intentionally broad, as this concept appears in many environments. Our sources above list multiple subcategories of injection vulnerabilities:
  
  * Wikipedia: SQL injection, Cross-site scripting, Dynamic evaluation vulnerabilities, Object injection, Remote file injection, Format specifier injection, Shell injection
  * OWASP: SQL queries, LDAP queries, Operating system command interpreters, Any program invocation, XML documents, HTML documents, JSON structures, HTTP headers, File paths, URLs, A variety of expression languages
  * IBM: Blind SQL Injection, Blind XPath Injection, Buffer Overflow, Format String Attack, LDAP Injection, OS Commanding, SQL Injection, SSI Injection, XPath Injection
  
  ---
  
### Demonstration
  We'll focus on a specific flavor of injection vulnerability, SQLi (SQL injection).
  
  In this example, users are able to submit a request for data, for any individual user:
  
  > <img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/enterUserName1.PNG">
  
  This sends the following request to our SQL table:
  
  ```
  SELECT userName, userData FROM `Users` WHERE userName='user1'
  ```
  
  Result:
  
  |userName|userData|
  |---|---|
  |user1|user1's data|
  
  Now, let's inject a logical statement that our developers probably didn't intend to be used.  
  (This statement closes an open string, adds a logical OR, and comments out the rest of the SQL request body):
  
  > <img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/enterUserName2.PNG">
  
  ```
  SELECT userName, userData FROM `Users` WHERE userName='user1' or TRUE
  ```
  
  This returns all rows in our table, because TRUE always evaluates to TRUE:
  
  |userName|userData|
  |---|---|
  |user1|user1's data|
  |user2|user2's data|
  |user3|user3's data|
  |[...]|[...]|
  
  You can try a live demo of this here (requires connection to OSU VPN):
  <a href="http://flip3.engr.oregonstate.edu:37773/injection#demonstration">[LINK TO WEB APP]</a>
  
  In this example, we've allowed the user to execute arbitrary SQL queries on our database. Our data is no longer secure or reliable. 
 
  ---  

### Remediation
  
  Remediation for injection vulnerabilities are specific to the context of the application. We will provide recommendations for the specific example above, as well as general best practices.
  
  OWASP advises vulnerabilities like the SQLi example above are failures of the **injection context**, specifically the SQL query. OWASP recommends the first defense in this context is **escaping**, in which we ensure data is treated like data, rather than an extension of the functionality or logic the query.
  
  
 
  ---
  
### Citations: Injection
  "Code injection." Wikipedia.
  https://en.wikipedia.org/wiki/Code_injection (accessed Jan 29, 2022).
  
  J. Williams. "Injection Theory". OWASP.
  https://owasp.org/www-community/Injection_Theory (accessed Jan 29, 2022).
  
  "Injection Attacks." IBM.
  https://www.ibm.com/docs/en/snips/4.6.0?topic=categories-injection-attacks (accessed Jan 29, 2022).
</details>

# 2. Broken Authentication
<details>
  <summary>
    ⨯ [Article not available yet]
  </summary>
  
### Description
  ---
### Demonstration
  ---
### Remediation
  ---
### Citations: Broken Authentication
</details>

# 3. Sensitive Data Exposure
<details>
  <summary>
    ⨯ [Article not available yet]
  </summary>
  
### Description
### Demonstration
### Remediation
### Citations: Sensitive Data Exposure
</details>

# 4. XML External Entities
<details>
  <summary>
    ⨯ [Article not available yet]
  </summary>
  
### Description
  ---
### Demonstration
  ---
### Remediation
  ---
### Citations: XML External Entities
</details>

# 5. Broken Access Control
<details>
  <summary>
    ⨯ [Article not available yet]
  </summary>
  
### Description
  ---
### Demonstration
  ---
### Remediation
  ---
### Citations: Broken Access Control
</details>

# 6. Security Misconfiguration
<details>
  <summary>
    ⨯ [Article not available yet]
  </summary>
  
### Description
  ---
### Demonstration
  ---
### Remediation
  ---
### Citations: Security Misconfiguration
</details>

# 7. Cross-Site Scripting
<details>
  <summary>
    ⨯ [Article not available yet]
  </summary>
  
### Description
  ---
### Demonstration
  ---
### Remediation
  ---
### Citations: Cross-Site Scripting
</details>

# 8. Insecure Deserialization
<details>
  <summary>
    ⨯ [Article not available yet]
  </summary>
  
### Description
  ---
### Demonstration
  ---
### Remediation
  ---
### Citations: Insecure Deserialization
</details>

# 9. Using Components with Known Vulnerabilities
<details>
  <summary>
    ⨯ [Article not available yet]
  </summary>
  
### Description
  ---
### Demonstration
  ---
### Remediation
  ---
### Citations: Using Components with Known Vulnerabilities
</details>

# 10. Insufficient Logging & Monitoring
<details>
  <summary>
    ⨯ [Article not available yet]
  </summary>
  
### Description
  ---
### Demonstration
  ---
### Remediation
  ---
### Citations: Insufficient Logging & Monitoring
</details>

# Citations: Primary Sources

"Website Security Research Project." EECS Project site.
https://eecs.oregonstate.edu/capstone/submission/pages/viewSingleProject.php?id=OLLHp1v4lrRuobYa (accessed Dec 2021-Jan 2022).

Avi. D. "Top 10 Common Web Attacks: The First Steps to Protect Your Website." vpnMentor.
https://www.vpnmentor.com/blog/top-10-common-web-attacks/ (accessed Dec 2021-Jan 2022).

# Code References

REFERENCES  
<sub> 
├── expressjs		| "Hello world example", https://expressjs.com/en/starter/hello-world.html  
├── expressjs		| "cs340_sample_nodejs_app", https://github.com/knightsamar/cs340_sample_nodejs_app  
├── body-parser		| "body-parser", http://expressjs.com/en/resources/middleware/body-parser.html  
├── handlebars		| "Introduction", https://handlebarsjs.com/guide/  
├── handlebars		| "Express Handlebars", https://www.npmjs.com/package/express-handlebars  
├── handlebars		| "Hello Handlebars", https://eecs.oregonstate.edu/ecampus-video/CS290/core-content/hello-node/hello-handlebars.html  
├── handlebars		| "app.locals", https://expressjs.com/en/api.html#app.locals  
├── JavaScript		| "Element.classList", https://developer.mozilla.org/en-US/docs/Web/API/Element/classList  
├── MySQL			| "Using Node on the Engineering Servers", https://eecs.oregonstate.edu/ecampus-video/CS290/core-content/tools-and-overview/Using-Node-on-the-Engineering-Servers.html  
└── express-session	| "express-session", http://expressjs.com/en/resources/middleware/session.html
</sub>
