// Function to extract relevant content from the main article body
function extractTextFromWikipedia() {
    const contentSelectors = [
        '.mw-parser-output', // Standard article body
        '#mp-upper', // Some specific sections (e.g., homepage content)
        '.toc', // Table of Contents (optional, if relevant)
        '#content', // For special cases
        'h2', // Section headers (helpful to identify the structure)
        'p' // Paragraphs for content
    ];

    let content = '';
    contentSelectors.forEach(selector => {
        const sections = document.querySelectorAll(selector);
        sections.forEach(section => {
            content += section.innerText + " ";
        });
    });

    return content.trim();
}

// Function to intelligently summarize the full text by selecting important content
function summarizeText(text) {
    const sentences = text.split('.').filter(sentence => sentence.trim().length > 0);

    const summarySentences = sentences.slice(0, 10); // Get first 10 sentences for a basic summary

    const keywords = ["introduction", "summary", "conclusion", "key points"];
    const importantSentences = sentences.filter(sentence =>
        keywords.some(keyword => sentence.toLowerCase().includes(keyword))
    );

    const finalSummary = importantSentences.length > 0 ? importantSentences.join('.') : summarySentences.join('.');

    return finalSummary + '.';
}

// Randomly select a theme color for the summary box
const themes = [
    { background: '#a7c7e7', header: '#6fa3d1', text: '#ffffff', buttonBackground: '#98aadd', buttonText: '#ffffff', buttonHover: '#7e90b0', scrollbarTrack: '#e1f1f8', scrollbarThumb: '#6492b1' },
    { background: '#f0d3e0', header: '#f1a2c7', text: '#4b0000', buttonBackground: '#f4c4d9', buttonText: '#4b0000', buttonHover: '#c79db5', scrollbarTrack: '#ffe2f1', scrollbarThumb: '#b6828b' },
    { background: '#f1e1b1', header: '#c89d63', text: '#3e2a47', buttonBackground: '#d1b381', buttonText: '#ffffff', buttonHover: '#c2a76f', scrollbarTrack: '#f7e8c2', scrollbarThumb: '#bc9e71' },
    { background: '#e3f2f9', header: '#89b5cf', text: '#000000', buttonBackground: '#aad6f4', buttonText: '#ffffff', buttonHover: '#8db0cc', scrollbarTrack: '#d6e6f7', scrollbarThumb: '#80a7c2' },
    { background: '#eef7e0', header: '#8bc9a8', text: '#2e4d42', buttonBackground: '#a3d8b2', buttonText: '#ffffff', buttonHover: '#7cb88e', scrollbarTrack: '#d1f5e6', scrollbarThumb: '#84b594' },
];

const randomTheme = themes[Math.floor(Math.random() * themes.length)];

// Create and inject the summary box into the page
function injectSummaryBox(summary) {
    const summaryBox = document.createElement('div');
    summaryBox.id = 'wiki-summary-box';
    summaryBox.innerHTML = `
        <div class="summary-header">Summary</div>
        <div class="summary-content">${summary}</div>
        <div class="summary-actions">
            <button id="copy-button">Copy</button>
        </div>
    `;
    document.body.appendChild(summaryBox);

    const style = document.createElement('style');
    style.textContent = `
        #wiki-summary-box {
            position: fixed;
            top: 20%;
            right: 20px;
            width: 300px;
            padding: 15px;
            background-color: ${randomTheme.background};
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            font-family: Arial, sans-serif;
            cursor: move;
        }
        .summary-header {
            background-color: ${randomTheme.header};
            color: ${randomTheme.text};
            font-size: 16px;
            font-weight: bold;
            padding: 8px;
            border-radius: 5px;
            text-align: center;
        }
        .summary-content {
            font-size: 14px;
            color: ${randomTheme.text};
            margin-top: 10px;
            height: 150px;
            overflow-y: auto;
            line-height: 1.6;
        }
        .summary-actions {
            margin-top: 10px;
            text-align: center;
        }
        .summary-actions button {
            background-color: ${randomTheme.buttonBackground};
            color: ${randomTheme.buttonText}; 
            border: none;
            padding: 8px 16px;
            margin: 5px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease-in-out;
        }
        .summary-actions button:hover {
            background-color: ${randomTheme.buttonHover};
            color: ${randomTheme.buttonText}; /* Keep the text color unchanged */
        }

        /* Custom scroll bar */
        .summary-content::-webkit-scrollbar {
            width: 10px;
        }
        
        .summary-content::-webkit-scrollbar-track {
            background: ${randomTheme.scrollbarTrack};
        }
        
        .summary-content::-webkit-scrollbar-thumb {
            background-color: ${randomTheme.scrollbarThumb};
            border-radius: 5px;
            border: 2px solid ${randomTheme.background};
        }
    `;
    document.head.appendChild(style);

    // Add drag functionality
    makeDraggable(summaryBox);

    // Add button functionality
    addButtonListeners();
}

// Function to make an element draggable
function makeDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener('mousedown', function (e) {
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        element.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
        element.style.cursor = 'move';
    });
}

// Add button functionality (Copy only)
function addButtonListeners() {
    const copyButton = document.getElementById('copy-button');

    // Copy to clipboard
    copyButton.addEventListener('click', function () {
        const textToCopy = document.querySelector('.summary-content').innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
            copyButton.innerText = 'Copied!';
            setTimeout(() => {
                copyButton.innerText = 'Copy';
            }, 2000);
        });
    });
}

// Main function to summarize the page content
function summarizePage() {
    const pageContent = extractTextFromWikipedia();
    if (pageContent.length > 0) {
        const summary = summarizeText(pageContent);
        injectSummaryBox(summary);
    } else {
        console.log("No content found for summary");
    }
}

// Only run the summarizer if we're on a Wikipedia page
if (window.location.hostname.includes('wikipedia.org')) {
    summarizePage();
}
