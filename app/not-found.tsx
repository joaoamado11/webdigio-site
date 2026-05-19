import Link from 'next/link';

// Skip static prerendering — avoids Windows case-mismatch React duplication bug
export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050508',
        color: '#f1f5f9',
        fontFamily: 'system-ui, sans-serif',
        gap: '1rem',
      }}
    >
      <h1 style={{ fontSize: '4rem', fontWeight: 900, margin: 0, color: '#3b82f6' }}>404</h1>
      <p style={{ color: '#94a3b8', margin: 0 }}>Página não encontrada.</p>
      <Link href="/" style={{ color: '#60a5fa', textDecoration: 'underline', marginTop: '0.5rem' }}>
        Voltar ao início
      </Link>
    </div>
  );
}
