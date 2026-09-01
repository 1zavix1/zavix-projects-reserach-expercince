#!/usr/bin/env python3
"""
TCP Port Scanner
----------------
Simple educational TCP port scanner for authorized systems.

Usage:
    python3 port_scanner.py 127.0.0.1
    python3 port_scanner.py 192.168.1.10 --start 1 --end 1000

Only scan systems/networks you own or have explicit permission to test.
"""

import argparse
import socket
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List


def scan_port(target: str, port: int, timeout: float) -> int | None:
    """
    Try to establish a TCP connection to a single port.

    Returns:
        The port number if open, otherwise None.
    """
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(timeout)
            result = sock.connect_ex((target, port))

            if result == 0:
                return port

    except socket.gaierror:
        raise ValueError(f"Could not resolve target: {target}")
    except OSError:
        return None

    return None


def scan_ports(
    target: str,
    start_port: int,
    end_port: int,
    timeout: float,
    workers: int,
) -> List[int]:
    """Scan a range of TCP ports concurrently."""

    open_ports: List[int] = []

    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = {
            executor.submit(scan_port, target, port, timeout): port
            for port in range(start_port, end_port + 1)
        }

        for future in as_completed(futures):
            port = future.result()

            if port is not None:
                open_ports.append(port)
                print(f"[+] Port {port}/tcp is OPEN")

    return sorted(open_ports)


def parse_arguments() -> argparse.Namespace:
    """Parse command-line arguments."""

    parser = argparse.ArgumentParser(
        description="Educational TCP port scanner."
    )

    parser.add_argument(
        "target",
        help="Target hostname or IP address"
    )

    parser.add_argument(
        "--start",
        type=int,
        default=1,
        help="First port to scan (default: 1)"
    )

    parser.add_argument(
        "--end",
        type=int,
        default=1000,
        help="Last port to scan (default: 1000)"
    )

    parser.add_argument(
        "--timeout",
        type=float,
        default=0.5,
        help="Socket timeout in seconds (default: 0.5)"
    )

    parser.add_argument(
        "--workers",
        type=int,
        default=50,
        help="Number of concurrent workers (default: 50)"
    )

    args = parser.parse_args()

    if not 1 <= args.start <= 65535:
        parser.error("--start must be between 1 and 65535")

    if not 1 <= args.end <= 65535:
        parser.error("--end must be between 1 and 65535")

    if args.start > args.end:
        parser.error("--start cannot be greater than --end")

    if args.timeout <= 0:
        parser.error("--timeout must be greater than 0")

    if not 1 <= args.workers <= 500:
        parser.error("--workers must be between 1 and 500")

    return args


def main() -> None:
    """Program entry point."""

    args = parse_arguments()

    try:
        target_ip = socket.gethostbyname(args.target)
    except socket.gaierror:
        print(f"[-] Unable to resolve hostname: {args.target}")
        return

    print("=" * 50)
    print("TCP Port Scanner")
    print("=" * 50)
    print(f"Target : {args.target}")
    print(f"IP     : {target_ip}")
    print(f"Ports  : {args.start}-{args.end}")
    print()

    try:
        open_ports = scan_ports(
            target_ip,
            args.start,
            args.end,
            args.timeout,
            args.workers,
        )
    except ValueError as exc:
        print(f"[-] Error: {exc}")
        return

    print()
    print("=" * 50)
    print(f"Scan complete. Open ports found: {len(open_ports)}")
    print("=" * 50)

    if open_ports:
        print("Open ports:", ", ".join(map(str, open_ports)))
    else:
        print("No open TCP ports found in the selected range.")


if __name__ == "__main__":
    main()