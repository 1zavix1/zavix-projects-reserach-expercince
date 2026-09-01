# 🔍 TCP Port Scanner – Network Basics Project

## 📌 Project Overview

This project is a **professional TCP port scanner** written in Python. It demonstrates fundamental networking concepts: socket communication, concurrent programming, and command-line argument parsing.

**Why this project?**  
As a future *Fachinformatiker für Systemintegration*, understanding how networks function at the port level is essential. This tool allows me to:

- Learn how TCP connections work
- Practice Python scripting for system administration
- Understand network reconnaissance (for defensive purposes)
- Develop secure, documented, and ethical code
- Implement professional security practices

---

## 🛠️ Technologies Used

| Technology | Purpose | Version |
|------------|---------|----------|
| **Python** | Core scripting language | 3.8+ |
| **Socket Library** | TCP connection handling | Standard lib |
| **ThreadPoolExecutor** | Concurrent scanning for speed | Standard lib |
| **Argparse** | Professional command-line interface | Standard lib |
| **Logging** | Structured logging support | Standard lib |

---

## ✨ Features

### Core Features
- ✅ Scan a single target (IP or hostname)
- ✅ Customizable port range (`--start` / `--end`)
- ✅ Adjustable timeout (`--timeout`)
- ✅ Concurrent scanning with worker threads (`--workers`)
- ✅ Clear, formatted output (open ports highlighted)
- ✅ Error handling for invalid inputs
- ✅ Educational comments throughout the code
- ✅ Ethical usage reminder (only scan authorized systems)

### Advanced Features (v1.1.0+)
- ✅ **Rate limiting** - Pause between scanning batches
- ✅ **Structured logging** - Debug mode with `--verbose`
- ✅ **Version info** - Display version with `--version`
- ✅ **Graceful shutdown** - Clean Ctrl+C handling
- ✅ **Memory efficient** - Batch processing for large ranges
- ✅ **Python 3.8+ compatible** - Works on Ubuntu 20.04+
- ✅ **Professional logging** - Structured output and error messages

---

## 📦 Installation & Usage

### Prerequisites
- Python 3.8+ installed
- Linux/Mac/Windows with network access
- Permission to scan the target (important!)

### Setup

```bash
# Navigate to the tool directory
cd portfolio/cybersecurity-research/tools/port-scanner

# Make the script executable (Linux/Mac)
chmod +x port_scanner.py
```

### Quick Start

#### Basic Scan (Localhost)
```bash
python3 port_scanner.py 127.0.0.1
```

#### Scan Remote Host
```bash
python3 port_scanner.py 192.168.1.10
```

#### Custom Port Range
```bash
python3 port_scanner.py 192.168.1.10 --start 1 --end 1000
```

#### Fast Scan (More Workers)
```bash
python3 port_scanner.py 192.168.1.10 --workers 100 --timeout 0.2
```

#### Slow, Stealthy Scan (Rate Limiting)
```bash
python3 port_scanner.py 192.168.1.10 --rate-limit 0.1 --workers 20
```

#### Verbose Mode (Debug Output)
```bash
python3 port_scanner.py 127.0.0.1 --verbose --end 100
```

#### Full Scan (All Ports)
```bash
python3 port_scanner.py 192.168.1.1 --start 1 --end 65535 --workers 50
```

---

## 🎛️ Command Line Options

```
usage: port_scanner.py [-h] [--start START] [--end END] 
                       [--timeout TIMEOUT] [--workers WORKERS]
                       [--rate-limit RATE_LIMIT] [--version] 
                       [--verbose] target

positional arguments:
  target                Target hostname or IP address

optional arguments:
  -h, --help            Show help message
  --start START         First port to scan (default: 1)
  --end END             Last port to scan (default: 1000)
  --timeout TIMEOUT     Socket timeout in seconds (default: 0.5)
  --workers WORKERS     Concurrent workers (default: 50, max: 200)
  --rate-limit RATE_LIMIT
                        Pause seconds between batches (default: 0)
  --version             Show version number
  --verbose             Enable debug logging
```

---

## 📊 Example Output

### Basic Scan
```
==================================================
TCP Port Scanner v1.1.0
==================================================
Target : 127.0.0.1
IP     : 127.0.0.1
Ports  : 1-1000
Workers: 50

[+] Port 22/tcp is OPEN
[+] Port 80/tcp is OPEN
[+] Port 443/tcp is OPEN

==================================================
Scan complete. Open ports found: 3
==================================================
Open ports: 22, 80, 443
```

### Verbose Mode
```
[INFO] Scanning 1000 ports with 50 workers
[+] Port 22/tcp is OPEN
[+] Port 80/tcp is OPEN
[+] Port 443/tcp is OPEN
[INFO] Scan complete. Open ports found: 3
```

---

## 🧠 What I Learned

| Concept | Implementation | Relevance |
|---------|----------------|----------|
| **TCP Handshake** | `socket.connect_ex()` implements SYN→SYN-ACK→ACK | Network protocols |
| **Concurrency** | `ThreadPoolExecutor` for parallel scanning | Performance optimization |
| **Error Handling** | Try/except with exception categorization | Robust code |
| **CLI Design** | `argparse` with validation | User experience |
| **Memory Management** | Batch processing to limit heap usage | Resource efficiency |
| **Rate Limiting** | Configurable pause between batches | Network etiquette |
| **Logging** | Structured logging with levels | Professional software |
| **Security** | Input validation, privilege separation | Secure coding |
| **Ethical Awareness** | Legal disclaimers and documentation | Professional responsibility |

---

## 🔐 Ethics & Legal Disclaimer

