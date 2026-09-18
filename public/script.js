document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('chat-form');
  const input = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');

  let conversation = [];
  let pending = false;
  let msgIdCounter = 0;
  const REQUEST_TIMEOUT_MS = 30000;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (pending) return;

    const userText = input.value.trim();
    if (!userText) return;

    // Add user message to UI and conversation state
    appendMessage('user', userText);
    conversation.push({ role: 'user', text: userText });

    // Clear input and prepare UI for pending request
    input.value = '';
    input.focus();

    // Add temporary Thinking... message and remember its id so we can replace it
    const thinkingId = appendMessage('model', 'Thinking...', { temporary: true });

    pending = true;
    setControlsDisabled(true);

    try {
      const result = await postConversation(conversation, REQUEST_TIMEOUT_MS);

      // Expected response shape: { result: "<text>" }
      const aiText = result && typeof result.result === 'string' ? result.result : null;

      if (aiText && aiText.length > 0) {
        replaceMessageText(thinkingId, aiText);
        conversation.push({ role: 'model', text: aiText });
      } else {
        replaceMessageText(thinkingId, 'Sorry, no response received.');
      }
    } catch (err) {
      console.error('Chat error:', err);
      replaceMessageText(thinkingId, 'Failed to get response from server.');
    } finally {
      pending = false;
      setControlsDisabled(false);
      scrollChatToBottom();
    }
  });

  // Append a message to the chat box. Returns a message id for later updates.
  function appendMessage(sender, text, { temporary = false } = {}) {
    const id = `msg-${++msgIdCounter}`;
    const wrapper = document.createElement('div');
    wrapper.className = `message ${sender}`;
    wrapper.dataset.id = id;

    const content = document.createElement('div');
    content.className = 'message-content';
    content.textContent = text;

    if (temporary) {
      wrapper.classList.add('is-thinking');
    }

    wrapper.appendChild(content);
    chatBox.appendChild(wrapper);
    scrollChatToBottom();
    return id;
  }

  // Replace text for a previously added message by id
  function replaceMessageText(messageId, newText) {
    const el = chatBox.querySelector(`[data-id="${messageId}"]`);
    if (!el) {
      // Fallback: append a new message if original can't be found
      appendMessage('model', newText);
      return;
    }
    const content = el.querySelector('.message-content');
    if (content) {
      content.textContent = newText;
    } else {
      el.textContent = newText;
    }
    el.classList.remove('is-thinking');
    scrollChatToBottom();
  }

  function scrollChatToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function setControlsDisabled(disabled) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = disabled;
    input.disabled = disabled;
  }

  // Send the conversation to the backend with a timeout and return parsed JSON
  async function postConversation(conversationPayload, timeoutMs) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation: conversationPayload }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!resp.ok) {
        // Try to parse error body if available
        let errText = resp.statusText;
        try {
          const json = await resp.json();
          if (json && json.error) errText = json.error;
        } catch (e) {
          // ignore JSON parse errors
        }
        throw new Error(`Server responded with ${resp.status}: ${errText}`);
      }

      // Parse successful response
      const data = await resp.json();
      return data;
    } catch (err) {
      // Normalize abort error for clearer messaging
      if (err.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }
});
