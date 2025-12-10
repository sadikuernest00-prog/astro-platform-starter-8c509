import { useState } from "react";
import { ethers } from "ethers";

export default function ConnectWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  async function handleConnect() {
    try {
      setConnecting(true);
      setError(null);

      const anyWindow = window as any;
      const ethereum = anyWindow.ethereum;

      if (!ethereum) {
        setError("No wallet found. Install MetaMask or another Web3 wallet.");
        return;
      }

      const provider = new ethers.BrowserProvider(ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const addr = await signer.getAddress();

      setAddress(addr);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to connect wallet");
    } finally {
      setConnecting(false);
    }
  }

  const shortAddress =
    address && `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "360px",
      }}
    >
      <button
        onClick={handleConnect}
        disabled={connecting}
        style={{
          padding: "10px 18px",
          borderRadius: "999px",
          border: "none",
          fontWeight: 600,
          fontSize: "14px",
          cursor: "pointer",
          background: "#2563eb",
          color: "white",
        }}
      >
        {address
          ? "Wallet connected"
          : connecting
          ? "Connecting…"
          : "Connect wallet"}
      </button>

      {address && (
        <p style={{ fontSize: "14px" }}>
          Connected address: <code>{shortAddress}</code>
        </p>
      )}

      {error && (
        <p style={{ fontSize: "13px", color: "#dc2626" }}>
          {error}
        </p>
      )}

      <p style={{ fontSize: "12px", color: "#6b7280" }}>
        Hardware wallets (Ledger, Trezor, etc.) can be used by connecting them
        through MetaMask or another Web3 wallet in your browser.
      </p>
    </div>
  );
}
