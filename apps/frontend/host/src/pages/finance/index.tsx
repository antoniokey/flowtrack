import { useEffect } from 'react';

const FINANCE_URL = process.env.NEXT_PUBLIC_FINANCE_URL ?? 'http://localhost:3004';
const FINANCE_SCRIPT_ID = 'finance-script';

export default function FinancePage() {
  useEffect(() => {
    if (customElements.get('finance-app') || document.getElementById(FINANCE_SCRIPT_ID)) {
      return;
    }

    // Angular build output is ESM, so it has to be loaded as a module script.
    const script = document.createElement('script');
    script.id = FINANCE_SCRIPT_ID;
    script.type = 'module';
    script.src = `${FINANCE_URL}/main.js`;
    document.body.appendChild(script);
  }, []);

  return (
    <finance-app />
  );
}
