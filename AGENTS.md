## Developer Memory

### Nginx & RTMP Module
- **Version**: Nginx 1.30.3 (stable) with local `cookie-nginx-rtmp` module.
- **Hardening**: AMF recursion limit (128), no VLAs, `ngx_random()` handshakes, and fixed memory leaks in `ngx_rtmp_eval.c`.
- **Codecs**: Support for HEVC (H.265), AV1, and VP9 via Enhanced RTMP FourCC identification.

### Streaming Infrastructure
- **RTMPS**: Handled via local Stunnel proxying (ports 19350-19358). Stunnel config includes SNI and `checkHost` for CDN compatibility.
- **Dual-Streaming**: Supported via separate `live` (horizontal) and `vertical` Nginx applications. `install.sh` handles auto-mirroring and server diversification.

### Management & UI
- **Installer**: `install.sh` Quick Reference provides "Combined Chat Config Page: http://{host}/{8-char-hex}", randomized per fresh download. Menu options #6 (chat CLI config) and #7 (titles/Twitch API) removed. Sub-option 10 configures NOALBS Scene Switcher MP4 to loop during low bitrate or disconnection for the configured duration.
- **Control Dashboard**: `chat.html` integrated with `stream_validator.py` (Flask) for unified multi-platform chat overlay (Twitch, YouTube, Kick) with platform logos.
- **OAuth**: Supported for Twitch and YouTube with background token refresh logic to maintain sessions.
- **Persistence**: Stream keys, chat hex keys, and episode counts persisted in host volume `./data` and `rtmp_config.env`.
