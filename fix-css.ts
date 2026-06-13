import * as fs from 'fs';

let css = fs.readFileSync('src/index.css', 'utf8');

// Replace the old :root definitions
css = css.replace(/:root \{[\s\S]*?\.dark \{[\s\S]*?\}/, `:root {
    --background: transparent;
    --card: rgba(0, 0, 0, 0.4);
    --card-hover: rgba(255, 255, 255, 0.05);
    --text: #ffffff;
    --text-muted: rgba(255, 255, 255, 0.6);
    --border: rgba(255, 255, 255, 0.1);
    --primary: #00BFFF;
    --radius: 1rem;
}

html.light-theme {
    --background: #FFFFFF;
    --card: #FFFFFF;
    --card-hover: #F8FAFC;
    --text: #111827;
    --text-muted: #475569;
    --border: rgba(0, 174, 239, 0.2);
    --primary: #00AEEF;
}`);

// Fix the body style
css = css.replace(/body \{\s*@apply text-foreground .*?\}\s*\}/, `body {
    @apply text-text bg-background relative min-h-screen;
    background: radial-gradient(circle at top left, rgba(56,189,248,.25), transparent),
                radial-gradient(circle at top right, rgba(139,92,246,.25), transparent),
                linear-gradient(180deg, #1E1B4B, #312E81);
    background-attachment: fixed;
}`);

// Delete the explicit overrides at the end
css = css.replace(/html\.light-theme body \{[\s\S]*$/, `
html.light-theme body {
    background: var(--background) !important;
}

html.light-theme body::before {
    background: none !important;
    animation: none !important;
}

html.light-theme .text-transparent.bg-clip-text {
    background-image: linear-gradient(to right, #00AEEF, #8B5CF6) !important;
    color: transparent !important;
    -webkit-text-fill-color: transparent !important;
}

html.light-theme [class*='shadow-\\[0_0_'] {
    box-shadow: 0 4px 15px rgba(0, 174, 239, 0.1) !important;
}
`);

fs.writeFileSync('src/index.css', css);
console.log('done modifying');
