import './style.css';
import './wdyr';
import { createRoot } from 'react-dom/client';

const App = () => {
  return (
    <div>
      <h1 className="text-4xl text-[#09F]">Web AI Dapp</h1>
    </div>
  );
};

const container = document.getElementById('app');
if (!container) {
  throw new Error('Failed to find the root element');
}
const root = createRoot(container);

root.render(<App />);
