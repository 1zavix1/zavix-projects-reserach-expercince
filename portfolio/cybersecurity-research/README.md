# 🔐 Cybersecurity Research & Learning

**Status:** 📝 In Progress | **Focus:** SOC Analyst Path

This folder contains my cybersecurity research, hardening guides, and SOC analyst learning materials.

## 📚 Contents

### Security Hardening Projects
- **Diamond Shield** — 7-layer personal OPSEC/cybersecurity hardening
- **Device Security** — Windows 11, Linux (Kali, Ubuntu), Mac hardening
- **Network Security** — VLANs, firewalls, DMZ, intrusion detection concepts
- **Identity & Access** — Bitwarden, 2FA (Aegis), PGP/GPG encryption
- **Server Hardening** — SSH keys, fail2ban, UFW, monitoring

### Research Areas
- Malware analysis basics
- Incident response procedures
- Threat identification & red flags
- Social engineering awareness
- Cryptography fundamentals
- VPN & anonymization tools

### Tools & Technologies
- **OS:** Linux (Kali, Ubuntu, Whonix), Windows, macOS
- **Security:** Bitwarden, VeraCrypt, ProtonVPN, Tor, GPG/PGP
- **Monitoring:** Suricata, UFW, fail2ban, Pi-hole
- **Analysis:** Wireshark, TestDisk/PhotoRec, hash verification

### Case Studies
- **Data Recovery Incident** — VeraCrypt SSD wipe analysis & recovery attempts
- **Malware Quarantine** — Defender detections analysis (heart sender v1.2, RCE files)
- **API Security Hardening** — Zavix Store token rotation & secret management

---

## 🎓 SOC Analyst Learning

**Current Path:**
1. ✅ Identify threats in network traffic
2. ✅ Understand firewall logs
3. ✅ Recognize attack patterns
4. 🔄 Build incident response playbooks
5. 🔄 Set up monitoring & alerting
6. 📋 Create security policies

**Skills Building:**
- Network analysis (Wireshark)
- Log analysis (Suricata, UFW)
- Malware identification
- Incident classification
- Threat intelligence

---

## 🛡️ Key Projects

### Diamond Shield (7 Layers)

**Layer 1: Device Security**
- ✅ MAC spoofing (scheduled task)
- ✅ DNS over HTTPS (Quad9)
- ✅ Brave + uBlock Origin + Canvas fingerprint blocking
- 🔄 Bitwarden password manager (HIGH PRIORITY)

**Layer 2: Network Security**
- ✅ ProtonVPN WireGuard VPN
- 🔄 UFW firewall (new Kali VM)
- 🔄 Whonix VM (OVA downloaded, sig verification pending)
- 📋 Nginx + Fail2ban + Cowrie (honeypot) + Suricata (IDS)

**Layer 3: Identity & Cryptography**
- ✅ GPG4win installed
- ✅ PGP key generated (old VM, needs regeneration)
- 🔄 Aegis 2FA authenticator
- 📋 Virtual phone number
- 📋 Temp email service

**Layer 4: Storage Encryption**
- ✅ VeraCrypt container (separate)
- 🔄 Lexar SL300 2TB SSD re-encryption (recovery pending)

**Layer 5: Advanced**
- 📋 Tails OS (live system)
- 📋 Raspberry Pi 4B (Pi-hole, WireGuard server)

**Layer 6: Mobile & Physical**
- 📋 GrapheneOS / Signal
- 📋 Faraday bag

**Layer 7: Air-Gapped PC**
- 📋 Offline storage & signing

---

## 📊 Security Incidents & Lessons

### Incident 1: Lexar SSD Encryption Wipe
**What Happened:** VeraCrypt encryption mid-setup, password forgotten, SSD wiped via diskpart

**Response:**
- PhotoRec recovery attempt
- Manual C:\Recovered folder analysis
- Decision: Document as case study for portfolio

**Lesson:** Always backup before encryption, use password manager (Bitwarden) FIRST

### Incident 2: Malware Quarantine (Telegram)
**What Happened:** Defender quarantined `heart sender v1.2.rar`, `rce.md`, `file-upload.md` from Telegram

**Response:**
- Identified source: Discord crypto/trading community
- Decided: Treat as handled by Defender
- Lesson: Community-shared files need isolation testing

### Incident 3: API Token Exposure (Zavix Store)
**What Happened:** Admin tokens hardcoded in public config files

**Response:**
- ✅ Replaced with placeholders (Codex)
- ✅ Generated new rotated tokens
- 🔄 Bitwarden integration (pending)
- 🔄 Supabase SQL update (may not be completed)

**Lesson:** Secrets should never touch version control or plain text

---

## 🚀 Next Priorities

1. **🔴 HIGH:** Install Bitwarden (blocks other security work)
2. **🔴 HIGH:** Complete Supabase token rotation (Zavix Store)
3. **🟠 MEDIUM:** Re-encrypt Lexar SSD with VeraCrypt
4. **🟠 MEDIUM:** Finish Whonix import & signature verification
5. **🟡 LOW:** Set up Raspberry Pi 4B (Pi-hole, WireGuard)
6. **🟡 LOW:** Build Tails OS for offline operations

---

## 📖 Resources

- **NIST Cybersecurity Framework** — Identify, Protect, Detect, Respond, Recover
- **MITRE ATT&CK** — Threat modeling and adversary tactics
- **OWASP Top 10** — Web application security
- **CIS Benchmarks** — Hardening best practices
- **Kali Linux Tools** — Security testing and analysis

---

## 📝 Documentation

Each security project includes:
- ✅ Setup procedure (step-by-step)
- ✅ Configuration details
- ✅ Why each security measure exists
- ✅ How to verify it's working
- ✅ Troubleshooting guide

---

## 🎯 Portfolio Value

**For Ausbildung Interviews:**
- Demonstrates hands-on security implementation
- Shows understanding of defense-in-depth
- Proves ability to research & solve security problems
- Documents incident response thinking

**For SOC Analyst Role:**
- Practical malware analysis experience
- Network security understanding
- Log analysis and threat identification
- Incident response procedures

---

**Version:** 1.0 | **Status:** Active Development | **Last Updated:** August 31, 2026
