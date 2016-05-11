# from nova.signature import *
# from nova.signature.handler import *
# import uuid
# import json
# import logging
# import webapp2
# import pipeline.models
# from datetime import date, datetime,timedelta
# 
# 
# 
# class Context(object):
# 
#     def __init__(self, customer_id, context_id = None):
#         self.customer_id = customer_id
# 
#         if context_id:
#             self.uuid = uuid.UUID(context_id)
#         else:
#             self.uuid = uuid.uuid4()
# 
# 
#     def __str__(self):
#         return str(self.uuid)
# 
# 
#     def signal(self, kind, subject = None, info = None):
#         """Signal that an event has a occurred connected to this event.  Events
#         can only be signaled while a context is "open." """
#         event = Event()
#         event.customer_id = self.customer_id
#         event.context_id = str(self)
#         event.kind = kind
# 
#         event.time = datetime.datetime.now()
# 
#         if subject:
#             event.subject = str(subject)
# 
#         event.info = info
# 
#         # We just store the event and let the Datastore assign an id to it.  The
#         # key doesn't have an ancestor, as adding one would create an entity group
#         # and limit event creation to 1 per second.
#         key = event.put()
# 
#         if subject:
#             subject_message = "[subject %s]" % (subject, )
#         else:
#             subject_message = ""
# 
#         logging.info("Event %d: %s:%s %s %s", key.id(), self.customer_id, str(self), kind, subject_message)
# 
#         return key
# 
# 
#     def open(self):
#         """Signal that the context is now "open" and events will start to be
#         generated.  While a context is open new Event entites may be generated
#         against it.  Once closed those entities get cleaned up and a summary
#         report is written."""
#         self.signal('context:open')
# 
# 
#     def close(self):
#         self.signal('context:close')
# 
#         summary = self.summarize(include_stats = True)
#         summary.put()
# 
# 
#     def reference(self, n = None):
#         if n is None:
#             n = 1
# 
#         self.signal('reference_count', info = n)
# 
# 
#     def release(self, n = None):
#         if n is None:
#             n = 1
# 
#         self.signal('reference_count', info = -n)
# 
# 
#     def summarize(self, include_stats = None):
#         """Collects all events for a context and generates a summary report."""
# 
#         # TODO: The 60 second deadline might be a problem and needs to be tested.
# 
#         report = SummaryReport(customer_id = self.customer_id, context_id = str(self))
# 
#         q = Event.query(Event.customer_id == self.customer_id, Event.context_id == str(self),
#                 Event.kind == 'context:open')
#         event = q.fetch(1)
#         if event:
#             report.started = event[0].time
#         else:
#             return report
# 
#         if include_stats:
#             start = datetime.datetime.now()
#             q = Event.query(Event.customer_id == self.customer_id, Event.context_id == str(self))
#             k = dict()
#             r = 0
# 
#             for event in q:
#                 if event.kind in k:
#                     k[event.kind] += 1
#                 else:
#                     k[event.kind] = 1
# 
#                 if (event.kind == 'reference_count'):
#                     r += event.info
# 
#             end = datetime.datetime.now()
#             duration = (end - start).total_seconds()
#             logging.info('Stats for %s/%s took %d seconds', report.customer_id, report.context_id, duration)
# 
#             report.stats = k
#             report.ref_count = r
# 
#             if report.state == 'complete':
#                 q = Event.query(Event.customer_id == self.customer_id, Event.context_id == str(self)).order(-Event.time)
#                 event = q.fetch(1)
#                 if event:
#                     report.completed = event[0].time
# 
# 
#         return report
# 
# 
#     @classmethod
#     def get_context_ids(cls, customer_id):
#         ids = set()
# 
#         for e in Event.query(Event.customer_id == customer_id, Event.kind == 'context:open'):
#             ids.add(e.context_id)
# 
#         return ids
# 
# 
#     @classmethod
#     def get_closed_context_ids(cls, customer_id):
#         ids = set()
# 
#         for e in Event.query(Event.customer_id == customer_id, Event.kind == 'context:close'):
#             ids.add(e.context_id)
# 
#         return ids
# 
# 
#     @classmethod
#     def get_open_context_ids(cls, customer_id):
#         world = cls.get_context_ids(customer_id)
#         closed = cls.get_closed_context_ids(customer_id)
#         return world - closed
# 
# 
#     @classmethod
#     def get_context_summaries(cls, customer_id):
#         summaries = []
# 
#         for context_id in cls.get_open_context_ids(customer_id):
#             context = Context(customer_id, context_id = context_id)
#             report = context.summarize(include_stats = True)
#             summaries.append(report)
# 
#         for report in SummaryReport.query(SummaryReport.customer_id == customer_id):
#             summaries.append(report)
# 
#         return summaries
# 
# 
# class ReportApi(RequestHandler):
#     """Provide a general report on statistics and usage for a particular
#     customer.
# 
#     1. Current status of any enforcement / validation sweeps.
#     2. Summary of last run (# users set, # errors (if any))
#     3. Summary of validation (# users, # users who modified)
#     4. History of usage.
# 
#     NOTE: This is just a wish list.  Performance and efficiency are key.
# 
#     """
# 
#     def get(self, custid):
#         """Return data summary for customer."""
# 
#         # An admin of any kind can get a report for the customer.
#         if not {'admin'} & self.roles(customer_id = custid):
#             raise ApiException(403, 'Forbidden.')
# 
#         """
#         summaries = Context.get_context_summaries(custid)
#         report = {
#             'customer_id': custid,
#             'summaries': summaries,
#         }
#         """
#         result = []
#         customer_key = ndb.Key(Customer, custid)
#         summaries = StatusReport(parent=customer_key).query(StatusReport.started >=  datetime.now() - timedelta(days = 2))
# 
#         for summary in summaries.fetch():
# 
#             pipeline_id = summary.key.id()
#             # Query the pipeline data model _PipelineRecord for current status
#             record = pipeline.models._PipelineRecord.get_by_key_name(summary.key.id())
# 
#             if record.finalized_time:
#                 completion_time = str(record.finalized_time - record.start_time).split(".")[0]
#             else:
#                 completion_time = ' '
# 
#             result.append({'_id':pipeline_id,'abort_message':record.abort_message,
#                             'finalized_time':record.finalized_time,
#                             'start_time':record.start_time,'status':record.status,
#                             'remark':summary.remark , 'started_since' : str(datetime.now() - record.start_time).split(".")[0],
#                             'completion_time': completion_time})
# 
#         self.respond(result)
# 
# 
# 
# class ReportUserApi(RequestHandler):
#     """Provides a specific report on a user.  This is a small amount of
#     information.
# 
#     1. Whether or not user's signature is managed.
#     2. If managed, has the user tried to change it.
#     3. Last date and time signature was set.
# 
#     NOTE: This is just a wish list.  Performance and efficiency are key.
#     Storing information on each user may increase costs and may not be worth
#     it.
# 
#     """
# 
#     def get(self, custid, email):
#         """Return report for a user."""
# 
#         # An admin of any kind can get a report for a customer's user.
#         if not {'admin'} & self.roles(customer_id = custid):
#             raise ApiException(403, 'Forbidden.')
# 
#         raise ApiException(501, 'Not implemented yet.')
# 
# 
# 
# class CleanUpReportsApi(RequestHandler):
#     """Search the Datastore for old SummaryReport's and remove them.
#     """
# 
#     def get(self):
#         for customer in Customer.query():
#             customer_id = customer.key.id()
#             for context_id in Context.get_open_context_ids(customer_id):
#                 context = Context(customer_id, context_id = context_id)
#                 report = context.summarize(include_stats = True)
#                 if report.state == 'complete':
#                     context.close()
#                     q = Event.query(Event.customer_id == context.customer_id, Event.context_id == str(context))
#                     for key in q.fetch(keys_only = True):
#                         key.delete()
# 
#         self.respond_ok()
# 
# 
# 
# class CheckContextsApi(RequestHandler):
#     """Check contexts to see if they are still really running.  Mark broken
#     contexts as defunct."""
# 
#     def get(self):
#         self.respond_ok()

