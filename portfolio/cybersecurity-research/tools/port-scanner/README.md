# 🔍 TCP Port Scanner

## Overview

A lightweight, educational TCP port scanner written in Python. This tool demonstrates network reconnaissance concepts essential for cybersecurity professionals and system administrators.

**Status:** ✅ Production Ready

---

## 🎯 Features

✅ **Concurrent Scanning** - Uses ThreadPoolExecutor for fast parallel port scanning  
✅ **Customizable Range** - Scan any port range (1-65535)  
✅ **Error Handling** - Robust error handling for network issues  
✅ **Configurable Timeout** - Adjust socket timeout for different network conditions  
✅ **Clean Output** - Easy-to-read results with clear formatting  
✅ **Type Hints** - Fully typed Python code for better maintainability  

---

## 📋 Requirements

- Python 3.8+
- Standard library only (no external dependencies!)

---

## 🚀 Installation

```bash
# Clone or download the repository
git clone https://github.com/1zavix1/zavix-projects-reserach-expercince.git

# Navigate to the tool
cd portfolio/cybersecurity-research/tools/port-scanner/

# Make it executable (optional)
chmod +x port_scanner.py
```

---

## 💻 Usage

### Basic Usage (scan localhost, ports 1-1000)
```bash
python3 port_scanner.py 127.0.0.1
```

### Scan Specific IP Address
```bash
python3 port_scanner.py 192.168.1.10
```

### Custom Port Range
```bash
python3 port_scanner.py 192.168.1.10 --start 1 --end 10000
```

### Faster Scan (more workers)
```bash
python3 port_scanner.py 192.168.1.10 --workers 100
```

### Adjust Timeout (slow network)
```bash
python3 port_scanner.py 192.168.1.10 --timeout 1.0
```

### Complete Example
```bash
python3 port_scanner.py 192.168.1.1 --start 20 --end 443 --timeout 0.8 --workers 75
```

---

## 📊 Command Line Options

| Option | Default | Description |
|--------|---------|-------------|
| `target` | Required | Hostname or IP address to scan |
| `--start` | 1 | First port to scan (1-65535) |
| `--end` | 1000 | Last port to scan (1-65535) |
| `--timeout` | 0.5 | Socket timeout in seconds |
| `--workers` | 50 | Number of concurrent threads (1-500) |

---

## 📚 How It Works

### 1. **Argument Parsing**
The script parses command-line arguments with validation to ensure valid port ranges and parameters.

### 2. **Hostname Resolution**
Converts hostname to IP address using `socket.gethostbyname()`.

### 3. **Concurrent Port Scanning**
Uses `ThreadPoolExecutor` to scan multiple ports simultaneously:
- Each port gets a separate thread
- Attempts TCP connection using `socket.connect_ex()`
- Returns immediately if connection succeeds (port is open)

### 4. **Results Collection**
Collects and displays all open ports in sorted order.

---

## ⚙️ Technical Details

### Connection Method
- **Protocol**: TCP (Transmission Control Protocol)
- **Method**: Three-way handshake (`SYN → SYN-ACK → ACK`)
- **Detection**: If `connect_ex()` returns 0, the port is open

### Performance
- **Concurrency**: ThreadPoolExecutor (up to 500 workers by default)
- **Timeout**: 0.5 seconds per port (adjustable)
- **Speed**: ~20-50 ports/second depending on network conditions

### Error Handling
```python
- socket.gaierror → Invalid hostname
- socket.timeout → Port not responding
- ConnectionRefused → Port closed
- OSError → General network error
```

---

## 📝 Example Output

```
==================================================
TCP Port Scanner
==================================================
Target : 192.168.1.10
IP     : 192.168.1.10
Ports  : 1-1000

[+] Port 22/tcp is OPEN
[+] Port 80/tcp is OPEN
[+] Port 443/tcp is OPEN
[+] Port 3306/tcp is OPEN

==================================================
Scan complete. Open ports found: 4
==================================================
Open ports: 22, 80, 443, 3306
```

---

## ⚖️ Legal & Ethical Considerations

⚠️ **IMPORTANT:** 

- **ONLY** scan systems and networks you own
- **ALWAYS** get explicit written permission before scanning any systems
- Unauthorized port scanning is **illegal** in most jurisdictions
- This tool is for **educational purposes only**
- Misuse could violate the Computer Fraud and Abuse Act (CFAA) or similar laws

---

## 🔐 Security Notes

1. **No Exploitation** - This is a reconnaissance tool only
2. **No Fingerprinting** - Only detects open/closed ports
3. **Clean Connections** - Properly closes all sockets
4. **No Malicious Payload** - Sends only standard TCP packets

---

## 🛠️ Customization

### Increase Speed
```bash
# Use more workers for faster scanning
python3 port_scanner.py 192.168.1.10 --workers 200 --timeout 0.3
```

### Thorough Scan
```bash
# Longer timeout for unreliable networks
python3 port_scanner.py 192.168.1.10 --timeout 2.0 --workers 25
```

### Common Ports Only
```bash
# Scan only well-known ports
python3 port_scanner.py 192.168.1.10 --start 1 --end 1024
```

---

## 📖 Learning Outcomes

By studying this code, you'll learn:

- ✅ TCP/IP networking fundamentals
- ✅ Socket programming in Python
- ✅ Concurrent programming with ThreadPoolExecutor
- ✅ Error handling and validation
- ✅ Command-line argument parsing
- ✅ Professional Python code structure

---

## 🚀 Future Enhancements

Possible improvements:
- UDP port scanning
- Service version detection (banner grabbing)
- Export results to JSON/CSV
- GUI interface
- Nmap-style output formatting
- Conditional firewall detection

---

## 📄 License

This tool is provided for educational purposes. Use responsibly and legally.

---

## 👤 Author

**Zavix** - Cybersecurity Learning & Research  
Portfolio: [zavix-projects-research-experience](https://github.com/1zavix1/zavix-projects-reserach-expercince)

---

**Remember:** Knowledge is power, but responsibility is essential! 🔐
