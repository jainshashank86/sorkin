from sorkin.signature.customer import *
from sorkin.signature.session import *
import json
import webapp2
from sorkin.signature.test import *


wsgi = webapp2.WSGIApplication([
    webapp2.Route(r'/a/customer/<username>', CustomerApi),
    webapp2.Route(r'/a/customer/<username>/verify', CustomerVerifyApi),
    webapp2.Route(r'/a/test', TestApi),
 ], debug = True)

# from nova.signature.clientid import *
# from nova.signature.customer import *
# from nova.signature.enforce import *
# from nova.signature.image import *
# from nova.signature.report import *
# from nova.signature.rule import *
# from nova.signature.session import *
# from nova.signature.setup import *
# from nova.signature.signature import *
# from nova.signature.scheduler import *
# from nova.signature.test import *
# import json
# import webapp2
#
#
# wsgi = webapp2.WSGIApplication([
#     webapp2.Route(r'/a/apply', EnforceApplyApi),
#     webapp2.Route(r'/a/check_contexts', CheckContextsApi),
#     webapp2.Route(r'/a/clean_reports', CleanUpReportsApi),
#     webapp2.Route(r'/a/clientid', ClientIdApi),
#     webapp2.Route(r'/a/test', TestApi),
#     webapp2.Route(r'/a/customer/<customer_id>/apply', handler = CustomerApplyApi),
#     webapp2.Route(r'/a/customer/<custid>', handler = CustomerApi),
#     webapp2.Route(r'/a/customer/<custid>/image', handler = ImageListApi),
#     webapp2.Route(r'/a/customer/<custid>/image/<imageid>', handler = ImageApi),
#     webapp2.Route(r'/a/customer/<custid>/orgunits', handler = CustomerOrgUnitsApi),
#     webapp2.Route(r'/a/customer/<custid>/preview/<email>', handler = SignaturePreviewApi),
#     webapp2.Route(r'/a/customer/<custid>/report', handler = ReportApi),
#     webapp2.Route(r'/a/customer/<custid>/report/user/<email>', handler = ReportUserApi),
#     webapp2.Route(r'/a/customer/<custid>/rule', handler = RuleListApi),
#     webapp2.Route(r'/a/customer/<customer_id>/rule/<rule_id>/apply', handler = RuleApplyApi),
#     webapp2.Route(r'/a/customer/<custid>/rule/<ruleid>', handler = RuleApi),
#     webapp2.Route(r'/a/customer/<custid>/rule/<ruleid>/validate', handler = RuleValidateApi),
#     webapp2.Route(r'/a/customer/<custid>/signature', handler = SignatureListApi),
#     webapp2.Route(r'/a/customer/<custid>/signature/<sigid>/apply/<email>', handler = SignatureApplyApi),
#     webapp2.Route(r'/a/customer/<custid>/signature/<sigid>', handler = SignatureApi),
#     webapp2.Route(r'/a/customer/<custid>/signature/<sigid>/validate/<email>', handler = SignatureValidateApi),
#     webapp2.Route(r'/a/customer/<custid>/validate', handler = CustomerValidateApi),
#     webapp2.Route(r'/a/customer/<custid>/users', handler = CustomerUsersApi),
#     webapp2.Route(r'/a/customer', CustomerListApi),
#     webapp2.Route(r'/a/_scheduler', SchedulerApi),
#     webapp2.Route(r'/a/session', SessionApi),
#     webapp2.Route(r'/a/setup', SetupApi),
#     webapp2.Route(r'/a/validate', EnforceValidateApi),
# ], debug = True)
