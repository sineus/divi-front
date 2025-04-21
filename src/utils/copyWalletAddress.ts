export function copyWalletAddress(address: string) {
  navigator.clipboard.writeText(address);
}
