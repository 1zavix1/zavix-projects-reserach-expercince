# 🏗️ Intermediate Cybersecurity Network - Packet Tracer Project

**Status:** ✅ Complete | **Difficulty:** Intermediate | **Focus:** Cybersecurity & Network Segmentation

## 📋 Project Overview

This is a **realistic corporate network** designed with security in mind. It demonstrates:
- Network segmentation using VLANs
- Firewall concepts and access control
- DMZ (demilitarized zone) for public-facing servers
- Basic intrusion detection concepts
- Proper IP addressing and subnetting

**Perfect for:** Portfolio demonstration, Ausbildung preparation, SOC analyst interviews

---

## 🏛️ Network Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      INTERNET (ISP)                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                    Router (Edge)
                    Gateway IP: 10.0.0.1
                         │
              ┌──────────┴──────────┐
              │                     │
         FIREWALL          (Optional IDS/IPS)
       (Perimeter)              Monitoring
              │
    ┌─────────┴─────────┐
    │                   │
 VLAN 10: DMZ      Core Switch
 (Public Servers)   (Distribution)
 IP: 192.168.10.0/24    │
                 ┌──────┬──────┬──────┐
                 │      │      │      │
            VLAN 20  VLAN 30  VLAN 40 VLAN 50
            (Admin)  (Users)  (Servers) (Guests)
            .1.0/24  .2.0/24  .3.0/24  .4.0/24
              │        │        │        │
           Admin PC  User PCs  Servers  Guest PCs
           (restricted) (standard) (critical) (isolated)
```

---

## 🔐 VLAN Configuration & Purpose

### **VLAN 10 - DMZ (Demilitarized Zone)**
- **IP Range:** 192.168.10.0/24
- **Gateway:** 192.168.10.1
- **Purpose:** Public-facing servers (web server, mail server)
- **Access:** Can be reached from internet, but restricted to/from internal networks
- **Devices:** Web Server (192.168.10.10), Mail Server (192.168.10.11)
- **Why:** If a public server gets hacked, attacker can't directly access internal network

### **VLAN 20 - Admin**
- **IP Range:** 192.168.20.0/24
- **Gateway:** 192.168.20.1
- **Purpose:** Network administrators only
- **Access:** Can reach ALL other VLANs (for management)
- **Devices:** Admin PC (192.168.20.10), Management Server (192.168.20.20)
- **Why:** Admins need access everywhere, but need isolation from regular users

### **VLAN 30 - Users (Standard Corporate)**
- **IP Range:** 192.168.30.0/24
- **Gateway:** 192.168.30.1
- **Purpose:** Regular employees' computers
- **Access:** Can reach internet, DMZ (limited), Servers (read-only)
- **Devices:** User PC-1 (192.168.30.10), User PC-2 (192.168.30.11), Laptop (192.168.30.12)
- **Why:** Users need to work but shouldn't access everything

### **VLAN 40 - Servers (Critical Infrastructure)**
- **IP Range:** 192.168.40.0/24
- **Gateway:** 192.168.40.1
- **Purpose:** Database servers, file servers, backup systems
- **Access:** Can only be reached from Admin + Users (limited ports)
- **Devices:** Database Server (192.168.40.10), File Server (192.168.40.11)
- **Why:** Most critical — needs maximum protection

### **VLAN 50 - Guests (Isolated)**
- **IP Range:** 192.168.50.0/24
- **Gateway:** 192.168.50.1
- **Purpose:** Visitors, temporary contractors
- **Access:** Internet ONLY, no internal access
- **Devices:** Guest PC-1 (192.168.50.10), Guest Laptop (192.168.50.11)
- **Why:** Guests might be untrusted — complete isolation

---

## 🛠️ Device Configuration

### **CORE ROUTER (Internet Gateway)**

**Interfaces:**
```
Fa0/0 (to ISP) — IP: 10.0.0.2/30 (internet side)
Fa0/1 (to Firewall) — IP: 192.168.0.1/30 (internal side)
```

**Basic Configuration:**
```
Router> enable
Router# configure terminal
Router(config)# hostname CoreRouter
Router(config)# ip route 0.0.0.0 0.0.0.0 10.0.0.1  (default route to ISP)
Router(config)# interface fa0/0
Router(config-if)# ip address 10.0.0.2 255.255.255.252
Router(config-if)# no shutdown
Router(config)# interface fa0/1
Router(config-if)# ip address 192.168.0.1 255.255.255.252
Router(config-if)# no shutdown
```

---

### **FIREWALL (Perimeter Security)**

**Concept:** Acts as gateway between internet and internal network. Inspects traffic and applies security rules.

**Key Rules (ACL - Access Control Lists):**

```
✅ ALLOW: Inbound HTTP (port 80) to DMZ Web Server ONLY
✅ ALLOW: Inbound HTTPS (port 443) to DMZ Web Server ONLY
✅ ALLOW: Inbound SSH (port 22) to DMZ from Admin VLAN ONLY
❌ DENY: Any other inbound traffic (default deny)
✅ ALLOW: All outbound from internal networks
❌ DENY: DMZ to internal networks (one-way access only)
❌ DENY: Guest VLAN to all internal networks
```

**Example ACL (Packet Tracer):**
```
Router(config)# access-list 101 permit tcp any host 192.168.10.10 eq 80
Router(config)# access-list 101 permit tcp any host 192.168.10.10 eq 443
Router(config)# access-list 101 deny ip any 192.168.30.0 0.0.0.255
Router(config)# access-list 101 deny ip any 192.168.40.0 0.0.0.255
Router(config)# access-list 101 permit ip any any
Router(config)# interface fa0/0
Router(config-if)# ip access-group 101 in
```

---

### **CORE SWITCH (Distribution Layer)**

**Purpose:** Connects all VLANs together. Routes traffic between them based on VLAN membership.

**VLAN Configuration:**
```
Switch(config)# vlan 10
Switch(config-vlan)# name DMZ
Switch(config)# vlan 20
Switch(config-vlan)# name Admin
Switch(config)# vlan 30
Switch(config-vlan)# name Users
Switch(config)# vlan 40
Switch(config-vlan)# name Servers
Switch(config)# vlan 50
Switch(config-vlan)# name Guests
```

**Port Assignments (which ports belong to which VLAN):**
```
Switch(config)# interface range fa0/1-2
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10   (DMZ)

