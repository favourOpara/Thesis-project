"""
Abatrades transactional email helpers.
All emails are sent via Brevo SMTP (configured in settings.py).
Call send_* functions from views — they swallow exceptions so a mail
failure never breaks the main request.
"""
import logging
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)

FROM = settings.DEFAULT_FROM_EMAIL
FRONTEND = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')


# ── Shared HTML shell ─────────────────────────────────────────────────────────

def _wrap(title: str, body: str) -> str:
    return f"""
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:28px 36px;">
            <span style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">Abatrades</span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px;">
            <h2 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#0f172a;">{title}</h2>
            {body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 36px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">
              &copy; 2025 Abatrades &middot;
              <a href="{FRONTEND}" style="color:#94a3b8;">Visit site</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
"""


def _btn(label: str, url: str, color: str = "#0f172a") -> str:
    return f"""
<table cellpadding="0" cellspacing="0" style="margin:24px 0 8px;">
  <tr>
    <td style="background:{color};border-radius:10px;padding:12px 28px;">
      <a href="{url}" style="color:#fff;text-decoration:none;font-weight:700;font-size:14px;">{label}</a>
    </td>
  </tr>
</table>
"""


def _p(text: str) -> str:
    return f'<p style="margin:0 0 14px;font-size:14px;color:#374151;line-height:1.7;">{text}</p>'


def _send(subject: str, to: str, html: str):
    try:
        send_mail(
            subject=subject,
            message='',
            from_email=FROM,
            recipient_list=[to],
            html_message=html,
            fail_silently=False,
        )
    except Exception as exc:
        logger.warning("Email send failed to %s — %s: %s", to, subject, exc)


# ── 1. Welcome (account created) ─────────────────────────────────────────────

def send_welcome(user):
    name = user.first_name or user.email.split('@')[0]
    body = (
        _p(f"Hi {name}, welcome to Abatrades!")
        + _p("You now have access to thousands of products from independent sellers across Nigeria. "
             "Discover stores, track your orders, and enjoy a seamless shopping experience.")
        + _btn("Start Shopping", f"{FRONTEND}/browse")
        + _p("If you have any questions, just reply to this email — we're always happy to help.")
    )
    _send(
        subject="Welcome to Abatrades 🎉",
        to=user.email,
        html=_wrap("Welcome aboard!", body),
    )


# ── 2. Seller: product listed ─────────────────────────────────────────────────

def send_product_listed(user, product):
    name = user.first_name or user.email.split('@')[0]
    body = (
        _p(f"Hi {name}, your product has been listed successfully!")
        + f"""
        <table width="100%" cellpadding="0" cellspacing="0"
               style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin:0 0 20px;">
          <tr>
            <td>
              <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Product</p>
              <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#0f172a;">{product.name}</p>
              <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Price</p>
              <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#0f172a;">
                ₦{float(product.price):,.0f}
              </p>
              <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Category</p>
              <p style="margin:0;font-size:14px;color:#374151;">{product.category}</p>
            </td>
          </tr>
        </table>
        """
        + _p("Buyers can now find and purchase your product. Make sure your store is set to <strong>Open</strong> so it's visible.")
        + _btn("View My Store", f"{FRONTEND}/seller/products")
    )
    _send(
        subject=f"Product listed: {product.name}",
        to=user.email,
        html=_wrap("Your product is live!", body),
    )


# ── 3. Premium activated ──────────────────────────────────────────────────────

def send_premium_activated(user, shop):
    name = user.first_name or user.email.split('@')[0]
    features = [
        "Promo video on your storefront",
        "Editorial text blocks between products",
        "Verified Premium badge",
        "Boosted store ranking & homepage placement",
        "Warehousing & logistics services",
        "Priority seller support",
        "Reduced platform fees",
    ]
    features_html = "".join(
        f'<li style="margin:0 0 6px;font-size:13.5px;color:#374151;">✓ &nbsp;{f}</li>'
        for f in features
    )
    body = (
        _p(f"Hi {name}, your store <strong>{shop.name}</strong> is now a <strong>Premium Store</strong>! 🎉")
        + f'<ul style="margin:0 0 20px;padding-left:18px;">{features_html}</ul>'
        + _p("Your subscription renews monthly. You can manage billing anytime from your seller dashboard.")
        + _btn("Manage Premium", f"{FRONTEND}/seller/premium", color="#d97706")
    )
    _send(
        subject="Premium activated — welcome to Abatrades Premium!",
        to=user.email,
        html=_wrap("You're now a Premium Seller", body),
    )


