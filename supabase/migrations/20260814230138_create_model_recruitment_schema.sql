/*
# Cria Studios - model recruitment chat & admin schema

## O que essa alteração faz (resumo simples)
Cria a base de dados para o site da Cria Studios: o chat onde visitantes
conversam com o admin para se candidatarem a modelo, e o painel do admin
que atende a fila, registra os dados da candidata e libera as plataformas
de transmissão para ela.

## Novas tabelas
1. `conversations` - uma linha por visitante que abre o chat.
   - `visitor_token` (uuid): identificador anônimo gerado no navegador da
     visitante e guardado localmente, usado para ela encontrar sua própria
     conversa sem precisar de login.
   - `protocol` (texto gerado automaticamente, ex: CRIA-00001): número de
     protocolo que a candidata pode usar para acompanhar o atendimento.
   - `name`, `age`, `whatsapp`: dados do cadastro (idade mínima 18 anos,
     validada no banco).
   - `status`: novo / em_atendimento / cadastro_concluido.
2. `messages` - mensagens trocadas no chat (uma por visitante ou admin).
3. `conversation_platforms` - quais plataformas (Stripchat, Cam4,
   CameraPrive, Chaturbate, SkyPrivate) o admin já liberou para cada
   candidata.

## Segurança
- RLS habilitado nas 3 tabelas.
- Visitantes (função anônima) NÃO têm acesso direto às tabelas. Todo
  acesso de visitante passa por funções seguras (`start_conversation`,
  `get_my_conversation`, `send_visitor_message`, `submit_registration`)
  que só enxergam/alteram a conversa cujo `visitor_token` bate com o
  informado - assim uma visitante nunca vê dados de outra.
- O admin (usuário autenticado com o e-mail fixo do estúdio) tem acesso
  total via políticas de RLS que conferem o e-mail da sessão, então
  mesmo que outra conta seja criada no futuro, ela não enxerga estes
  dados.
- É criada a conta de login do admin em `auth.users` (e-mail e senha
  fornecidos), caso ainda não exista.

## Notas importantes
1. Nenhuma mensagem de erro ou dado sensível é exposto sem checagem.
2. Idade mínima de 18 anos é obrigatória, tanto no banco quanto na tela.
*/

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_token uuid NOT NULL UNIQUE,
  protocol_number bigserial NOT NULL,
  protocol text GENERATED ALWAYS AS ('CRIA-' || lpad(protocol_number::text, 5, '0')) STORED,
  name text,
  age integer CHECK (age IS NULL OR (age >= 18 AND age <= 90)),
  whatsapp text,
  status text NOT NULL DEFAULT 'novo' CHECK (status IN ('novo', 'em_atendimento', 'cadastro_concluido')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS conversations_status_idx ON conversations(status);
CREATE INDEX IF NOT EXISTS conversations_created_at_idx ON conversations(created_at);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender text NOT NULL CHECK (sender IN ('visitor', 'admin')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_conversation_id_idx ON messages(conversation_id, created_at);

CREATE TABLE IF NOT EXISTS conversation_platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('stripchat', 'cam4', 'cameraprive', 'chaturbate', 'skyprivate')),
  enabled_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (conversation_id, platform)
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_platforms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_select_conversations" ON conversations;
CREATE POLICY "admin_select_conversations" ON conversations FOR SELECT
  TO authenticated USING (auth.jwt() ->> 'email' = 'criapitbull@icloud.com');
DROP POLICY IF EXISTS "admin_insert_conversations" ON conversations;
CREATE POLICY "admin_insert_conversations" ON conversations FOR INSERT
  TO authenticated WITH CHECK (auth.jwt() ->> 'email' = 'criapitbull@icloud.com');
DROP POLICY IF EXISTS "admin_update_conversations" ON conversations;
CREATE POLICY "admin_update_conversations" ON conversations FOR UPDATE
  TO authenticated USING (auth.jwt() ->> 'email' = 'criapitbull@icloud.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'criapitbull@icloud.com');
DROP POLICY IF EXISTS "admin_delete_conversations" ON conversations;
CREATE POLICY "admin_delete_conversations" ON conversations FOR DELETE
  TO authenticated USING (auth.jwt() ->> 'email' = 'criapitbull@icloud.com');

DROP POLICY IF EXISTS "admin_select_messages" ON messages;
CREATE POLICY "admin_select_messages" ON messages FOR SELECT
  TO authenticated USING (auth.jwt() ->> 'email' = 'criapitbull@icloud.com');
DROP POLICY IF EXISTS "admin_insert_messages" ON messages;
CREATE POLICY "admin_insert_messages" ON messages FOR INSERT
  TO authenticated WITH CHECK (auth.jwt() ->> 'email' = 'criapitbull@icloud.com');
DROP POLICY IF EXISTS "admin_update_messages" ON messages;
CREATE POLICY "admin_update_messages" ON messages FOR UPDATE
  TO authenticated USING (auth.jwt() ->> 'email' = 'criapitbull@icloud.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'criapitbull@icloud.com');
DROP POLICY IF EXISTS "admin_delete_messages" ON messages;
CREATE POLICY "admin_delete_messages" ON messages FOR DELETE
  TO authenticated USING (auth.jwt() ->> 'email' = 'criapitbull@icloud.com');

DROP POLICY IF EXISTS "admin_select_platforms" ON conversation_platforms;
CREATE POLICY "admin_select_platforms" ON conversation_platforms FOR SELECT
  TO authenticated USING (auth.jwt() ->> 'email' = 'criapitbull@icloud.com');
DROP POLICY IF EXISTS "admin_insert_platforms" ON conversation_platforms;
CREATE POLICY "admin_insert_platforms" ON conversation_platforms FOR INSERT
  TO authenticated WITH CHECK (auth.jwt() ->> 'email' = 'criapitbull@icloud.com');
DROP POLICY IF EXISTS "admin_update_platforms" ON conversation_platforms;
CREATE POLICY "admin_update_platforms" ON conversation_platforms FOR UPDATE
  TO authenticated USING (auth.jwt() ->> 'email' = 'criapitbull@icloud.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'criapitbull@icloud.com');
DROP POLICY IF EXISTS "admin_delete_platforms" ON conversation_platforms;
CREATE POLICY "admin_delete_platforms" ON conversation_platforms FOR DELETE
  TO authenticated USING (auth.jwt() ->> 'email' = 'criapitbull@icloud.com');

CREATE OR REPLACE FUNCTION get_my_conversation(p_visitor_token uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_conv conversations%ROWTYPE;
  v_result json;
BEGIN
  SELECT * INTO v_conv FROM conversations WHERE visitor_token = p_visitor_token;
  IF v_conv.id IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT json_build_object(
    'id', v_conv.id,
    'protocol', v_conv.protocol,
    'name', v_conv.name,
    'age', v_conv.age,
    'whatsapp', v_conv.whatsapp,
    'status', v_conv.status,
    'created_at', v_conv.created_at,
    'messages', (
      SELECT coalesce(json_agg(json_build_object(
        'id', m.id, 'sender', m.sender, 'content', m.content, 'created_at', m.created_at
      ) ORDER BY m.created_at), '[]'::json)
      FROM messages m WHERE m.conversation_id = v_conv.id
    ),
    'platforms', (
      SELECT coalesce(json_agg(cp.platform), '[]'::json)
      FROM conversation_platforms cp WHERE cp.conversation_id = v_conv.id
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION start_conversation(p_visitor_token uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  IF p_visitor_token IS NULL THEN
    RAISE EXCEPTION 'Token inválido';
  END IF;

  SELECT id INTO v_id FROM conversations WHERE visitor_token = p_visitor_token;
  IF v_id IS NULL THEN
    INSERT INTO conversations (visitor_token) VALUES (p_visitor_token) RETURNING id INTO v_id;
  END IF;

  RETURN get_my_conversation(p_visitor_token);
END;
$$;

CREATE OR REPLACE FUNCTION send_visitor_message(p_visitor_token uuid, p_content text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  IF p_visitor_token IS NULL THEN
    RAISE EXCEPTION 'Token inválido';
  END IF;
  IF p_content IS NULL OR length(trim(p_content)) = 0 THEN
    RAISE EXCEPTION 'Mensagem vazia';
  END IF;
  IF length(p_content) > 2000 THEN
    RAISE EXCEPTION 'Mensagem muito longa';
  END IF;

  SELECT id INTO v_id FROM conversations WHERE visitor_token = p_visitor_token;
  IF v_id IS NULL THEN
    INSERT INTO conversations (visitor_token) VALUES (p_visitor_token) RETURNING id INTO v_id;
  END IF;

  INSERT INTO messages (conversation_id, sender, content) VALUES (v_id, 'visitor', trim(p_content));
  UPDATE conversations SET updated_at = now() WHERE id = v_id;

  RETURN get_my_conversation(p_visitor_token);
END;
$$;

CREATE OR REPLACE FUNCTION submit_registration(p_visitor_token uuid, p_name text, p_age int, p_whatsapp text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  IF p_visitor_token IS NULL THEN
    RAISE EXCEPTION 'Token inválido';
  END IF;
  IF p_name IS NULL OR length(trim(p_name)) < 2 THEN
    RAISE EXCEPTION 'Nome inválido';
  END IF;
  IF p_age IS NULL OR p_age < 18 OR p_age > 90 THEN
    RAISE EXCEPTION 'Idade inválida. É necessário ter 18 anos ou mais.';
  END IF;
  IF p_whatsapp IS NULL OR length(regexp_replace(p_whatsapp, '\D', '', 'g')) < 10 THEN
    RAISE EXCEPTION 'Número de WhatsApp inválido';
  END IF;

  SELECT id INTO v_id FROM conversations WHERE visitor_token = p_visitor_token;
  IF v_id IS NULL THEN
    INSERT INTO conversations (visitor_token) VALUES (p_visitor_token) RETURNING id INTO v_id;
  END IF;

  UPDATE conversations
  SET name = trim(p_name), age = p_age, whatsapp = trim(p_whatsapp), status = 'em_atendimento', updated_at = now()
  WHERE id = v_id;

  INSERT INTO messages (conversation_id, sender, content)
  VALUES (v_id, 'visitor', format('Cadastro enviado: %s, %s anos, WhatsApp %s', trim(p_name), p_age, trim(p_whatsapp)));

  RETURN get_my_conversation(p_visitor_token);
END;
$$;

REVOKE ALL ON FUNCTION get_my_conversation(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION start_conversation(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION send_visitor_message(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION submit_registration(uuid, text, int, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION get_my_conversation(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION start_conversation(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION send_visitor_message(uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION submit_registration(uuid, text, int, text) TO anon, authenticated;

DO $$
DECLARE
  v_admin_id uuid;
BEGIN
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'criapitbull@icloud.com';

  IF v_admin_id IS NULL THEN
    v_admin_id := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change,
      email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_admin_id, 'authenticated', 'authenticated',
      'criapitbull@icloud.com', crypt('Cria20231998@', gen_salt('bf')),
      now(), '{"provider":"email","providers":["email"]}', '{}',
      now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_admin_id,
      jsonb_build_object('sub', v_admin_id::text, 'email', 'criapitbull@icloud.com'),
      'email', v_admin_id::text, now(), now(), now()
    );
  END IF;
END $$;
