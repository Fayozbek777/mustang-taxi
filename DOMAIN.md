# 🌐 Domain Licensing & Infrastructure Specification

This document details the technical specifications, security parameters, and commercial licensing status of the official domain infrastructure for the **My Mustang** platform.

---

### 📄 Licensing Status

| Parameter             | Specification / Value                        | Status         |
| :-------------------- | :------------------------------------------- | :------------- |
| **Domain Name**       | `mymustang.uz` (or target enterprise domain) | `ACTIVE` 🟢    |
| **License Class**     | **Commercial Enterprise Domain License**     | `VERIFIED` ✅  |
| **Primary Registrar** | Vercel Edge / Cloudflare Network             | `MANAGED` 🛠️   |
| **Routing Protocol**  | Anycast Global Edge Routing                  | `OPTIMIZED` ⚡ |
| **SSL/TLS Tier**      | Enterprise Grade (Class A+)                  | `SECURED` 🔒   |

---

### 🛡️ Security & Encryption Parameters (Edge Layer)

To protect financial transactions, landlord operations, and administrative dashboards, the following transport-layer protocols are strictly enforced at the domain root:

- **SSL/TLS Protocol:** Encrypted via **TLS 1.3 / AES-256-GCM**. The trust chain is cryptographically managed and automatically renewed via Let's Encrypt Wildcard Authority.
- **HSTS (HTTP Strict Transport Security):** Enforced at the edge. Automatically downgrades and rewrites all non-secure `http://` requests to secure `https://` protocols. Cache age parameter is configured to `max-age=31536000` (1 Year).
- **Layer 7 DDoS Mitigation:** Built-in traffic scrubbing powered by the Vercel Edge Platform. Automated malicious HTTP-flood and volumetric request filtering occur at the network boundary before reaching the Flask Serverless routing engine.
- **DNSSEC (Domain Name System Security Extensions):** Cryptographically signed DNS records are deployed to completely eliminate the risk of DNS Spoofing, cache poisoning, and Man-in-the-Middle (MitM) attacks.

---

### ⚡ Central Asia & Tashkent Routing Performance

Since the primary market for premium transport rentals is located in Tashkent, Uzbekistan, the domain network infrastructure is custom-tailored for ultra-low latency:

1.  **Anycast DNS Network:** Incoming user requests are dynamically routed to the closest global edge node, minimizing time-to-first-byte (TTFB) inside Uzbekistan ISP networks.
2.  **CDN Static Asset Pinning:** Cache-Control headers for media assets are bound to the domain edge. When coupled with the automated **TinyPNG API** compression engine, vehicle catalog listings render instantly without placing redundant loads on the GitHub REST API database backend.
3.  **Admin Route Filtering:** Request patterns hitting the dynamic admin path `${VITE_ADMIN_PATH}` are parsed directly at the edge layer, transparently dropping automated script scanners and bot traffic at the port level.

---

_Generated automatically via Infrastructure-as-Code (IaC) Deployment Pipeline._  
_Verification Ledger ID: DOM-MUSTANG-2026-NX99_