# ── 4. Order confirmation (buyer) ─────────────────────────────────────────────

def send_order_confirmation(order):
    buyer = order.buyer
    name  = buyer.first_name or buyer.email.split('@')[0]

    rows = "".join(
        f"""
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:13.5px;color:#374151;">
            {item.product_name}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:13.5px;color:#374151;text-align:center;">
            &times;{item.quantity}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:13.5px;font-weight:600;color:#0f172a;text-align:right;">
            ₦{float(item.unit_price * item.quantity):,.0f}
          </td>
        </tr>
        """
        for item in order.items.all()
    )

    body = (
        _p(f"Hi {name}, your order has been placed and payment confirmed. Thank you for shopping on Abatrades!")
        + f"""
        <table width="100%" cellpadding="0" cellspacing="0"
               style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin:0 0 20px;">
          <tr>
            <td>
              <p style="margin:0 0 12px;font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
                Order #{order.id} &middot; {order.created_at.strftime('%d %b %Y')}
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <th style="text-align:left;font-size:12px;color:#94a3b8;padding-bottom:8px;">Item</th>
                  <th style="text-align:center;font-size:12px;color:#94a3b8;padding-bottom:8px;">Qty</th>
                  <th style="text-align:right;font-size:12px;color:#94a3b8;padding-bottom:8px;">Total</th>
                </tr>
                {rows}
                <tr>
                  <td colspan="2" style="padding-top:12px;font-size:14px;font-weight:700;color:#0f172a;">Total</td>
                  <td style="padding-top:12px;font-size:14px;font-weight:700;color:#0f172a;text-align:right;">
                    ₦{float(order.total_amount):,.0f}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        """
        + _p(f"<strong>Shipping to:</strong> {order.shipping_name}, {order.shipping_address}, {order.shipping_city}, {order.shipping_state}")
        + _p("The seller will process and ship your order. You'll receive another email when it's on its way.")
        + _btn("View Order", f"{FRONTEND}/orders")
    )
    _send(
        subject=f"Order confirmed — #{order.id}",
        to=buyer.email,
        html=_wrap("Your order is confirmed!", body),
    )


# ── 5. New order notification (seller) ───────────────────────────────────────

def send_new_order_to_sellers(order):
    """Send each seller an email listing only their items from this order."""
    from collections import defaultdict
    seller_items = defaultdict(list)
    for item in order.items.select_related('seller').all():
        if item.seller:
            seller_items[item.seller].append(item)

    for seller, items in seller_items.items():
        seller_name = seller.first_name or seller.email.split('@')[0]
        rows = "".join(
            f"""
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:13.5px;color:#374151;">
                {item.product_name}
              </td>
              <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:13.5px;text-align:center;">&times;{item.quantity}</td>
              <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:13.5px;font-weight:600;color:#0f172a;text-align:right;">
                ₦{float(item.unit_price * item.quantity):,.0f}
              </td>
            </tr>
            """
            for item in items
        )
        body = (
            _p(f"Hi {seller_name}, you have a new order from <strong>{order.shipping_name}</strong>!")
            + f"""
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin:0 0 20px;">
              <tr><td>
                <p style="margin:0 0 12px;font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
                  Order #{order.id} &middot; {order.created_at.strftime('%d %b %Y')}
                </p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <th style="text-align:left;font-size:12px;color:#94a3b8;padding-bottom:8px;">Item</th>
                    <th style="text-align:center;font-size:12px;color:#94a3b8;padding-bottom:8px;">Qty</th>
                    <th style="text-align:right;font-size:12px;color:#94a3b8;padding-bottom:8px;">Total</th>
                  </tr>
                  {rows}
                </table>
                <p style="margin:16px 0 0;font-size:13px;color:#374151;">
                  <strong>Ship to:</strong> {order.shipping_name}, {order.shipping_address}, {order.shipping_city}, {order.shipping_state}<br>
                  <strong>Phone:</strong> {order.shipping_phone}
                </p>
              </td></tr>
            </table>
            """
            + _p("Please process this order promptly and update the status in your seller dashboard.")
            + _btn("View Orders", f"{FRONTEND}/seller/orders")
        )
        _send(
            subject=f"New order #{order.id} — action required",
            to=seller.email,
            html=_wrap("You have a new order!", body),
        )


