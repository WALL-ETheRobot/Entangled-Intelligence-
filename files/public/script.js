document.getElementById('themeSelector').addEventListener('change', function() {
    const theme = this.value;
    document.body.className = theme;
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileContent = e.target.result;
            let language = 'javascript';
            const ext = file.name.split('.').pop().toLowerCase();
            switch (ext) {
                case 'py': language = 'python'; break;
                case 'html':
                case 'xml': language = 'markup'; break;
                case 'css': language = 'css'; break;
                case 'java': language = 'java'; break;
                case 'cpp':
                case 'c': language = 'cpp'; break;
                case 'json': language = 'json'; break;
                case 'sh': language = 'bash'; break;
                case 'md': displayMarkdown(fileContent); return;
            }
            displayCode(fileContent, language);
        };
        reader.readAsText(file);
    }
});

function displayCode(code, language) {
    const codeElement = document.querySelector('#codePreview code');
    codeElement.textContent = code;
    codeElement.className = `language-${language}`;
    Prism.highlightElement(codeElement);
}

function displayMarkdown(mdContent) {
    const codeElement = document.querySelector('#codePreview code');
    codeElement.className = 'language-html';
    codeElement.innerHTML = marked.parse(mdContent);
}

document.getElementById('promptTemplates').addEventListener('change', function() {
    document.getElementById('prompt').value = this.value;
});

function sendMessage(message, sender) {
    const chatHistory = document.getElementById('chatHistory');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    chatHistory.appendChild(messageElement);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

async function sendPrompt() {
    const promptText = document.getElementById('prompt').value;
    if (promptText.trim() !== '') {
        sendMessage(promptText, 'user');
        sendMessage("Thinking...", 'ai');
        try {
            const response = await fetch("/ask", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: promptText })
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            document.querySelector(".message.ai:last-child").innerHTML = marked.parse(data.response || "[No response]");
        } catch (err) {
            document.querySelector(".message.ai:last-child").textContent = `❌ Error: ${err.message}`;
        }
        document.getElementById('prompt').value = '';
    }
}

function toggleListening() {
    alert('Voice input is not yet implemented.');
}

function scrollToTop() {
    document.getElementById('chatHistory').scrollTop = 0;
}
function scrollToBottom() {
    const chatHistory = document.getElementById('chatHistory');
    chatHistory.scrollTop = chatHistory.scrollHeight;
}
function clearChat() {
    document.getElementById('chatHistory').innerHTML = '';
}