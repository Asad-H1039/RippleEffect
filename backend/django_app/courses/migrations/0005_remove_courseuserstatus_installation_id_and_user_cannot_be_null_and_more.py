# Generated by Django 4.2.8 on 2024-05-23 17:04

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("courses", "0004_alter_courseuserstatus_installation_id_and_more"),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name="courseuserstatus",
            name="installation_id_and_user_cannot_be_null",
        ),
        migrations.AddConstraint(
            model_name="courseuserstatus",
            constraint=models.CheckConstraint(
                check=models.Q(
                    ("installation_id__isnull", False), ("user__isnull", False), _connector="OR"
                ),
                name="installation_id_and_user_cannot_be_null",
            ),
        ),
    ]
