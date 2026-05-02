from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0016_simplify_premium'),
    ]

    operations = [
        migrations.AddField(
            model_name='shop',
            name='premium_expires_at',
            field=models.DateTimeField(
                blank=True, null=True,
                help_text='Access continues until this date after cancellation (end of paid billing period)'
            ),
        ),
    ]
