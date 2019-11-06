# You'll need to install PyJWT via pip 'pip install PyJWT' or your project packages file

import jwt

METABASE_SITE_URL = "http://192.168.3.44:3000"
METABASE_SECRET_KEY = "920343352d91a2d0eb7d6553e0b1e3f67a9c86c5fd2729e95b65b6c1912152e6"

payload = {
    "resource": {"dashboard": 4},
    "params": {

    }
}
token = jwt.encode(payload, METABASE_SECRET_KEY, algorithm="HS256")

iframeUrl = METABASE_SITE_URL + "/embed/dashboard/" + \
    token.decode("utf8") + "#bordered=true&titled=true"
print(iframeUrl)
