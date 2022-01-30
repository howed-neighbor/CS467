# CS467: Website Security Research Project

This project will explore the web vulnerabilities outlined in the article <a href="https://www.vpnmentor.com/blog/top-10-common-web-attacks/">Top 10 Common Web Attacks: The First Steps to Protect Your Website</a>. These vulnerabilities are categorized as follows:

* [Injection](#injection)
* [Broken Authentication](#broken-authentication)
* [Sensitive Data Exposure](#sensitive-data-exposure)
* [XML External Entities](#xml-external-entities)
* [Broken Access Control](#broken-access-control)
* [Security Misconfiguration](#security-misconfiguration)
* [Cross-Site Scripting](#cross-site-scripting)
* [Insecure Deserialization](#insecure-deserialization)
* [Using Components with Known Vulnerabilities](#using-components-with-known-vulnerabilities)
* [Insufficient Logging & Monitoring](#insufficient-logging--monitoring)

These vulnerabilities will be explored through a demonstration app, datapotato:
<img src="https://github.com/howed-neighbor/CS467/blob/main/public/datapotato_black.svg#gh-light-mode-only" width=50% height=50%>
<img src="https://github.com/howed-neighbor/CS467/blob/main/public/datapotato_white.svg#gh-dark-mode-only" width=50% height=50%>

We'll take a look at each of these through the following framework:
* **Description**   | Multiple definitions from trusted web security authorities
* **Demonstration** | A straightforward expression of a prototypical example
* **Remediation**   | Best practices, checklists, and guidance from security champions

# Injection 
<details>
  <summary>
    Details
  </summary>
  
### Description
  * **Wikipedia** | Code injection is the exploitation of a computer bug that is caused by processing invalid data.
  * **OWASP**     | Injection is an attacker’s attempt to send data to an application in a way that will change the meaning of commands being sent to an interpreter.
  * **IBM**       | This type of attack allows an attacker to inject code into a program or query or inject malware onto a computer in order to execute remote commands that can read or modify a database, or change data on a web site. 
  
  
  The common idea is that we've left a door open that someone with knowledge of our systems and interpreters can abuse.
  
  This topic is both broad and deep. Our sources above all list multiple subcategories of injection vulnerabilities or pathways:
  * **Wikipedia** | SQL injection, Cross-site scripting, Dynamic evaluation vulnerabilities, Object injection, Remote file injection, Format specifier injection, Shell injection
  * **OWASP**     | SQL queries, LDAP queries, Operating system command interpreters, Any program invocation, XML documents, HTML documents, JSON structures, HTTP headers, File paths, URLs, A variety of expression languages
  * **IBM**       | Blind SQL Injection, Blind XPath Injection, Buffer Overflow, Format String Attack, LDAP Injection, OS Commanding, SQL Injection, SSI Injection, XPath Injection
  
  
  
### Demonstration
  We'll focus on a specific flavor of injection vulnerability, SQLi (SQL injection).
  
  
### Remediation
  
  
### Citations: Injection
  #### "Code injection." Wikipedia.
  https://en.wikipedia.org/wiki/Code_injection (accessed Jan 29, 2022).
  #### J. Williams. "Injection Theory". OWASP.
  https://owasp.org/www-community/Injection_Theory (accessed Jan 29, 2022).
  #### "Injection Attacks." IBM.
  https://www.ibm.com/docs/en/snips/4.6.0?topic=categories-injection-attacks (accessed Jan 29, 2022).
</details>

# Broken Authentication
<details>
  <summary>
    Details
  </summary>
  
### Description
### Demonstration
### Remediation
### Citations: Broken Authentication
</details>

# Sensitive Data Exposure
<details>
  <summary>
    Details
  </summary>
  
### Description
### Demonstration
### Remediation
### Citations: Sensitive Data Exposure
</details>

# XML External Entities
<details>
  <summary>
    Details
  </summary>
  
### Description
### Demonstration
### Remediation
### Citations: XML External Entities
</details>

# Broken Access Control
<details>
  <summary>
    Details
  </summary>
  
### Description
### Demonstration
### Remediation
### Citations: Broken Access Control
</details>

# Security Misconfiguration
<details>
  <summary>
    Details
  </summary>
  
### Description
### Demonstration
### Remediation
### Citations: Security Misconfiguration
</details>

# Cross-Site Scripting
<details>
  <summary>
    Details
  </summary>
  
### Description
### Demonstration
### Remediation
### Citations: Cross-Site Scripting
</details>

# Insecure Deserialization
<details>
  <summary>
    Details
  </summary>
  
### Description
### Demonstration
### Remediation
### Citations: Insecure Deserialization
</details>

# Using Components with Known Vulnerabilities
<details>
  <summary>
    Details
  </summary>
  
### Description
### Demonstration
### Remediation
### Citations: Using Components with Known Vulnerabilities
</details>

# Insufficient Logging & Monitoring
<details>
  <summary>
    Details
  </summary>
  
### Description
### Demonstration
### Remediation
### Citations: Insufficient Logging & Monitoring
</details>

# Citations: Primary Sources

#### "Website Security Research Project." EECS Project site.
https://eecs.oregonstate.edu/capstone/submission/pages/viewSingleProject.php?id=OLLHp1v4lrRuobYa (accessed Dec 2021-Jan 2022).

#### Avi. D. "Top 10 Common Web Attacks: The First Steps to Protect Your Website." vpnMentor.
https://www.vpnmentor.com/blog/top-10-common-web-attacks/ (accessed Dec 2021-Jan 2022).
