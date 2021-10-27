# Generated by Django 3.2.4 on 2021-10-27 17:19

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('messenger_backend', '0003_auto_20211027_1627'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='conversation',
            name='participants',
        ),
        migrations.AddField(
            model_name='conversation',
            name='participants',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=[1, 2, 3, 4], size=None),
            preserve_default=False,
        ),
    ]
