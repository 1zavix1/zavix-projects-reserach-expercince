#!/usr/bin/env python3
"""
TCP Port Scanner - Hardened Educational Edition

A professional TCP port scanner with enhanced security, logging, and
resource management. Suitable for authorized network reconnaissance and
educational purposes.

Author: Zavix
Version: 1.1.0
Last Updated: September 2026
"""

import argparse
import socket
import sys
import time
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(levelname)s] %(message)s'
)
logger = logging.getLogger(__name__)

VERSION = "1.1.0"


def scan_port(target: str, port: int, timeout: float) -> Optional[int]:
    """
    Try to establish a TCP connection to a single port.

    Args:
        target: Target IP address or hostname
        port: Port number to scan
        timeout: Socket timeout in seconds

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
    except OSError as e:
        # Log unexpected errors (except connection refused/timeout)
        if e.errno not in [socket.errno.ECONNREFUSED, socket.errno.ETIMEDOUT, socket.errno.ENETUNREACH]:
            logger.debug(f"Unexpected error on port {port}: {e}")
        return None
    return None


def scan_ports(
    target: str,
    start_port: int,
    end_port: int,
    timeout: float,
    workers: int,
    rate_limit: float,
) -> List[int]:
    """
    Scan a range of TCP ports with rate limiting and batch processing.

    Args:
        target: Target IP address
        start_port: First port to scan
        end_port: Last port to scan
        timeout: Socket timeout in seconds
        workers: Number of concurrent threads
        rate_limit: Seconds to pause between batches

    Returns:
        List of open ports in sorted order
    """
    open_ports: List[int] = []
    total_ports = end_port - start_port + 1
    logger.info(f"Scanning {total_ports} ports with {workers} workers")

    # Process in batches to limit memory usage
    BATCH_SIZE = min(1000, total_ports)

    with ThreadPoolExecutor(max_workers=workers) as executor:
        for batch_start in range(start_port, end_port + 1, BATCH_SIZE):
            batch_end = min(batch_start + BATCH_SIZE - 1, end_port)
            futures = {
                executor.submit(scan_port, target, port, timeout): port
                for port in range(batch_start, batch_end + 1)
            }

            for future in as_completed(futures):
                port = future.result()
                if port is not None:
                    open_ports.append(port)
                    print(f"[+] Port {port}/tcp is OPEN")

            # Rate limiting: pause between batches
            if rate_limit > 0 and batch_end < end_port:
                time.sleep(rate_limit)

    return sorted(open_ports)


def parse_arguments() -> argparse.Namespace:
    """
    Parse and validate command-line arguments.

    Returns:
        Parsed arguments namespace
    """
    parser = argparse.ArgumentParser(
        description="Educational TCP port scanner for authorized testing.",
        epilog="⚠️  Only scan systems you own or have explicit permission to test. Unauthorized scanning is illegal."
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
        help="Number of concurrent workers (default: 50, max: 200)"
    )

    parser.add_argument(
        "--rate-limit",
        type=float,
        default=0.0,
        help="Seconds to pause between batches (default: 0, use to reduce load)"
    )

    parser.add_argument(
        "--version",
        action="version",
        version=f"Port Scanner v{VERSION}"
    )

    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Enable debug logging"
    )

    args = parser.parse_args()

    # Validation
    if not 1 <= args.start <= 65535:
        parser.error("--start must be between 1 and 65535")
    if not 1 <= args.end <= 65535:
        parser.error("--end must be between 1 and 65535")
    if args.start > args.end:
        parser.error("--start cannot be greater than --end")
    if args.timeout <= 0:
        parser.error("--timeout must be greater than 0")
    if not 1 <= args.workers <= 200:
        parser.error("--workers must be between 1 and 200")
    if args.rate_limit < 0:
        parser.error("--rate-limit must be >= 0")

    if args.verbose:
        logger.setLevel(logging.DEBUG)

    return args


def main() -> None:
    """Program entry point with graceful error handling."""
    try:
        args = parse_arguments()

        try:
            target_ip = socket.gethostbyname(args.target)
        except socket.gaierror:
            logger.error(f"Unable to resolve hostname: {args.target}")
            sys.exit(1)

        print("=" * 50)
        print(f"TCP Port Scanner v{VERSION}")
        print("=" * 50)
        print(f"Target : {args.target}")
        print(f"IP     : {target_ip}")
        print(f"Ports  : {args.start}-{args.end}")
        print(f"Workers: {args.workers}")
        if args.rate_limit > 0:
            print(f"Rate Limit: {args.rate_limit}s between batches")
        print()

        try:
            open_ports = scan_ports(
                target_ip,
                args.start,
                args.end,
                args.timeout,
                args.workers,
                args.rate_limit,
            )
        except ValueError as exc:
            logger.error(f"Error: {exc}")
            sys.exit(1)

        print()
        print("=" * 50)
        print(f"Scan complete. Open ports found: {len(open_ports)}")
        print("=" * 50)

        if open_ports:
            print("Open ports:", ", ".join(map(str, open_ports)))
        else:
            print("No open TCP ports found in the selected range.")

    except KeyboardInterrupt:
        print("\n[!] Scan interrupted by user.")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()