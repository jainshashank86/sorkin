Tempus Nova Signature Application
=================================

An application for administratively managing signatures within a Google Domain.
It is designed to handle multiple customers (domains) at once and integrate
with the Google Apps Marketplace.


Installation
------------

To install the application on Google Cloud Platform:


1. Use PIP to download third party libraries.  All such libraries are listed in
   the "requirements.txt" file.  To download, run the following command from
   the project root:

   % pip2 install -r requirements.txt -t lib/

   This will tell Pip to download and install the requirements to the "lib"
   directory.  These libraries will be uploaded to to App Engine will the
   application is deployed later.

   Note the use of "pip2" which targets Python 2.7.  Python 3+ is not yet
   available on App Engine using the "Sandbox VMs."

2. Create a Google Cloud Platform project.  Note the project id.

3. Create a new Service Account from the "APIs & Auth >> Credentials" section.

4. Deploy the application using the "appcfg.py" utility distributed with the
   App Engine SDK.  Use the "-A" flag to target the project id created above.

   $ appcfg.py update -A s~<project-id> .

   Note the "s~" prefix added to the application name.  This is required by the
   App Engine SDK for some inexplicable reason.



5. To configure the new application instance go to:

   https://<project-id>.appspot.com/admin


6. [TODO] Detail how to upload credential.



Scopes
------

The following scopes are required by the application:


* https://apps-apis.google.com/a/feeds/emailsettings/2.0/
* https://www.googleapis.com/auth/admin.directory.user.readonly
* https://www.googleapis.com/auth/admin.directory.orgunit.readonly
* https://apps-apis.google.com/a/feeds/domain/
* https://www.googleapis.com/auth/admin.directory.group.readonly
* https://www.googleapis.com/auth/appsmarketplace.license