⚠️ **CRITICAL: This tool is for educational purposes only.**

### Legal Requirements
- ✅ **Only** scan networks and systems you own
- ✅ Get **explicit written permission** before testing any systems
- ✅ Document all authorization and testing scope
- ✅ Comply with local laws and regulations

### Legal Risks
- ❌ Unauthorized scanning is **illegal** in most jurisdictions
- ❌ Violates Computer Fraud and Abuse Act (CFAA) in USA
- ❌ Violates Computer Misuse Act in UK
- ❌ Similar laws exist worldwide

### When It's Safe to Use
- ✅ Testing your own home network
- ✅ Lab/educational environment
- ✅ Authorized security assessments (with written permission)
- ✅ Learning and training purposes

---

## 🚀 How This Project Evolved

### Version 1.0 (Initial)
- Basic TCP port scanner
- Concurrent scanning with ThreadPoolExecutor
- Command-line interface

### Version 1.1.0 (Hardened)
- ✅ Fixed Python 3.8+ compatibility
- ✅ Added rate limiting
- ✅ Added structured logging
- ✅ Improved memory efficiency
- ✅ Enhanced error handling
- ✅ Professional features (version, verbose, graceful shutdown)

**See [IMPROVEMENTS.md](./IMPROVEMENTS.md) for detailed changes.**

---

## 🔍 Security Review

This code has been professionally reviewed by a security specialist.

**Verdict:** ✅ **APPROVED** for educational portfolio

**Key Findings:**
- No critical vulnerabilities
- Low operational risk
- Production-ready code quality
- Professional error handling

**See [SECURITY_REVIEW.md](./SECURITY_REVIEW.md) for full audit.**

---

## ⚠️ Limitations

### Current Constraints
1. **IPv4 only** – IPv6 targets not supported yet
2. **TCP only** – UDP scanning not implemented
3. **No service detection** – Doesn't identify services on ports
4. **No OS fingerprinting** – Doesn't detect operating system
5. **Single-target only** – Scans one host at a time
6. **No output formats** – Only prints to stdout (no JSON/CSV)

### Operational Considerations
- **No stealth** – TCP connect scans are easily logged
- **No proxy support** – Can't route through SOCKS/HTTP proxies
- **Rate limiting** – High worker count can overwhelm targets
- **No persistence** – Can't resume interrupted scans

### When NOT to Use
- ❌ Production penetration testing (use professional tools like nmap)
- ❌ Stealth operations (use more advanced techniques)
- ❌ Scanning without explicit permission
- ❌ Any unauthorized use

---

## 🧪 Testing & Validation

### Functional Tests
```bash
# Test on localhost
./port_scanner.py 127.0.0.1

# Test with different port ranges
./port_scanner.py 127.0.0.1 --start 20 --end 443

# Test rate limiting
./port_scanner.py 127.0.0.1 --rate-limit 0.5 --end 200

# Test verbose mode
./port_scanner.py 127.0.0.1 --verbose --end 100

# Test version
./port_scanner.py --version
```

### Code Quality
```bash
# Syntax check
python3 -m py_compile port_scanner.py

# Type hints verification
mypy port_scanner.py

# Linting
pylint port_scanner.py --max-line-length=120
```

---

## 📈 Performance Characteristics

| Operation | Time | Memory | Notes |
|-----------|------|--------|-------|
| Scan 1000 ports (50 workers) | ~2-5 seconds | ~10 MB | Typical LAN |
| Scan 65535 ports (50 workers) | ~60-120 seconds | ~8 MB | Full range |
| Memory with rate limiting | Same | Reduced | Batching effect |

---

## 🛣️ Roadmap (Future Versions)

### v2.0 Planned
- [ ] IPv6 support via `socket.getaddrinfo()`
- [ ] UDP port scanning
- [ ] Service detection (banner grabbing)
- [ ] JSON/CSV export formats
- [ ] GUI interface (Tkinter)
- [ ] Async/await implementation

### v3.0+ Ideas
- [ ] Configuration files
- [ ] Distributed scanning
- [ ] Machine learning for pattern detection
- [ ] Integration with other security tools

---

## 📚 Resources & References

### Learning Resources
- [Python Socket Programming](https://docs.python.org/3/library/socket.html)
- [TCP/IP Fundamentals](https://en.wikipedia.org/wiki/Internet_protocol_suite)
- [ThreadPoolExecutor Guide](https://docs.python.org/3/library/concurrent.futures.html)
- [Network Security Basics](https://www.cybrary.it/)

### Related Tools
- **nmap** - Professional network scanning tool
- **masscan** - Fast internet-wide network scanner
- **zmap** - Fast single-port scanner

### Ethical Hacking Resources
- OWASP Top 10
- HackTheBox (legal practice environment)
- TryHackMe (interactive learning)

---

## 🎓 Skills Demonstrated

This project shows potential employers:

| Skill | Evidence | Relevance |
|-------|----------|----------|
| **Python** | Clean, documented code | Essential for sysadmins |
| **Networking** | TCP/IP implementation | Core for network admins |
| **Concurrency** | ThreadPoolExecutor usage | Performance optimization |
| **Security** | Error handling, validation | Professional practice |
| **Linux** | Bash commands, permissions | Core competency |
| **Documentation** | README, comments, changelog | Professional communication |
| **Code Review** | Version improvements | Continuous learning |
| **Ethical Awareness** | Legal disclaimers | Responsible development |

---

**Status:** ✅ Production Ready (v1.1.0)

**Last Updated:** September 2026

**Made with ❤️ by Zavix** 🇩🇪 Preparing for Ausbildung in Germany