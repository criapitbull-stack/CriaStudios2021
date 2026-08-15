/*
# Resposta automática no chat

## O que faz
Quando uma visitante envia qualquer mensagem no chat, uma resposta
automática é inserida como se fosse do "admin", com o texto:
"Olá! Se cadastre no site ou mande mensagem no WhatsApp 71993559126."

Isso garante que toda visitante receba um retorno imediato, mesmo que
o admin não esteja online.

## Alterações
- Função `send_visitor_message` agora insere a mensagem da visitante
  e em seguida insere uma resposta automática do "admin".
- Nenhuma tabela nova, nenhum dado perdido.
*/

CREATE OR REPLACE FUNCTION send_visitor_message(p_visitor_token uuid, p_content text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_auto_reply text := 'Olá! Se cadastre no site ou mande mensagem no WhatsApp 71993559126.';
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
  INSERT INTO messages (conversation_id, sender, content) VALUES (v_id, 'admin', v_auto_reply);
  UPDATE conversations SET updated_at = now() WHERE id = v_id;

  RETURN get_my_conversation(p_visitor_token);
END;
$$;

REVOKE ALL ON FUNCTION send_visitor_message(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION send_visitor_message(uuid, text) TO anon, authenticated;
