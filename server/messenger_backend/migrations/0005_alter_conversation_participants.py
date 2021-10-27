# Generated by Django 3.2.4 on 2021-10-27 17:28

import django.contrib.postgres.fields
from django.db import migrations, models
import messenger_backend.models.conversation


class Migration(migrations.Migration):

    dependencies = [
        ('messenger_backend', '0004_auto_20211027_1719'),
    ]

    operations = [
        migrations.AlterField(
            model_name='conversation',
            name='participants',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(validators=[messenger_backend.models.conversation.Conversation.validate_user_id]), size=None),
        ),
    ]
