import qrcode
import os

os.makedirs("/home/amed/Downloads/my-website-main/qrcodes", exist_ok=True)

# 1. Telegram QR
tg_url = "https://t.me/EnergixCopilotBot"
img_tg = qrcode.make(tg_url)
img_tg.save("/home/amed/Downloads/my-website-main/qrcodes/qr_telegram.png")

# 2. Local Mobile Web QR (192.168.1.9:8000/demo.html)
web_url = "http://192.168.1.9:8000/demo.html"
img_web = qrcode.make(web_url)
img_web.save("/home/amed/Downloads/my-website-main/qrcodes/qr_web.png")

# 3. WhatsApp Direct QR (Sample)
wa_url = "https://wa.me/?text=Hello%20Energix%20AI%20Co-Pilot"
img_wa = qrcode.make(wa_url)
img_wa.save("/home/amed/Downloads/my-website-main/qrcodes/qr_whatsapp.png")

print("Generated all QRs successfully in /qrcodes/")
