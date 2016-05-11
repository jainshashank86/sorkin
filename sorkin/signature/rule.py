# from apiclient import discovery
# from datetime import datetime
# from google.appengine.api import taskqueue
# from google.appengine.api import urlfetch
# from google.appengine.ext import db, ndb
# from  nova.signature.handler import *
# from  nova.signature import *
# import nova.signature.apply
# import nova.signature.auth
# import nova.signature.report
# import oauth2client.client
# 
# 
# class RuleListApi(RequestHandler):
#     """Manage rules as a group."""
# 
#     def get(self, custid):
#         """Get a list of all Rules."""
# 
#         # An admin of any kind can access rules for a customer.
#         if not {'admin'} & self.roles(customer_id = custid):
#             raise ApiException(403, 'Forbidden.')
# 
#         customer_key = ndb.Key(Customer, custid)
#         customer = customer_key.get()
#         if customer is None:
#             self.error('Customer does not exist.', status = 404)
#             return
# 
#         qry = Rule.query(ancestor = customer_key)
#         r = []
# 
#         for rule in qry.fetch():
#             x = rule.to_dict()
#             x['_id'] = rule.key.id()
#             r.append(x)
# 
#         self.respond(r)
# 
# 
#     def post(self, custid):
#         """Create a new rule."""
# 
#         # An admin of any kind can create rules for a customer.
#         if not {'admin'} & self.roles(customer_id = custid):
#             raise ApiException(403, 'Forbidden.')
# 
#         customer_key = ndb.Key(Customer, custid)
#         customer = customer_key.get()
#         if customer is None:
#             self.error('Customer does not exist.', status = 404)
#             return
# 
#         submission = self.load()
# 
#         key = ndb.Key(Rule, None, parent = customer_key)
#         rule = Rule(key = key)
#         rule.populate(**submission)
#         rule.customer_id = custid
#         key = rule.put()
# 
#         doc = rule.to_dict()
#         doc['_id'] = key.id()
# 
#         self.respond(doc)
# 
# 
# class RuleApi(RequestHandler):
#     """Provides access to individual rules by id."""
# 
#     @staticmethod
#     def key(custid, ruleid):
#         """Build a key for the given customer and rule ids."""
#         try:
#             ruleid = int(ruleid)
#         except ValueError as err:
#             # Raise a 404 since the ruleid part of the URL and technically
#             # could exist.
#             raise nova.ApiException(404, 'Not found.')
# 
#         customer_key = ndb.Key(Customer, custid)
#         return ndb.Key(Rule, ruleid, parent = customer_key)
# 
# 
#     def get(self, custid, ruleid):
#         """Get a rule."""
# 
#         # An admin of any kind can access rules for a customer.
#         if not {'admin'} & self.roles(customer_id = custid):
#             raise ApiException(403, 'Forbidden.')
# 
#         key = self.key(custid, ruleid)
#         rule = key.get()
# 
#         if not rule:
#             self.error('Not found.', status = 404)
#             return
# 
#         doc = rule.to_dict()
#         doc['_id'] = rule.key.id()
# 
#         self.respond(doc)
# 
# 
#     def put(self, custid, ruleid):
#         """Update a rule."""
# 
#         # An admin of any kind can modify rules for a customer.
#         if not {'admin'} & self.roles(customer_id = custid):
#             raise ApiException(403, 'Forbidden.')
# 
#         key = self.key(custid, ruleid)
#         rule = key.get()
# 
#         if rule is None:
#             self.error('Not found.', status = 404)
#             return
# 
#         submission = self.load()
# 
#         if '_id' in submission:
#             del submission['_id']
# 
#         signature_id = int(submission['signature_id'])
#         signature = ndb.Key(Customer, custid, Signature, signature_id).get()
#         if signature is None:
#             raise ApiException(400, 'Signature does not exist.')
# 
#         rule = Rule(key = key)
#         rule.populate(**submission)
#         rule.put()
# 
#         doc = rule.to_dict()
#         doc['_id'] = rule.key.id()
# 
#         self.respond(doc)
# 
# 
#     def delete(self, custid, ruleid):
#         """Delete a rule."""
# 
#         # An admin of any kind can modify rules for a customer.
#         if not {'admin'} & self.roles(customer_id = custid):
#             raise ApiException(403, 'Forbidden.')
# 
#         key = self.key(custid, ruleid)
#         key.delete()
# 
#         self.respond_ok()
# 
# 
# class RuleApplyApi(RequestHandler):
#     """Manage applying a rule to a customer."""
# 
#     def get(self, customer_id, rule_id):
#         return self.post(customer_id, rule_id)
# 
#     def post(self, customer_id, rule_id):
#         """Apply the given rule to the given customer."""
# 
#         roles = self.roles()
#         """
#         if 'appengine' not in roles and 'admin' not in roles:
#             raise ApiException(403, 'Forbidden.')
#         """
#         customer_key = ndb.Key(Customer, customer_id)
#         customer = customer_key.get()
#         rule = ndb.Key(Rule, int(rule_id), parent = customer_key).get()
# 
#         if not customer or not rule:
#             raise ApiException(404, 'Not found.')
# 
#         stage = nova.signature.apply.ApplyRule(customer_id, rule.signature_id, rule.org_unit,
#                 customer.domain_admin)
#         stage.start()
# 
#         #Save pipeline Id in StatusReport kind
#         key = ndb.Key(StatusReport,stage.pipeline_id , parent = customer_key)
#         report = StatusReport(key = key)
#         report.remark = 'Rule execution for orgunit ' + rule.org_unit
#         report.put()
# 
#         logging.info('Started pipeline %s', stage.pipeline_id)
# 
#         self.respond({'ok': True, 'pipeline_id': stage.pipeline_id})
# 
# 
# class RuleValidateApi(RequestHandler):
# 
#     def get(self, custid, ruleid):
#         self.respond_ok()
# 
# 

