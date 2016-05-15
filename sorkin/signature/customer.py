from sorkin.signature import *
from sorkin.signature.handler import *
import json
import logging
import sorkin
import sorkin.signature
import webapp2
from google.appengine.api import mail
from google.appengine.api import app_identity
import random
from google.appengine.api import urlfetch





class CustomerVerifyApi(RequestHandler):

    def put(self,username):

        submission = self.load()

        logging.info('Inside  verify')
        logging.info(submission)

        key = ndb.Key(Credentials, submission['username'])

        user = key.get()

        if not user:
            self.error('Invalid user', status = 404)
            return


        if ((user.password != submission['password']) or (user is None)):
            self.error('Invalid user', status = 404)
            return

        self.respond(user)




class CustomerApi(RequestHandler):
    """Provide access to individual Customer entities."""

    def get(self, username):
        """Retrieve a customer by customer id. """

        key = ndb.Key(Credentials, username)
        customer = key.get()

        if not customer:
            self.error('Not found', status = 404)
            return

        self.respond(customer)


    def put(self, username):
        """ to update customer details """

        submission = self.load()

        key = ndb.Key(Credentials, username)
        customer = Credentials(key = key)
        customer.populate(**submission)
        customer.put()

        self.respond(customer)


    def delete(self, username):
        """ to delete customer """

        key = ndb.Key(Credentials, username)
        key.delete()

        self.respond_ok()



    def post(self,username):
        """ to update customer details """

        logging.info('Inside post')

        submission = self.load()

        logging.info(submission)

        hash = str(random.getrandbits(32))

        key = ndb.Key(Credentials, username)
        customer = Credentials(key = key)
        customer.first_name = submission[u'first_name']
        customer.password = submission[u'password']
        customer.email = submission['email']
        customer.last_name = submission[u'last_name']
        customer.company = submission['company']
        customer.role = submission[u'role']
        customer.hashKey = hash
        customer.authenticated = False
        customer.put()

        sender_address = 'intense-howl-790@appspot.gserviceaccount.com'.format(app_identity.get_application_id())  #'intense-howl-790@appspot.gserviceaccount.com'
        logging.info(sender_address);
        message = mail.EmailMessage(
        sender=sender_address,
        subject="Your account has been approved")

        urlStr = 'https://sorkin-dot-intense-howl-790.appspot.com/a/customer/' +  username + '/authenticate/' + hash;

        message.to = submission['email']

        message.body = """Dear """ + submission[u'first_name'] + """:



        Your example.com account has been approved.  You can now visit
        http://www.example.com/ and sign in using your Google Account to
        access new features.

        Please let us know if you have any questions.

        T        he example.com Team
        """ +  urlStr

        message.send()



        self.respond_ok()



class CustomerAuthenticateApi(RequestHandler):

    def get(self,username,hashkey):

        #submission = self.load()



        logging.info('Inside  verify')
        #logging.info(submission)

        key = ndb.Key(Credentials, username)

        #user = Credentials(key = key)

        user = key.get()

        if not user:
            self.error('Invalid user', status = 404)
            return

        if (user.hashKey == hashkey) :
            user.authenticated = True
            user.put()
            self.redirect('/')
            return
            #urlfetch.fetch(url='https://localhost:8080/')

        else :
            self.error('Invalid session', status = 404)
            return

        self.respond(user)



