import { ConnectKitButton } from 'connectkit';

export default function WalletConnect() {
  return (
    <ConnectKitButton 
      theme="auto"
      showBalance={true}
      showAvatar={true}
    />
  );
}