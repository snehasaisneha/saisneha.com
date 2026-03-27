# Lightsail Deployment

This directory contains a simple single-server deployment bundle for:

- `listmonk.saisneha.com`
- `comments.saisneha.com`

The setup assumes:

- Ubuntu 24.04 on AWS Lightsail
- `nginx` on the host
- `listmonk`, `postgres`, and `remark42` in Docker
- Forward Email handling outbound SMTP for `newsletter@mailer.saisneha.com`

## 1. Install base packages

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg nginx certbot python3-certbot-nginx ufw
```

Install Docker Engine using the official Docker instructions for Ubuntu:

- https://docs.docker.com/engine/install/ubuntu/

Then:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

Open the firewall:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

Also allow ports `22`, `80`, and `443` in the Lightsail networking panel.

## 2. Use the cloned repo directly

```bash
cd /home/ubuntu/saisneha.com/deploy/lightsail
```

If you've cloned this repository to a different location, use that path instead.

Then:

```bash
cp .env.example .env
mkdir -p volumes/postgres volumes/listmonk-uploads volumes/remark42
```

Edit `.env` with real values.

Generate strong secrets:

```bash
openssl rand -base64 48
```

Use one value for `REMARK42_SECRET` and another for `REMARK42_ADMIN_SHARED_ID`.

## 3. Start the services

From the directory containing `docker-compose.yml`:

```bash
docker compose up -d
docker compose logs -f listmonk
docker compose logs -f remark42
```

Expected local ports:

- listmonk -> `127.0.0.1:9000`
- remark42 -> `127.0.0.1:8080`

## 4. Configure nginx

Copy the vhost files:

```bash
sudo cp nginx/listmonk.saisneha.com.conf /etc/nginx/sites-available/listmonk.saisneha.com
sudo cp nginx/comments.saisneha.com.conf /etc/nginx/sites-available/comments.saisneha.com
```

Enable them:

```bash
sudo ln -s /etc/nginx/sites-available/listmonk.saisneha.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/comments.saisneha.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 5. Get TLS certificates

```bash
sudo certbot --nginx -d listmonk.saisneha.com -d comments.saisneha.com
```

## 6. Configure listmonk

Open:

- `https://listmonk.saisneha.com`

Then:

- log in with `LISTMONK_ADMIN_USER` / `LISTMONK_ADMIN_PASSWORD`
- create a public list, for example `site-updates`
- enable double opt-in if desired
- keep the sender as `newsletter@mailer.saisneha.com`
- set reply-to to your preferred real inbox

Once the list exists, note its public UUID.

## 7. Configure website env vars

Set these in Netlify for the site:

```bash
PUBLIC_LISTMONK_URL=https://listmonk.saisneha.com
PUBLIC_LISTMONK_LIST_UUID=replace-with-your-public-list-uuid
PUBLIC_REMARK42_HOST=https://comments.saisneha.com
PUBLIC_REMARK42_SITE_ID=saisneha-com
```

The website code already supports these env vars.

## Notes

- Forward Email should be configured on `mailer.saisneha.com`, not the root mail domain.
- `newsletter@mailer.saisneha.com` should be used as the sending address.
- `comments.saisneha.com` does not need SMTP to work initially unless you later want email notifications from Remark42.
- Upgrade listmonk by pulling the new image and re-running the app container. See:
  - https://listmonk.app/docs/upgrade/