Switch(config)# interface range fa0/3-4
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 20   (Admin)

Switch(config)# interface range fa0/5-7
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 30   (Users)

Switch(config)# interface range fa0/8-9
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 40   (Servers)

Switch(config)# interface range fa0/10-11
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 50   (Guests)

Switch(config)# interface range fa0/24  (trunk to router)
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20,30,40,50
```

---

### **LAYER 3 SWITCH / Inter-VLAN Router (SVI Configuration)**

This allows VLANs to communicate with each other.

```
Switch(config)# interface vlan 10
Switch(config-if)# ip address 192.168.10.1 255.255.255.0
Switch(config-if)# no shutdown

Switch(config)# interface vlan 20
Switch(config-if)# ip address 192.168.20.1 255.255.255.0
Switch(config-if)# no shutdown

Switch(config)# interface vlan 30
Switch(config-if)# ip address 192.168.30.1 255.255.255.0
Switch(config-if)# no shutdown

Switch(config)# interface vlan 40
Switch(config-if)# ip address 192.168.40.1 255.255.255.0
Switch(config-if)# no shutdown

Switch(config)# interface vlan 50
Switch(config-if)# ip address 192.168.50.1 255.255.255.0
Switch(config-if)# no shutdown

Switch(config)# ip routing  (enable routing between VLANs)
```

---

### **DHCP Servers (Automatic IP Assignment)**

**For Users VLAN (VLAN 30):**
```
Switch(config)# ip dhcp pool USERS_VLAN
Switch(dhcp-config)# network 192.168.30.0 255.255.255.0
Switch(dhcp-config)# default-router 192.168.30.1
Switch(dhcp-config)# dns-server 8.8.8.8

Switch(config)# ip dhcp excluded-address 192.168.30.1 192.168.30.9
(reserve 1-9 for static assignments)
```

**For Guests VLAN (VLAN 50):**
```
Switch(config)# ip dhcp pool GUESTS_VLAN
Switch(dhcp-config)# network 192.168.50.0 255.255.255.0
Switch(dhcp-config)# default-router 192.168.50.1
Switch(dhcp-config)# dns-server 8.8.8.8
Switch(dhcp-config)# lease 1  (1 day — guests leave eventually)
```

---

## 🔒 Security Rules (Inter-VLAN ACLs)

### **Rule 1: Guests Isolated (can only reach internet)**
```
Switch(config)# ip access-list extended GUESTS_OUT
Switch(config-ext-nacl)# permit ip 192.168.50.0 0.0.0.255 any
Switch(config-ext-nacl)# deny ip 192.168.50.0 0.0.0.255 192.168.20.0 0.0.0.255
Switch(config-ext-nacl)# deny ip 192.168.50.0 0.0.0.255 192.168.30.0 0.0.0.255
Switch(config-ext-nacl)# deny ip 192.168.50.0 0.0.0.255 192.168.40.0 0.0.0.255

Switch(config)# interface vlan 50
Switch(config-if)# ip access-group GUESTS_OUT out
```

### **Rule 2: Users can reach Servers (port 443 HTTPS, 3306 database, port 445 file share)**
```
Switch(config)# ip access-list extended USERS_TO_SERVERS
Switch(config-ext-nacl)# permit tcp 192.168.30.0 0.0.0.255 192.168.40.0 0.0.0.255 eq 443
Switch(config-ext-nacl)# permit tcp 192.168.30.0 0.0.0.255 192.168.40.10 0.0.0.0 eq 3306
Switch(config-ext-nacl)# permit tcp 192.168.30.0 0.0.0.255 192.168.40.11 0.0.0.0 eq 445
Switch(config-ext-nacl)# deny ip 192.168.30.0 0.0.0.255 192.168.40.0 0.0.0.255

