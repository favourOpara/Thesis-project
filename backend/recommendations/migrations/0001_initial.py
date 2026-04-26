# Generated migration for OutfitBundle model

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('products', '0009_alter_productimage_image'),
    ]

    operations = [
        migrations.CreateModel(
            name='OutfitBundle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text="Catchy name for the outfit (e.g., 'Power Suit Ensemble')", max_length=255)),
                ('theme', models.CharField(choices=[('office_chic', 'Office Chic'), ('casual_friday', 'Casual Friday'), ('date_night', 'Date Night'), ('weekend_vibes', 'Weekend Vibes'), ('athleisure', 'Athleisure'), ('brunch_ready', 'Brunch Ready'), ('night_out', 'Night Out'), ('business_casual', 'Business Casual'), ('street_style', 'Street Style'), ('beach_day', 'Beach Day')], help_text='Style theme for this outfit', max_length=50)),
                ('description', models.TextField(blank=True, help_text='Optional description of the outfit styling', null=True)),
                ('is_active', models.BooleanField(default=True, help_text='Whether this outfit should be shown to users')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('products', models.ManyToManyField(help_text='3-4 products that make up this outfit', related_name='outfit_bundles', to='products.product')),
            ],
            options={
                'verbose_name': 'Outfit Bundle',
                'verbose_name_plural': 'Outfit Bundles',
                'ordering': ['-created_at'],
            },
        ),
    ]
