#JWT is: 71b9afa5c5794655a9e7b4829874877a79695923f23afc1951d2eb7e9d7d2c58
#JWT Issuer is: user:13964514:974

curl "https://addons.mozilla.org/api/v4/addons/@gitmeme/versions/1.3/" -g -XPUT --form "upload=../FirefoxExtension.zip" -H "Authorization: JWT 71b9afa5c5794655a9e7b4829874877a79695923f23afc1951d2eb7e9d7d2c58"