# from apiclient import discovery
# from google.appengine.api import taskqueue
# from google.appengine.ext import ndb
# from nova.signature.handler import *
# from nova.signature import *
# from pprint import pprint
# import logging
# import nova.signature.report
#
#
#
# class CustomerListApi(RequestHandler):
#     """Top-level handler for all customer requests.  Used for managing the list
#     of all customers."""
#
#     def get(self):
#         """Get list of all customers."""
#
#
#         # Only an application admin should be able to get a list of all
#         # customers.  That is, customers should be able to see who else is a
#         # customer.
#         if not {'application_admin'} <= self.roles():
#             raise ApiException(403, 'Forbidden.')
#
#         # TODO: The list of customers may become very large.  Add support for
#         # pagination.
#
#         r = []
#
#         for customer in Customer.query():
#             x = customer.to_dict()
#             x['_id'] = customer.key.id()
#             r.append(x)
#
#         self.respond(r)
#
#
# class CustomerApi(RequestHandler):
#     """Provide access to individual Customer entities."""
#
#     def get(self, custid, action = None):
#         """Retrieve a customer by customer id. """
#
#         key = ndb.Key(Customer, custid)
#         customer = key.get()
#         if not customer:
#             self.error('Not found', status = 404)
#             return
#
#         # Anyone who is an admin of any kind can get information about the
#         # customer.  Knowing who has access to an application is considered to
#         # be privileged information.
#         if not {'admin'} <= self.roles(customer = customer):
#             raise ApiException(403, 'Forbidden.')
#
#         self.respond(customer)
#
#
#     def put(self, custid):
#         """ to update customer details """
#
#         # Updating the Customer object allows you to change who is authorized
#         # to access a customer's data.  It is therefore very sensitive and
#         # should only be allowed by Domain Admins (people responsible for the
#         # customer) or by Application Admins (people who administrate the
#         # application itself).
#         if not {'domain_admin', 'application_admin'} & self.roles(customer_id = custid):
#             raise ApiException(403, 'Forbidden.')
#
#         submission = self.load()
#
#         key = ndb.Key(Customer, custid)
#         customer = Customer(key = key)
#         customer.populate(**submission)
#         customer.put()
#
#         self.respond(customer)
#
#
#     def delete(self, custid):
#         """ to delete customer """
#
#         if not {'domain_admin', 'application_admin'} & self.roles(customer_id = custid):
#             raise ApiException(403, 'Forbidden.')
#
#         key = ndb.Key(Customer, custid)
#         key.delete()
#
#         self.respond_ok()
#
#
# class CustomerApplyApi(RequestHandler):
#     """Control a customer level "apply" operation.  At this level we simply
#     apply all the rules."""
#
#     def get(self, customer_id):
#         return self.post(customer_id)
#
#     def post(self, customer_id):
#         """Schedule an "apply" operation for all rules belonging to this customer."""
#
#         # This endpoint is typically called from the Task Queue service or
#         # directly by someone kicking of a run manually.
#         roles = self.roles()
#         """
#         if 'appengine' not in roles and 'admin' not in roles:
#             raise ApiException(403, 'Forbidden.')
#         """
#         stage = nova.signature.apply.ApplyRulesForCustomer(customer_id)
#         stage.start()
#         logging.info('Stage started with pipeline id = %s', stage.pipeline_id)
#
#         """ To save the pipelineid of current Event."""
#         customer_key = ndb.Key(Customer, customer_id)
#         key = ndb.Key(StatusReport,stage.pipeline_id , parent = customer_key)
#         report = StatusReport(key = key)
#         report.remark = 'Execution of all available rules'
#         report.put()
#
#         self.respond_ok()
#
#
# class CustomerValidateApi(RequestHandler):
#     """Control a customer level "validate" operation."""
#
#     def post(self, custid):
#         """Schedule a "validate" operation for all rules belonging to this customer."""
#         logging.error('Customer level validate not implemented yet.')
#         self.respond_ok()
#
#
# class CustomerOrgUnitsApi(RequestHandler):
#     """Retrieve the list of organization units for the customer."""
#
#     def get(self, custid):
#         """Get a list of org units.  If a rule applys to an org unit then
#         include the rule id."""
#
#         key = ndb.Key(Customer, custid)
#         customer = key.get()
#         if not customer:
#             self.error('Not found', status = 404)
#             return
#
#         # Getting the list of organizational units is necessary for setting up
#         # rules, but it should not be publicly available.  Therefore it is just
#         # restricted to admins (of any kind).
#         if not {'admin'} & self.roles(customer = customer):
#             raise ApiException(403, 'Forbidden.')
#
#         try:
#             http = nova.signature.auth.make_authorized_http(prn = customer.domain_admin)
#         except AccessTokenRefreshError as err:
#             logging.warning('Application not authorized for customer.', exc_info = True)
#             raise err
#
#         directory = discovery.build('admin', 'directory_v1', http = http)
#         orgunits = directory.orgunits().list(customerId = custid, orgUnitPath = '/').execute()
#
#         index = dict()
#         for orgunit in orgunits.get('organizationUnits', []):
#             index[orgunit['orgUnitPath']] = orgunit
#
#         for rule in Rule.query(ancestor = key):
#             for path, orgunit in index.iteritems():
#                 if path.startswith(unicode(rule.org_unit)):
#                     orgunit[u'rule'] = unicode(rule.key.id())
#
#         self.respond(orgunits)
#
#
# class CustomerUsersApi(RequestHandler):
#
#     def get(self, custid):
#         """Get a list of users in a customer's domain.  A query parameter can
#         be passed in (q) to search the list.  This parameter is passed directly
#         to the "query" parameter in the Directory API.
#
#         This call is to facilitate auto complete on user's names and emails.
#         It's not meant for getting the full list of all users.
#         """
#         customer = ndb.Key(Customer, custid).get()
#         if not customer:
#             self.error('Not found', status = 404)
#             return
#
#         # Getting the list of organizational units is necessary for setting up
#         # rules, but it should not be publicly available.  Therefore it is just
#         # restricted to admins (of any kind).
#         if not {'admin'} & self.roles(customer = customer):
#             raise ApiException(403, 'Forbidden.')
#
#         query_str = self.request.GET['q']
#
#         http = nova.signature.auth.make_authorized_http(prn = customer.domain_admin)
#         directory = discovery.build('admin', 'directory_v1', http = http)
#         users = directory.users().list(customer = custid, maxResults = 10, query = query_str,
#                 fields = "users(primaryEmail),users(name)").execute()
#
#         self.respond(users)

