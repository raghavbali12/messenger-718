# Generated by Django 3.2.4 on 2021-10-27 16:27

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('messenger_backend', '0002_message_read'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='conversation',
            name='user1',
        ),
        migrations.RemoveField(
            model_name='conversation',
            name='user2',
        ),
        migrations.AddField(
            model_name='conversation',
            name='numberOfParticipants',
            field=models.IntegerField(default=2, validators=[django.core.validators.MinValueValidator(2), django.core.validators.MaxValueValidator(12)]),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='conversation',
            name='participants',
            field=models.ManyToManyField(related_name='conversations_in', to='messenger_backend.User'),
        ),
    ]