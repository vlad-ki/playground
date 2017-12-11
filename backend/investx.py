from json import dumps
import ssl
from bottle import (route,
                    post,
                    debug,
                    run,
                    request,
                    response,
                    redirect,
                    template,
                    static_file,)

from yahoo_finance import Share
import sys

debug(True)


@route('/')
def home():
    return template('home')


@route('/v1/price/realtime_price/<name>')
def get_realtime_price(name):
    tool_object = Share(name)
    data_price = dumps(
        {
            'time': tool_object.get_trade_datetime(),
            'price': tool_object.get_price(),
        }
    )
    return data_price

if __name__ == '__main__':
    ssl._create_default_https_context = ssl._create_unverified_context
    run(host='localhost', port=8081, reloader=True)


# Client ID (Consumer Key)
# dj0yJmk9ODlBUEZjNWlhYkJLJmQ9WVdrOWJYRkNObmxPTjJzbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD00Zg--
# Client Secret (Consumer Secret)
# f253f96402514b6a28217ce899e2db42e8e3afe5
