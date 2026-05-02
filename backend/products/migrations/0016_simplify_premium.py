from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0015_shop_paystack_authorization_code'),
    ]

    operations = [
        # Replace premium_expires_at with premium_cancelled_at on Shop
        migrations.RenameField(
            model_name='shop',
            old_name='premium_expires_at',
            new_name='premium_cancelled_at',
        ),
        migrations.AlterField(
            model_name='shop',
            name='premium_cancelled_at',
            field=models.DateTimeField(
                blank=True, null=True,
                help_text='Timestamp of last cancellation — used to enforce 24-hour resubscribe cooldown'
            ),
        ),
        # Add tile_color to StoreTextBlock
        migrations.AddField(
            model_name='storetextblock',
            name='tile_color',
            field=models.CharField(
                blank=True, null=True, max_length=20, default='#0f172a',
                help_text='Hex color for the left-border tile accent'
            ),
        ),
    ]
