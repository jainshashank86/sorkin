from google.appengine.ext import ndb
import logging
import sorkin
import httplib2



class Credentials(ndb.Model):

    username = ndb.StringProperty(required = True)
    password = ndb.StringProperty(required = True)
    created = ndb.DateTimeProperty(auto_now_add = True)
    first_name =  ndb.StringProperty(required = True)


# class DailyTasks(ndb.model):
#     username = ndb.StringProperty(required = True)



#
#
# class Signature(ndb.Model):
#     """Define an email signature."""
#
#     # Human readable title of signature.
#     title = ndb.StringProperty(required = True)
#
#     # Body of signature.  This is a template that will be applied for each
#     # user.
#     body = ndb.TextProperty(required = True, indexed = False)
#
#
#
# class Event(ndb.Model):
#     """Records an event of some kind for a customer."""
#
#     # The customer that this event is associated with.
#     customer_id = ndb.StringProperty(required = True)
#
#     # An opaque string that indicates which event occurred.
#     kind = ndb.StringProperty(required = True)
#
#     # A unique string used to group events across a long running task.
#     context_id = ndb.StringProperty()
#
#     # Used to signal whether or not there are any more tasks pending for this
#     # context.  When the ref_count for all events with the same context_id
#     # equals 0 then there are nor more events.
#     #
#     # TODO: This may not be reliable while events are being generated for a
#     # context.  More testing and thought is needed.
#     ref_count = ndb.IntegerProperty()
#
#     # The time associated with this event.
#     time = ndb.DateTimeProperty(auto_now_add = True)
#
#     # The object that this event is related to, such as an email address.
#     focus = ndb.StringProperty()
#
#     # A field for any kind-specific extra data.
#     info = ndb.JsonProperty()
#
#
# class SummaryReport(ndb.Model):
#     """Provides summary report for a sweep over a customer's users.  This model
#     is used to collect information from many events and consolidate it into a
#     single report."""
#
#     # The customer that this summary relates to.
#     customer_id = ndb.StringProperty(required = True)
#
#     # The context_id this summary is for.  A SummaryReport will only be stored
#     # in the datastore after all events are finished for a context.
#     context_id = ndb.StringProperty(required = True)
#
#     # The date/time of the first event in this context.
#     started = ndb.DateTimeProperty()
#
#     # The data/time of the last event in this context.
#     completed = ndb.DateTimeProperty()
#
#     # Maps an event "kind" to a count.  i.e., "apply:failed" -> 36
#     stats = ndb.JsonProperty()
#
#     # The sum of event ref_counts.  When 0, that should mean the task is
#     # complete and nor more events will be generated.
#     ref_count = ndb.IntegerProperty()
#
#     # Provides a more explicit indication of the context's status.
#     state = ndb.ComputedProperty(lambda self: ['complete', 'active'][int(self.ref_count != 0)])
#
#
# class StatusReport(ndb.Model):
#     """Record pipeline Id, its start time and special remark whenever Rule is applied. """
#     #Start time
#     started = ndb.DateTimeProperty(auto_now_add = True)
#      #Brief remark while rule application like
#      #"Execution of all available rules" in case all rules for a customer have been triggered.
#      # Or 'Execution of rule for xyz orgunit '
#     remark  = ndb.StringProperty()
#
#
# def list_grouper(lst, n):
#     for i in xrange(0, len(lst), n):
#         yield lst[i:i+n]

