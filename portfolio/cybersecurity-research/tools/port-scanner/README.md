# 🔍 TCP Port Scanner – Network Basics Project

## 📌 Project Overview

This project is a **simple, educational TCP port scanner** written in Python. It demonstrates fundamental networking concepts: socket communication, concurrent programming, and command-line argument parsing.

**Why this project?**  
As a future *Fachinformatiker für Systemintegration*, understanding how networks function at the port level is essential. This tool allows me to:

- Learn how TCP connections work
- Practice Python scripting for system administration
- Understand network reconnaissance (for defensive purposes)
- Develop clean, documented, and ethical code

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|----------|
| **Python 3** | Core scripting language |
| **Socket Library** | TCP connection handling |
| **ThreadPoolExecutor** | Concurrent scanning for speed |
| **Argparse** | Professional command-line interface |

---

## 🚀 Features

- ✅ Scan a single target (IP or hostname)
- ✅ Customizable port range (`--start` / `--end`)
- ✅ Adjustable timeout (`--timeout`)
- ✅ Concurrent scanning with worker threads (`--workers`)
- ✅ Clear, formatted output (open ports highlighted)
- ✅ Error handling for invalid inputs
- ✅ Educational comments throughout the code
- ✅ Ethical usage reminder (only scan authorized systems)

---

## 📦 Installation & Usage

### Prerequisites
- Python 3.8+ installed
- Internet/network access to the target (with permission)

### Clone & Run

```bash
# Navigate to your tools directory
cd portfolio/cybersecurity-research/tools/port-scanner

# Make the script executable (optional)
chmod +x port_scanner.py

# Basic scan (localhost)
python3 port_scanner.py 127.0.0.1

# Advanced scan (custom range, more workers)
python3 port_scanner.py 192.168.1.10 --start 1 --end 1000 --workers 100
```

### Example Output

```
==================================================
TCP Port Scanner
==================================================
Target : 127.0.0.1
IP     : 127.0.0.1
Ports  : 1-1000

[+] Port 22/tcp is OPEN
[+] Port 80/tcp is OPEN
[+] Port 443/tcp is OPEN

==================================================
Scan complete. Open ports found: 3
==================================================
Open ports: 22, 80, 443
```

---

## 🧠 What I Learned

| Concept | How I Applied It |
|---------|------------------|
| **TCP Handshake** | Understood SYN, SYN-ACK, ACK flow via connect_ex() |
| **Concurrency** | Used ThreadPoolExecutor to scan multiple ports simultaneously |
| **Error Handling** | Wrapped socket calls in try/except blocks |
| **CLI Design** | Built a professional interface with argparse |
| **Ethical Boundaries** | Added explicit warnings to only scan authorized systems |

---

## 🔐 Ethics & Legal Disclaimer

**IMPORTANT:** This tool is for educational purposes only.

- ✅ Only scan networks and systems that you own
- ✅ Get explicit written permission before testing any systems
- ❌ Unauthorized scanning is **illegal** in many jurisdictions
- ❌ Violates computer misuse laws in most countries

**Use this tool responsibly and ethically!**

---

## 📈 Next Steps (How I'll Improve This)

- [ ] **Service Detection** – Identify what service runs on each open port (e.g., SSH, HTTP)
- [ ] **UDP Scanning** – Expand to UDP ports for deeper network analysis
- [ ] **Output Formats** – Export results to JSON/CSV for reporting
- [ ] **Nmap Integration** – Use this as a lightweight alternative for quick checks
- [ ] **GUI Interface** – Create a simple Tkinter interface for non-technical users

---

## 🧩 Skills Demonstrated

| Skill | Relevance for Ausbildung |
|-------|-------------------------|
| **Python Scripting** | Automation & system administration |
| **TCP/IP Networking** | Core network knowledge for sysadmins |
| **Concurrent Programming** | Efficient resource usage |
| **CLI Tool Building** | Creating professional IT tools |
| **Documentation** | Writing clear, maintainable code |
| **Ethical Awareness** | Understanding legal boundaries |

---

## 📂 Related Projects

- 🔐 [Cybersecurity Research](../README.md)
- 📚 [Crypto Trading Guide](../../crypto-trading-guide/)
- 🤖 [n8n Workflows](../../n8n-workflows/)

---

## 🙏 Acknowledgments

- Built with guidance from AI tools (Claude, ChatGPT, DeepSeek) as learning aids
- Inspired by real-world sysadmin tasks and cybersecurity fundamentals
- Code reviewed and optimized for educational clarity

---

**Project Status:** ✅ Complete (v1.0) – Ready for portfolio inclusion

**Last Updated:** September 2026

---

**Made with ❤️ by Zavix – Future Systemintegration Specialist 🇩🇪**