# ── 6. Order status update (buyer) ───────────────────────────────────────────

# ── 7. Subscription auto-renewed (monthly charge succeeded) ──────────────────

def send_subscription_renewed(user, shop, next_payment_date=None):
    name = user.first_name or user.email.split('@')[0]
    next_str = ""
    if next_payment_date:
        try:
            from django.utils.dateparse import parse_datetime
            dt = parse_datetime(next_payment_date)
            if dt:
                next_str = f"Your next charge is on <strong>{dt.strftime('%d %B %Y')}</strong>."
        except Exception:
            pass
    body = (
        _p(f"Hi {name}, your Abatrades Premium subscription for <strong>{shop.name}</strong> has been renewed successfully.")
        + _p(f"₦10,000 has been charged to your saved card. {next_str}")
        + _p("All your premium features remain active. You can manage your subscription anytime from your seller dashboard.")
        + _btn("Manage Subscription", f"{FRONTEND}/seller/premium", color="#d97706")
    )
    _send(
        subject="Premium subscription renewed — Abatrades",
        to=user.email,
        html=_wrap("Subscription renewed ✓", body),
    )


# ── 8. Subscription auto-renewal failed ──────────────────────────────────────

def send_subscription_failed(user, shop):
    name = user.first_name or user.email.split('@')[0]
    body = (
        _p(f"Hi {name}, we were unable to renew your Premium subscription for <strong>{shop.name}</strong>.")
        + _p("Your card was declined. As a result, your premium features have been paused.")
        + _p("To restore access, please update your payment method or reactivate your subscription from your seller dashboard.")
        + _btn("Fix My Subscription", f"{FRONTEND}/seller/premium", color="#b91c1c")
        + _p('<span style="font-size:12.5px;color:#94a3b8;">If you believe this is an error, contact your bank or reach out to Abatrades support.</span>')
    )
    _send(
        subject="Action required — Premium subscription payment failed",
        to=user.email,
        html=_wrap("Subscription renewal failed", body),
    )


STATUS_MESSAGES = {
    "processing": ("Your order is being processed", "The seller is preparing your items and will ship them soon."),
    "shipped":    ("Your order is on its way! 🚚",   "Your order has been shipped and is heading to you."),
    "delivered":  ("Your order has been delivered ✅", "Your order has been marked as delivered. Enjoy your purchase!"),
    "cancelled":  ("Your order has been cancelled",   "Unfortunately your order was cancelled. Contact support if you need help."),
}

def send_order_status_update(order):
    buyer  = order.buyer
    name   = buyer.first_name or buyer.email.split('@')[0]
    title, detail = STATUS_MESSAGES.get(order.status, ("Order update", "Your order status has been updated."))
    body = (
        _p(f"Hi {name},")
        + _p(detail)
        + f"""
        <table width="100%" cellpadding="0" cellspacing="0"
               style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin:0 0 20px;">
          <tr><td>
            <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Order</p>
            <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#0f172a;">#{order.id}</p>
            <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Status</p>
            <p style="margin:0;font-size:15px;font-weight:700;color:#0f172a;">{order.status.capitalize()}</p>
          </td></tr>
        </table>
        """
        + _btn("Track Order", f"{FRONTEND}/orders")
    )
    _send(
        subject=f"Order #{order.id} — {order.status.capitalize()}",
        to=buyer.email,
        html=_wrap(title, body),
    )
