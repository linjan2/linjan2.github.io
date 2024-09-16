# Alertmanager configuration

```yaml
global:
  resolve_timeout: 5m
  smtp_smarthost: smtpsmarthost.example.lo:25
  smtp_from: alert@example.lo
  smtp_require_tls: true
  smtp_hello: example.lo
  smtp_auth_username: example
  smtp_auth_password_file: /etc/alertmanager/secrets/secretname/auth-password

inhibit_rules:
  - # inhibit info and warning alerts if same-name critical alert is firing
    source_matchers:
      - severity = critical
    target_matchers:
      - severity =~ warning|info
    equal:
      - namespace
      - alertname
  - # inhibit info alerts if same-name warning alert is firing
    source_matchers:
      - severity = warning
    target_matchers:
      - severity =~ info
    equal:
      - namespace
      - alertname
  - # inhibit info alerts if InfoInhibitor is firing
    source_matchers:
      - alertname = InfoInhibitor
    target_matchers:
      - severity = info
    equal:
      - namespace
  - # inhibit InfoInhibitor
    target_matchers:
      - alertname = InfoInhibitor

receivers:
  - name: 'null'
  - name: email_notification
    email_configs:
      - to: receiver@example.lo
        send_resolved: false # don't notify about resolved alerts

time_intervals:
  - name: workhours
    time_intervals:
      - times:
        - start_time: '08:00'
          end_time: '17:00'
        weekdays: ['monday:friday']
        location: Europe/Stockholm

route:
  group_by: # alert groups have notifications batched (https://prometheus.io/docs/alerting/latest/alertmanager/#grouping)
    - namespace
  group_wait: 30s # how long to initially wait to send a notification (needed to wait for inhibitor alerts to trigger)
  group_interval: 5m # how long to wait before sending a notification about new alerts
  repeat_interval: 12h # how long to wait before sending a notification again
  continue: false
  receiver: 'null' # default receiver
  routes:
    - receiver: 'null'
      matchers:
        - alertname = "Watchdog"
        - alertname = "InfoInhibitor"
      continue: false
    - receiver: email-notification
      group_wait: 30s
      group_interval: 5m
      repeat_interval: 24h
      matchers:
        - severity =~ warning|critical
      active_time_intervals:
        - workhours
```
