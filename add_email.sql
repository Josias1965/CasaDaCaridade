-- 1. Adicionar coluna email
ALTER TABLE user_profiles ADD COLUMN email text;

-- 2. Atualizar permissões (RLS)
-- Remover políticas antigas se necessário ou garantir novas
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Ver se a política de SELECT já existe, senão cria:
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Permitir leitura para autenticados') THEN
        CREATE POLICY "Permitir leitura para autenticados" 
        ON user_profiles FOR SELECT 
        TO authenticated 
        USING (true);
    END IF;
END
$$;

-- Permitir que novos perfis sejam inseridos durante o registro
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Permitir inserção de perfil próprio') THEN
        CREATE POLICY "Permitir inserção de perfil próprio" 
        ON user_profiles FOR INSERT 
        WITH CHECK (auth.uid() = id);
    END IF;
END
$$;
