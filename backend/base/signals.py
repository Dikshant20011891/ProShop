from django.db.models.signals import pre_save
from django.contrib.auth.models import User

def updateUser(sender,instance, **kwargs):
    user = instance
    if user.email != '':
        user.username = user.email
    
# When we make any changes to the user model a signal is triggered
# The signal will update the username field with the email field
pre_save.connect(updateUser, sender=User)