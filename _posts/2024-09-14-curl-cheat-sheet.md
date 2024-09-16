# cURL cheat sheet

```sh
# post file
curl --data-binary @filename https://example.com

# get with url-encoded url parameters
curl --get \
    --data-urlencode "p1=value 1" \
    --data-urlencode "p2=@-" \
    https://example.com <$(printf '%s' 'value 2')
    # https://example.com?p1=value%201&p2=value%202
```

```sh
# check connection
curl -vvv telnet://example.com:443
  # CTRL+c
```

```sh
# output most variables in json format
curl --silent --show-error --output /dev/null --write-out "%{json}" https://example.com | jq .

# only output HTTP return code
curl --silent --show-error --output /dev/null --write-out "%{http_code}" https://example.com

# output certificate chain details
curl --silent --show-error --output /dev/null --write-out "%{certs}\n" https://example.com

# output response headers
curl --silent --show-error --output /dev/null --write-out "%{header_json}\n" https://example.com

# output redirect url, if any
curl --silent --show-error --output /dev/null --write-out "%{redirect_url}\n" https://example.com

# use format from file
curl --silent --show-error --output /dev/null --write-out "@curl-format.txt" https://example.com
```

> NOTE: on Windows, instead of `--output /dev/null` use `--output nul` to suppress output of response payload.

`curl-format.txt` for basic request information:

```
%{local_ip}:%{local_port}|%{remote_ip}:%{remote_port}|%{url}|%{response_code}|%{exitcode}|%{errormsg}\n
```

`curl-format.txt` for request timings:

```
time_namelookup:      %{time_namelookup}s\n
time_connect:         %{time_connect}s\n
time_appconnect:      %{time_appconnect}s\n
time_pretransfer:     %{time_pretransfer}s\n
time_redirect:        %{time_redirect}s\n
time_starttransfer:   %{time_starttransfer}s\n
----------\n
time_total:           %{time_total}s\n
```

