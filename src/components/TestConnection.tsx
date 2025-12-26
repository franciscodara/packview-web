import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function TestConnection() {
  const [results, setResults] = useState<Array<{ status: 'success' | 'error', message: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testConnection();
  }, []);

  async function testConnection() {
    setLoading(true);
    const testResults: Array<{ status: 'success' | 'error'; message: string }> = [];

    // Teste 1: Verificar se as variáveis de ambiente existem
    const hasUrl = !!import.meta.env.VITE_SUPABASE_URL;
    const hasKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (hasUrl && hasKey) {
      testResults.push({ 
        status: 'success', 
        message: 'Variáveis VITE_ encontradas no .env' 
      });
    } else {
      testResults.push({ 
        status: 'error', 
        message: 'Variáveis VITE_ não encontradas (reinicie o servidor!)' 
      });
    }

    // Teste 2: Conexão com Supabase
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      testResults.push({ 
        status: 'success', 
        message: 'Conexão com Supabase Auth estabelecida' 
      });
    } catch (error: any) {
      testResults.push({ 
        status: 'error', 
        message: 'Erro na conexão Auth: ' + error.message 
      });
    }

    // Teste 3: Acesso ao banco de dados
    try {
      const { error } = await supabase.from('profiles').select('count');
      if (error) throw error;
      testResults.push({ 
        status: 'success', 
        message: 'Banco de dados acessível (tabela profiles OK)' 
      });
    } catch (error: any) {
      testResults.push({ 
        status: 'error', 
        message: 'Erro no banco: ' + error.message 
      });
    }

    // Teste 4: Storage
    try {
      const { data, error } = await supabase.storage.listBuckets();
      if (error) throw error;
      const hasPostImages = data.some(bucket => bucket.name === 'post-images');
      
      if (hasPostImages) {
        testResults.push({ 
          status: 'success', 
          message: 'Storage configurado (bucket post-images encontrado)' 
        });
      } else {
        testResults.push({ 
          status: 'error', 
          message: 'Bucket post-images não encontrado' 
        });
      }
    } catch (error: any) {
      testResults.push({ 
        status: 'error', 
        message: 'Erro ao verificar storage: ' + error.message 
      });
    }

    setResults(testResults);
    setLoading(false);
  }

  const allSuccess = results.every(r => r.status === 'success');
  const hasErrors = results.some(r => r.status === 'error');

  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '15px',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>
          {loading ? '🔄 Testando conexão...' : 
           allSuccess ? '✅ Packview configurado com sucesso!' :
           hasErrors ? '⚠️ Alguns testes falharam' : 
           '🎯 Testes completos'}
        </h1>
        <p style={{ margin: 0, opacity: 0.9 }}>
          Verificando configuração do Supabase
        </p>
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: '15px', 
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        {results.map((result, i) => (
          <div key={i} style={{ 
            marginBottom: '15px',
            padding: '15px',
            borderRadius: '8px',
            background: result.status === 'success' ? '#f0fdf4' : '#fef2f2',
            border: result.status === 'success' ? '2px solid #22c55e' : '2px solid #ef4444'
          }}>
            <div style={{ 
              fontSize: '18px',
              fontWeight: 'bold',
              color: result.status === 'success' ? '#16a34a' : '#dc2626',
              marginBottom: '5px'
            }}>
              {result.status === 'success' ? '✅' : '❌'} 
              {result.status === 'success' ? 'SUCESSO' : 'ERRO'}
            </div>
            <div style={{ color: '#374151' }}>
              {result.message}
            </div>
          </div>
        ))}

        <button 
          onClick={testConnection}
          style={{
            marginTop: '20px',
            padding: '15px 30px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          🔄 Testar Novamente
        </button>
      </div>

      {allSuccess && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: '#fef3c7',
          borderRadius: '15px',
          border: '2px solid #f59e0b'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🎉 Parabéns!</div>
          <div style={{ color: '#92400e' }}>
            Seu ambiente está 100% configurado. Agora você pode começar a desenvolver os componentes do Packview!
          </div>
        </div>
      )}
    </div>
  );
}