Switch(config)# interface vlan 30
Switch(config-if)# ip access-group USERS_TO_SERVERS out
```

### **Rule 3: Servers cannot initiate connection to Users (one-way only)**
```
Switch(config)# ip access-list extended SERVERS_RESTRICTED
Switch(config-ext-nacl)# deny ip 192.168.40.0 0.0.0.255 192.168.30.0 0.0.0.255
Switch(config-ext-nacl)# deny ip 192.168.40.0 0.0.0.255 192.168.50.0 0.0.0.255
Switch(config-ext-nacl)# permit ip 192.168.40.0 0.0.0.255 any

Switch(config)# interface vlan 40
Switch(config-if)# ip access-group SERVERS_RESTRICTED out
```

### **Rule 4: Admin can reach everything (no restrictions)**
```
(Admin VLAN 20 has no ACL — can go anywhere)
```

---

## 📊 Network Summary Table

| VLAN | Name | IP Range | Gateway | Devices | Access Level | Purpose |
|------|------|----------|---------|---------|--------------|----------|
| 10 | DMZ | 192.168.10.0/24 | 192.168.10.1 | Web Server, Mail Server | Public + Admin | Public-facing services |
| 20 | Admin | 192.168.20.0/24 | 192.168.20.1 | Admin PC, Mgmt Server | All VLANs | Network management |
| 30 | Users | 192.168.30.0/24 | 192.168.30.1 | User PCs, Laptops | Internet + Servers (limited) | Employee workstations |
| 40 | Servers | 192.168.40.0/24 | 192.168.40.1 | Database, File Server | Admin + Users (limited) | Critical data |
| 50 | Guests | 192.168.50.0/24 | 192.168.50.1 | Guest PCs | Internet only | Visitors |

---

## 🧪 Testing & Verification (Packet Tracer)

### **Test 1: Verify VLAN Segmentation**
```
1. Ping from User PC (192.168.30.10) to Admin PC (192.168.20.10)
   Expected: ❌ FAILS (no direct access)

2. Ping from Admin PC (192.168.20.10) to User PC (192.168.30.10)
   Expected: ✅ SUCCESS (admin can reach users)

3. Ping from Guest PC (192.168.50.10) to User PC (192.168.30.10)
   Expected: ❌ FAILS (guests isolated)
```

### **Test 2: Verify Firewall Rules**
```
1. From Internet → Web Server (192.168.10.10) port 80
   Expected: ✅ SUCCESS (public server accessible)

2. From Internet → User PC (192.168.30.10)
   Expected: ❌ BLOCKED (internal only)

3. From DMZ → Internal Servers (192.168.40.0/24)
   Expected: ❌ BLOCKED (DMZ isolated)
```

### **Test 3: Verify DHCP Assignment**
```
1. Connect User PC and set network config to DHCP
   Expected: ✅ Receives IP from 192.168.30.0/24 pool

2. Connect Guest PC and set network config to DHCP
   Expected: ✅ Receives IP from 192.168.50.0/24 pool (short lease)
```

### **Test 4: Verify Server Access Control**
```
1. User PC tries SSH to Database Server (port 22)
   Expected: ❌ BLOCKED (users only get HTTPS/specific ports)

2. User PC tries HTTPS to Database Server (port 443)
   Expected: ✅ SUCCESS (allowed service)
```

---

## 🎓 Learning Outcomes

✅ **Network Segmentation** — Understanding why VLANs separate traffic
✅ **Firewall Concepts** — How access control lists protect networks
✅ **DMZ Design** — Why public servers are isolated
✅ **Defense in Depth** — Multiple security layers working together
✅ **Incident Response** — If one zone is compromised, others are protected
✅ **SOC Analyst Skills** — Detecting unauthorized VLAN-to-VLAN traffic

---

## 🚀 How to Use This in Packet Tracer

1. **Create devices:** 2 Routers, 1 Switch (Layer 3), 5 PCs, 2 Servers
2. **Configure VLANs:** Use VLAN config commands above
3. **Set static IPs:** Follow IP scheme from each VLAN section
4. **Add ACLs:** Copy security rules for each VLAN
5. **Test connectivity:** Use ping and tracert commands
6. **Document:** Screenshot each test result
7. **Explain:** Write down WHY each test passed/failed

---

## 📸 Portfolio Documentation Tips

For your Ausbildung portfolio, include:
- Network diagram (topology)
- VLAN purpose table
- Configuration commands for each device
- Test results (screenshots of pings)
- Security explanation (why each rule exists)
- Lessons learned (what this teaches about cybersecurity)

---

**Version:** 1.0 | **Level:** Intermediate | **Time to Complete:** 3-4 hours | **Portfolio Ready:** ✅ YES
