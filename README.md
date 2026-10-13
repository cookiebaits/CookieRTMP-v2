# CookieRTMPS v2: Secure, Self-Hosted Multistreaming & Cloud Failover Solution

[![Discord](https://img.shields.io/badge/Discord-Join%20Community-5865F2?logo=discord&logoColor=white)](http://wubu.cookiebaits.com)
[![Version](https://img.shields.io/badge/Version-v2.0-blue.svg)](https://github.com/cookiebaits/CookieRTMP-v2)
[![Nginx](https://img.shields.io/badge/Nginx-1.30.3-brightgreen.svg)](https://nginx.org)
[![Enhanced%20RTMP](https://img.shields.io/badge/Enhanced%20RTMP-HEVC%20%7C%20AV1%20%7C%20VP9-orange.svg)](#enhanced-codecs)

---

## Project Overview

**CookieRTMPS v2** (`cookiebaits/CookieRTMP-v2`) is a standalone, enterprise-grade, self-hosted RTMP/RTMPS relay engine designed for content creators and streamers. It enables simultaneous multistreaming across Twitch, YouTube, Kick, TikTok, Facebook, Trovo, Instagram, X (Twitter), and custom RTMP endpoints—**without putting upload strain on your local connection or paying recurring fees to commercial cloud restreamers.**

You send **one** high-quality feed to your VPS, and CookieRTMPS handles validation, hardware/network proxying, vertical aspect ratio mirroring, chat aggregation, and automated failover.

---

## What Sets CookieRTMPS Apart

### 1. Strict Stream Key Authentication (`on_publish`)
* **The Obscurity Trap:** Many relays rely on obfuscated RTMP stream endpoints as their only defense. If the URL is intercepted, anyone can hijack your ingest and broadcast to your channels.
* **The CookieRTMPS Standard:** Ingest keys are strictly checked against destination keys or a dedicated Master Ingest Key in real time via an embedded Python/Flask validator. Streams failing verification are instantly rejected at the socket level.

### 2. Built-in Cloud BRB & Disconnection Protection (NOALBS Scene Switcher)
* **100% Server-Side Fallback:** No auxiliary OBS PC or second streaming machine required!
* If your local connection drops below your **Low Bitrate Threshold** (e.g., 1000 kbps) or OBS disconnects entirely:
  * CookieRTMPS immediately takes over and broadcasts a formatted **Cloud BRB `.mp4` video on loop** directly to all configured platforms.
  * Loops continuously for the duration of the configured **Disconnection Protection Duration** (e.g., 300 seconds).
  * Automatically switches back the instant your primary live stream reconnects!
* **Broadcast-Standard MP4 Transcoding:**
  * Strict video profile: **H.264 High Profile (Level 4.1, `yuv420p`)**.
  * Constant **60 FPS** with closed GOP (`-g 60 -keyint_min 60 -sc_threshold 0`).
  * CBR stream targeting **6000 kbps** (`-b:v 6000k -maxrate 6000k -bufsize 6000k`).
  * Broadcast-grade audio: **AAC stereo @ 48,000 Hz, 160 kbps**.
  * MP4 faststart container (`-movflags +faststart`) to eliminate playback buffering.
  * Supports custom HTTP/HTTPS download URLs or local `.mp4` files on your server.

### 3. Password-Protected Combined Chat Config Page
* Access URL: `http://{your_vps_ip}/{8-character-hex}` (or via reverse proxy domain: `https://yourdomain.com/{8-character-hex}`).
* **Stream Key Password Protection:**
  * When a stream key or Master OBS Key is configured in **Option 4**, that key automatically becomes the password required to unlock the Combined Chat Configuration Page.
  * If no stream key is configured, access remains open.
* **Multi-Platform Chat Aggregator:**
  * Aggregates live chat from Twitch, YouTube, and Kick with official platform branding badges.
  * Built, hosted, and reverse-proxied directly on your VPS during server deployment.
  * Clean removal: Completely deleted upon server uninstallation.

### 4. Seamless In-Place File Updates & Running Instance Preservation
* When executing `./install.sh`:
  * Automatically checks for newer files or changes, replacing updated files while preserving existing configuration (`rtmp_config.env`) and `./data`.
  * **Leaves active streaming containers running uninterrupted**, only stopping and rebuilding the container when you explicitly select Option 9 ("Build & Start Server").

### 5. Horizontal & Vertical Dual-Streaming
* Native support for horizontal widescreen (`rtmp://<vps_ip>:1935/live`) and vertical feeds (`rtmp://<vps_ip>:1935/vertical`) for the **Aitum Vertical OBS plugin**.
* Independent destination control for TikTok, YouTube Shorts, and Twitch Vertical.
* Includes a **TikTok Auto-Pusher** via Streamlabs API to bypass TikTok Studio desktop restrictions.

### 6. Hardened Nginx 1.30.3 & Enhanced RTMP Codecs
* Stable **Nginx 1.30.3** compiled with custom `cookie-nginx-rtmp` module.
* Memory protections: AMF recursion depth limit (128), zero variable-length arrays (VLAs), and leak-free evaluation.
* Enhanced RTMP FourCC negotiation supporting **HEVC (H.265)**, **AV1**, and **VP9**.
* Built-in **Stunnel** proxy (ports 19350–19358) with SNI and CDN host verification for platforms requiring RTMPS (Facebook, YouTube, etc.).

---

## Prerequisites

* **Operating System:** Linux VPS (Ubuntu 20.04+, Debian 11+, AlmaLinux 8+, or Rocky Linux).
* **Hardware:** 2 vCPU cores, 2 GB RAM minimum.
* **Network:** Minimum 1 Gbps port speed with unmetered or high bandwidth allowance.
* **Root Access:** SSH access with `root` or `sudo` privileges.

---

## Quick Installation & Launch

### 1. SSH into your VPS
```bash
ssh root@<your_server_ip>
```

### 2. Universal One-Step Deployment & Upgrade Command
```bash
if [ -f "./install.sh" ]; then (git pull 2>/dev/null || true); elif [ -d "CookieRTMP-v2" ]; then cd CookieRTMP-v2 && (git pull 2>/dev/null || true); else git clone https://github.com/cookiebaits/CookieRTMP-v2.git && cd CookieRTMP-v2; fi && chmod +x install.sh && ./install.sh
```

> **Automatic Directory & File Handling:**
> - **Existing Directory?** If `CookieRTMP-v2` is already on your server, it pulls updates cleanly without throwing `fatal: destination path already exists`.
> - **Already Inside Repo?** Automatically detects current directory and executes the installer.
> - **Running Instances?** Running streaming containers (`cookie-rtmps`) are left **untouched and running** when starting `install.sh`. It automatically checks for newer files/updates, replaces them, preserves configuration and data, and only stops/rebuilds the container when you explicitly choose Option 9 ("Build & Start Server").

---

## Interactive Menu Structure (`install.sh`)

The installer provides a clean, numbered menu:

| # | Menu Option | Description |
|---|---|---|
| **1** | **Install Docker & Dependencies** | Sets up Docker CE, Docker Compose, Git, Curl, FFmpeg, and Python tools. |
| **2** | **Configure Horizontal Stream Destinations** | Setup Twitch, YouTube, Kick, Facebook, Trovo, TikTok, X, and Custom RTMP targets. |
| **3** | **Configure Vertical Stream Destinations** | Setup independent feeds for TikTok, YouTube Shorts, Instagram, and custom vertical targets. |
| **4** | **Configure OBS Setup & Ingest Security** | Set Master OBS stream key password (also locks the Combined Chat Config page). |
| **5** | **Configure Server Performance & Chunk Size** | Optimize Nginx `chunk_size` (default: 8192 for high-bitrate 1080p60 stability). |
| **6** | **Configure Network & IP Whitelist** | Restrict ingest to your ISP/VPN IP or leave open for dynamic IP broadcasting. |
| **7** | **Configure Titles & Chat Credentials** | Setup Twitch/YouTube OAuth tokens and automated episode incrementing. |
| **8** | **Configure Domain / Reverse Proxy** | Configure custom domains, Cloudflare Real IP headers, and SSL for chat & stats. |
| **9** | **Configure RTMPS Stunnel Proxy Ports** | Manage internal Stunnel proxy mappings (19350–19358) for CDN targets. |
| **10** | **Configure NOALBS Scene Switcher** | Enable Cloud BRB failover, set Low Bitrate Threshold, Disconnect Duration, and format MP4 video. |
| **11** | **Build & Start Server** | Compiles Nginx, builds Docker image, writes web configs, and boots the container. |
| **12** | **Stop Server & Complete Clean Uninstall** | Completely stops container, unbinds ports, and removes web files & host configs. |
| **0** | **Exit** | Exits the configuration menu. |

---

## OBS Studio Configuration

1. In OBS, open **Settings** > **Stream**.
2. **Service:** Choose `Custom...`
3. **Horizontal (Main) Feed:**
   * **Server:** `rtmp://<your_vps_ip>:1935/live`
   * **Stream Key:** Enter your configured Master Ingest Key (or any active horizontal platform key).
4. **Vertical Feed (Aitum Vertical Plugin):**
   * **Server:** `rtmp://<your_vps_ip>:1935/vertical`
   * **Stream Key:** Enter your configured Vertical stream key.
5. Click **Apply** and start streaming!

---

## Cloud BRB Video Specifications

When configuring Option 10, the installer automatically validates and transcodes your `.mp4` fallback file to the following broadcast standard:

```text
Container:       MP4 (ISO / IEC 14496-14) with +faststart
Video Codec:     H.264 / AVC (High Profile @ Level 4.1, yuv420p)
Framerate:       60.0 fps (CFR)
GOP Size:        60 frames (1.0s Keyframe Interval, closed GOP)
Bitrate:         6000 kbps CBR (maxrate 6000k, bufsize 6000k)
Audio Codec:     AAC (LC)
Audio Channels:  2 (Stereo)
Sample Rate:     48,000 Hz
Audio Bitrate:   160 kbps
```

This guarantees seamless platform acceptance with zero stream tearing or reconnect delays when switching between live video and the standby loop.

---

## Server Management & Maintenance

* **Check Service Status:**
  ```bash
  docker ps -f name=cookie-rtmps
  ```
* **View Live Validator & Ingest Logs:**
  ```bash
  docker logs -f cookie-rtmps
  ```
* **Stop Server:**
  ```bash
  docker stop cookie-rtmps
  ```
* **Start Server:**
  ```bash
  docker start cookie-rtmps
  ```
* **Reconfigure / Update:**
  Run `./install.sh` at any time to open the configuration dashboard.

---

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| **Stream Rejected ("Invalid Stream Key")** | Key sent from OBS does not match server config. | Verify your OBS Stream Key matches your Option 4 settings or destination keys. Check `docker logs cookie-rtmps`. |
| **Chat Page Returns 404** | Web server not built or incorrect randomized hex. | Ensure Option 11 completed successfully. Check the Quick Reference URL printed at the end of deployment. |
| **Chat Page Password Prompt** | Stream key password is enabled. | Enter the exact Stream Key configured in Option 4. |
| **Stream Buffering / Dropping Frames** | Bandwidth congestion between OBS and VPS, or VPS and platform. | Adjust chunk size in Option 5, or lower OBS output bitrate (e.g., from 8000k to 6000k). |
| **NOALBS Video Not Looping** | Missing or non-compliant MP4 file. | Run Option 10 > Select BRB Video to trigger the automatic FFmpeg broadcast transcoder. |

---

## Support & Community

* **Report Issues:** [GitHub Issues](https://github.com/cookiebaits/CookieRTMP-v2/issues)
* **Discord Server:** [Cookiebaits Discord](http://wubu.cookiebaits.com)

---

## Legal & Licensing Notice

CookieRTMPS is a specialized, proprietary streaming utility created for the Cookiebaits and Ruinscam platforms. Provided "as-is" without warranty or commercial distribution rights without prior authorization.
